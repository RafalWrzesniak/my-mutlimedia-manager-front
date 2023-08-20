import { get, post, deleteCall } from './AxiosApi';

let URL = "http://localhost:8080"

function getResponseData(response) {
  return response ? response.data : null;
};

const login = async (username, password, onSuccess = () => {}, onFailure = () => {}) => {
  let credentials = {
    'username': username,
    'password': password
  }

  post(`${URL}/login`, credentials, (response) => {
    localStorage.setItem('authorizationBearer', response.headers['authorization']);
    onSuccess();  
  }, onFailure)
}

const register = async (username, password, onSuccess = () => {}, onFailure = () => {}) => {
  let url = `${URL}/register?username=${username}&password=${password}`
  post(url, {}, onSuccess, onFailure);
}

const getUserListInfo = async () => {
  const response = await get(`${URL}/user/lists`);
  return getResponseData(response);
};

const getListByName = async (listName, apiType, page, direction, sortKey, pageSize) => {
  const finalUrl = `${URL}/${apiType}/list?listName=${listName}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}&pageSize=${pageSize ? pageSize : 20}`;
  const response = await get(finalUrl);
  return getResponseData(response);
  };
  
const getRecentlyDone = async (apiType) => {
  const response = await get(`${URL}/${apiType}/lastFinished`);
  return getResponseData(response);
};  

const getItemById = async (itemId, apiType) => {
  const response = await get(`${URL}/${apiType}/${itemId}`);
  return getResponseData(response);
};

const createBookFromUrl = (bookUrl, listName, bookFormat, refreshState) => {
  let url = `${URL}/book/createBookUrl?bookUrl=${bookUrl}${listName ? '&listName=' + listName : ''}${bookFormat ? '&bookFormat=' + bookFormat : ''}`
  post(url, {}, refreshState);
}

const createGameFromUrl = (gameUrl, listName, platform, refreshState) => {
  let url = `${URL}/game/createGameUrl?url=${gameUrl}${listName ? '&listName=' + listName : ''}${platform ? '&gamePlatform=' + platform : ''}`
  post(url, {}, refreshState);
}

const createMovieFromUrl = (movieUrl, listName, refreshState) => {
  let url = `${URL}/movie/create?url=${movieUrl}${listName ? '&listName=' + listName : ''}`;
  post(url, {}, refreshState);
}

const findProductsByProperty = async (propertyName, valueToFind, apiType, page, direction, sortKey, pageSize) => {
  const finalUrl = `${URL}/${apiType}/property?propertyName=${propertyName}&value=${valueToFind}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}&pageSize=${pageSize ? pageSize : 20}`;
  const response = await get(finalUrl);
  return getResponseData(response);
}

const createNewList = (listName, apiType, onSuccess = () => {}) => {
  post(`${URL}/${apiType}/list?listName=${listName}`, {}, onSuccess);
}

const findListsContainingProduct = async (productId, apiType) => {
  const finalUrl = `${URL}/${apiType}/list/with/${productId}`;
  const response = await get(finalUrl);
  return getResponseData(response);
}

const addItemToList = (itemId, listName, apiType, onSuccess = () => {}) => {
  post(`${URL}/${apiType}/list/add?listName=${listName}&productId=${itemId}`, {}, onSuccess);      
}

const removeItemFromList = async (itemId, listName, apiType, onSucces = () => {}) => {
  deleteCall(`${URL}/${apiType}/list/remove?listName=${listName}&productId=${itemId}`, onSucces);
}

const setBookFormat = (bookId, bookFormat, onSuccess = () => {}) => {
  post(`${URL}/book/${bookId}/format?bookFormat=${bookFormat}`, {}, onSuccess);
}  

const setGamePlatform = (gameId, gamePlatform, onSuccess = () => {}) => {
  post(`${URL}/game/${gameId}/platform?gamePlatform=${gamePlatform}`, {}, onSuccess);
}

const finishItem = (itemId, finishDate, spentTime, apiType, onSuccess = () => {}) => {
  let url = '';
  if(apiType !== 'game') {
    url = `${URL}/${apiType}/${itemId}/finish?finishDate=${finishDate}`;
  } else {
    url = `${URL}/${apiType}/${itemId}/finishGame?finishDate=${finishDate}&playedHours=${spentTime}`;
  }
  post(url, {}, onSuccess);
}

export { getUserListInfo, getListByName, getRecentlyDone, createBookFromUrl, createGameFromUrl, 
  createMovieFromUrl, findProductsByProperty, createNewList, findListsContainingProduct, 
  addItemToList, removeItemFromList, setBookFormat, setGamePlatform, getItemById, finishItem, login, register };
