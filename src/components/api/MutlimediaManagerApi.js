import { encodeItem } from '../utils/Utils';
import { get, post, deleteCall } from './AxiosApi';

let URL;

if (process.env.NODE_ENV === 'production') {
  URL = "https://3vxyuyc4oa.execute-api.eu-central-1.amazonaws.com/prod"
} else {
  URL = "http://localhost:8080"
}

function getResponseData(response) {
  return response ? response.data : null;
}

const registerInApp = async (userId, preferredUsername, email, onSuccess = () => {}, onFailure = () => {}) => {
  let url = `${URL}/user/register?username=${userId}&preferredUsername=${preferredUsername}&email=${email}`
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
  const response = await get(`${URL}/${apiType}/lastFinished?productType=${apiType}`);
  return getResponseData(response);
};  

const getItemById = async (itemId, apiType, onSuccess = () => {}) => {
  const response = await get(`${URL}/${apiType}?id=${encodeURIComponent(itemId)}`, onSuccess);
  return getResponseData(response);
};

const createBookFromUrl = (bookUrl, listId, bookFormat, refreshState) => {
  let url = `${URL}/book/createBookUrl?url=${encodeURIComponent(bookUrl)}${listId ? '&listId=' + listId : ''}${bookFormat ? '&bookFormat=' + bookFormat : ''}`
  post(url, {}, refreshState);
}

const createGameFromUrl = (gameUrl, listId, platform, refreshState) => {
  let url = `${URL}/game/createGameUrl?url=${encodeURIComponent(gameUrl)}${listId ? '&listId=' + listId : ''}${platform ? '&gamePlatform=' + platform : ''}`
  post(url, {}, refreshState);
}

const createMovieFromUrl = (movieUrl, listId, refreshState) => {
  let url = `${URL}/movie/create?url=${encodeURIComponent(movieUrl)}${listId ? '&listId=' + listId : ''}`;
  post(url, {}, refreshState);
}

const findProductsByProperty = async (listId, propertyName, valueToFind, apiType, page, direction, sortKey, pageSize) => {
  const finalUrl = `${URL}/${apiType}/property?listId=${listId}&propertyName=${propertyName}&value=${valueToFind}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}&pageSize=${pageSize ? pageSize : 20}`;
  const response = await get(finalUrl);
  return getResponseData(response);
}

const createNewList = async (listName, apiType, onSuccess = () => {}, onFailure = () => {}) => {
  post(`${URL}/${apiType}/list?listName=${listName}`, {}, onSuccess, onFailure);
}

const findListsContainingProduct = async (productId, apiType) => {
  const finalUrl = `${URL}/${apiType}/list/with?productId=${encodeURIComponent(productId)}`;
  const response = await get(finalUrl);
  return getResponseData(response);
}

const addItemToList = async (itemId, listId, apiType, onSuccess = () => {}) => {
  post(`${URL}/${apiType}/list/add?listId=${listId}&productId=${encodeURIComponent(itemId)}`, {}, onSuccess);
}

const removeItemFromList = async (itemId, listId, apiType, onSuccess = () => {}) => {
  deleteCall(`${URL}/${apiType}/list/remove?listId=${listId}&productId=${encodeURIComponent(itemId)}`, onSuccess);
}

const setBookFormat = async (bookId, bookFormat, onSuccess = () => {}) => {
  post(`${URL}/book/format?bookId=${bookId}&bookFormat=${bookFormat}`, {}, onSuccess);
}  

const setGamePlatform = async (gameId, gamePlatform, onSuccess = () => {}) => {
  post(`${URL}/game/platform?gameId=${gameId}&gamePlatform=${gamePlatform}`, {}, onSuccess);
}

const getDetailsForItems = async (items, username, apiType, onSuccess = () => {}) => {
  let encodedItems = items.map(item => item.polishTitle ? {...item, title: item.polishTitle} : item).map(item => encodeItem(item));
  post(`${URL}/${apiType}/details`, encodedItems, onSuccess);
}

const finishItem = async (itemId, finishDate, spentTime, apiType, onSuccess = () => {}) => {
  let url = '';
  if(apiType !== 'game') {
    url = `${URL}/${apiType}/finish?id=${encodeURIComponent(itemId)}&finishDate=${finishDate}`;
  } else {
    url = `${URL}/${apiType}/finishGame?gameId=${encodeURIComponent(itemId)}&finishDate=${finishDate}&playedHours=${spentTime}`;
  }
  await post(url, {}, onSuccess);
}

const renameList = async (newListName, listId, apiType, onSuccess = () => {}, onFailure = () => {}) => {
  post(`${URL}/${apiType}/list/rename?listId=${listId}&newListName=${encodeURIComponent(newListName)}`, {}, onSuccess, onFailure);
}

const removeListFromUser = async(listId, apiType, onSuccess = () => {}) => {
  deleteCall(`${URL}/${apiType}/list?listId=${listId}`, onSuccess);
}


export { getUserListInfo, getListById, getRecentlyDone, createBookFromUrl, createGameFromUrl, removeListFromUser,
  createMovieFromUrl, findProductsByProperty, createNewList, findListsContainingProduct, getDetailsForItems, 
  addItemToList, removeItemFromList, setBookFormat, setGamePlatform, getItemById, finishItem, registerInApp, renameList };
