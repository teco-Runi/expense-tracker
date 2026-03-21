import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import logo from "../../assets/expensely-logo.svg";
import { loginAPI } from "../../utils/ApiRequest";
import "react-toastify/dist/ReactToastify.css";
import "./auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

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

    if (!values.email || !values.password)
      return toast.error("All fields are required", toastOptions);

    try {
      setLoading(true);
      const { data } = await axios.post(loginAPI, values);

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
            <p className="tagline">Track your expenses easily</p>
          </div>

          <div className="cardBottom">
            <h5 className="text-center mb-3">Welcome Back</h5>

            <Form onSubmit={handleSubmit}>
              <Form.Control className="inputField" name="email" placeholder="Email" onChange={handleChange} />
              <Form.Control className="inputField" type="password" name="password" placeholder="Password" onChange={handleChange} />

              <Button className="primaryBtn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>

            <p className="text-center mt-3">
              Don't have an account? <Link to="/register" className="lnk">Register</Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;