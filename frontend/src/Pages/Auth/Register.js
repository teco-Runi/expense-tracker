import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { registerAPI } from "../../utils/ApiRequest";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (localStorage.getItem("user")) navigate("/"); }, [navigate]);

  const toastOptions = { position: "bottom-right", autoClose: 2000, theme: "dark" };

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.name || !values.email || !values.password) return toast.error("All fields required", toastOptions);
    if (values.password.length < 6) return toast.error("Password must be at least 6 characters", toastOptions);

    try {
      setLoading(true);
      const { data } = await axios.post(registerAPI, values);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else toast.error(data.message, toastOptions);
    } catch { toast.error("Server error", toastOptions); } finally { setLoading(false); }
  };

  return (
    <div className="authPage">
      <Form onSubmit={handleSubmit}>
        <Form.Control name="name" placeholder="Full Name" value={values.name} onChange={handleChange} />
        <Form.Control name="email" placeholder="Email" value={values.email} onChange={handleChange} />
        <Form.Control name="password" placeholder="Password" value={values.password} onChange={handleChange} />
        <Button disabled={loading}>{loading ? "Creating..." : "Sign Up"}</Button>
      </Form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
      <ToastContainer />
    </div>
  );
};

export default Register;