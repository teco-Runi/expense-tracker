import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./auth.css";
import axios from "axios";
import logo from "../../assets/expensely-logo.svg";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {

const navigate = useNavigate();
const [loading,setLoading] = useState(false);

const [values,setValues] = useState({
email:"",
password:""
});

useEffect(()=>{
if(localStorage.getItem("user")){
navigate("/")
}
},[navigate])

const toastOptions={
position:"bottom-right",
autoClose:2000,
theme:"dark"
}

const handleChange=(e)=>{
setValues({...values,[e.target.name]:e.target.value})
}

const handleSubmit = async (e)=>{
e.preventDefault()

try{

setLoading(true)

const {data} = await axios.post(loginAPI,{
email:values.email,
password:values.password
})

if(data.success){

localStorage.setItem("user",JSON.stringify(data.user))
toast.success(data.message,toastOptions)
navigate("/")

}else{
toast.error(data.message,toastOptions)
}

}catch(error){

toast.error("Something went wrong",toastOptions)

}

setLoading(false)

}

return(

<div
style={{
minHeight:"100vh",
background:`
radial-gradient(circle at center, rgba(255,114,94,0.12) 0%, rgba(255,114,94,0.06) 20%, transparent 40%),
linear-gradient(135deg,#ffffff,#fdfdfd)
`,
display:"flex",
alignItems:"center",
justifyContent:"center"
}}
>
<Container className="d-flex justify-content-center">
<Row className="w-100 justify-content-center">

<Col lg={4} md={6} sm={10} xs={11}>

<div className="appCard">

<div className="cardTop">
<img
src={logo}
alt="ExpenseLy Logo"
style={{
width:"60px",
height:"60px",
marginBottom:"8px"
}}
/>
<h4 className="mt-2 text-white">ExpenseLy</h4>
<p style={{fontSize:"13px",opacity:"0.9"}}>
Track your expenses easily
</p>
</div>

<div className="cardBottom">

<h5 className="text-center mb-3">Sign In</h5>

<Form onSubmit={handleSubmit}>

<Form.Control
className="inputField"
type="email"
name="email"
placeholder="Email"
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

{loading ? "Signing..." : "Login"}

</Button>

</Form>

<p className="text-center mt-3">

<Link to="/forgotPassword" className="lnk">
Forgot Password?
</Link>

</p>

<p className="text-center">

Don't have an account?

<Link to="/register" className="lnk"> Register</Link>

</p>

</div>

</div>

</Col>

</Row>
</Container>

</div>

)

}

export default Login