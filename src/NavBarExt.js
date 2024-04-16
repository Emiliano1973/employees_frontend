// Components/NavBar.js
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavBar.css';

const NavBarExt = () => {
   return (     
      <>
      <Navbar bg="dark" data-bs-theme="dark">
         <Container>
         <Navbar.Brand href="#home">Employee Manager Application</Navbar.Brand>
         <Nav className="me-auto">
            <Nav.Link href="#login"><Link to="/login">Login</Link></Nav.Link>
         </Nav>
         </Container>
      </Navbar>
      </>
)
   
};

export default NavBarExt;