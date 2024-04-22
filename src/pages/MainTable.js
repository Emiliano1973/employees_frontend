import React, { useState, useEffect, useContext } from 'react';
import TableWithPagination from '../TableWithPagination';
import { useNavigate } from 'react-router-dom';

import '../App.css';
import { AuthContext } from '../routing/AuthContext';
import NavBar from '../NavBar';
import { jwtDecode } from 'jwt-decode';
import { TailSpin } from "react-loader-spinner";
import LoadingComponent from '../LoadingComponent';

const MainTable = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading1, setLoading1] = useState(true);
  const [refresh, setRefresh] =useState(false);
  const[orderBy, setOrderBy] =useState('employeeNumber');
  const[orderByDir, setOrderByDir] =useState('DESC');
  const [searchLikeTerm,setSearchLikeTerm ]= useState('');
  const apiUrl = process.env.REACT_APP_SERVER_URL; 
  const navigate = useNavigate();
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/services/employees/pages?page=${currentPage}&pageSize=10&orderBy=${orderBy}&orderByDir=${orderByDir}`+(searchLikeTerm !==''? '&searchLike='+searchLikeTerm:''), {
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
        setData(jsonData.elements);
        setTotalPages(jsonData.totalPages);
        setTotalItems(jsonData.totalElements);
      } catch (error) {
        setError(error.message);
      } finally {
         setLoading1(false); 
      }
    };

    const decoded = jwtDecode(token);
    const expDate=new Date();
    expDate.setTime( decoded.exp * 1000);
    const now=new Date();
    if(now>expDate){
        navigate('/logout');
        
    }else{
        fetchData();
    }
  }, [currentPage, token, refresh]);

  const handlePageChange = (newPage) => {
    setLoading1(true);
    setCurrentPage(newPage);
  };


  const handleDeleteRecord=  async(employeeNumber)  =>  {
    try{
      const decoded = jwtDecode(token);
      const expDate=new Date();
      expDate.setTime( decoded.exp * 1000);
      const now=new Date();
      if(now>expDate){
          navigate('/logout');
          return;   
      }
      setLoading1(true);
      await fetch(`${apiUrl}/api/services/employees/${employeeNumber}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer '+token,
          'access-control-allow-origin' : '*',
          'Cache-Control': 'no-cache'
        }});
        
       if(currentPage >1){
          handlePageChange(1);
       }else{
        setRefresh(refresh?false:true);
       }
    } catch (error) {
      setError(error.message);
    }
  };

  const orderingFunction= (orderTerm) =>{
    setLoading1(true);
    setOrderBy(orderTerm);
    if(orderByDir==='ASC'){
      setOrderByDir('DESC');
    }else {
      setOrderByDir('ASC');
    }
    setRefresh(refresh?false:true);
    };

    const searchLikeSubmit= (searchTem) =>{
      const decoded = jwtDecode(token);
      const expDate=new Date();
      expDate.setTime( decoded.exp * 1000);
      const now=new Date();
      if(now>expDate){
          navigate('/logout');
          return; 
      }
      setLoading1(true);
      setSearchLikeTerm('');
      setSearchLikeTerm(searchTem);
      if(searchTem.length>0){
        setSearchLikeTerm(searchTem);
      }
      if(currentPage >1){
        handlePageChange(1);
     }else{
      setRefresh(refresh?false:true);
     }
    };


  if (loading1) {
    return <LoadingComponent/>;
  }

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <>
    <NavBar/>
    <div className='App'>
   
      <h1>Employees</h1>
      <TableWithPagination
        currentPage={currentPage}
        totalPages={totalPages}
        items={data}
        onPageChange={handlePageChange}
        deleteEmployee={handleDeleteRecord}
        orderFunction={orderingFunction}
        handleSubmitSearch={searchLikeSubmit}
        searchTerm={searchLikeTerm}
      />
    </div>
    </>
  );
};

export default MainTable;
