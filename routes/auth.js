const express = require("express");
const router = express.Router();
const passport = require("passport");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login"));
});

router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.render("register", { error: error.details[0].message });
  }
  const hash = await bcrypt.hash(req.body.password, 10);
  try {
    await User.create({ email: req.body.email, password: hash });
    res.redirect("/login");
  } catch (e) {
    res.render("register", { error: "User already exists" });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.render("login", { error: "Invalid email or password" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;