import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useBlockchain } from "../context/BlockchainContext";

function AadhaarVerification() {
    const { walletAddress, user, setUser, fetchUserByWallet, contract } =
        useBlockchain();
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!walletAddress) {
            toast.error("Please Connect Wallet");
            navigate("/");
            return;
        }

        console.log("on aadhaar")
        console.log("user : ", user)
        if (user) return navigate("/election-category");

        fetchUserByWallet(walletAddress);

        if(user){
          navigate("/election-category");
        }

    }, [walletAddress, user, setUser, navigate]);

    const handleSendOtp = async () => {
        if (aadhaar.length !== 12)
            return toast.error("Enter a valid 12-digit Aadhaar number");

        try {
            await axios.post("http://localhost:8000/api/otp/send", {
                aadhar_number: aadhaar,
            });
            setOtpSent(true);
            toast.success("OTP sent successfully!");
        } catch (err) {
            console.error("Failed to send OTP:", err);
            toast.error("Failed to send OTP. Try again later.");
        }
    };

    const handleVerifyOtp = async () => {
        setVerifying(true);

        try {
            const res = await axios.post(
                "http://localhost:8000/api/otp/verify",
                {
                    aadhar_number: aadhaar,
                    otp: otp,
                }
            );

            const { full_name, dob, contact_info } = res.data.user;

            const userDetail = {
                aadhar: aadhaar,
                walletAddress,
                name: full_name,
                dob,
                state: contact_info.address.state,
            };

            const tx = await contract.addVoter(walletAddress);
            await tx.wait();

            await axios.post(
                "http://localhost:8080/api/user/register",
                userDetail
            );

            setUser(userDetail);
            toast.success("Registration successful!");
            navigate("/election-category");
        } catch (err) {
            console.error("OTP verification or registration failed:", err);
            toast.error(
                "Verification failed. Please check your OTP or try again."
            );
        } finally {
            setVerifying(false);
        }
    };

    return (
        <motion.div
          className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-blue-50 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl font-bold mb-6 text-blue-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Aadhaar Verification
          </motion.h2>
    
          <motion.input
            type="text"
            maxLength={12}
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            placeholder="Enter Aadhaar Number"
            className="mb-4 px-4 py-2 border rounded w-72 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileFocus={{ scale: 1.03 }}
          />
    
          {otpSent && (
            <motion.input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="mb-4 px-4 py-2 border rounded w-72 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
              whileFocus={{ scale: 1.03 }}
            />
          )}
    
          {!otpSent ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleSendOtp}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all duration-200 shadow"
            >
              Send OTP
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={!verifying ? { scale: 1.05 } : {}}
              onClick={handleVerifyOtp}
              disabled={verifying}
              className={`${
                verifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white px-6 py-2 rounded transition-all duration-200 shadow flex items-center gap-2`}
            >
              {verifying ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify & Register'
              )}
            </motion.button>
          )}
        </motion.div>
      );
}

export default AadhaarVerification;
