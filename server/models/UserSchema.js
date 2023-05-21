const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },

  loginAttempts: {
    type: Number,
    default: 0,
  },

  lockUntil: {
    type: Number,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: {
    type: String,
  },

  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpires: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
  },

  deletedAt: {
    type: Date,
  },

  deleted: {
    type: Boolean,
    default: false,
  },

  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  TwoFactorAuth: {
    type: Boolean,
    default: false,
  },

  TwoFactorAuthSecret: {
    type: String,
  },

  TwoFactorAttempts: {
    type: Number,
    default: 0,
  },

  TwoFactorLockUntil: {
    type: Number,
  },

  TwoFactorAuthEnabled: {
    type: Boolean,
    default: false,

  },



});

const UserSchema = mongoose.model('User', userSchema);

module.exports = UserSchema;