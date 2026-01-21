import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, getRemovedUsers, deleteUser, restoreUser, permanentlyDeleteUser } from '../api/admin.api';
import Loader from '../components/Loader';
import { Users, Trash2, RotateCcw, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserManagement = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [removedUsers, setRemovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'removed'
  const [deleteReason, setDeleteReason] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [active, removed] = await Promise.all([
        getAllUsers(),
        getRemovedUsers()
      ]);
      setActiveUsers(active.users || []);
      setRemovedUsers(removed.removedUsers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const reason = deleteReason[userId] || 'No reason provided';
    try {
      await deleteUser(userId, reason);
      await fetchUsers();
      setShowDeleteModal(null);
      setDeleteReason({});
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to remove user');
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      await restoreUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error restoring user:', error);
      alert(error.response?.data?.message || 'Failed to restore user');
    }
  };

  const handlePermanentDelete = async (userId) => {
    if (!window.confirm('Are you sure? This action CANNOT be undone!')) {
      return;
    }
    try {
      await permanentlyDeleteUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      alert(error.response?.data?.message || 'Failed to permanently delete user');
    }
  };

  if (loading) return <Loader />;

  const filteredActiveUsers = activeUsers.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRemovedUsers = removedUsers.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.deletionReason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => window.location.href = '/admin'}
              className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Admin Dashboard</span>
            </button>
            
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl shadow-lg">
                <Trash2 size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  User Management
                </h1>
                <p className="text-gray-400">Fire, restore, or permanently remove users from the system</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-50 text-sm font-medium mb-1">Active Users</p>
                  <p className="text-4xl font-bold text-white">{activeUsers.length}</p>
                  <p className="text-green-50 text-xs mt-2">Currently working in system</p>
                </div>
                <CheckCircle size={48} className="text-green-50 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-red-500 to-rose-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-50 text-sm font-medium mb-1">Removed Users</p>
                  <p className="text-4xl font-bold text-white">{removedUsers.length}</p>
                  <p className="text-red-50 text-xs mt-2">Fired or terminated</p>
                </div>
                <XCircle size={48} className="text-red-50 opacity-20" />
              </div>
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              <CheckCircle size={20} />
              Active Users ({filteredActiveUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('removed')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'removed'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              <XCircle size={20} />
              Removed Users ({filteredRemovedUsers.length})
            </button>
          </div>

        {/* Active Users Table */}
        {activeTab === 'active' && (
          <AnimatePresence mode="wait">
            <motion.div
              key="active-users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-700"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-500 to-emerald-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Name</th>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Email</th>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Role</th>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Joined</th>
                      <th className="px-6 py-4 text-center text-white font-semibold text-sm uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredActiveUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-700/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-white">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase inline-flex items-center gap-1.5 ${
                            user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                            user.role === 'manager' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                            'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          }`}>
                            {user.role === 'admin' && <Shield size={12} />}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setShowDeleteModal(user._id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2 mx-auto"
                          >
                            <Trash2 size={16} />
                            Fire User
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filteredActiveUsers.length === 0 && (
                  <div className="text-center py-16">
                    <Users size={64} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-gray-400 text-lg">
                      {searchQuery ? 'No users found matching your search' : 'No active users found'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Removed Users Table */}
        {activeTab === 'removed' && (
          <AnimatePresence mode="wait">
            <motion.div
              key="removed-users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-700"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-red-500 to-rose-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Name</th>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Email</th>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Role</th>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Fired Date</th>
                      <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide">Reason</th>
                      <th className="px-6 py-4 text-center text-white font-semibold text-sm uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredRemovedUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-700/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-semibold text-sm opacity-60">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-400 line-through">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-slate-700 text-gray-400">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(user.deletedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-5">
                          <div className="max-w-xs">
                            <p className="text-gray-400 text-sm truncate" title={user.deletionReason}>
                              {user.deletionReason || 'No reason provided'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleRestoreUser(user._id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                            >
                              <RotateCcw size={16} />
                              Restore
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(user._id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-800 to-rose-800 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                            >
                              <AlertTriangle size={16} />
                              Delete Forever
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filteredRemovedUsers.length === 0 && (
                  <div className="text-center py-16">
                    <CheckCircle size={64} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-gray-400 text-lg">
                      {searchQuery ? 'No removed users found matching your search' : 'No removed users - All clear!'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowDeleteModal(null);
                setDeleteReason({});
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 border-2 border-red-500/30"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-600/20 rounded-xl">
                    <AlertTriangle size={32} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Fire User</h3>
                    <p className="text-gray-400 text-sm">This action will terminate the user's access</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">
                    Termination Reason <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-400 text-sm mb-3">
                    Provide a reason for firing this user. This will be saved for compliance and audit purposes.
                  </p>
                  <textarea
                    value={deleteReason[showDeleteModal] || ''}
                    onChange={(e) => setDeleteReason({ ...deleteReason, [showDeleteModal]: e.target.value })}
                    placeholder="e.g., Performance issues, policy violation, misconduct..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border-2 border-slate-700 focus:border-red-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
                    rows="4"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(null);
                      setDeleteReason({});
                    }}
                    className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteUser(showDeleteModal)}
                    disabled={!deleteReason[showDeleteModal]?.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Fire User
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default UserManagement;
