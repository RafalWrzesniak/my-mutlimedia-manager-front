import { sendSyncInfo, getSyncInfo } from '../../components/api/MultimediaManagerApi';

const SynchronizationService = (allUserLists) => {

  const storeAndSendSyncInfo = () => {
    var currentDate = new Date();
    localStorage.setItem('syncTimestamp', currentDate.toISOString());
    localStorage.setItem('allUserLists', JSON.stringify(allUserLists));
    sendSyncInfo({syncTimestamp: currentDate.toISOString()})
    console.log('Updated sync info on ' + currentDate.toISOString())
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
      let localAllUserListsRaw = localStorage.getItem('allUserLists')
      let localAllUserLists = JSON.parse(localAllUserListsRaw)
      return localAllUserLists;
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
