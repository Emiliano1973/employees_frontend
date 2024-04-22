import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import DatePicker from 'react-datepicker';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../routing/AuthContext';




const EmployeeForm = ({ handleSubmit, entity, readOnly}) => {
 
  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isReadOnly, setIsReadOnly] =useState(readOnly);
  const [deptOptions, setDeptOptions] =useState([]);
  const [error, setError] =useState('');
  const { token} = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_SERVER_URL; 


  const getDateFromString = ( dateString)=>{
    if(!dateString){
      return null;
    }
    var splitDate=dateString.split('-');
    var day=parseInt( splitDate[0]); 
    var month=parseInt( splitDate[1])-1;
    var year=parseInt( splitDate[2]);
  
    return new Date(year, month, day);
  };

  const getStringFromDate= (dateObj)=>{
    if(!dateObj){
      return null;
    }
    const month   =String( dateObj.getMonth() + 1).padStart(2, '0'); // months from 1-12
    const day     =String( dateObj.getDate()).padStart(2, '0');
    const year    =String( dateObj.getFullYear());
    return day + '-' + month + '-'+ year;
  };


  const getStartBirthDate= ()=>{
    return  new Date(1950, 0, 1);
   }

   const getEndBirthDate= ()=>{
    let now=new Date();  
    return  new Date(now.getFullYear()-20, now.getMonth(), now.getDate());
   }

  const checkIfNull= (s) =>{
    if(!s){
      return ''
    }
    return s;
  }
  var empObj;
   if(entity){
   empObj= {

      'employeeNumber' : entity.employeeNumber , 
      'firstName' : checkIfNull(entity.firstName ),
      'lastName' : checkIfNull(entity.lastName),
      'gender' : checkIfNull(entity.gender),
      'birthDate': getDateFromString(entity.birthDate) ,
      'hireDate': getDateFromString(entity.hireDate),
      'departmentNumber' : checkIfNull(entity.departmentNumber),
      'title':  checkIfNull(entity.title),
      'salary': entity.salary
      };
   }else{
    empObj= {

      'employeeNumber' : 0 , 
      'firstName' :'',
      'lastName' : '',
      'gender' : '',
      'birthDate': null,
      'hireDate':  null,
      'departmentNumber' : '',
      'title':  '',
      'salary': 0
      };
   }



  const [ employeeForm , setEmployeeForm] = useState(empObj);

    const [employeeEntity, setEmployeeEntity] =useState(entity? entity:
       {'employeeNumber': 0, 
       'firstName' : '',
       'lastName' :  '',
       'gender' : '',
       'birthDate': '',
       'hireDate':  '',
       'departmentNumber' :'',
       'title':  '',
       'salary':0
      });
    
    const handleChange = (event) => {

      const name = event.target.name;
      const value = event.target.value;
      setEmployeeForm(values => ({...values, [name]: value}))
    };

   
    const handleChangeDate = ( fieldName, date) =>{
      setEmployeeForm(values => ({...values, [fieldName]: date}));
    };

    const handleChangeHireDate = (date) => {
        handleChangeDate('hireDate', date);
    };

    const handleChangeBirthDate = (date) => {
      handleChangeDate('birthDate', date);
    };


     const handleSubmitInternal= (event)=>{
      event.preventDefault();

      if(employeeForm.departmentNumber && employeeForm.employeeNumber>0){
        employeeEntity.employeeNumber=employeeForm.employeeNumber;
      }
      employeeEntity.firstName=employeeForm.firstName;
      employeeEntity.lastName=employeeForm.lastName;
      employeeEntity.gender=employeeForm.gender;
      employeeEntity.birthDate=getStringFromDate(employeeForm.birthDate);
      employeeEntity.departmentNumber=employeeForm.departmentNumber;
      employeeEntity.hireDate=getStringFromDate(employeeForm.hireDate);
      employeeEntity.title=employeeForm.title;
      employeeEntity.salary=employeeForm.salary;
      setEmployeeEntity(employeeEntity);
      handleSubmit(employeeEntity);

     };


     useEffect(() => {
      const fetchDeptOptions = async () => {
        try {
          
          const response = await fetch(`${apiUrl}/api/services/departments`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+token,
              'access-control-allow-origin' : '*',
              'Content-type': 'application/json; charset=UTF-8',
              'Cache-Control': 'no-cache'
            }});
   

          if (!response.ok) {
            throw new Error('Error in loading data');
          }
          const jsonData = await response.json();
          setDeptOptions(jsonData.elements);
        } catch (error) {
          setError(error.message);
        } finally {
           setIsLoading(false); 
        }
      };
        fetchDeptOptions();
        setStartDate(getStartBirthDate())
        setEndDate(getEndBirthDate());
     }, []);

    const loadDeptOptions =   () =>{
      return deptOptions.map(deptOption => (
        <option value={deptOption.code}>{deptOption.description}</option>
      ));
    }

    return (
     <>
     <Container>  
          <Form  onSubmit={handleSubmitInternal} autoComplete='off'>
          <Row className='mb-3'>
          <Form.Group as={Col} md="2"  controlId="firstName" >
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" value={employeeForm.firstName} required id='firstName' name='firstName' onChange={handleChange} placeholder="Enter First Name" />
            <Form.Control.Feedback type="invalid" tooltip>
            Please fill  First name.
          </Form.Control.Feedback>
                  
          </Form.Group>
     
          <Form.Group as={Col} md="2"  controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" value={employeeForm.lastName} required name='lastName' id='lastName' onChange={handleChange} placeholder="Enter Last Name" />
            <Form.Control.Feedback type="invalid" tooltip>
            Please fill  Last name.
          </Form.Control.Feedback>
        
          </Form.Group>
         <Form.Group as={Col} md="2"  controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select value={employeeForm.gender }  name='gender'  required as="select" type="select"  id='gender' onChange={handleChange} aria-label="Default select example">
                <option value="">Open this select menu</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid" tooltip>
            Please select gender.
          </Form.Control.Feedback>
        
          </Form.Group>
    <Form.Group  as={Col} md="2" controlId="birthDate">
        <Form.Label className="form-label">Birth Date</Form.Label>
        <DatePicker name='birthDate' id='birthDate' className="form-control"
          selected={employeeForm.birthDate}
          onChange={handleChangeBirthDate}
          dateFormat={'dd-MM-yyyy'}
           minDate={startDate}
           maxDate={endDate}
          required
        />
         <Form.Control.Feedback type="invalid" tooltip>
            Please select birth date.
          </Form.Control.Feedback>
        
      </Form.Group>
      </Row>
      <Row className='mb-3'>
      <Form.Group as={Col}  md="2"  controlId="departmentNumber">
            <Form.Label>Department</Form.Label>
            <Form.Select value={employeeForm.departmentNumber} required as="select" type="select"  name='departmentNumber' id='departmentNumber' onChange={handleChange} aria-label="Default select example">
                <option value="">Open this select menu</option>
                {loadDeptOptions()}
            </Form.Select>
            <Form.Control.Feedback type="invalid" tooltip>
            Please select Department.
          </Form.Control.Feedback>
        
          </Form.Group>
          <Form.Group as={Col} md="2"  controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Select  onChange={handleChange} required as="select" type="select"  name='title' id='title' value={employeeForm.title} aria-label="Default select example">
                <option value="">Open this select menu</option>
                <option value="Assistant Engineer">Assistant Engineer</option>
                <option value="Engineer">Engineer</option>
                <option value="Junior Developer">Junior Developer</option>
                <option value="Manager">Manager</option>
                <option value="Senior Developer">Senior Developer</option>
                <option value="Senior Engineer">Senior Engineer</option>
                <option value="Senior Staff">Senior Staff</option>
                <option value="Staff">Staff</option>
                <option value="Technique Leader">Technique Leader</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid" tooltip>
            Please select Title.
          </Form.Control.Feedback>
        
          </Form.Group>
        <Form.Group as={Col} md="2"  controlId="hireDate">
        <Form.Label className="form-label">Hire Date</Form.Label>
        <DatePicker name='hireDate' id='hireDate' className="form-control"
          selected={employeeForm.hireDate}
          onChange={handleChangeHireDate}
          dateFormat={'dd-MM-yyyy'}
          required
        />
            <Form.Control.Feedback type="invalid" tooltip>
            Please selct hire date.
          </Form.Control.Feedback>
        
      </Form.Group>
      <Form.Group as={Col} md="2"  controlId="salary">
            <Form.Label>Salary</Form.Label>
            <Form.Control name='salary' id='salary' required type="number" value={employeeForm.salary} onChange={handleChange} placeholder="enter Salary" />
          </Form.Group>
          <Form.Control.Feedback type="invalid" tooltip>
            Please fill  salary.
          </Form.Control.Feedback>
        </Row>
          <Row className='mb-3'>
            <Col md="12" >   
          <Button variant="primary" disabled={isReadOnly==='off'?false:true} type="submit">
            Submit
          </Button>
          </Col>
          </Row>
        </Form>
        </Container>  
      </>
      );
};

export default EmployeeForm;