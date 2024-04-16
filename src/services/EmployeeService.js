import axios from "axios";

class EmployeeService {


    constructor(url){
        this.baseUrl=url+'/services/employees';
    }


    getPages = async (page, pageSize) => {
        try {
          const response = await axios.get(this.baseUrl + 'page='+page+'pageSize='+pageSize);
          return response.data;
        } catch (error) {
          console.error('Errore durante la richiesta GET al backend:', error);
          throw error;
        }
      }
    

      getEmployee = async (employeeNumber) => {
        try {
          const response = await axios.get(this.baseUrl + '/'+employeeNumber);
          return response.data;
        } catch (error) {
          console.error('Errore durante la richiesta GET al backend:', error);
          throw error;
        }
      }


       updateEmployee = async (employeeNumber, employeeData) => {
        try {
          const response = await axios.post(this.baseUrl+'/' + employeeNumber, employeeData);
          return response.data;
        } catch (error) {
          console.error('Errore durante la richiesta PUT al backend:', error);
          throw error;
        }
      }
    
      insertEmployee = async ( employeeData) => {
        try {
          const response = await axios.post(this.baseUrl, employeeData);
          return response.data;
        } catch (error) {
          console.error('Errore durante la richiesta POST al backend:', error);
          throw error;
        }
      }
    
      deleteEmployee = async (employeeNumber) => {
        try {
          const response = await axios.delete(this.baseUrl + '/' + employeeNumber);
          return response.data;
        } catch (error) {
          console.error('Errore durante la richiesta DELETE al backend:', error);
          throw error;
        }
      }
    }

