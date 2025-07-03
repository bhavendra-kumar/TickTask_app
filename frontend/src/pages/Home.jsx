import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">Welcome to <span className="text-blue-600">🎯TickTask</span> </h1>

        <p className="text-gray-700 text-md mb-6">
          TickTask is your personal productivity assistant. Create tasks, assign countdown timers,
          and stay focused with live countdowns. Whether you're studying, working, or just staying
          organized — TickTask keeps you on track, one tick at a time.
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <Link
            to="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-lg shadow-md transition"
          >
            Register
          </Link>

          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-lg shadow-md transition"
          >
            Login
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          ⏳ Plan. Focus. Complete. <br /> Start ticking your tasks with TickTask.
        </div>
      </div>
    </div>
  );
}