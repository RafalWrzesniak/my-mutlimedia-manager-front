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
  await post(url, {}, onSuccess, onFailure);
}

const getUserListInfo = async (syncInfo) => {
  const response = await post(`${URL}/user/lists`, syncInfo);
  return getResponseData(response);
};

const getListById = async (listId, apiType, page, direction, sortKey, pageSize, propertyName, valueToFind, onSuccess = () => {}, onFailure = () => {}) => {
  const finalUrl = `${URL}/${apiType}/list?listId=${listId}&direction=${direction ? direction : 'ASC'}&sortKey=${sortKey ? sortKey : 'id'}&page=${page ? page : 0}&pageSize=${pageSize ? pageSize : 30}${propertyName ? '&propertyName=' + propertyName : ""}${valueToFind ? '&value=' + valueToFind : ""}`;
  const response = await get(finalUrl, onSuccess, onFailure);
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

const createBookFromUrl = (bookUrl, listId, bookFormat, onSuccess = () => {}, onFailure = () => {}) => {
  let url = `${URL}/book/createBookUrl?url=${encodeURIComponent(bookUrl)}${listId ? '&listId=' + listId : ''}${bookFormat ? '&bookFormat=' + bookFormat : ''}`
  post(url, {}, onSuccess, onFailure);
}

const createGameFromUrl = (gameUrl, listId, platform, onSuccess = () => {}, onFailure = () => {}) => {
  let url = `${URL}/game/createGameUrl?url=${encodeURIComponent(gameUrl)}${listId ? '&listId=' + listId : ''}${platform ? '&gamePlatform=' + platform : ''}`
  post(url, {}, onSuccess, onFailure);
}

const createMovieFromUrl = (movieUrl, listId, onSuccess = () => {}, onFailure = () => {}) => {
  let url = `${URL}/movie/create?url=${encodeURIComponent(movieUrl)}${listId ? '&listId=' + listId : ''}`;
  post(url, {}, onSuccess, onFailure);
}

const createNewList = async (listName, apiType, onSuccess = () => {}, onFailure = () => {}) => {
  post(`${URL}/${apiType}/list?listName=${listName}`, {}, onSuccess, onFailure);
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

const renameListOnServer = async (newListName, listId, apiType, onSuccess = () => {}, onFailure = () => {}) => {
  post(`${URL}/${apiType}/list/rename?listId=${listId}&newListName=${encodeURIComponent(newListName)}`, {}, onSuccess, onFailure);
}

const removeListFromUser = async(listId, apiType, onSuccess = () => {}) => {
  deleteCall(`${URL}/${apiType}/list?listId=${listId}`, onSuccess);
}

const sendSyncInfo = async(syncInfo, onSuccess = () => {}, onFailure = () => {}) => {
  let url = `${URL}/user/sync`
  await post(url, syncInfo, onSuccess, onFailure);
}

const getSyncInfo = async(onSuccess = () => {}, onFailure = () => {}) => {
  let url = `${URL}/user/sync`
  let response = await get(url, onSuccess, onFailure);
  return getResponseData(response);
}

export { getUserListInfo, getListById, getRecentlyDone, createBookFromUrl, createGameFromUrl, removeListFromUser,
  createMovieFromUrl, createNewList, getDetailsForItems, sendSyncInfo, getSyncInfo,
  addItemToList, removeItemFromList, setBookFormat, setGamePlatform, getItemById, finishItem, registerInApp, renameListOnServer };
