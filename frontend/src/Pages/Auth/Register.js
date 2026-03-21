import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import logo from "../../assets/expensely-logo.svg";
import { registerAPI } from "../../utils/ApiRequest";
import "react-toastify/dist/ReactToastify.css";
import "./auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/setAvatar");
  }, [navigate]);

  const toastOptions = { position: "bottom-right", autoClose: 2000, theme: "dark" };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!values.name || !values.email || !values.password)
      return toast.error("All fields required", toastOptions);

    if (values.password.length < 6)
      return toast.error("Password must be at least 6 characters", toastOptions);

    try {
      setLoading(true);
      const { data } = await axios.post(registerAPI, values);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/setAvatar");   // ✅ FIX
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch {
      toast.error("Server error", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="centerWrapper">
        <div className="appCard">
          <div className="cardTop">
            <div className="brandRow">
              <img src={logo} alt="logo" />
              <h4>ExpenseLy</h4>
            </div>
            <p className="tagline">Create your account</p>
          </div>

          <div className="cardBottom">
            <h5 className="text-center mb-3">Sign Up</h5>

            <Form onSubmit={handleSubmit}>
              <Form.Control className="inputField" name="name" placeholder="Full Name" onChange={handleChange} />
              <Form.Control className="inputField" name="email" placeholder="Email" onChange={handleChange} />
              <Form.Control className="inputField" type="password" name="password" placeholder="Password" onChange={handleChange} />

              <Button type="submit" className="primaryBtn" disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </Button>
            </Form>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login" className="lnk">Login</Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;