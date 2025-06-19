const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/', ensureAuth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id });
  res.render('index', { todos });
});

router.post('/add', ensureAuth, async (req, res) => {
  await Todo.create({ task: req.body.task, completed: false, userId: req.user._id });
  res.redirect('/');
});

router.post('/complete/:id', ensureAuth, async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, { completed: true });
  res.redirect('/');
});

router.post('/delete/:id', ensureAuth, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

module.exports = router;