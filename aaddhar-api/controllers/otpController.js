const User = require("../models/userSchema");
const ContactInfo = require("../models/contactSchema");
const OtpVerification = require("../models/otpVerificationSchema");

// For simplicity, this simulates sending OTP (you can integrate Twilio, MSG91, etc.)
function sendOtpToMobile(mobile, otp) {
  console.log(`Sending OTP ${otp} to mobile number: ${mobile}`);
}

// Generate a 6-digit random OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOtp = async (req, res) => {
  try {
    const { aadhar_number } = req.body;

    const user = await User.findOne({ aadhar_number }).populate("contact_info");

    if (!user) {
      return res.status(404).json({ message: "Aadhaar number not found" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save to DB
    await OtpVerification.findOneAndUpdate(
      { aadhar_number },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    sendOtpToMobile(user.contact_info.mobile_number, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { aadhar_number, otp } = req.body;

    const record = await OtpVerification.findOne({ aadhar_number });

    if (!record) {
      return res.status(400).json({ message: "No OTP request found for this Aadhaar number" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Optionally: delete used OTP
    await OtpVerification.deleteOne({ aadhar_number });

    const user = await User.findOne({ aadhar_number }).populate("contact_info");

    res.status(200).json({
      message: "OTP verified successfully",
      aadhar_verified: true,
      user: {
        full_name: user.full_name,
        dob: user.dob,
        gender: user.gender,
        aadhar_number: user.aadhar_number,
        contact_info: user.contact_info,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
