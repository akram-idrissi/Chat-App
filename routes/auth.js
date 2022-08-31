const bcrypt = require("bcrypt");
const token = require("../lib/token");
const User = require("../models/user");
const router = require("express").Router();
const { inputValidator } = require("../lib/validation");

// register end points
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const isValid = inputValidator(req, true);
    if (typeof isValid === "string")
        return res.json({ error: true, msg: isValid });

    // verifying if email exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
        return res.json({ error: true, msg: "Email already exists" });

    // hashing password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
        password: hashedPassword,
    });

    user = await user.save();
    return res.json({ name: user.name });
});

// login end points
router.get("/login", (req, res) => {
    return res.render("login");
});

router.post("/login", async (req, res) => {
    const isValid = inputValidator(req);
    if (!isValid) return res.json({ error: true, msg: isValid });

    // get user if it exists
    let user = await User.findOne({ email: req.body.email });

    if (!user)
        return res.json({
            error: true,
            msg: "Credentials provided are invalid",
        });

    // comparing client and db passwords
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword)
        return res.json({
            error: true,
            msg: "Credentials provided are invalid",
        });

    user = user.toObject();
    delete user.password;

    token.sendAccessToken(res, token.createAccessToken(user));
    token.sendRefreshToken(res, token.createRefreshToken(user));

    return res.json({ name: user.name });
});

// logout end point
router.post("/logout", (req, res) => {
    token.deleteTokens(res);
    return res.json({ error: false });
});

module.exports = router;
