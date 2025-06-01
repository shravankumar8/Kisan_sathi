const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\+91[6-9]\d{9}$/,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  pincode: {
    type: String,
    required: true,
    match: /^\d{6}$/, // Indian PIN code format
  },
  selectedLanguage: {
    type: String,
    required: true,
    enum: ["hi-IN", "ta-IN", "te-IN", "en-IN"],
    default: "en-IN",
  },
  location: {
    type: String,
    trim: true,
    set: function () {
      return `${this.city}, ${this.state}`; // Computed field for Dashboard
    },
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre("save", function (next) {
  this.location = `${this.city}, ${this.state}`;
  next();
});

module.exports = mongoose.model("User", userSchema);
