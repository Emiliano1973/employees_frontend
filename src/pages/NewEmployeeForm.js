import React, { useState, useEffect, useContext } from 'react';

import {useNavigate } from 'react-router-dom';

import EmployeeForm from './EmployeeForm';
import { AuthContext } from '../routing/AuthContext';
import NavBar from '../NavBar';
import { jwtDecode } from 'jwt-decode';
import LoadingComponent from '../LoadingComponent';

const NewEmployeeForm = () => {

    const { token, loading } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [responseStatus, setResponseStatus] = useState(null);
       
    useEffect(() =>{
        const decoded = jwtDecode(token);
        const expDate=new Date();
        expDate.setTime( decoded.exp * 1000);
        const now=new Date();
        if(now>expDate){
            navigate('/logout');
        }

    }, []);
    const apiUrl = process.env.REACT_APP_SERVER_URL; 
 
    const submitHandler = (empObj) => {
        const decoded = jwtDecode(token);
        const expDate=new Date();
        expDate.setTime( decoded.exp * 1000);
        const now=new Date();
        if(now>expDate){
            navigate('/logout'); 
            return;
        }
        setIsLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(empObj)
        };
        fetch(apiUrl+'/api/services/employees', options)
            .then(response => response.status)
            .then(data => setResponseStatus(data))
            .catch(error => setError(error));
            setIsLoading(false);
            navigate('/list');
    };
            if (isLoading) {
                return <LoadingComponent/>;
            }

            if (error) {
                return <div>An error is occurred: {error +' '+responseStatus} </div>;
            }


    return (
        <>
        <NavBar/>
        <h1 style={{textAlign:'center'}}>New Employee</h1>  
    <EmployeeForm
        handleSubmit={submitHandler}
        entity={null}
        readOnly={'off'}
    /></>)
}

export default NewEmployeeForm;