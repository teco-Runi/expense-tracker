import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const [cUser, setcUser] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  // ✅ CHECK USER + AVATAR
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
    } else if (!user.isAvatarImageSet || user.avatarImage === "") {
      navigate("/setAvatar");
    } else {
      setcUser(user);
      setRefresh(true);
    }
  }, [navigate]);

  // ✅ HANDLE FORM CHANGE
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, description, category, date, transactionType } = values;

    if (!title || !amount || !description || !category || !date || !transactionType) {
      toast.error("Please enter all fields", toastOptions);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(addTransaction, {
        ...values,
        userId: cUser._id,
      });

      if (data.success) {
        toast.success(data.message, toastOptions);
        setShow(false);
        setRefresh(!refresh);
      } else {
        toast.error(data.message, toastOptions);
      }

    } catch (err) {
      toast.error("Server error", toastOptions);
    }

    setLoading(false);
  };

  // ✅ FETCH TRANSACTIONS
  useEffect(() => {
    if (!cUser) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency,
          startDate,
          endDate,
          type,
        });

        setTransactions(data.transactions);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchData();
  }, [refresh, frequency, startDate, endDate, type, cUser]);

  return (
    <>
      <Header />

      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-3">
          
          {/* FILTER ROW */}
          <div className="filterRow">

            <Form.Group>
              <Form.Label>Select Frequency</Form.Label>
              <Form.Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="7">Last Week</option>
                <option value="30">Last Month</option>
                <option value="365">Last Year</option>
                <option value="custom">Custom</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">All</option>
                <option value="expense">Expense</option>
                <option value="credit">Earned</option>
              </Form.Select>
            </Form.Group>

            {/* VIEW BUTTONS */}
            <div className="iconBtnBox">
              <FormatListBulletedIcon
                onClick={() => setView("table")}
                className={view === "table" ? "iconActive" : "iconDeactive"}
              />
              <BarChartIcon
                onClick={() => setView("chart")}
                className={view === "chart" ? "iconActive" : "iconDeactive"}
              />
            </div>

            {/* ADD BUTTON */}
            <Button onClick={() => setShow(true)} className="addNew">
              Add New
            </Button>
          </div>

          {/* DATE FILTER */}
          {frequency === "custom" && (
            <div className="date">
              <DatePicker selected={startDate} onChange={setStartDate} />
              <DatePicker selected={endDate} onChange={setEndDate} />
            </div>
          )}

          {/* RESET */}
          <div className="containerBtn">
            <Button onClick={() => {
              setType("all");
              setStartDate(null);
              setEndDate(null);
              setFrequency("7");
            }}>
              Reset Filter
            </Button>
          </div>

          {/* TABLE / CHART */}
          {view === "table" ? (
            <TableData data={transactions} user={cUser} />
          ) : (
            <Analytics transactions={transactions} user={cUser} />
          )}

          {/* MODAL */}
          <Modal show={show} onHide={() => setShow(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add Transaction</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Form.Control name="title" placeholder="Title" onChange={handleChange} className="mb-2"/>
                <Form.Control name="amount" type="number" placeholder="Amount" onChange={handleChange} className="mb-2"/>
                <Form.Control name="description" placeholder="Description" onChange={handleChange} className="mb-2"/>
                <Form.Control name="category" placeholder="Category" onChange={handleChange} className="mb-2"/>
                <Form.Control name="date" type="date" onChange={handleChange} className="mb-2"/>

                <Form.Select name="transactionType" onChange={handleChange}>
                  <option value="">Type</option>
                  <option value="credit">Credit</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
              <Button variant="primary" onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
          </Modal>

          <ToastContainer />
        </Container>
      )}
    </>
  );
};

export default Home;