const Joi = require('joi');
const validateEvent = (req, res, next) => {
    const schema = Joi.object({
    EventName: Joi.string().min(3).max(100).required(),
    EventDesc: Joi.string().min(3).max(300).required(),
    EventPrice: Joi.number().required(),
    EventDate: Joi.date().iso().required(),
    EventCat: Joi.string().min(3).max(100).required(),
    EventLocation: Joi.string().min(10).max(100).required(),
    EventRegEndDate: Joi.date().iso().required(),
    EventMgrID: Joi.string().min(2).max(10).required(),
    EventIntake: Joi.number().required(),
    });
  
    const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body
  
    if (validation.error) {
      const errors = validation.error.details.map((error) => error.message);
      res.status(400).json({ message: "Validation error", errors });
      return; // Terminate middleware execution on validation error
    }
  
    next(); // If validation passes, proceed to the next route handler
  };


module.exports = validateEvent;