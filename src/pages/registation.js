import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import "react-datepicker/dist/react-datepicker.css";
import NavBar from '../NavBar';
import { AuthContext } from '../routing/AuthContext';


const Registration = () => {
  
  const { token, loading } = useContext(AuthContext);
  const [signupForm, setSignupForm]=useState ({
    'username' : '',
    'password' : '',
    'email' : '',
    'roles' : []
  });

  const apiUrl = process.env.REACT_APP_SERVER_URL; 
 
  const [errorMessage, setErrorMessage] = useState(null); // New state for handling error messages
  const navigate = useNavigate();
    const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value;
    setSignupForm(values => ({...values, [name]: value}));
      };

      const handleChangeRoles = (event) => {
        const name = event.target.name
        const value = event.target.value;
        
        setSignupForm(values => ({...values, [name]: [value]}));
          };
    
    
  const handleSingup = async (event) => {
    event.preventDefault();
    try{
      const options = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+token,
          'access-control-allow-origin': '*',
          'Content-type': 'application/json; charset=UTF-8',
          'Cache-Control': 'no-cache'
},
          body: JSON.stringify(signupForm)
    };
    const response= await  fetch(apiUrl+'/api/services/signup', options)
    if (!response.ok) {
      throw new Error('Error in registration');
    }
      navigate("/list");     
      } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data); // Set the error message if present in the error response
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
  } 
};
 
  return (
   <>
     <Container> 
      <NavBar/>   
     <h1>Regster new Application User</h1>
     {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
          <Form onSubmit={handleSingup} autoComplete='off'>
          <Form.Group className="mb-3" controlId="username" >
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={signupForm.username} id='username' name='username'
             onChange={handleChange} placeholder="Enter Usermane" minLength={5} maxLength={10} required/>
          </Form.Group>
          <Form.Group className="mb-3"  controlId="email">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="email" value={signupForm.email} name='email' id='email' onChange={handleChange} placeholder="Enter email" required />
          </Form.Group>
        
          <Form.Group className="mb-3"  controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={signupForm.password} name='password' id='password' onChange={handleChange} placeholder="Enter Password" minLength={8} required />
          </Form.Group>
          <Form.Group className='mb-3'  controlId="roles">
            <Form.Label>Roles</Form.Label>
            <Form.Control required as="select" name='roles' id='roles' onChange={handleChangeRoles} >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        </Container>  
      </>
    );
};

export default Registration;