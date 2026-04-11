import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../services/userService";
import { toast } from "react-toastify";
import "../styles/auth.css";

const SignIn = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email === "") {
      toast.warn("Email must be entered");
      return;
    }

    if (form.password === "") {
      toast.warn("Password must be entered");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn(form.email, form.password);

      if (res.status === "success") {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("email", form.email);
        sessionStorage.setItem("name", res.data.name);

        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;