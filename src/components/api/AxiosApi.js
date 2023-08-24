import axios from 'axios';
  
  async function get(url, onSuccess = () => {}, onFailure = () => {}) {
    try {
        const response = await axios.get(url, headers());
        onSuccess(response);
        return response;
    } catch (error) {
        console.log(error)  
        onFailure();  
        return error;
    }
  }
  
  async function post(url, data, onSuccess = () => {}, onFailure = () => {}) {
    try {
        const response = await axios.post(url, data, headers());
        onSuccess(response);
        return response;
    } catch (error) {
        console.log(error)
        onFailure(error);
        return error;
    }
  }

  async function deleteCall(url, onSuccess = () => {}, onFailure = () => {}) {
    try {
      await axios.delete(url, headers());
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  }
  
  function headers() {
    return {
      headers: {
        Authorization: localStorage.getItem('authorizationBearer')
      }
    }
  }

  export {get, post, deleteCall}