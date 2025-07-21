const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  script: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending'
  },
  blandCallId: {
    type: String,
    sparse: true
  },
  transcript: {
    type: String,
    default: ''
  },
  response: {
    type: String,
    default: ''
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Call', CallSchema);