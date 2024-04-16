import axios from "axios";
class UserService {

    constructor(url){
        this.baseUrl=url+'/api/auth';
    }

     login=  async (loginRequest) => {
        try {
          const response = await axios.post(this.baseUrl+'/login', loginRequest);
          return response.data;
        } catch (error) {
          console.error('Login  error:', error);
          throw error;
        }
      }

      signup= async (signupRequest) => {
        try {
          const response = await axios.post(this.baseUrl+'/signup', signupRequest);
          return response.data;
        } catch (error) {
          console.error('Login  error:', error);
          throw error;
        }
      }

};

export default UserService;