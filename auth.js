const router = require("express").Router();
const boolean = require("@hapi/joi/lib/types/boolean");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const { inputValidator } = require("./validation");

router.post("/register", async (req, res) => {
    const validationMsg = inputValidator(req, true);
    if (typeof validationMsg === "string")
        return res.status(400).send(validationMsg);

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

router.post("/login", async (req, res) => {
    const validationMsg = inputValidator(req);
    if (typeof validationMsg === "string")
        return res.status(400).send(validationMsg);

    // get user if it exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("Email not found");

    // comparing client and db passwords
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword) return res.status(400).send("Invalid password");

    res.status(200).send("success");
});

module.exports = router;
