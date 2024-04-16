import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row  from 'react-bootstrap/Row';
import { AuthContext } from '../routing/AuthContext';
import Container from 'react-bootstrap/Container';
import "react-datepicker/dist/react-datepicker.css";
import NavBarExt from '../NavBarExt';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
  const [validated, setValidated] = useState(false);

  const [loginForm, setLoginForm]=useState ({
    'username' : '',
    'password' : ''
  });

   const [validationMessages, setValidationMessages] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null); // New state for handling error messages
  const { setToken, setIsAdmin } = useContext(AuthContext);
 
  const navigate = useNavigate();
    const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value;
    
    setLoginForm(values => ({...values, [name]: value}));
     
  };

  const apiUrl = process.env.REACT_APP_SERVER_URL; 
 
  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    setValidated(true);
    try{
      const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(loginForm)
    };
    const response= await  fetch(apiUrl+'/api/auth/login', options)
    if (!response.ok) {
  
       if(response.status ===401){
        throw new Error("Authentication failed: User and/or password incorrect");
        
     }else if(response.status ===400){
      var errorObj= await response.json();
      if(errorObj && errorObj.messages){
        setValidationMessages(errorObj.messages);
        throw new Error("Validation error");
      }else {
        throw new Error("Error in login");
      }
      
   } else{
      throw new Error('Error in login');
     }
    }
    const jsonData = await response.json();
     
    const decoded = jwtDecode(jsonData.token);
    const roles = await decoded.roles;
     await setToken(jsonData.token);
     await  setIsAdmin(roles.indexOf('ADMIN') >-1);
    localStorage.setItem("isAdmin", roles.indexOf('ADMIN') >-1);
     localStorage.setItem("token", jsonData.token);
      navigate("/list");     
      } catch (error) {
      console.error("Authentication failed:", error);
      setToken(null);
      setIsAdmin(false);
      localStorage.removeItem("token");
      setErrorMessage(error.message);
  } 
};
 
   const renderValidationMessages= () => {
    return validationMessages.map(item => (
        <li>{item}</li>
    ));
  };
  
  return (
   <>
     <NavBarExt/>   
   
     <Container>  
     {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
     {errorMessage && validationMessages &&  <div style={{ color: "red" }}>
      <ul>
        {renderValidationMessages()}
      </ul>
      </div>}{" "}
     <h1>Login</h1>
          <Form validated={validated} onSubmit={handleLogin}>
          <Row>
          <Form.Group as={Col} controlId="username" >
            <Form.Label> Username</Form.Label>
            <Form.Control type="text" value={loginForm.username} id='username' name='username' onChange={handleChange} placeholder="Enter Usermane" minLength={5} maxLength={15} required />
            <Form.Control.Feedback type='invalid' >Username is manadatory</Form.Control.Feedback>
          </Form.Group>
          </Row>
          <Row>  
          <Form.Group  as={Col} controlId="lastName">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={loginForm.password} name='password' 
            id='password' onChange={handleChange} placeholder="Enter Password" minLength={8} required />
            <Form.Control.Feedback type='invalid'> Password is manadatory and not shorter than 8</Form.Control.Feedback>
          </Form.Group>
          </Row>
          <Button variant="primary"  type="submit">
            Submit
          </Button>
        </Form>
        </Container>  
      </>
    );
};

export default Login;