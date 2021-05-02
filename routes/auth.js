const router = require("express").Router();
const bcryt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../validation");

router.post("/register", async (req, res) => {
  console.log("Register request received!");

  // Valdiate the received user
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send({ error: "Email already exists!" });
  }

  // Hash password
  const salt = await bcryt.genSalt(10);
  const hashedPassword = await bcryt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  console.log(user);

  try {
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  console.log("Login request received!");
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log({ error: error.details[0].message });
      return res.status(400).send({ error: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ error: "Email doesn't exists!" });
    }

    const validPassword = await bcryt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).send({ error: "Password is incorrect!" });
    }

    console.log(`${user.name} is logged in!`);
    // Create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send(token);

    // res.send(`Logged In`);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
