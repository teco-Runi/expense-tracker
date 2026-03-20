import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/expensely-logo.svg";
import { registerAPI } from "../../utils/ApiRequest";
import "react-toastify/dist/ReactToastify.css";
import "./auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.name || !values.email || !values.password) {
      return toast.error("All fields are required", toastOptions);
    }

    if (values.password.length < 6) {
      return toast.error("Password must be at least 6 characters", toastOptions);
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
  "https://expense-backend-2k8h.onrender.com/api/auth/register",
  values
);

      if (data.success) {
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }

    } catch (error) {
      toast.error("Server error", toastOptions);
    }

    setLoading(false);
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

            <h5 className="text-center mb-3">Create Account</h5>

            <Form onSubmit={handleSubmit}>

              <Form.Control
                className="inputField"
                type="text"
                name="name"
                placeholder="Full Name"
                value={values.name}
                onChange={handleChange}
              />

              <Form.Control
                className="inputField"
                type="email"
                name="email"
                placeholder="Email Address"
                value={values.email}
                onChange={handleChange}
              />

              <Form.Control
                className="inputField"
                type="password"
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
              />

              <Button className="primaryBtn" disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </Button>

            </Form>

            <p className="text-center mt-3">
              Already have an account?
              <Link to="/login" className="lnk"> Login</Link>
            </p>

          </div>

        </div>

      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;