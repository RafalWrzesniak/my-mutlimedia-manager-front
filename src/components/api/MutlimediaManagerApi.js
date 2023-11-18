import { get, post, deleteCall } from './AxiosApi';

let URL;

if (process.env.NODE_ENV === 'production') {
  URL = "https://1mu67inv7k.execute-api.eu-central-1.amazonaws.com/prod"
} else {
  URL = "http://localhost:8080"
}

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
    onSuccess(username);  
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

const getListById = async (listId, apiType, page, direction, sortKey, pageSize) => {
  const finalUrl = `${URL}/${apiType}/list?listId=${listId}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}&pageSize=${pageSize ? pageSize : 20}`;
  const response = await get(finalUrl);
  return getResponseData(response);
  };
  
const getRecentlyDone = async (apiType) => {
  const response = await get(`${URL}/${apiType}/lastFinished`);
  return getResponseData(response);
};  

const getItemById = async (itemId, apiType, onSuccess = () => {}) => {
  const response = await get(`${URL}/${apiType}?id=${encodeURIComponent(itemId)}`, onSuccess);
  return getResponseData(response);
};

const createBookFromUrl = (bookUrl, listId, bookFormat, refreshState) => {
  let url = `${URL}/book/createBookUrl?url=${bookUrl}${listId ? '&listId=' + listId : ''}${bookFormat ? '&bookFormat=' + bookFormat : ''}`
  post(url, {}, refreshState);
}

const createGameFromUrl = (gameUrl, listId, platform, refreshState) => {
  let url = `${URL}/game/createGameUrl?url=${gameUrl}${listId ? '&listId=' + listId : ''}${platform ? '&gamePlatform=' + platform : ''}`
  post(url, {}, refreshState);
}

const createMovieFromUrl = (movieUrl, listId, refreshState) => {
  let url = `${URL}/movie/create?url=${movieUrl}${listId ? '&listId=' + listId : ''}`;
  post(url, {}, refreshState);
}

const findProductsByProperty = async (listId, propertyName, valueToFind, apiType, page, direction, sortKey, pageSize) => {
  const finalUrl = `${URL}/${apiType}/property?listId=${listId}&propertyName=${propertyName}&value=${valueToFind}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}&pageSize=${pageSize ? pageSize : 20}`;
  const response = await get(finalUrl);
  return getResponseData(response);
}

const createNewList = async (listName, apiType, onSuccess = () => {}) => {
  post(`${URL}/${apiType}/list?listName=${listName}`, {}, onSuccess);
}

const findListsContainingProduct = async (productId, apiType) => {
  const finalUrl = `${URL}/${apiType}/list/with?productId=${productId}`;
  const response = await get(finalUrl);
  return getResponseData(response);
}

const addItemToList = async (itemId, listId, apiType, onSuccess = () => {}) => {
  post(`${URL}/${apiType}/list/add?listId=${listId}&productId=${itemId}`, {}, onSuccess);      
}

const removeItemFromList = async (itemId, listId, apiType, onSucces = () => {}) => {
  deleteCall(`${URL}/${apiType}/list/remove?listId=${listId}&productId=${itemId}`, onSucces);
}

const setBookFormat = async (bookId, bookFormat, onSuccess = () => {}) => {
  post(`${URL}/book/format?bookId=${bookId}&bookFormat=${bookFormat}`, {}, onSuccess);
}  

const setGamePlatform = async (gameId, gamePlatform, onSuccess = () => {}) => {
  post(`${URL}/game/platform?gameId=${gameId}&gamePlatform=${gamePlatform}`, {}, onSuccess);
}

const getDetailsForItems = async (items, apiType, onSuccess = () => {}) => {
  post(`${URL}/${apiType}/details`, items, onSuccess);
}

const getDetailsForItem = async (item, apiType, onSuccess = () => {}) => {
  const response = await post(`${URL}/${apiType}/detailed`, item, onSuccess);
  return getResponseData(response);
}

const finishItem = async (itemId, finishDate, spentTime, apiType, onSuccess = () => {}) => {
  let url = '';
  if(apiType !== 'game') {
    url = `${URL}/${apiType}/finish?id=${itemId}&finishDate=${finishDate}`;
  } else {
    url = `${URL}/${apiType}/finishGame?gameId=${itemId}&finishDate=${finishDate}&playedHours=${spentTime}`;
  }
  post(url, {}, onSuccess);
}

export { getUserListInfo, getListById, getRecentlyDone, createBookFromUrl, createGameFromUrl, 
  createMovieFromUrl, findProductsByProperty, createNewList, findListsContainingProduct, getDetailsForItems, 
  addItemToList, removeItemFromList, setBookFormat, setGamePlatform, getItemById, finishItem, login, register, getDetailsForItem };
