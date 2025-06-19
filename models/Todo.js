const mongoose = require('mongoose');
const TodoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  userId: mongoose.Schema.Types.ObjectId
});
module.exports = mongoose.model('Todo', TodoSchema);