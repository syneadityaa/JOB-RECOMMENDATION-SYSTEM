const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job:    { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['applied','reviewing','accepted','rejected'], default: 'applied' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);