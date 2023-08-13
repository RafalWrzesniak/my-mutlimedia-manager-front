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

  const getItemById = async (itemId, apiType) => {
    try {
      const response = await axios.get(`${URL}/${apiType}/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item:', error);
      return null;
    }
  };

  const createBookFromUrl = async (bookUrl, listName, bookFormat, refreshState) => {
    try {
      const response = await axios.post(`${URL}/book/createBookUrl?bookUrl=${bookUrl}${listName ? '&listName=' + listName : ''}${bookFormat ? '&bookFormat=' + bookFormat : ''}`);
      console.log('Book added:', response.data);
      refreshState();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  const createGameFromUrl = async (url, listName, platform, refreshState) => {
    try {
      const response = await axios.post(`${URL}/game/createGameUrl?url=${url}${listName ? '&listName=' + listName : ''}${platform ? '&gamePlatform=' + platform : ''}`);
      console.log('Game added:', response.data);
      refreshState();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  const createMovieFromUrl = async (url, listName, refreshState) => {
    try {
      const response = await axios.post(`${URL}/movie/create?url=${url}${listName ? '&listName=' + listName : ''}`);
      console.log('Movie added:', response.data);
      refreshState();
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

  const createNewList = async (listName, apiType, onSuccess = () => {}) => {
    try {
      const response = await axios.post(`${URL}/${apiType}/list?listName=${listName}`);
      onSuccess();
      console.log('Created list: ', response.data);
    } catch (error) {
      console.error('Error adding list:', error);
    }
  }

  const findListsContainingProduct = async (productId, apiType) => {
    try {
      const finalUrl = `${URL}/${apiType}/list/with/${productId}`;
      const response = await axios.get(finalUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching lists containing product:', error);
      return null;
    }
  }

  const addItemToList = async (itemId, listName, apiType, onSuccess) => {
    try {
      await axios.post(`${URL}/${apiType}/list/add?listName=${listName}&productId=${itemId}`);
      onSuccess();
    } catch (error) {
      console.error('Error adding item to list:', error);
    }
  }

  const removeItemFromList = async (itemId, listName, apiType, onSucces = () => {}) => {
    try {
      await axios.delete(`${URL}/${apiType}/list/remove?listName=${listName}&productId=${itemId}`);
      onSucces();
    } catch (error) {
      console.error('Error removing item from list:', error);
    }
  }
  
  const setBookFormat = async (bookId, bookFormat, onSuccess) => {
    try {
      await axios.post(`${URL}/book/${bookId}/format?bookFormat=${bookFormat}`);
      onSuccess();
    } catch (error) {
      console.error('Error setting book format:', error);
    }
  }  

  const setGamePlatform = async (gameId, gamePlatform, onSuccess) => {
    try {
      await axios.post(`${URL}/game/${gameId}/platform?gamePlatform=${gamePlatform}`);
      onSuccess();
    } catch (error) {
      console.error('Error setting game platform:', error);
    }
  }

  const finishItem = async (itemId, finishDate, spentTime, apiType, onSuccess) => {
    let url = '';
    if(apiType !== 'game') {
      url = `${URL}/${apiType}/${itemId}/finish?finishDate=${finishDate}`;
    } else {
      url = `${URL}/${apiType}/${itemId}/finishGame?finishDate=${finishDate}&playedHours=${spentTime}`;
    }
    try {
      await axios.post(url);
      onSuccess();
    } catch (error) {
      console.error('Error finishing item:', error);
    }
  }

export { getUserListInfo, getListByName, getRecentlyDone, createBookFromUrl, createGameFromUrl, 
  createMovieFromUrl, findProductsByProperty, createNewList, findListsContainingProduct, 
  addItemToList, removeItemFromList, setBookFormat, setGamePlatform, getItemById, finishItem };
