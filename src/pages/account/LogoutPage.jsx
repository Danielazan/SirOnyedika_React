// LogoutPage — Panel 7 of the account area.
// Shows a friendly confirmation before logging the user out.
// Accessed via the Logout link in the sidebar — NOT a route, rendered inline.
// This is re-exported and used inside AccountLayout as the /account/logout route.
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LogoutPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-[#fdf2f0] border-4 border-[#AE3E27]/20 flex items-center justify-center mb-5"
      >
        <LogOut className="w-8 h-8 text-[#AE3E27]" />
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-gray-900 mb-2"
      >
        Logged Out
      </motion.h2>

      {/* Sub-text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 text-sm mb-1"
      >
        Hi <strong className="text-gray-800">{user?.name?.split(' ')[0] ?? 'there'}</strong>,
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-gray-500 text-sm mb-8"
      >
        Are you sure you want to logout?
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-8 py-3 bg-[#AE3E27] hover:bg-[#8f3320] text-white font-bold text-sm rounded-xl transition-all shadow-md"
        >
          <LogOut className="w-4 h-4" />
          Yes, Log Out
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}
