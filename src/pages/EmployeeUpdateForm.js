import React, { useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

import {  useParams, useNavigate } from 'react-router-dom';

import EmployeeForm from './EmployeeForm';
import { AuthContext } from '../routing/AuthContext';
import NavBar from '../NavBar';
import LoadingComponent from '../LoadingComponent';

const EmployeeUpdateForm = () => {

    const { token, isAdmin } = useContext(AuthContext);
    const {employeeNumber} = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [responseStatus, setResponseStatus] = useState(null);
    const apiUrl = process.env.REACT_APP_SERVER_URL; 

    useEffect(() => {

        
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(apiUrl+`/api/services/employees/${employeeNumber}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer '+token,
                        'access-control-allow-origin': '*',
                        'Content-type': 'application/json; charset=UTF-8',
                        'Cache-Control': 'no-cache'
                    }
                });
                if (!response.ok) {
                    throw new Error('Errore durante il caricamento dei dati');
                }
                const jsonData = await response.json();
                setData(jsonData);
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
        }else {
            fetchData();
        }
    }, []);


    const submitHandler = (empObj) => {
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer '+token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(empObj)
        };
        fetch(apiUrl+'/api/services/employees/'+empObj.employeeNumber, options)
            .then(response => response.status)
            .then(data => setResponseStatus(data))
            .catch(error => console.error(error));
            navigate('/list');
    }


    
            if (isLoading) {
                return <LoadingComponent/>;

            }

            if (error) {
                return <div>Si è verificato un errore: {error}</div>;
            }


    return (
        <>
        <NavBar/>
      <h1 style={{textAlign:'center'}}>Update Employee</h1>      
    <EmployeeForm
        handleSubmit={submitHandler}
        entity={data}
        readOnly={isAdmin?'off':'on'}
    /></>)
}

export default EmployeeUpdateForm;