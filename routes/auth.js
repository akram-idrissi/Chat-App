const bcrypt = require("bcrypt");
const User = require("../models/user");
const token = require("../lib/token");
const router = require("express").Router();
const { inputValidator } = require("../lib/validation");

// register end points
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const isValid = inputValidator(req, true);
    if (!isValid) return res.json({ error: true, valid: true });

    // verifying if email exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.json({ error: true, email: true });

    // hashing password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let user = new User({
        name: req.body.name,
        email: req.body.email,
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
    if (!isValid) return res.json({ error: true });

    // get user if it exists
    let user = await User.findOne({ email: req.body.email });

    if (!user) return res.json({ error: true });

    // comparing client and db passwords
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword) return res.json({ error: true });

    user = user.toObject();
    delete user.password;

    token.sendAccessToken(res, token.createAccessToken(user));
    token.sendRefreshToken(res, token.createRefreshToken(user));

    return res.json({ name: user.name });
});

// logout end points
router.get("/logout", (req, res) => {
    token.deleteTokens(res);
    res.redirect("/auth/login");
});

router.post("/logout", (req, res) => {
    token.deleteTokens(res);
    res.redirect("/login");
});

module.exports = router;
