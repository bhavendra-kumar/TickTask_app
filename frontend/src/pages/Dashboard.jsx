import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const alertSound = useRef(null);
  const startSound = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [timeDays, setTimeDays] = useState(0);
  const [timeHours, setTimeHours] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.completed || !task.countdownEnd) return task;

          const remaining = new Date(task.countdownEnd) - Date.now();

          // 🎬 Play "start" sound once
          if (!task.startPlayed && remaining > 0 && startSound.current) {
            startSound.current.currentTime = 0;
            startSound.current.play().catch(() => { });
          }

          // 🔔 Play "end" sound once
          if (task.remainingTime > 0 && remaining <= 0 && !task.endPlayed && alertSound.current) {
            alertSound.current.currentTime = 0;
            alertSound.current.play().catch(() => { });
          }

          return {
            ...task,
            remainingTime: remaining > 0 ? remaining : 0,
            startPlayed: task.startPlayed || remaining > 0,
            endPlayed: task.endPlayed || (task.remainingTime > 0 && remaining <= 0),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const baseURL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/tasks`, {
        headers: { Authorization: token },
      });
      const updated = res.data.map((task) => ({
        ...task,
        remainingTime: task.completed ? 0 : new Date(task.countdownEnd) - Date.now(),
        startPlayed: false,
        endPlayed: false,
      }));
      setTasks(updated);
    } catch (err) {
      console.error("Fetch task error:", err.response?.data || err.message);
      alert("Failed to load tasks");
    }
  };


  const handleAddTask = async () => {
    const totalMillis = (timeDays * 24 * 60 * 60 + timeHours * 60 * 60 + timeMinutes * 60) * 1000;

    if (!newTask.trim()) {
      alert("Task cannot be empty.");
      return;
    }

    if (totalMillis <= 0) {
      alert("Please set a timer greater than 0.");
      return;
    }

    try {
      const countdownEnd = new Date(Date.now() + totalMillis);
      const res = await axios.post(
                 `${baseURL}/api/tasks`, 
        { task: newTask, countdownEnd },
        { headers: { Authorization: token } }
      );
      setTasks([{ ...res.data, remainingTime: totalMillis }, ...tasks]);
      setNewTask("");
      setTimeDays(0);
      setTimeHours(0);
      setTimeMinutes(0);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to add task");
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      const res = await axios.put(`${baseURL}/api/tasks/${taskId}`,
         { completed: !currentStatus },
          { headers: { Authorization: token } }
        );
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
     await axios.delete(`${baseURL}/api/tasks/${taskId}`,
       { headers: { Authorization: token } }
      );
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
  };

  const getOriginalSetTime = (task) => {
    const totalMs = new Date(task.countdownEnd) - new Date(task.createdAt);
    const totalSeconds = Math.floor(totalMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const parts = [];
    if (days) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (minutes) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
    return parts.join(", ");
  };

  const nextActiveTask = tasks
    .filter((t) => !t.completed && t.remainingTime > 0)
    .sort((a, b) => a.remainingTime - b.remainingTime)[0];


  return (
    <>
      <audio ref={alertSound} src="/alert.wav" preload="auto" />
      <audio ref={startSound} src="/alert.wav" preload="auto" />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700">🎯 TickTask</h2>
          <p className="text-sm text-gray-600">
            Manage your tasks with countdown precision and stay focused on what matters most.
          </p>
        </div>

        <div className="max-w-xl mx-auto sticky top-4 z-10 bg-white border border-gray-300 rounded-xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">📌 Task Dashboard</h1>
            <button
              className="text-sm text-white bg-red-500 px-4 py-1.5 rounded hover:bg-red-600"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}>
              Logout
            </button>
          </div>

          {nextActiveTask && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-5 rounded-md">
              <p>
                <strong>📝 New task:</strong> "{nextActiveTask.task}"
              </p>
              <p>
                ⏱ Countdown for your task, Stay focused to Complete within{" "}
                <strong>{formatTime(nextActiveTask.remainingTime)}</strong>
              </p>
            </div>
          )}

          <h3 className="font-semibold text-gray-800 text-lg mb-2">Add New Task</h3>

          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter your task..."
            className="w-full border border-gray-300 px-3 py-2 rounded-md mb-3 shadow-sm focus:outline-blue-500"
          />

          <h3 className="text-sm text-gray-600 mb-1">⏰ <strong>Set Timer</strong></h3>

          <div className="flex gap-4 items-end flex-wrap mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Days</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={timeDays}
                onChange={(e) => setTimeDays(Number(e.target.value))}
                className="w-24 border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Hours</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={timeHours}
                onChange={(e) => setTimeHours(Number(e.target.value))}
                className="w-24 border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(Number(e.target.value))}
                className="w-24 border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white h-10 px-5 py-2 rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`flex justify-between items-center p-4 border-l-4 rounded-lg shadow-sm transition ${task.completed ? "border-green-500 bg-green-50" : "border-yellow-400 bg-yellow-50"
                  }`}
              >
                <div className="flex flex-col">
                  <span
                    onClick={() => toggleTask(task._id, task.completed)}
                    className={`cursor-pointer font-semibold text-md ${task.completed ? "line-through text-gray-500" : "text-gray-800"
                      }`}
                  >
                    {task.task}
                  </span>
                  {!task.completed && (
                    <span className="text-sm text-gray-600 mt-1">
                      ⏳ {formatTime(task.remainingTime || 0)} left
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-600 hover:text-red-800 text-lg"
                >
                  ❌
                </button>

              </div>
            ))}
          </div>
        </div>


      </div>
    </>
  );
}
