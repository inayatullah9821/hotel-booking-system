const validate = (schema) => {
  return (req, res, next) => {
    if(!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
    }
    next();
  };
};

module.exports = { validate };
