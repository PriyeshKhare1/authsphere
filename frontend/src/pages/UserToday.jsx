import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  User,
  ListTodo,
  CheckCircle,
  Clock,
  Plus,
} from "lucide-react";
import { ViewReplyDialog } from "./ViewReplyDialog";

export default function UserToday({ id }) {
  const navigate = useNavigate();
  const userName = id === "1" ? "Priyesh" : "Aman";

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project documentation",
      done: true,
      needsReply: true,
      replied: true,
      reply: {
        text: "Documentation completed.",
        image:
          "https://images.unsplash.com/photo-1712812824597-1781d19a2acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        timestamp: "01/06/2026, 10:30 AM",
      },
    },
    {
      id: 2,
      title: "Review code changes",
      done: false,
      needsReply: true,
      replied: false,
    },
    {
      id: 3,
      title: "Attend team meeting",
      done: true,
      needsReply: true,
      replied: true,
      reply: {
        text: "Meeting attended.",
        image: null,
        timestamp: "01/06/2026, 02:00 PM",
      },
    },
  ]);

  const [replyingTaskId, setReplyingTaskId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [viewingReply, setViewingReply] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const todayTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;

  const handleTaskDone = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task.needsReply && !task.replied) {
      alert("User needs to reply first before marking this task done");
      return;
    }
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, done: true } : t
      )
    );
  };

  const handleReplySubmit = (taskId) => {
    const timestamp = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              replied: true,
              reply: {
                text: replyText,
                image: replyImage
                  ? URL.createObjectURL(replyImage)
                  : null,
                timestamp,
              },
            }
          : task
      )
    );

    setReplyingTaskId(null);
    setReplyText("");
    setReplyImage(null);
  };

  const handleAddTask = () => {
    if (!newTaskTitle || !newTaskDate) {
      alert("Please fill all fields");
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTaskTitle,
        date: newTaskDate,
        done: false,
        needsReply: true,
        replied: false,
      },
    ]);

    setShowAddTask(false);
    setNewTaskTitle("");
    setNewTaskDate("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-3xl text-white mb-2">
            User Today Info
          </h1>
          <p className="text-blue-200">
            Manage and monitor user activity
          </p>
        </div>

        {/* User Stats */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Stat icon={<User />} label="Name" value={userName} />
            <Stat icon={<ListTodo />} label="Today Tasks" value={todayTasks} />
            <Stat icon={<CheckCircle />} label="Completed" value={completedTasks} />
            <Stat icon={<Clock />} label="Login Time" value="09:10" />
            <Stat icon={<Clock />} label="Logout Time" value="--" />
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-white">Tasks</h2>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Assign Task
            </button>
          </div>

          {showAddTask && (
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <input
                placeholder="Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded-xl bg-white/10 text-white"
              />
              <input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded-xl bg-white/10 text-white"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddTask}
                  className="bg-green-600 px-4 py-2 rounded-xl text-white"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="bg-white/10 px-4 py-2 rounded-xl text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800/50 rounded-xl px-6 py-4 flex justify-between"
              >
                <div>
                  <div
                    className={`text-white ${
                      task.done ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!task.done && (
                    <button
                      onClick={() => handleTaskDone(task.id)}
                      className="bg-green-600 px-4 py-2 rounded-xl text-white"
                    >
                      Mark Done
                    </button>
                  )}
                  {task.replied && task.reply && (
                    <button
                      onClick={() => setViewingReply(task.reply)}
                      className="bg-blue-600 px-4 py-2 rounded-xl text-white flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ View Full Details Button (ADDED) */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(`/admin/users/${id}/details`)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all text-sm"
          >
            View Full Details
          </button>
        </div>
      </div>

      {viewingReply && (
        <ViewReplyDialog
          reply={viewingReply}
          onClose={() => setViewingReply(null)}
        />
      )}
    </div>
  );
}

/* Reusable stat card */
function Stat({ icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 text-blue-200">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-white text-lg">{value}</div>
    </div>
  );
}
