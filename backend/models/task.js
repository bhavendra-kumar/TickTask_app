const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  countdownEnd: { type: Date },  // ✅ Add this line
  completed: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
