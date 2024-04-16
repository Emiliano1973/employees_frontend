import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TableWithPagination.css';
import {
  useNavigate
} from "react-router-dom";
import { Button, Col, Container,Row, Form } from 'react-bootstrap'
import { PaginationControl } from 'react-bootstrap-pagination-control';
import ConfirmDialog from './ConfirmDialog';
import { AuthContext } from './routing/AuthContext';



const TableWithPagination = ({ currentPage, totalPages, items, onPageChange, deleteEmployee, orderFunction, handleSubmitSearch, searchTerm=''}) => {
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  const[internSearchLike,setInternSearchLike ]= useState(searchTerm);
  const[delParam, setDelParam] = useState({
    param: null,
  });

  const showDialogFlag={
    showModal: false
  } ;
  
  const goToUpdatePage=(employeeNumber) =>{
    navigate('/employeeUp/'+employeeNumber);

  };

  const handleChange = (event) => {
    const value = event.target.value;
     setInternSearchLike(value)
      };


 const handleSubmitSearchInternal = (event)=>{
   event.preventDefault();
   handleSubmitSearch(internSearchLike.trim());
   
 };  

  const deleteEmployeeInternal=(employeeNumberDel)=>{
    deleteEmployee(employeeNumberDel);
  };

 const disableSearch= ()=>{
  if(internSearchLike.length===0){
    return false;
  }
  if(internSearchLike.length <3){
    return true;
  }
  return false;
 };

 const renderItems = () => {
    return items.map(item => (
      <tr key={item.employeeNumber}>
        <td>{item.employeeNumber}</td>
        <td>{item.firstName} {item.lastName}</td>
        <td>{item.hireDate}</td>
        <td>{item.departmentName}</td>
        <td>{item.title}</td>
        <td><Button style={ isAdmin? {display:'inline'}: {display:'none'}} onClick={() => {deleteEmployee(item.employeeNumber);}}>del</Button></td>
        <td><Button onClick={() => {goToUpdatePage(item.employeeNumber);}}>View</Button></td>      
      </tr>
    ));
  }  
  return (
   <> 
  <Container fluid>
    <Form onSubmit={handleSubmitSearchInternal} autoComplete='off'>
      <Row className="align-items-right" > 
        <Col xs="10">
          <Form.Label htmlFor="searchLikeField" visuallyHidden>
            Search
          </Form.Label>
          <Form.Control
          style={{width:'20%', float:'right'}}
            className="mb-2"
            id="searchLikeField"
            value={internSearchLike}
            placeholder="search by term"
            onChange={handleChange}
          />
        </Col>
    
        <Col xs="2" >
          <Button style={{float:'left' }} disabled={disableSearch()}  type="submit" className="mb-2" >
            Search
          </Button>
        </Col>
      </Row>
    </Form>
      <Row>      
      <Col xs="12">
        
      <table className="table table-striped">
        <thead>
          <tr>
            <th><span className='headerLink' onClick={() =>{ orderFunction('employeeNumber');}}> Emp. Number</span></th>
            <th><span className='headerLink' onClick={() => {orderFunction('name');}}> Name</span></th>
            <th><span className='headerLink' onClick={() => {orderFunction('hireDate');}}> Hire Date</span></th>
           <th><span className='headerLink'  onClick={() => {orderFunction('departmentName');}}> Department</span> </th>
           <th><span className='headerLink'  onClick={() => {orderFunction('title');}}> Title</span></th>
           <th colSpan="2"> </th>
          </tr>
        </thead> 
        <tbody>
          {renderItems()}
        </tbody>
      </table>
    
      <PaginationControl
        page={currentPage}
        total={totalPages}
        limit={1}
        changePage={onPageChange}
         last
      />
      <div>
        <span>Page {currentPage} of {totalPages}</span>
      </div>
    </Col>
      </Row>
        
    </Container>
    <ConfirmDialog
      title={'Employees'}
      message={'Delete employee?'}
      btnOkLabel={'Ok'}
      btnKoLabel={'Close'}
      handleOkCall={deleteEmployeeInternal}
      param={delParam}
      showDlg={showDialogFlag}
    /> 
    </>
  
  );
};

export default TableWithPagination;
