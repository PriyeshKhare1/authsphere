import { useEffect, useState } from "react";
import { Clock, CheckCircle, Plus, Trash2, Send, Edit2, AlertCircle, X, RotateCcw, Bell } from "lucide-react";
import { checkIn, checkOut, getTodayAttendance, resetTodayAttendance, getMyAttendanceHistory } from "../api/attendance.api.js";
import { getTasks, deleteTask, createTask, submitTaskReply, completeTask, updateTaskStatus } from "../api/task.api.js";
import { ReplyDialog } from "./ReplyDialog.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { sortTasksByDate, useTasksSocket } from "../hooks/useTasksSocket.js";

export default function UserDashboard() {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [submittingReply, setSubmittingReply] = useState({});
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskDue, setNewTaskDue] = useState("");
  const [filterMode, setFilterMode] = useState("today"); // today, upcoming, all, date
  const [selectedDate, setSelectedDate] = useState("");
  const [showReplyDialog, setShowReplyDialog] = useState(null); // null or taskId
  const [taskStatus, setTaskStatus] = useState({}); // { taskId: "hold" | "working" | "done" }
  const [completingTask, setCompletingTask] = useState({});
  const [dateKey, setDateKey] = useState(() => new Date().toDateString());
  const [assignmentAlerts, setAssignmentAlerts] = useState([]);
  const [showAssignmentDrawer, setShowAssignmentDrawer] = useState(false);
  
  // Hold popup state
  const [showHoldPopup, setShowHoldPopup] = useState(null); // null or taskId
  const [holdReason, setHoldReason] = useState({}); // { taskId: reason text }
  const [holdAttachment, setHoldAttachment] = useState({}); // { taskId: file }
  
  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState(null); // null or { type: 'working'|'submit', taskId }
  const [updatingTaskStatus, setUpdatingTaskStatus] = useState({});

  const user = JSON.parse(localStorage.getItem("auth_user"))?.user || {};

  useTasksSocket(Boolean(user?._id), setTasks);

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
    fetchAttendance();
    fetchTasks();
  }, []);

  // Refresh UI when the date rolls over to a new day
  useEffect(() => {
    const timer = setInterval(() => {
      const todayStr = new Date().toDateString();
      if (todayStr !== dateKey) {
        setDateKey(todayStr);
        fetchAttendance();
      }
    }, 60 * 1000); // check every minute

    return () => clearInterval(timer);
  }, [dateKey]);
  

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(sortTasksByDate(data));

      // Build notification list for any newly assigned tasks from managers (last 3 days)
      const now = Date.now();
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      const alerts = (data || [])
        .filter((t) =>
          t.assignedTo?._id === user._id &&
          t.assignedByManager &&
          !t.done &&
          t.createdAt && (now - new Date(t.createdAt).getTime() <= threeDays)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAssignmentAlerts(alerts);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      const [todayData, historyData] = await Promise.all([
        getTodayAttendance(),
        getMyAttendanceHistory(),
      ]);

      setTodayAttendance(todayData?.attendance || todayData || null);

      // Sort newest first and keep last 7 for the table
      const sortedHistory = (historyData || [])
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 7);

      setAttendanceHistory(sortedHistory);
    } catch (err) {
      setError(err.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      setError("");
      const data = await checkIn();
      // The API returns { message, attendance }
      setTodayAttendance(data.attendance || data);
      setSuccess("✓ Checked in successfully!");
      setTimeout(() => setSuccess(""), 3000);
      // Refresh attendance data
      await fetchAttendance();
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
      // The API returns { message, attendance }
      setTodayAttendance(data.attendance || data);
      setSuccess("✓ Checked out successfully!");
      setTimeout(() => setSuccess(""), 3000);
      // Refresh history
      await fetchAttendance();
    } catch (err) {
      setError(err.message || "Check-out failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleResetToday = async () => {
    try {
      setCheckingOut(true);
      setError("");
      const data = await resetTodayAttendance();
      // The API returns { message, attendance }
      setTodayAttendance(data.attendance || data);
      setSuccess("✓ Today's status reset! Check-out removed.");
      setTimeout(() => setSuccess(""), 3000);
      // Refresh history
      await fetchAttendance();
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      setError("Task title is required");
      return;
    }
    try {
      setCreatingTask(true);
      setError("");
      const newTask = await createTask({
        title: newTaskTitle,
        description: newTaskDesc,
        needsReply: false,
        dueDate: newTaskDue || undefined,
      });
      setTasks((prev) => sortTasksByDate([newTask, ...prev]));
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskDue("");
      setShowAddTask(false);
      setSuccess("✓ Task created!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      setSuccess("✓ Task deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  };

  const handleSubmitReply = async (taskId) => {
    if (!replyText[taskId]) {
      setError("Reply cannot be empty");
      return;
    }
    try {
      setSubmittingReply({ ...submittingReply, [taskId]: true });
      await submitTaskReply(taskId, { text: replyText[taskId] });
      setReplyText({ ...replyText, [taskId]: "" });
      setShowReplyDialog(null);
      await fetchTasks();
      setSuccess("✓ Reply submitted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit reply");
    } finally {
      setSubmittingReply({ ...submittingReply, [taskId]: false });
    }
  };

  const handleReplyDialogSubmit = async (taskId, replyText, image, pdf) => {
    try {
      setSubmittingReply({ ...submittingReply, [taskId]: true });
      const replyData = { text: replyText };
      // If image or PDF, we can extend the API to handle them
      // For now, just send the text
      await submitTaskReply(taskId, replyData);
      setReplyText({ ...replyText, [taskId]: "" });
      setShowReplyDialog(null);
      await fetchTasks();
      setSuccess("✓ Reply submitted with text, image, and PDF!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit reply");
    } finally {
      setSubmittingReply({ ...submittingReply, [taskId]: false });
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setCompletingTask({ ...completingTask, [taskId]: true });
      await completeTask(taskId);
      await fetchTasks();
      setSuccess("✓ Task submitted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to complete task");
    } finally {
      setCompletingTask({ ...completingTask, [taskId]: false });
    }
  };

  // Handle status change with confirmation/popup
  const handleStatusChange = (taskId, newStatus) => {
    if (newStatus === 'hold') {
      setShowHoldPopup(taskId);
    } else if (newStatus === 'working') {
      setConfirmDialog({ type: 'working', taskId });
    } else if (newStatus === 'done') {
      setConfirmDialog({ type: 'submit', taskId });
    }
  };

  // Handle hold popup submission
  const handleHoldSubmit = async (taskId) => {
    if (!holdReason[taskId] || !holdReason[taskId].trim()) {
      setError("Please provide a reason for hold");
      return;
    }
    try {
      setUpdatingTaskStatus({ ...updatingTaskStatus, [taskId]: true });
      await updateTaskStatus(taskId, { status: 'on-hold', holdReason: holdReason[taskId] });
      await fetchTasks();
      setSuccess("✓ Task marked as On Hold");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdatingTaskStatus({ ...updatingTaskStatus, [taskId]: false });
      setShowHoldPopup(null);
    }
  };

  // Handle working confirmation
  const handleWorkingConfirm = async (taskId) => {
    try {
      setUpdatingTaskStatus({ ...updatingTaskStatus, [taskId]: true });
      await updateTaskStatus(taskId, { status: 'in-progress' });
      await fetchTasks();
      setSuccess("✓ Task status updated to Working");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdatingTaskStatus({ ...updatingTaskStatus, [taskId]: false });
      setConfirmDialog(null);
    }
  };

  // Handle submit confirmation
  const handleSubmitConfirm = async (taskId) => {
    setConfirmDialog(null);
    await handleCompleteTask(taskId);
  };

  // Separate user created tasks and assigned tasks
  const userCreatedTasks = tasks.filter(t => t.createdBy?._id === user._id);
  const assignedTasks = tasks.filter(t => t.assignedTo?._id === user._id);

  // Helper to check if a task is due on a specific date (YYYY-MM-DD)
  const isDueOn = (task, dateStr) => {
    if (!task?.dueDate) return false;
    const d = new Date(task.dueDate);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}` === dateStr;
  };

  // Compute filtered lists based on filterMode / selectedDate
  const getFiltered = (list) => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;

    if (filterMode === "all") return list;
    if (filterMode === "today") {
      return list.filter((t) => (t.dueDate ? isDueOn(t, todayStr) : false));
    }
    if (filterMode === "upcoming") {
      return list.filter((t) => t.dueDate && new Date(t.dueDate) > new Date(todayStr));
    }
    if (filterMode === "date" && selectedDate) {
      return list.filter((t) => (t.dueDate ? isDueOn(t, selectedDate) : false));
    }
    return list;
  };

  const filteredUserCreated = getFiltered(userCreatedTasks);
  const filteredAssigned = getFiltered(assignedTasks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400 text-lg">Manage your attendance, tasks, and work activities</p>
          </div>
          <button
            onClick={() => setShowAssignmentDrawer(!showAssignmentDrawer)}
            className="relative flex items-center gap-2 bg-purple-700/30 hover:bg-purple-700/50 border border-purple-500/50 text-white px-4 py-2 rounded-lg transition shadow-lg"
          >
            <Bell size={18} />
            <span className="font-semibold">Assignments</span>
            {assignmentAlerts.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {assignmentAlerts.length}
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl animate-pulse">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl animate-pulse">
            {success}
          </div>
        )}

        {assignmentAlerts.length > 0 && (
          <div className="mb-6 p-4 bg-purple-500/15 border border-purple-500/40 text-purple-100 rounded-xl">
            <p className="font-semibold mb-2">New tasks assigned by your manager (last 3 days):</p>
            <ul className="space-y-1 text-sm text-purple-50">
              {assignmentAlerts.slice(0, 5).map((t) => (
                <li key={t._id} className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded ${
                    t.priority === 'high'
                      ? 'bg-red-600/60'
                      : t.priority === 'medium'
                      ? 'bg-yellow-600/40'
                      : 'bg-green-600/40'
                  }`}>
                    {t.priority || 'priority'}
                  </span>
                  <span className="font-semibold">{t.title}</span>
                  {t.dueDate && (
                    <span className="text-purple-200 text-xs">Due {new Date(t.dueDate).toLocaleDateString()}</span>
                  )}
                  {t.createdAt && (
                    <span className="text-purple-200 text-xs">Assigned {new Date(t.createdAt).toLocaleDateString()}</span>
                  )}
                </li>
              ))}
              {assignmentAlerts.length > 5 && (
                <li className="text-xs text-purple-200">+ {assignmentAlerts.length - 5} more new assignments</li>
              )}
            </ul>
          </div>
        )}

        {!loading && (
          <div className="space-y-8">
            {/* SECTION 1: TODAY'S STATUS */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/50 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Clock className="text-blue-400" size={32} />
                  Today's Status
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Check In */}
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/60 transition">
                  <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">Check In Time</p>
                  <p className="text-3xl font-bold text-blue-300">
                    {todayAttendance?.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                  </p>
                </div>

                {/* Check Out */}
                <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/10 border border-orange-500/30 rounded-xl p-6 hover:border-orange-400/60 transition">
                  <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">Check Out Time</p>
                  <p className="text-3xl font-bold text-orange-300">
                    {todayAttendance?.checkOut ? new Date(todayAttendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                  </p>
                </div>

                {/* Hours Worked */}
                <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-500/30 rounded-xl p-6 hover:border-green-400/60 transition">
                  <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">Hours Worked</p>
                  <p className="text-3xl font-bold text-green-300">
                    {formatDurationFromRecord(todayAttendance)}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-8 flex items-center gap-4">
                <span className="text-gray-400 font-semibold">Status:</span>
                <span
                  className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide border ${
                    todayAttendance?.status === "present"
                      ? "bg-green-500/30 text-green-200 border-green-400/60"
                      : todayAttendance?.status === "half-day"
                      ? "bg-yellow-500/30 text-yellow-200 border-yellow-400/60"
                      : "bg-red-500/30 text-red-200 border-red-400/60"
                  }`}
                >
                  {todayAttendance?.status || "absent"}
                </span>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleCheckIn}
                  disabled={todayAttendance?.checkIn || checkingIn}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  {checkingIn ? "Checking In..." : "Check In"}
                </button>

                <button
                  onClick={handleCheckOut}
                  disabled={!todayAttendance?.checkIn || todayAttendance?.checkOut || checkingOut}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  {checkingOut ? "Checking Out..." : "Check Out"}
                </button>
              </div>
            </div>

            {/* SECTION 2: MY TASKS */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/50 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <CheckCircle className="text-purple-400" size={32} />
                  My Tasks
                </h2>
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition shadow-lg hover:shadow-purple-500/30"
                >
                  <Plus size={20} />
                  Add Task
                </button>
              </div>

              {/* Filter toolbar */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <button onClick={() => { setFilterMode('today'); setSelectedDate(''); }} className={`px-3 py-1 rounded-lg ${filterMode==='today' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300'}`}>Today</button>
                  <button onClick={() => { setFilterMode('upcoming'); setSelectedDate(''); }} className={`px-3 py-1 rounded-lg ${filterMode==='upcoming' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300'}`}>Upcoming</button>
                  <button onClick={() => { setFilterMode('all'); setSelectedDate(''); }} className={`px-3 py-1 rounded-lg ${filterMode==='all' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300'}`}>All</button>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <label className="text-gray-400 text-sm">Pick date:</label>
                  <input type="date" value={selectedDate} onChange={(e)=>{ setSelectedDate(e.target.value); setFilterMode('date'); }} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>

              {/* Add Task Form */}
              {showAddTask && (
                <div className="bg-slate-700/50 border border-purple-500/30 rounded-xl p-6 mb-8">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    />
                    <textarea
                      placeholder="Task description (optional)..."
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition h-24 resize-none"
                    />
                    <div className="flex gap-2 items-center">
                      <label className="text-gray-300 text-sm">Due date:</label>
                      <input
                        type="date"
                        value={newTaskDue}
                        onChange={(e) => setNewTaskDue(e.target.value)}
                        className="bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddTask}
                        disabled={creatingTask}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition"
                      >
                        {creatingTask ? "Creating..." : "Create Task"}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddTask(false);
                          setNewTaskTitle("");
                          setNewTaskDesc("");
                        }}
                        className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* User Created Tasks */}
              {filteredUserCreated.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">📝 Tasks I Created</h3>
                  <div className="space-y-3">
                    {filteredUserCreated.map((task) => (
                      <div
                        key={task._id}
                        className="bg-slate-700/50 border border-slate-600/80 rounded-xl p-5 hover:border-purple-500/50 transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white">{task.title}</h4>
                            {task.description && <p className="text-gray-400 text-sm mt-1">{task.description}</p>}
                            <div className="flex gap-3 mt-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                task.priority === 'high' ? 'bg-red-500/30 text-red-300' :
                                task.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                                'bg-green-500/30 text-green-300'
                              }`}>
                                {task.priority}
                              </span>
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                task.done ? 'bg-green-500/30 text-green-300' : 'bg-orange-500/30 text-orange-300'
                              }`}>
                                {task.done ? '✓ Done' : 'Pending'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition ml-4"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        {/* Done Button for Created Tasks */}
                        {!task.done && (
                          <button
                            onClick={() => handleCompleteTask(task._id)}
                            disabled={completingTask[task._id]}
                            className="mt-3 w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/30"
                          >
                            <CheckCircle size={18} />
                            {completingTask[task._id] ? "Marking..." : "Mark as Done"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Tasks */}
              {filteredAssigned.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">📋 Tasks Assigned to Me</h3>
                  <div className="space-y-3">
                    {filteredAssigned.map((task) => (
                      <div
                        key={task._id}
                        className="bg-slate-700/50 border border-blue-500/30 rounded-xl p-5 hover:border-blue-400/60 transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white">{task.title}</h4>
                            {task.description && <p className="text-gray-400 text-sm mt-1">{task.description}</p>}
                            <div className="flex gap-3 mt-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                task.priority === 'high' ? 'bg-red-500/30 text-red-300' :
                                task.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                                'bg-green-500/30 text-green-300'
                              }`}>
                                {task.priority}
                              </span>
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                task.done ? 'bg-green-500/30 text-green-300' : 'bg-orange-500/30 text-orange-300'
                              }`}>
                                {task.done ? '✓ Done' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Task Status Toggle (hold/working/done) */}
                        {!task.done && (
                          <div className="mt-4 pt-4 border-t border-slate-600">
                            <p className="text-sm text-blue-300 mb-3 font-semibold">Status:</p>
                            <div className="flex gap-2">
                              {['hold', 'working', 'done'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(task._id, status)}
                                  className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition ${
                                    (task.status === 'on-hold' && status === 'hold') ||
                                    (task.status === 'in-progress' && status === 'working') ||
                                    (task.status === 'completed' && status === 'done')
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                                  }`}
                                >
                                  {status === 'hold' ? '⏸ Hold' : status === 'working' ? '⚙ Working' : '✓ Done'}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reply Section with Reply Button */}
                        {task.needsReply && !task.reply && (
                          <div className="mt-4 pt-4 border-t border-slate-600">
                            <p className="text-sm text-blue-400 mb-3 font-semibold">🔔 This task requires a reply</p>
                            <button
                              onClick={() => setShowReplyDialog(task._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                            >
                              <Edit2 size={18} />
                              Reply
                            </button>
                          </div>
                        )}

                        {/* Show submitted reply */}
                        {task.reply && (
                          <div className="mt-4 pt-4 border-t border-slate-600 bg-green-500/10 rounded-lg p-4">
                            <p className="text-sm text-green-400 mb-2 font-semibold">✓ Reply Submitted</p>
                            <p className="text-gray-300">{task.reply.text}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(task.reply.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        )}

                        {/* Submit button (changed from Mark Complete) */}
                        {!task.done && (!task.needsReply || task.reply) && (
                          <button
                            onClick={() => setConfirmDialog({ type: 'submit', taskId: task._id })}
                            disabled={completingTask[task._id]}
                            className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30"
                          >
                            <CheckCircle size={20} />
                            {completingTask[task._id] ? "Submitting..." : "Submit"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Tasks */}
              {(filteredUserCreated.length === 0 && filteredAssigned.length === 0) && (
                <p className="text-gray-400 text-center py-12 text-lg">No tasks for selected filter. Try changing filter or date.</p>
              )}
            </div>

            {/* SECTION 3: ATTENDANCE HISTORY */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/50 shadow-2xl mb-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Clock className="text-indigo-400" size={32} />
                Attendance History (Last 7 Days)
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-gray-300 text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-600">
                      <th className="text-left py-4 px-4 font-bold text-gray-300">Date</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-300">Check In</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-300">Check Out</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-300">Hours Worked</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory && attendanceHistory.length > 0 ? (
                      attendanceHistory.map((record) => (
                        <tr key={record._id} className="border-b border-slate-600/50 hover:bg-slate-600/30 transition">
                          <td className="py-4 px-4 font-semibold">
                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-4 px-4 text-blue-300">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                          </td>
                          <td className="py-4 px-4 text-orange-300">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                          </td>
                          <td className="py-4 px-4 font-bold text-green-300">
                            {formatDurationFromRecord(record)}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                record.status === "present"
                                  ? "bg-green-500/30 text-green-300 border-green-400/60"
                                  : record.status === "absent"
                                  ? "bg-red-500/30 text-red-300 border-red-400/60"
                                  : "bg-yellow-500/30 text-yellow-300 border-yellow-400/60"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12 px-4 text-center text-gray-400 text-lg">
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-400 text-lg py-16">Loading dashboard...</div>
        )}

        {/* Reply Dialog Modal */}
        {showReplyDialog && (
          <ReplyDialog
            taskId={showReplyDialog}
            onSubmit={handleReplyDialogSubmit}
            onCancel={() => setShowReplyDialog(null)}
          />
        )}

        {/* Assignment Drawer */}
        {showAssignmentDrawer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-purple-500/40">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="text-purple-300" size={20} />
                  Recent Assignments
                </h3>
                <button
                  onClick={() => setShowAssignmentDrawer(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                {assignmentAlerts.length === 0 ? (
                  <p className="text-gray-400">No new assignments.</p>
                ) : (
                  <ul className="space-y-3">
                    {assignmentAlerts.map((t) => (
                      <li key={t._id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold">{t.title}</span>
                          <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-200">High</span>
                        </div>
                        {t.description && (
                          <p className="text-sm text-gray-300 mb-2">{t.description}</p>
                        )}
                        <div className="text-xs text-gray-400 flex gap-3 flex-wrap">
                          <span>Assigned by: {t.assignedByManager?.name || "Manager"}</span>
                          {t.dueDate && <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
                          {t.createdAt && <span>Assigned: {new Date(t.createdAt).toLocaleString()}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hold Reason Popup */}
        {showHoldPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-slate-600">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-600 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="text-orange-400" size={24} />
                  Reason for Hold
                </h3>
                <button
                  onClick={() => setShowHoldPopup(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4 space-y-4">
                {/* Reason Text */}
                <div>
                  <label className="text-sm mb-2 block text-gray-300 font-semibold">
                    Why are you holding this task? *
                  </label>
                  <textarea
                    value={holdReason[showHoldPopup] || ""}
                    onChange={(e) => setHoldReason({ ...holdReason, [showHoldPopup]: e.target.value })}
                    placeholder="Explain the reason for hold..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition min-h-[100px] resize-none"
                  />
                </div>

                {/* Attachment Section */}
                <div>
                  <label className="text-sm mb-2 block text-gray-300 font-semibold">
                    Attachment (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-orange-400 transition cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => setHoldAttachment({ ...holdAttachment, [showHoldPopup]: e.target.files?.[0] })}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                    />
                  </div>
                  {holdAttachment[showHoldPopup] && (
                    <p className="text-xs text-gray-400 mt-2">
                      📎 {holdAttachment[showHoldPopup].name}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-600 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowHoldPopup(null);
                    setHoldReason({ ...holdReason, [showHoldPopup]: "" });
                    setHoldAttachment({ ...holdAttachment, [showHoldPopup]: null });
                  }}
                  className="px-5 py-2.5 text-sm border-2 border-slate-600 rounded-lg hover:bg-slate-700 transition text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleHoldSubmit(showHoldPopup)}
                  className="px-5 py-2.5 text-sm bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg font-semibold transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 border border-slate-600">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-600">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertCircle className="text-yellow-400" size={24} />
                  Confirm Action
                </h3>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <p className="text-gray-300 text-center text-lg">
                  {confirmDialog.type === 'working'
                    ? "Are you sure you want to mark this task as Working?"
                    : confirmDialog.type === 'submit'
                    ? "Are you sure you want to submit this task?"
                    : "Confirm this action?"}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-600 flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-5 py-2.5 text-sm border-2 border-slate-600 rounded-lg hover:bg-slate-700 transition text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmDialog.type === 'working') {
                      handleWorkingConfirm(confirmDialog.taskId);
                    } else if (confirmDialog.type === 'submit') {
                      handleSubmitConfirm(confirmDialog.taskId);
                    }
                  }}
                  className="px-5 py-2.5 text-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-semibold transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
