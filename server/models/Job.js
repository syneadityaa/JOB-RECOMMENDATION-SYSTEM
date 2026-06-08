const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  description: { type: String, required: true },
  skills:      [String],        // e.g. ["React", "Node.js"]
  salary:      { type: String, default: 'Not specified' },
  type:        { type: String, enum: ['Full-time','Part-time','Remote','Internship'], default: 'Full-time' },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);