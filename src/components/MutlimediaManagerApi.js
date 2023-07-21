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
  
const getListByName = async (listName, apiType, page, direction, sortKey, pageSize) => {
    try {
      const finalUrl = `${URL}/${apiType}/list?listName=${listName}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}&pageSize=${pageSize ? pageSize : 20}`;
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

  const createBookFromUrl = async (bookUrl, listName, bookFormat) => {
    try {
      const response = await axios.post(`${URL}/book/createBookUrl?bookUrl=${bookUrl}&listName=${listName}&bookFormat=${bookFormat}`);
      console.log('Book added:', response.data);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  const createGameFromUrl = async (url, listName, platform) => {
    try {
      const response = await axios.post(`${URL}/game/createGameUrl?url=${url}&listName=${listName}&gamePlatform=${platform}`);
      console.log('Game added:', response.data);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  const createMovieFromUrl = async (url, listName) => {
    try {
      const response = await axios.post(`${URL}/movie/create?url=${url}&listName=${listName}`);
      console.log('Movie added:', response.data);
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

  const createNewList = async (listName, apiType) => {
    try {
      const response = await axios.post(`${URL}/${apiType}/list?listName=${listName}`);
      console.log('Created list: ', response.data);
    } catch (error) {
      console.error('Error adding list:', error);
    }
  }
  
export { getUserListInfo, getListByName, getRecentlyDone, createBookFromUrl, createGameFromUrl, 
  createMovieFromUrl, findProductsByProperty, createNewList };
