const { sign, verify } = require("jsonwebtoken");

const createAccessToken = (user) => {
    return sign({ user }, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: "10m",
    });
};

const createRefreshToken = (user) => {
    return sign({ user }, process.env.REFRESH_SECRET_TOKEN, {
        expiresIn: "7d",
    });
};

const sendAccessToken = (res, token) => {
    return res.cookie("jat", token, { httpOnly: true, overwrite: true });
};

const sendRefreshToken = (res, token) => {
    return res.cookie("jrt", token, { httpOnly: true, overwrite: true }); // 7 days in ms 60480000
};

const refreshTokens = (res, user) => {
    sendAccessToken(res, createAccessToken(user));
    sendRefreshToken(res, createRefreshToken(user));
};

const deleteTokens = (res) => {
    res.clearCookie("jrt");
    res.clearCookie("jat");
};

function isAuth(req, res, next) {
    const RToken = req.cookies.jrt;

    if (!RToken || typeof RToken == "undefined") {
        return res.status(401).send("go login");
    }

    let user = null;
    verify(RToken, process.env.REFRESH_SECRET_TOKEN, (error, payload) => {
        if (error) return res.status(403).send("token has expired");
        user = payload.user;
        const AToken = req.cookies.jat;
        if (!AToken || typeof AToken == "undefined") {
            return res.status(401).send("go login");
        }
        verify(AToken, process.env.ACCESS_SECRET_TOKEN, (error, payload) => {
            if (error) refreshTokens(res, user);
            next();
        });
    });
}

module.exports = {
    isAuth,
    deleteTokens,
    refreshTokens,
    sendAccessToken,
    sendRefreshToken,
    createAccessToken,
    createRefreshToken,
};
