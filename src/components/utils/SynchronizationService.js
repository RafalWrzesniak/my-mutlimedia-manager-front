import {getSyncInfo, sendSyncInfo} from '../api/MultimediaManagerApi';

const SynchronizationService = (defaultAllUserLists) => {

  const storeAndSendSyncInfo = (changedListIds, newUserListsData) => {
    const currentDate = new Date();
    const isoCurrentDate = currentDate.toISOString();
    let syncInfo = {
      syncTimestamp: isoCurrentDate,
      changedListIds: changedListIds
    }
    sendSyncInfo(syncInfo).then(r => {
      localStorage.setItem('syncTimestamp', isoCurrentDate);
      localStorage.setItem('syncLastModifiedLists', JSON.stringify(changedListIds))
      localStorage.setItem('allUserLists', JSON.stringify(newUserListsData ? newUserListsData : defaultAllUserLists));
    })
    console.log('Updated sync info on ' + isoCurrentDate)
  };

  const getAllUserListsIfSynchronized = async () => {
    let serverSyncInfo = await getSyncInfo();
    let localSyncInfo = localStorage.getItem('syncTimestamp')
    if(!serverSyncInfo.syncTimestamp || !localSyncInfo) {
      console.log('One of sync data is not available')
      return null;
    }
    if(serverSyncInfo.syncTimestamp.substring(0, 19) === localSyncInfo.substring(0, 19)) {
      console.log('Data up to date!')
      let localAllUserLists = localStorage.getItem('allUserLists')
      return JSON.parse(localAllUserLists);
    }
    console.log('Need to synchronize from server')
    return null;
  }

  const getCurrentSyncInfo = () => {
    let localSyncTimestamp = localStorage.getItem('syncTimestamp')
    let localSyncLastModifiedLists = JSON.parse(localStorage.getItem('syncLastModifiedLists'))
    let localAllUserLists = JSON.parse(localStorage.getItem('allUserLists'))
    let syncInfo = {
      syncTimestamp: localSyncTimestamp,
      changedListIds: localSyncLastModifiedLists
    }
    return {
      syncInfo: syncInfo,
      currentLists: buildServerUserListsDto(localAllUserLists)
    }
  }

  const getLocalUserLists = () => {
    return JSON.parse(localStorage.getItem('allUserLists'))
  }

  const setCurrentListsAsSynchronized = (userListsData) => {
    const currentDate = new Date();
    const isoCurrentDate = currentDate.toISOString();
    localStorage.setItem('syncTimestamp', isoCurrentDate);
    localStorage.setItem('syncLastModifiedLists', JSON.stringify([]))
    localStorage.setItem('allUserLists', JSON.stringify(userListsData ? userListsData : defaultAllUserLists));
  }

  const buildServerUserListsDto = (userListsData) => {
    if(!userListsData) {
      return {
        bookLists: [],
        movieLists: [],
        gameLists: []
      }
    }
    let bookLists = userListsData.filter(list => list.listType === 'BOOK_LIST')
    let movieLists = userListsData.filter(list => list.listType === 'MOVIE_LIST')
    let gameLists = userListsData.filter(list => list.listType === 'GAME_LIST')

    return {
      bookLists: bookLists,
      movieLists: movieLists,
      gameLists: gameLists
    }
  }

  const clearLocalData = () => {
    localStorage.removeItem('syncTimestamp');
    localStorage.removeItem('syncLastModifiedLists')
    localStorage.removeItem('allUserLists');
  }

  return {
    storeAndSendSyncInfo,
    getAllUserListsIfSynchronized,
    getCurrentSyncInfo,
    setCurrentListsAsSynchronized,
    getLocalUserLists,
    clearLocalData
  };
};

export default SynchronizationService;
