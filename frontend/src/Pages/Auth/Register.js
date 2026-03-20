import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
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

  const validateForm = () => {
    const { name, email, password } = values;

    if (!name || !email || !password) {
      toast.error("All fields are required", toastOptions);
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await axios.post(registerAPI, values);

      if (data.success) {
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Server error, try again later", toastOptions);
    }

    setLoading(false);
  };

  return (
    <div className="authPage">
      <Container>
        <Row className="justify-content-center">
          <Col lg={4} md={6} sm={10} xs={11}>
            
            <div className="appCard">

              {/* 🔶 Top */}
              <div className="cardTop">
                <div className="brandRow">
                  <img src={logo} alt="ExpenseLy Logo" />
                  <h4>ExpenseLy</h4>
                </div>
                <p className="tagline">Track your expenses easily</p>
              </div>

              {/* 🔳 Bottom */}
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

                  <Button
                    type="submit"
                    className="primaryBtn"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>

                </Form>

                <p className="text-center mt-3">
                  Already have an account?
                  <Link to="/login" className="lnk"> Login</Link>
                </p>

              </div>

            </div>

          </Col>
        </Row>
      </Container>

      <ToastContainer />
    </div>
  );
};

export default Register;