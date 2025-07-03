import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ add this

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate(); // ✅ hook for navigation

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert(res.data.message);

      // ✅ Optional: Auto login after registration
      const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // ✅ Save token and redirect
      localStorage.setItem("token", loginRes.data.token);
      navigate("/dashboard"); // 🔀 redirect to dashboard

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80 space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-600">Register</h2>
        <input
          name="username"
          placeholder="Username"
          className="w-full px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
}
