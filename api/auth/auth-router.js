const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/secret.js");
const router = require("express").Router();
const User = require("./auth-model");
const validateUser = require('../middleware/validateUser')
router.post("/register", validateUser ,async (req, res) => {
    const credentials = req.body;
    const rounds = process.env.BCRYPT_ROUNDS || 10;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
    try {
        const newUser = await User.insert(credentials);
        res.status(200).json(newUser);
    } catch (e) {
        res.status(500).json({ message: "username taken" });
    }
});

router.post("/login",validateUser ,async (req, res) => {
    const { username, password } = req.body;
    User.findBy({ username: username }).then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
            const token = makeToken(user);

            res.status(200).json({
                message: "Welcome to our API " + user.username,
                token,
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

const makeToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username,
        deparment: user.deparment,
    };
    const options = {
        expiresIn: "500s",
    };
    return jwt.sign(payload, jwtSecret, options);
};

module.exports = router;
