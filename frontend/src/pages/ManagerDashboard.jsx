import { useCallback, useEffect, useState } from "react";
import { Users, Clock, CheckCircle, AlertCircle, Plus, X, Edit2, ListTodo } from "lucide-react";
import { getTeamAttendance, updateAttendanceStatus, checkIn, checkOut, getTodayAttendance } from "../api/attendance.api.js";
import { getManagerTasks, assignTaskToUser, deleteTask } from "../api/task.api.js";
import { getManagerTeam } from "../api/user.api.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { sortTasksByDate, useTasksSocket } from "../hooks/useTasksSocket.js";

export default function ManagerDashboard() {
  const [teamData, setTeamData] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignForm, setAssignForm] = useState({
    title: "",
    description: "",
    userId: "",
    dueDate: "",
    priority: "medium",
  });
  const [assignLoading, setAssignLoading] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updatingAttendance, setUpdatingAttendance] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all"); // all, on-hold, high
  const [expandedMembers, setExpandedMembers] = useState({}); // { userId: bool }
  const [memberSearch, setMemberSearch] = useState("");
  const [memberSort, setMemberSort] = useState("name"); // name | high | tasks
  const [deletingTask, setDeletingTask] = useState({});
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState("");

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

  const user = JSON.parse(localStorage.getItem("auth_user"))?.user || {};
  const token = JSON.parse(localStorage.getItem("auth_user"))?.token || "";

  const socketRef = useTasksSocket(Boolean(token), setTasks);

  const fetchManagerData = useCallback(async () => {
    try {
      setLoading(true);
      const [attendanceData, tasksData, myToday, members] = await Promise.all([
        getTeamAttendance(),
        getManagerTasks(),
        getTodayAttendance(),
        getManagerTeam(),
      ]);

      setTeamData(attendanceData);
      setTasks(sortTasksByDate(tasksData));
      setTeamMembers(members);
      setTodayAttendance(myToday?.attendance || myToday || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagerData();
  }, [fetchManagerData]);

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return undefined;

    const handleAssignments = () => {
      fetchManagerData();
    };

    socket.on("manager:assignments-updated", handleAssignments);

    return () => {
      socket.off("manager:assignments-updated", handleAssignments);
    };
  }, [socketRef, fetchManagerData]);

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      setError("");
      const data = await checkIn();
      setTodayAttendance(data.attendance || data);
      setSuccess("Checked in");
      setTimeout(() => setSuccess(""), 2500);
      await fetchManagerData();
    } catch (err) {
      setError(err.message || "Check-in failed");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    const confirmed = window.confirm("Are you sure you want to check out now?");
    if (!confirmed) return;

    try {
      setCheckingOut(true);
      setError("");
      const data = await checkOut();
      setTodayAttendance(data.attendance || data);
      setSuccess("Checked out");
      setTimeout(() => setSuccess(""), 2500);
      await fetchManagerData();
    } catch (err) {
      setError(err.message || "Check-out failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      setDeletingTask({ ...deletingTask, [taskId]: true });
      await deleteTask(taskId);
      await fetchManagerData();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    } finally {
      setDeletingTask({ ...deletingTask, [taskId]: false });
    }
  };

  // Merge explicit team list with anyone who has attendance entries
  const mergedTeamMembers = Array.from(
    new Map(
      [
        ...(teamMembers || []).map((u) => [u._id, u]),
        ...teamData.map((record) => [record.userId?._id, record.userId]),
      ].filter(([id]) => Boolean(id))
    ).values()
  );

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!assignForm.title || !assignForm.userId) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setAssignLoading(true);
      await assignTaskToUser({
        title: assignForm.title,
        description: assignForm.description,
        assignedTo: assignForm.userId,
        dueDate: assignForm.dueDate,
        priority: assignForm.priority,
        needsReply: false,
      });
      setAssignForm({
        title: "",
        description: "",
        userId: "",
        dueDate: "",
        priority: "medium",
      });
      setShowAssignForm(false);
      setError("");
      fetchManagerData(); // Refresh tasks
    } catch (err) {
      setError(err.message);
    } finally {
      setAssignLoading(false);
    }
  };

  // Update attendance status
  const handleUpdateAttendance = async (record) => {
    try {
      setUpdatingAttendance(true);
      await updateAttendanceStatus(record._id, newStatus);
      setEditingAttendance(null);
      setNewStatus("");
      setError("");
      fetchManagerData(); // Refresh team data
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingAttendance(false);
    }
  };

  // Group attendance by user, but include team members even if they have no attendance yet
  const recordsByUser = teamData.reduce((acc, record) => {
    const userId = record.userId?._id;
    if (!userId) return acc;
    if (!acc[userId]) acc[userId] = [];
    acc[userId].push(record);
    return acc;
  }, {});

  const teamStats = mergedTeamMembers.map((member) => {
    const records = recordsByUser[member._id] || [];
    const todayRecord = records.find(
      (r) => new Date(r.date).toDateString() === new Date().toDateString()
    );
    const thisWeek = records.filter((r) => {
      const date = new Date(r.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    });

    return {
      userId: member._id,
      userName: member.name || "Unknown",
      email: member.email || "",
      records,
      todayStatus: todayRecord?.status || "absent",
      hoursThisWeek: thisWeek.reduce((sum, r) => sum + (r.hoursWorked || 0), 0),
      presentDays: thisWeek.filter((r) => r.status === "present").length,
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-500/20 text-green-300";
      case "half-day":
        return "bg-yellow-500/20 text-yellow-300";
      case "late":
        return "bg-orange-500/20 text-orange-300";
      default:
        return "bg-red-500/20 text-red-300";
    }
  };

  const formatTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString();
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === "on-hold") return t.status === "on-hold";
    if (taskFilter === "high") return t.priority === "high";
    return true;
  });

  const tasksByMember = filteredTasks.reduce((acc, task) => {
    const key = task.assignedTo?._id || "unassigned";
    if (!acc[key]) {
      acc[key] = {
        user: task.assignedTo || { name: "Unassigned" },
        items: [],
      };
    }
    acc[key].items.push(task);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {user.name}
          </h1>
          <p className="text-gray-400">Manage your team members and assign tasks</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-300 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 text-green-300 rounded-lg">
            {success}
          </div>
        )}

        {/* Manager Today's Attendance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <p className="text-gray-400 text-sm">Check In</p>
            <p className="text-2xl font-bold text-white">
              {todayAttendance?.checkIn
                ? new Date(todayAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "—"}
            </p>
          </div>
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <p className="text-gray-400 text-sm">Check Out</p>
            <p className="text-2xl font-bold text-white">
              {todayAttendance?.checkOut
                ? new Date(todayAttendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "—"}
            </p>
          </div>
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <p className="text-gray-400 text-sm">Hours Worked</p>
            <p className="text-2xl font-bold text-white">
              {formatDurationFromRecord(todayAttendance)}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={handleCheckIn}
            disabled={todayAttendance?.checkIn || checkingIn}
            className="bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white font-semibold px-5 py-2 rounded-lg"
          >
            {checkingIn ? "Checking in..." : "Check In"}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!todayAttendance?.checkIn || todayAttendance?.checkOut || checkingOut}
            className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-600 text-white font-semibold px-5 py-2 rounded-lg"
          >
            {checkingOut ? "Checking out..." : "Check Out"}
          </button>
          <span className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
            todayAttendance?.status === 'present'
              ? 'border-green-400 text-green-200 bg-green-500/10'
              : todayAttendance?.status === 'half-day'
              ? 'border-yellow-400 text-yellow-200 bg-yellow-500/10'
              : 'border-red-400 text-red-200 bg-red-500/10'
          }`}>
            Status: {todayAttendance?.status || 'absent'}
          </span>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Team Members</p>
                <p className="text-3xl font-bold text-white">{teamStats.length}</p>
              </div>
              <Users className="text-blue-400" size={32} />
            </div>
          </div>

          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Present Today</p>
                <p className="text-3xl font-bold text-green-400">
                  {teamStats.filter((t) => t.todayStatus === "present").length}
                </p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Absent Today</p>
                <p className="text-3xl font-bold text-red-400">
                  {teamStats.filter((t) => t.todayStatus === "absent").length}
                </p>
              </div>
              <AlertCircle className="text-red-400" size={32} />
            </div>
          </div>

          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tasks Assigned</p>
                <p className="text-3xl font-bold text-yellow-400">{tasks.length}</p>
              </div>
              <Clock className="text-yellow-400" size={32} />
            </div>
          </div>
        </div>

        {/* Assigned Tasks by Member */}
        <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <ListTodo className="text-purple-400" size={24} />
              Assigned Tasks by Member
            </h2>
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-300">
              <span className="text-gray-400">Filter:</span>
              {[
                { key: "all", label: "All" },
                { key: "on-hold", label: "On Hold" },
                { key: "high", label: "High Priority" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTaskFilter(f.key)}
                  className={`px-3 py-1 rounded-lg border text-sm font-semibold transition ${
                    taskFilter === f.key
                      ? "bg-purple-600 border-purple-400 text-white"
                      : "bg-slate-700 border-slate-600 text-gray-200 hover:bg-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search member..."
                  className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-gray-100"
                />
                <select
                  value={memberSort}
                  onChange={(e) => setMemberSort(e.target.value)}
                  className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-gray-100"
                >
                  <option value="name">Sort: Name</option>
                  <option value="tasks">Sort: Tasks</option>
                  <option value="high">Sort: High Priority</option>
                </select>
              </div>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="text-gray-400">No tasks match this filter.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {Object.values(tasksByMember)
                .filter(({ user }) => {
                  if (!memberSearch.trim()) return true;
                  const q = memberSearch.toLowerCase();
                  return (
                    (user.name || "").toLowerCase().includes(q) ||
                    (user.email || "").toLowerCase().includes(q)
                  );
                })
                .sort((a, b) => {
                  if (memberSort === "tasks") return b.items.length - a.items.length;
                  if (memberSort === "high") {
                    const ha = a.items.filter((t) => t.priority === "high").length;
                    const hb = b.items.filter((t) => t.priority === "high").length;
                    return hb - ha;
                  }
                  // name
                  return (a.user.name || "").localeCompare(b.user.name || "");
                })
                .map(({ user, items }) => {
                  const uid = user._id || "unassigned";
                  const isExpanded = expandedMembers[uid] ?? true; // default to showing all
                  const visibleItems = isExpanded ? items : items.slice(0, 5);
                  const hiddenCount = items.length - visibleItems.length;
                  return (
                  <div key={uid} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-200 border border-slate-600">
                      {items.length} task{items.length !== 1 && 's'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    <span className="px-2 py-1 rounded bg-green-600/20 text-green-200">Working: {items.filter(t => t.status === 'in-progress').length}</span>
                    <span className="px-2 py-1 rounded bg-yellow-600/20 text-yellow-200">On Hold: {items.filter(t => t.status === 'on-hold').length}</span>
                    <span className="px-2 py-1 rounded bg-red-600/20 text-red-200">High: {items.filter(t => t.priority === 'high').length}</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {visibleItems.map((t) => (
                      <div key={t._id} className="border border-slate-700 rounded-lg p-3 bg-slate-950/30">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <p className="text-white font-semibold leading-tight">{t.title}</p>
                            {t.description && <p className="text-xs text-gray-400 line-clamp-2">{t.description}</p>}
                            <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                              <span className={`px-2 py-1 rounded border ${
                                t.priority === 'high'
                                  ? 'bg-red-500/20 text-red-200 border-red-400/40'
                                  : t.priority === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/40'
                                  : 'bg-green-500/20 text-green-200 border-green-400/40'
                              }`}>
                                {t.priority}
                              </span>
                              <span className={`px-2 py-1 rounded border capitalize ${
                                t.status === 'on-hold'
                                  ? 'bg-yellow-500/10 text-yellow-200 border-yellow-400/30'
                                  : t.status === 'in-progress'
                                  ? 'bg-blue-500/10 text-blue-200 border-blue-400/30'
                                  : t.status === 'completed'
                                  ? 'bg-green-500/10 text-green-200 border-green-400/30'
                                  : 'bg-slate-600/30 text-slate-100 border-slate-500/40'
                              }`}>
                                {t.status || 'pending'}
                              </span>
                              <span>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(t._id)}
                            disabled={deletingTask[t._id]}
                            className="text-xs px-2 py-1 rounded border border-red-500/40 text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                          >
                            {deletingTask[t._id] ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                        {t.holdReason && t.holdReason.trim() !== "" && (
                          <p className="mt-2 text-xs text-yellow-200 bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1">
                            Hold reason: {t.holdReason}
                          </p>
                        )}
                      </div>
                    ))}
                    {hiddenCount > 0 && (
                      <p className="text-xs text-gray-400 px-1">+ {hiddenCount} more task{hiddenCount !== 1 && 's'} hidden</p>
                    )}
                  </div>
                  <div className="flex justify-end items-center gap-2 text-xs text-gray-300">
                    <span>View:</span>
                    <select
                      value={isExpanded ? "all" : "recent"}
                      onChange={(e) =>
                        setExpandedMembers({ ...expandedMembers, [uid]: e.target.value === "all" })
                      }
                      className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-gray-100"
                    >
                      <option value="recent">Recent (5)</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>
              );})}
            </div>
          )}
        </div>

        {/* Assign Task Section */}
        {!loading && (
          <div className="bg-slate-700/50 backdrop-blur rounded-xl p-8 border border-slate-600 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Assign Task</h2>
              <button
                onClick={() => setShowAssignForm(!showAssignForm)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                {showAssignForm ? <X size={18} /> : <Plus size={18} />}
                {showAssignForm ? "Cancel" : "New Task"}
              </button>
            </div>

            {showAssignForm && (
              <form onSubmit={handleAssignTask} className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Task Title"
                  required
                  value={assignForm.title}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg"
                />

                <textarea
                  placeholder="Task Description"
                  value={assignForm.description}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg"
                  rows="3"
                />

                <select
                  required
                  value={assignForm.userId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, userId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg"
                >
                  <option value="">Select Team Member</option>
                  {teamMembers.map((member) => (
                    <option key={member?._id} value={member?._id}>
                      {member?.name} ({member?.email})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={assignForm.dueDate}
                    onChange={(e) =>
                      setAssignForm({ ...assignForm, dueDate: e.target.value })
                    }
                    className="px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg"
                  />

                  <select
                    value={assignForm.priority}
                    onChange={(e) =>
                      setAssignForm({ ...assignForm, priority: e.target.value })
                    }
                    className="px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={assignLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-semibold transition"
                >
                  {assignLoading ? "Assigning..." : "Assign Task"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Team Attendance Table */}
        {!loading && (
          <div className="bg-slate-700/50 backdrop-blur rounded-xl p-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6">Team Attendance</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-gray-300">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-4 px-4">Name</th>
                    <th className="text-left py-4 px-4">Email</th>
                    <th className="text-left py-4 px-4">Today Status</th>
                    <th className="text-left py-4 px-4">Check In</th>
                    <th className="text-left py-4 px-4">Check Out</th>
                    <th className="text-left py-4 px-4">Hours This Week</th>
                    <th className="text-left py-4 px-4">Present Days</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStats.map((team) => {
                    const todayRecord = team.records.find(
                      (r) => new Date(r.date).toDateString() === new Date().toDateString()
                    );
                    return (
                      <tr key={team.userId} className="border-b border-slate-600 hover:bg-slate-600/30">
                        <td className="py-4 px-4 font-semibold">{team.userName}</td>
                        <td className="py-4 px-4 text-sm">{team.email}</td>
                        <td className="py-4 px-4">
                          {editingAttendance === todayRecord?._id ? (
                            <div className="flex gap-2 items-center">
                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="px-2 py-1 bg-slate-800 border border-slate-500 rounded text-white text-sm"
                              >
                                <option value="">Select Status</option>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="half-day">Half Day</option>
                                <option value="late">Late</option>
                              </select>
                              <button
                                onClick={() => handleUpdateAttendance(todayRecord)}
                                disabled={updatingAttendance || !newStatus}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-2 py-1 rounded text-xs font-semibold"
                              >
                                {updatingAttendance ? "..." : "Save"}
                              </button>
                              <button
                                onClick={() => setEditingAttendance(null)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                                  team.todayStatus
                                )}`}
                              >
                                {team.todayStatus}
                              </span>
                              {todayRecord && (
                                <button
                                  onClick={() => {
                                    setEditingAttendance(todayRecord._id);
                                    setNewStatus(team.todayStatus);
                                  }}
                                  className="text-blue-400 hover:text-blue-300 transition"
                                  title="Edit Status"
                                >
                                  <Edit2 size={16} />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">{formatTime(todayRecord?.checkIn)}</td>
                        <td className="py-4 px-4">{formatTime(todayRecord?.checkOut)}</td>
                        <td className="py-4 px-4 font-semibold text-white">
                          {team.hoursThisWeek.toFixed(1)}h
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded">
                            {team.presentDays}/7
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {teamStats.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No team members assigned yet
              </p>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-400">Loading team data...</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
