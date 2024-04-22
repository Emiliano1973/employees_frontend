// App.js
//import { Routes, Route } from 'react-router-dom';
//import Home from './Pages/Home';
import MainTable from './pages/MainTable';
import EmployeeUpdateForm from './pages/EmployeeUpdateForm'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import { AuthProvider } from './routing/AuthContext';
import Logout from './pages/Logout';
import Registration from './pages/registation';
import NewEmployeeForm from './pages/NewEmployeeForm';
import EmpPie from './pages/empPie';

//import Products from './Pages/Products';

const App = () => {
 return (
   <>
   <AuthProvider>
   <Routes>
          <Route exact path='/logout' element={<Logout/>}/>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/signup' element={<Registration/>}/>
          <Route exact path='/list' element={<MainTable/>} />
          <Route exact path='/pie' element={<EmpPie/>} />
          <Route exact path='/employeeUp/:employeeNumber' element={<EmployeeUpdateForm/>} />
          <Route exact path='/newEmployee' element={<NewEmployeeForm/>} />
          <Route path="*" element={<Navigate to="/logout" replace />} />
     </Routes> 
     </AuthProvider>
     </>
 );
};

export default App;