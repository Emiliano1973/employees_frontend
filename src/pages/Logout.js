import React, { useContext, useEffect } from 'react';

import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../routing/AuthContext';
import LoadingComponent from '../LoadingComponent';

const Logout = () => {
  const { setToken, setIsAdmin } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    
    setToken(null);
    setIsAdmin(false)
    
    // Remove the token from local storage
    localStorage.removeItem('token');
    
    
    navigate('/login');
  }, []); 

  return (
     <LoadingComponent/>)  ;
};

export default Logout;
