// Components/NavBar.js
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavBar.css';
import { useContext, useEffect } from 'react';
import { AuthContext } from './routing/AuthContext';
import { jwtDecode } from 'jwt-decode';

const NavBar = () => {
   const { token, isAdmin } = useContext(AuthContext);
   const navigate = useNavigate();
        useEffect(() => {

         const decoded = jwtDecode(token);
        const expDate=new Date();
        expDate.setTime( decoded.exp * 1000);
        const now=new Date();
        if(now>expDate){
            navigate('/logout');
            return; 
        }
   
      }, []);

    
   return (     
      <>
      <Navbar bg="dark" data-bs-theme="dark">
         <Container>
         <Navbar.Brand href="#employees"><Link to="/List">Home</Link></Navbar.Brand>
         <Nav className="me-auto">
            <Nav.Link href="#employees"><Link to="/List">Employees</Link></Nav.Link>
            <Nav.Link style={ isAdmin? {display:'inline'}: {display:'none'}} href="#newemployee"><Link to="/newEmployee">New Employee</Link></Nav.Link>
            <Nav.Link href="#pie"><Link  to="/pie">Employee Perc in Departments</Link></Nav.Link>
            <Nav.Link style={ isAdmin? {display:'inline'}: {display:'none'}}  href="#signup"><Link to="/signup">Add App User</Link></Nav.Link>
            <Nav.Link href="#logout"><Link to="/logout">Logout</Link></Nav.Link>
         </Nav>
         </Container>
      </Navbar>
      </>
)
   
};

export default NavBar;