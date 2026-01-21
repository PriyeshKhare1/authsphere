import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import axios from '../../api/axios';

export default function EmailVerified() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/auth');
    }
  }, [status, countdown, navigate]);

  const verifyEmail = async () => {
    try {
      const response = await axios.get(`/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
      >
        {status === 'verifying' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Loader2 className="w-16 h-16 text-indigo-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Email Verified! 🎉
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mb-6"
            >
              {message}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-indigo-50 rounded-xl p-4 mb-6"
            >
              <p className="text-indigo-700 font-medium mb-2">
                ✓ Your account is now active
              </p>
              <p className="text-indigo-600 text-sm">
                Redirecting to login in <span className="font-bold text-lg">{countdown}</span> seconds...
              </p>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl
                         font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200
                         shadow-lg hover:shadow-xl"
            >
              Go to Login Now
            </motion.button>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Verification Failed
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mb-6"
            >
              {message}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-yellow-800 font-medium mb-1">
                    Need a new verification link?
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Contact support or try registering again with a different email.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl
                         font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200
                         shadow-lg hover:shadow-xl"
            >
              Back to Login
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}
