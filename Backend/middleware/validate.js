const Joi = require("joi");

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phoneNumber: Joi.string()
      .pattern(/^\+91[6-9]\d{9}$/)
      .required(),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(50).required(),
    pincode: Joi.string()
      .pattern(/^\d{6}$/)
      .required(),
    selectedLanguage: Joi.string()
      .valid("hi-IN", "ta-IN", "te-IN", "en-IN")
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateSendOTP = (req, res, next) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^\+91[6-9]\d{9}$/)
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateVerifyOTP = (req, res, next) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^\+91[6-9]\d{9}$/)
      .required(),
    otp: Joi.string().length(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = { validateRegister, validateSendOTP, validateVerifyOTP };
