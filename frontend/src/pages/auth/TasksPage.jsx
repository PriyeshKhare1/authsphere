import { useEffect, useState } from "react";
import { getTasks, createTask, updateTaskReply, markTaskDone } from "../../api/task.api.js";
import { useAuth } from "../../context/AuthContext";
import { sortTasksByDate, useTasksSocket } from "../../hooks/useTasksSocket.js";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  useTasksSocket(Boolean(user), setTasks);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_user") 
          ? JSON.parse(localStorage.getItem("auth_user")).token 
          : null;
        if (!token) return;
        const data = await getTasks(token);
        setTasks(sortTasksByDate(data));
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  // Create task
  const handleCreateTask = async () => {
    if (!newTaskTitle) return;
    try {
      const token = localStorage.getItem("auth_user") 
        ? JSON.parse(localStorage.getItem("auth_user")).token 
        : null;
      if (!token) return;
      const data = await createTask({ title: newTaskTitle }, token);
      setTasks((prev) => sortTasksByDate([...prev, data]));
      setNewTaskTitle("");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Mark task done
  const handleMarkDone = async (taskId) => {
    try {
      const token = localStorage.getItem("auth_user") 
        ? JSON.parse(localStorage.getItem("auth_user")).token 
        : null;
      if (!token) return;
      await markTaskDone(taskId, token);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, done: true } : t));
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Reply to task
  const handleReply = async (taskId) => {
    if (!replyText) return;
    try {
      const token = localStorage.getItem("auth_user") 
        ? JSON.parse(localStorage.getItem("auth_user")).token 
        : null;
      if (!token) return;
      const data = await updateTaskReply(taskId, replyText, token);
      setTasks(tasks.map(t => t._id === taskId ? data : t));
      setReplyText("");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  if (!user) {
    return <div className="p-6 text-center">Please log in to view tasks</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Tasks Management</h2>
      
      {/* Add Task Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
        <div className="flex gap-3">
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            className="flex-1 border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <button 
            onClick={handleCreateTask}
            disabled={loading || !newTaskTitle}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">All Tasks</h3>
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet</p>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task._id} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded">
                <h4 className="font-semibold text-lg mb-2">{task.title}</h4>
                <p className="text-sm mb-2">
                  Status: <span className={`font-bold ${task.done ? 'text-green-600' : 'text-yellow-600'}`}>
                    {task.done ? "✓ Done" : "⏳ Pending"}
                  </span>
                </p>
                
                {task.reply && (
                  <div className="bg-white p-3 rounded mb-3 border border-gray-200">
                    <p className="text-sm text-gray-600"><strong>Reply:</strong> {task.reply}</p>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  {!task.done && (
                    <button 
                      onClick={() => handleMarkDone(task._id)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      Mark Done
                    </button>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 border border-gray-200 px-3 py-1 rounded text-sm"
                  />
                  <button 
                    onClick={() => handleReply(task._id)}
                    disabled={!replyText}
                    className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 text-sm disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
