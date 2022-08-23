const bcrypt = require("bcrypt");
const User = require("../models/user");
const token = require("../utils/token");
const router = require("express").Router();
const { inputValidator } = require("../utils/validation");

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const isValid = inputValidator(req, true);
    if (!isValid) return res.status(400).send("validation error");

    // verifying if email exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already exists");

    // hashing password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    await user.save();
    res.status(200).send("success");
});

router.get("/login", (req, res) => {
    res.render("login", { req: req });
});

router.post("/login", async (req, res) => {
    const isValid = inputValidator(req);
    if (!isValid) return res.json({ error: true });

    // get user if it exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.json({ error: true });

    // comparing client and db passwords
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword) return res.json({ error: true });

    token.sendAccessToken(res, token.createAccessToken(user.id));
    token.sendRefreshToken(res, token.createRefreshToken(user.id));

    return res.json({ user: true });
});

router.get("/logout", (req, res) => {
    token.deleteTokens(res);
    res.redirect("/auth/login");
});

router.post("/logout", (req, res) => {
    token.deleteTokens(res);
    res.redirect("/login");
});

router.get("/data", token.isAuth, (req, res) => {
    res.render("protected");
});

router.post("/data", token.isAuth, (req, res) => {
    res.render("protected");
});

module.exports = router;
