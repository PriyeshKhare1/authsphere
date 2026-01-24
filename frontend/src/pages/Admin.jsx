
import { useEffect, useState } from "react";
import { Users, Shield, Activity, Edit2, Save, X, Clock, Search, Download, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState("users"); // users, working-time, reports

  // Search & Filter states
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [workingTimeSearchQuery, setWorkingTimeSearchQuery] = useState("");
  const [attendanceDateFilter, setAttendanceDateFilter] = useState("all"); // all, today, week, month

  const token = JSON.parse(localStorage.getItem("auth_user"))?.token || "";
  const adminUser = JSON.parse(localStorage.getItem("auth_user"))?.user || {};

  const formatSeconds = (sec = 0) => {
    const hours = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDurationFromRecord = (record) => {
    if (!record) return "00:00:00";
    if (record.hoursWorkedFormatted) return record.hoursWorkedFormatted;
    if (record.hoursWorkedSeconds != null) return formatSeconds(record.hoursWorkedSeconds);

    if (record.checkIn && record.checkOut) {
      const diff = Math.max(0, new Date(record.checkOut) - new Date(record.checkIn));
      return formatSeconds(Math.floor(diff / 1000));
    }

    if (typeof record.hoursWorked === "number") {
      return formatSeconds(Math.round(record.hoursWorked * 3600));
    }

    return "00:00:00";
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Refresh when switching to working-time tab to pick up latest manager check-ins
  useEffect(() => {
    if (activeTab === "working-time") {
      fetchAllData();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      // Fetch users
      const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch all attendance records (managers' working times)
      const attendanceRes = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        setAttendanceData(attendanceData);
      }

      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      ...user,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const saveChanges = async () => {
    try {
      const managerId =
        (editForm.managerId && typeof editForm.managerId === "object"
          ? editForm.managerId._id
          : editForm.managerId) || null;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${editingUser}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: editForm.role,
          managerId,
        }),
      });

      if (!res.ok) throw new Error("Failed to update user");
      await fetchAllData(); // ensure fresh data with populated manager info
      setEditingUser(null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const managers = users.filter((u) => u.role === "manager");

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    managers: managers.length,
    employees: users.filter((u) => u.role === "user").length,
  };

  // Filter functions
  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
      const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
      const userManagerId = typeof user.managerId === "object" ? user.managerId?._id : user.managerId;
      const matchesManager = managerFilter === "all" || userManagerId === managerFilter;
      return matchesSearch && matchesRole && matchesManager;
    });
  };

  const getFilteredWorkingTime = () => {
    return attendanceData.filter((att) => {
      const attUserId = att.userId?._id || att.userId; // handle populated vs id-only
      const attUser = users.find((u) => u._id === attUserId);
      const isManager = attUser && attUser.role === "manager";
      const matchesSearch =
        !workingTimeSearchQuery ||
        attUser?.name.toLowerCase().includes(workingTimeSearchQuery.toLowerCase());
      return isManager && matchesSearch;
    });
  };

  const getFilteredAttendance = () => {
    const now = new Date();
    return attendanceData.filter(att => {
      const attDate = new Date(att.date);
      let dateMatch = true;
      
      if (attendanceDateFilter === "today") {
        dateMatch = attDate.toDateString() === now.toDateString();
      } else if (attendanceDateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateMatch = attDate >= weekAgo;
      } else if (attendanceDateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateMatch = attDate >= monthAgo;
      }
      return dateMatch;
    });
  };

  // Calculate working reports
  const getManagerWorkingReport = () => {
    const managerStats = {};
    attendanceData.forEach((att) => {
      const attUserId = att.userId?._id || att.userId; // normalize id
      const user = users.find((u) => u._id === attUserId);
      if (user && user.role === "manager") {
        if (!managerStats[user._id]) {
          managerStats[user._id] = {
            name: user.name,
            email: user.email,
            totalHours: 0,
            presentDays: 0,
            absentDays: 0,
            totalRecords: 0,
          };
        }
        managerStats[user._id].totalHours += att.hoursWorked || 0;
        if (att.status === "present") managerStats[user._id].presentDays++;
        if (att.status === "absent") managerStats[user._id].absentDays++;
        managerStats[user._id].totalRecords++;
      }
    });
    return Object.values(managerStats);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-gray-400">Complete system overview and management control</p>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/20 text-red-300 rounded-xl border border-red-500/50"
          >
            {error}
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
                <p className="text-5xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="text-blue-100 opacity-50" size={48} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Managers</p>
                <p className="text-5xl font-bold text-white">{users.filter(u => u.role === "manager").length}</p>
              </div>
              <Activity className="text-orange-100 opacity-50" size={48} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Employees</p>
                <p className="text-5xl font-bold text-white">{users.filter(u => u.role === "user").length}</p>
              </div>
              <Users className="text-green-100 opacity-50" size={48} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-50 text-sm font-medium mb-1">Admins</p>
                <p className="text-4xl font-bold text-white">{users.filter(u => u.role === "admin").length}</p>
              </div>
              <Shield className="text-purple-50 opacity-30" size={40} />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-600 flex-wrap">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "users"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Users Management
          </button>
          <button
            onClick={() => setActiveTab("working-time")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "working-time"
                ? "text-orange-400 border-b-2 border-orange-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Managers' Working Time
          </button>
          <button
            onClick={() => window.location.href = "/admin/user-management"}
            //className="px-6 py-3 font-semibold transition-all flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg shadow-lg hover:shadow-xl"
            className="px-6 py-3 font-semibold transition-all flex items-center gap-2 bg-[oklch(0.47_0.03_17.84)] text-white rounded-lg shadow-lg hover:shadow-xl"

          >
            <Trash2 size={18} />
            Fire & Restore Users
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "reports"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Reports & Analytics
          </button>
        </div>

        {/* Content */}
        {!loading && (
          <div className="bg-slate-700/50 backdrop-blur rounded-xl p-8 border border-slate-600 overflow-hidden">
            {/* Users Management Tab */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
                
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">Employee</option>
                  </select>

                  <select
                    value={managerFilter}
                    onChange={(e) => setManagerFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Managers</option>
                    {managers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setUserSearchQuery("");
                      setUserRoleFilter("all");
                      setManagerFilter("all");
                    }}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition"
                  >
                    Reset Filters
                  </button>

                  <button
                    onClick={fetchAllData}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                  >
                    Refresh Data
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-4 px-4">Name</th>
                        <th className="text-left py-4 px-4">Email</th>
                        <th className="text-left py-4 px-4">Role</th>
                        <th className="text-left py-4 px-4">Manager</th>
                        <th className="text-left py-4 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredUsers().map((user) => (
                        <tr key={user._id} className="border-b border-slate-600 hover:bg-slate-600/30">
                          {editingUser === user._id ? (
                            <>
                              <td className="py-4 px-4 font-semibold">{user.name}</td>
                              <td className="py-4 px-4 text-sm">{user.email}</td>
                              <td className="py-4 px-4">
                                <select
                                  value={editForm.role}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, role: e.target.value })
                                  }
                                  className="bg-slate-800 text-white px-3 py-1 rounded border border-slate-500"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="manager">Manager</option>
                                  <option value="user">User</option>
                                </select>
                              </td>
                              <td className="py-4 px-4">
                                <select
                                  value={editForm.managerId || ""}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      managerId: e.target.value || null,
                                    })
                                  }
                                  className="bg-slate-800 text-white px-3 py-1 rounded border border-slate-500"
                                >
                                  <option value="">None</option>
                                  {users
                                    .filter((m) => m.role === "manager" && m._id !== user._id)
                                    .map((m) => (
                                      <option key={m._id} value={m._id}>
                                        {m.name}
                                      </option>
                                    ))}
                                </select>
                              </td>
                              <td className="py-4 px-4 flex gap-2">
                                <button
                                  onClick={saveChanges}
                                  className="text-green-400 hover:text-green-300"
                                  title="Save"
                                >
                                  <Save size={18} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="text-red-400 hover:text-red-300"
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-4 px-4 font-semibold">{user.name}</td>
                              <td className="py-4 px-4 text-sm">{user.email}</td>
                              <td className="py-4 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.role === "admin"
                                      ? "bg-purple-500/20 text-purple-300"
                                      : user.role === "manager"
                                      ? "bg-orange-500/20 text-orange-300"
                                      : "bg-blue-500/20 text-blue-300"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-sm">
                                {user.managerId?.name || "None"}
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => startEdit(user)}
                                  className="text-blue-400 hover:text-blue-300"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Managers' Working Time Tab */}
            {activeTab === "working-time" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Managers' Working Time</h2>
                
                {/* Filters */}
                <div className="flex gap-4 mb-6 flex-wrap items-center">
                  <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search manager name..."
                      value={workingTimeSearchQuery}
                      onChange={(e) => setWorkingTimeSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  
                  <button
                    onClick={() => setWorkingTimeSearchQuery("")}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition"
                  >
                    Clear Search
                  </button>

                  <button
                    onClick={fetchAllData}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition"
                  >
                    Refresh data
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300 text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-4 px-4">Manager Name</th>
                        <th className="text-left py-4 px-4">Date</th>
                        <th className="text-left py-4 px-4">Check In</th>
                        <th className="text-left py-4 px-4">Check Out</th>
                        <th className="text-left py-4 px-4">Hours Worked</th>
                        <th className="text-left py-4 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredWorkingTime()
                        .map((att) => {
                          const attUserId = att.userId?._id || att.userId;
                          const manager = users.find((u) => u._id === attUserId) || att.userId;
                          const checkInTime = att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : "-";
                          const checkOutTime = att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : "-";
                          const worked = formatDurationFromRecord(att);
                          return (
                            <tr key={att._id} className="border-b border-slate-600 hover:bg-slate-600/30">
                              <td className="py-4 px-4 font-semibold">{manager?.name || manager?.email || "Manager"}</td>
                              <td className="py-4 px-4">{new Date(att.date).toLocaleDateString()}</td>
                              <td className="py-4 px-4">{checkInTime}</td>
                              <td className="py-4 px-4">{checkOutTime}</td>
                              <td className="py-4 px-4">{worked}</td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  att.status === "present"
                                    ? "bg-green-500/20 text-green-300"
                                    : att.status === "half-day"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : att.status === "late"
                                    ? "bg-orange-500/20 text-orange-300"
                                    : "bg-red-500/20 text-red-300"
                                }`}>
                                  {att.status || "absent"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {getFilteredWorkingTime().length === 0 && (
                    <p className="text-center text-gray-400 py-8">No working time records found</p>
                  )}
                </div>
              </div>
            )}

            {/* Reports & Analytics Tab */}
            {activeTab === "reports" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Download size={24} /> Reports & Analytics
                  </h2>
                </div>

                {/* Managers' Working Report */}
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-orange-400" />
                    Managers' Working Report
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-gray-300 text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-4 px-4">Manager Name</th>
                          <th className="text-left py-4 px-4">Total Hours</th>
                          <th className="text-left py-4 px-4">Present Days</th>
                          <th className="text-left py-4 px-4">Absent Days</th>
                          <th className="text-left py-4 px-4">Attendance Rate</th>
                          <th className="text-left py-4 px-4">Total Records</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getManagerWorkingReport().map((report) => {
                          const attendanceRate = report.totalRecords > 0 
                            ? ((report.presentDays / report.totalRecords) * 100).toFixed(1) 
                            : 0;
                          return (
                            <tr key={report.name} className="border-b border-slate-600 hover:bg-slate-700/30">
                              <td className="py-4 px-4 font-semibold">{report.name}</td>
                              <td className="py-4 px-4 text-orange-300">{report.totalHours.toFixed(1)} hrs</td>
                              <td className="py-4 px-4 text-green-300">{report.presentDays}</td>
                              <td className="py-4 px-4 text-red-300">{report.absentDays}</td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  attendanceRate >= 80 
                                    ? "bg-green-500/20 text-green-300"
                                    : attendanceRate >= 60
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                                }`}>
                                  {attendanceRate}%
                                </span>
                              </td>
                              <td className="py-4 px-4">{report.totalRecords}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {getManagerWorkingReport().length === 0 && (
                      <p className="text-center text-gray-400 py-8">No manager data available</p>
                    )}
                  </div>
                </div>

                {/* Attendance Report */}
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-green-400" />
                    Attendance Report
                  </h3>

                  {/* Date filter */}
                  <div className="mb-6 flex gap-4 flex-wrap">
                    <button
                      onClick={() => setAttendanceDateFilter("all")}
                      className={`px-4 py-2 rounded-lg transition ${
                        attendanceDateFilter === "all"
                          ? "bg-green-600 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-gray-300"
                      }`}
                    >
                      All Time
                    </button>
                    <button
                      onClick={() => setAttendanceDateFilter("today")}
                      className={`px-4 py-2 rounded-lg transition ${
                        attendanceDateFilter === "today"
                          ? "bg-green-600 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-gray-300"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setAttendanceDateFilter("week")}
                      className={`px-4 py-2 rounded-lg transition ${
                        attendanceDateFilter === "week"
                          ? "bg-green-600 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-gray-300"
                      }`}
                    >
                      This Week
                    </button>
                    <button
                      onClick={() => setAttendanceDateFilter("month")}
                      className={`px-4 py-2 rounded-lg transition ${
                        attendanceDateFilter === "month"
                          ? "bg-green-600 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-gray-300"
                      }`}
                    >
                      This Month
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-gray-300 text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-4 px-4">User Name</th>
                          <th className="text-left py-4 px-4">Role</th>
                          <th className="text-left py-4 px-4">Date</th>
                          <th className="text-left py-4 px-4">Check In</th>
                          <th className="text-left py-4 px-4">Check Out</th>
                          <th className="text-left py-4 px-4">Hours</th>
                          <th className="text-left py-4 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredAttendance().map((att) => {
                          const attUserId = att.userId?._id || att.userId;
                          const user = users.find((u) => u._id === attUserId) || att.userId;
                          const checkInTime = att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : "-";
                          const checkOutTime = att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : "-";
                          const worked = formatDurationFromRecord(att);
                          return (
                            <tr key={att._id} className="border-b border-slate-600 hover:bg-slate-700/30">
                              <td className="py-4 px-4 font-semibold">{user?.name}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  user?.role === "manager"
                                    ? "bg-orange-500/20 text-orange-300"
                                    : "bg-blue-500/20 text-blue-300"
                                }`}>
                                  {user?.role}
                                </span>
                              </td>
                              <td className="py-4 px-4">{new Date(att.date).toLocaleDateString()}</td>
                              <td className="py-4 px-4">{checkInTime}</td>
                              <td className="py-4 px-4">{checkOutTime}</td>
                              <td className="py-4 px-4">{worked}</td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  att.status === "present"
                                    ? "bg-green-500/20 text-green-300"
                                    : att.status === "half-day"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : att.status === "late"
                                    ? "bg-orange-500/20 text-orange-300"
                                    : "bg-red-500/20 text-red-300"
                                }`}>
                                  {att.status || "absent"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {getFilteredAttendance().length === 0 && (
                      <p className="text-center text-gray-400 py-8">No attendance records found for selected period</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-400">Loading data...</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
