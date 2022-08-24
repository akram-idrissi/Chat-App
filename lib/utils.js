const { verify } = require("jsonwebtoken");

module.exports = {
    getUser: (cookies) => {
        let user = null;
        const jat = cookies.jat;
        verify(jat, process.env.ACCESS_SECRET_TOKEN, async (error, payload) => {
            if (error) return null;
            user = payload.user;
        });
        return user;
    },
};
