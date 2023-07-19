import axios from 'axios';

let URL = "http://localhost:8080"

const getUserListInfo = async () => {
    try {
      const response = await axios.get(`${URL}/user/lists`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user list info:', error);
      return null;
    }
  };
  
const getListByName = async (listName, apiType, page, direction, sortKey) => {
    try {
      const finalUrl = `${URL}/${apiType}/list?listName=${listName}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}`;
      const response = await axios.get(finalUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching list:', error);
      return null;
    }
  };
  
  const getRecentlyDone = async (apiType) => {
    try {
      const response = await axios.get(`${URL}/${apiType}/lastFinished`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recently done:', error);
      return null;
    }
  };

  const addItemByUrl = async (url, listName, apiType) => {
    try {
      const response = await axios.post(`${URL}/${apiType}/create`, {url, listName});
      console.log('Item added:', response.data);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  const findProductsByProperty = async (propertyName, valueToFind, apiType, page, direction, sortKey, pageSize) => {
    try {
      const finalUrl = `${URL}/${apiType}/property?propertyName=${propertyName}&value=${valueToFind}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}&pageSize=${pageSize ? pageSize : 20}`;
      const response = await axios.get(finalUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching list:', error);
      return null;
    }
  }
  
export { getUserListInfo, getListByName, getRecentlyDone, addItemByUrl, findProductsByProperty };
