// middlewares/verifyAadhar.js
module.exports = (req, res, next) => {
    const { aadhar } = req.body;
  
    // Basic mock validation (length check, numeric)
    if (!aadhar || aadhar.length !== 12 || !/^\d+$/.test(aadhar)) {
      return res.status(400).json({ message: 'Invalid Aadhar Number' });
    }
  
    next();
  };
  