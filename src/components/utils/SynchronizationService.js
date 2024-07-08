import {getSyncInfo, sendSyncInfo} from '../api/MultimediaManagerApi';

const SynchronizationService = (defaultAllUserLists) => {

  const storeAndSendSyncInfo = (newUserListsData) => {
    const currentDate = new Date();
    const isoCurrentDate = currentDate.toISOString();
    sendSyncInfo({syncTimestamp: isoCurrentDate}).then(r => {
      localStorage.setItem('syncTimestamp', isoCurrentDate);
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

  return {
    storeAndSendSyncInfo,
    getAllUserListsIfSynchronized
  };
};

export default SynchronizationService;
