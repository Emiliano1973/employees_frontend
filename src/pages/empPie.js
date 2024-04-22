import React, { useState, useEffect, useContext } from 'react';


import {  useNavigate } from 'react-router-dom';
import { Col, Container,Row, Form } from 'react-bootstrap'
import Chart from 'react-google-charts';
import { jwtDecode } from 'jwt-decode';
import LoadingComponent from '../LoadingComponent';
import NavBar from '../NavBar';
import { AuthContext } from '../routing/AuthContext';

const EmpPie = () => {
  const [deptOptions, setDeptOptions] =useState([]);
    const { token } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deptNo, setDeptNo] =useState('');
    const [ disabled, setDisabled] =useState(false)
    const apiUrl = process.env.REACT_APP_SERVER_URL; 
 
    const navigate = useNavigate();
    const options = {
        title: "Percentual of Employees for departments",
      };
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/services/departments/pie`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer '+token,
                        'access-control-allow-origin': '*',
                        'Content-type': 'application/json; charset=UTF-8',
                        'Cache-Control': 'no-cache'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error for data loading');
                }
                const jsonData = await response.json();
                setData(jsonData.elements);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };


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
        const decoded = jwtDecode(token);
        const expDate=new Date();
        expDate.setTime( decoded.exp * 1000);
        const now=new Date();
        if(now>expDate){
            navigate('/logout');
            
        }else{
          fetchDeptOptions();
            fetchData();
        }
    }, [token, navigate]);


    const fetchReport = async (departmentNumber) => {
        try {
          if(departmentNumber){
          setDisabled(e=> true)
            setDeptNo(e=> departmentNumber);
          }else{
            setDeptNo(e=> '');
            return;
          }
          const response = await fetch(`${apiUrl}/api/services/departments/${departmentNumber}/report/pdf`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+token,
              'access-control-allow-origin' : '*',
              'Cache-Control': 'no-cache'
            }});
          if (!response.ok) {
            throw new Error('Error in loading data');
          }
              // Extract filename from header
        
       const blob = await response.blob();
       const header=response.headers.get('content-disposition');
       const filename =header
       .split(';')
       .find(n => n.includes('filename='))
       .replace('filename=', '')
       .trim();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = filename ;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        } catch (error) {
          setError(error.message);
        } finally {
           setDisabled(false); 
        }
      }
    const handleChange =   (event)=>{
        const value = event.target.value;
        fetchReport(value);
      
    };


    if (isLoading) {
        return <LoadingComponent/>;
      }
    
      if (error) {
        return <div>An error happened: {error}</div>;
      }
    
      const loadDeptOptions =   () =>{
        return deptOptions.map(deptOption => (
          <option value={deptOption.code}>{deptOption.description}</option>
        ));
      }
  

    return (
        <>
        <NavBar/>

        <Container fluid>
        <Row className="align-items-right" > 
        <Col xs="9"> &nbsp;</Col>
        <Col xs="3" style={{'float':'right'}}>
        <Form.Label>Report</Form.Label>
            <Form.Select  required as="select" type="select" style={disabled?{'cursor':'wait'}:{'cursor':'inherit'}} value={deptNo} disabled={disabled}  name='departmentNumber' id='departmentNumber' onChange={handleChange} aria-label="Default select example">
                <option value="">Open this select menu</option>
                {loadDeptOptions()}
            </Form.Select>

         </Col>
        </Row>
      <Row>      
      <Col xs="12">
        
        <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
     </Col>
     </Row>   
    </Container>
    </>)
}

export default EmpPie;