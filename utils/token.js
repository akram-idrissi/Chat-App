const { sign, verify } = require("jsonwebtoken");

const createAccessToken = (xjr) => {
    return sign({ xjr }, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: "10m",
    });
};

const createRefreshToken = (xjr) => {
    return sign({ xjr }, process.env.REFRESH_SECRET_TOKEN, {
        expiresIn: "7d",
    });
};

const sendAccessToken = (res, token) => {
    return res.cookie("jat", token, { httpOnly: true, overwrite: true });
};

const sendRefreshToken = (res, token) => {
    return res.cookie("jrt", token, { httpOnly: true, overwrite: true }); // 7 days in ms 60480000
};

const refreshTokens = (res, xjr) => {
    sendAccessToken(res, createAccessToken(xjr));
    sendRefreshToken(res, createRefreshToken(xjr));
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

    let xjr = null;
    verify(RToken, process.env.REFRESH_SECRET_TOKEN, (error, payload) => {
        if (error) return res.status(403).send("token has expired");
        xjr = payload.xjr;
        const AToken = req.cookies.jat;
        if (!AToken || typeof AToken == "undefined") {
            return res.status(401).send("go login");
        }
        verify(AToken, process.env.ACCESS_SECRET_TOKEN, (error, payload) => {
            if (error) refreshTokens(res, xjr);
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
