import { useEffect, useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/expensely-logo.svg";
import "./style.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="navbarCustom">
      <Container>

        {/* 🔷 Logo + Brand */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="brandContainer"
        >
          <img src={logo} alt="logo" />
          <span>ExpenseLy</span>
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Nav>

            {user ? (
              <Button className="navBtn" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button className="navBtn" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}

          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default Header;