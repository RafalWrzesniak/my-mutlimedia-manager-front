import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './components/views/Toolbar';
import Sidebar from './components/views/Sidebar';
import TabMenu from './components/views/TabMenu';
import Content from './components/views/Content';
import Paginator from './components/views/Paginator';
import { getListById, getUserListInfo, getRecentlyDone, getItemById } from './components/api/MultimediaManagerApi';
import { tabToApi, tabToListObjects, getListsForTab, isBook, isGame, isMovie, decodeItem, isDesktop } from './components/utils/Utils';
import InitLoader from './components/utils/InitLoader';
import TaskServiceDisplay from './components/utils/TaskServiceDisplay';
import TaskService from './components/utils/TaskService';
import SynchronizationService from './components/utils/SynchronizationService';
import AddItemDialog from './components/views/dialog/AddItemDialog';
import ReactModal from 'react-modal';
import BookDetailedWindow from './components/views/detailed/BookDetailedWindow';
import GameDetailedWindow from './components/views/detailed/GameDetailedWindow';
import MovieDetailedWindow from './components/views/detailed/MovieDetailedWindow';
import Login from './components/credentials/Login';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineMenu } from "react-icons/ai";
import Modal from 'react-modal';
import {RingLoader} from "react-spinners";

ReactModal.setAppElement('#root');

const App = () => {
  const toolbarRef = useRef(null);  
  const [pageSize] = useState(30);
  const [activeTab, setActiveTab] = useState('BOOK_LIST');
  const [username, setUsername] = useState('');
  const [activeList, setActiveList] = useState(null);
  const [allUserLists, setAllUserLists] = useState([]);
  const [tabLists, setTabLists] = useState([]);
  const [displayedItems, setDisplayedItemsFunc] = useState([]);
  const [activeItem, setActiveItem] = useState();
  const [rememberedList, setRememberedList] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobileSideBarOpen, setIsMobileSideBarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState('createdOn');
  const [sortDirection, setSortDirection] = useState('ASC');
  const [searchInputData, setSearchInputData] = useState({});
  const [initLoading, setInitLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [currentListName, setCurrentListName] = useState('');

  const taskService = TaskService();
  const synchronizationService = SynchronizationService(allUserLists);

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    if(sortKey === 'createdOn' && sortDirection === 'ASC' && !searchInputData.propertyName && !searchInputData.valueToFind) {
      let currentList = tabLists.filter(listFromTab => listFromTab.id === activeList)[0];
      setDisplayedItemsWithPage(currentList.allItems, page)
    } else {
      taskService.setTask('Pobieram kolejną stronę...', true)
      await getListById(activeList, tabToApi(activeTab), page, sortDirection, sortKey, pageSize, searchInputData.propertyName, searchInputData.valueToFind, response => {
        taskService.clearTask()
        setDisplayedItemsFunc(tabToListObjects(response.data, activeTab));
      }, () => taskService.setTask('Nie udało się pobrać danych :( Spróbuj odświeżyć stronę'));
    }
  };

  const setDisplayedItemsWithPage = (items, pageNumber) => {
    let startIndex = pageNumber * pageSize;
    let endIndex = startIndex + pageSize;
    if (endIndex > items.length) {
      endIndex = items.length;
    }
    let finalItems = items.slice(startIndex, endIndex);
    setDisplayedItemsFunc(finalItems);
  }

  const setDisplayedItems = (items) => {
    setDisplayedItemsWithPage(items, currentPage)
  }

  useEffect(() => {
    async function fetchSortedData() {
      if(sortKey && !sortDirection) {
        setSortDirection('ASC');
      }
      if(!sortKey && sortDirection) {
        setSortKey('createdOn');

      }
      if(!activeList || !(sortKey && sortDirection)) {
        return;
      }
      let currentList = tabLists.filter(listFromTab => listFromTab.id === activeList)[0];
      taskService.setTask('Sortuję listę...', true);
      await getListById(currentList.id, tabToApi(activeTab), 0, sortDirection, sortKey, pageSize, searchInputData.propertyName, searchInputData.valueToFind, response => {
        setDisplayedItemsFunc(tabToListObjects(response.data, activeTab));
        setTotalPages(Math.ceil(response.data.productsNumber / pageSize));
        setCurrentPage(0);
        taskService.clearTask();
      }, () => taskService.setTask('Nie udało się pobrać danych :( Spróbuj odświeżyć stronę'));
    }
    fetchSortedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, sortDirection]);

  
  useEffect(() => {
    if(username) {
      setSearchInputData({})
      setActiveTab(activeTab);
      let updatedLists = getListsForTab(allUserLists, activeTab)
      setTabLists(updatedLists);
      let currentList = updatedLists.length > 0 ? updatedLists[0] : null;
      setActiveItem(undefined);
      if(currentList) {
        setCurrentListName(currentList.name)
        setActiveList(currentList.id);
        setCurrentPage(0);
        setTotalPages(Math.ceil((currentList.items)/pageSize));
        setDisplayedItemsWithPage(currentList.allItems, 0)
      }
      toolbarRef.current.turnOffRecentlyDoneButton();
      toolbarRef.current.clearSearchInput();
      toolbarRef.current.restartSorting(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleListChange = async (listId) => {
    if(!listId) return;
    let newList = tabLists.filter(listFromTab => listFromTab.id === listId)[0];
    setActiveList(newList.id);
    setDisplayedItemsWithPage(newList.allItems, 0)
    setCurrentPage(0);
    setTotalPages(Math.ceil((newList.items)/pageSize));
    setIsMobileSideBarOpen(false)
    toolbarRef.current.turnOffRecentlyDoneButton();
    toolbarRef.current.clearSearchInput();
    toolbarRef.current.restartSorting(activeTab);
    setSortKey(undefined);
    setSortDirection(undefined);
    setSearchInputData({})
    setCurrentListName(newList.name)
    if(!isDesktop()) {
      setActiveItem(undefined);
    }
  };

  const handleItemChange = (item) => {
    if(!activeItem || item.id !== activeItem.id) {
      getItemById(item.id, tabToApi(activeTab), response => setActiveItem(response.data))
    } else {
      setActiveItem(undefined) 
    }    
  };

  const recentlyDoneHandler = async () => {
    if((activeList && activeList !== -1) || searchInputData.propertyName) {
      taskService.setTask('Szukam ostatnio ukończonych..', true);
      toolbarRef.current.clearSearchInput();
      setSearchInputData({})
      let recentlyDoneItems = await getRecentlyDone(tabToApi(activeTab))
      setDisplayedItems(recentlyDoneItems)
      taskService.clearTask();
      if(activeList !== -1) {
        setRememberedList(activeList)
      }
      setActiveList(-1);
      setCurrentPage(0);
      setTotalPages(1)
    } else if(activeList) {
      handleListChange(rememberedList)
    }
  }

  const handleInputSearch = async (propertyName, valueToFind) => {
    if(searchInputData.valueToFind && valueToFind.length === 0) {
      setSearchInputData({})
      handleListChange(activeList);
      return;
    }
    if(valueToFind.length >= 2) {
      let currentList = tabLists.filter(listFromTab => listFromTab.id === activeList)[0];
      if(propertyName === 'titleOrg') {
        propertyName = 'title'
      }
      setSearchInputData({
        propertyName: propertyName,
        valueToFind: valueToFind
      })
      setTimeout(async function(){
        taskService.setTask('Szukam na tej liście: ' + valueToFind, true);
        await getListById(currentList.id, tabToApi(activeTab), 0, sortDirection, sortKey, pageSize, propertyName, valueToFind, response => {
          setSearchInputData(prevState => {
            if(valueToFind === prevState.valueToFind || !prevState.valueToFind) {
              taskService.clearTask();
              setCurrentPage(0);
              setTotalPages(Math.ceil(response.data.productsNumber / pageSize));
              setDisplayedItemsFunc(tabToListObjects(response.data, activeTab));
            }
            return prevState;
          })
        }, () => taskService.setTask('Nie udało się pobrać danych :( Spróbuj odświeżyć stronę'));
      }, 300);

    }
  }

  const moveToDefaultView = () => {
    if(isLoggedIn) {
      setActiveTab('BOOK_LIST');
      taskService.setTask('Miłego dzionka i smacznej kawusi! :-)');
    }
  }

  const fetchInitialData = async (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    taskService.setTask('Uruchamiam funkcję lambda...');
    try {
      setInitLoading(true);
      let syncInfo = synchronizationService.getCurrentSyncInfo();
      let userListsData= await getUserListInfo(syncInfo);
      synchronizationService.setCurrentListsAsSynchronized(userListsData)
      let savedShowTitle = localStorage.getItem('savedShowTitle');
      if(savedShowTitle) {
        setShowTitle(savedShowTitle === 'true');
      }
      setAllUserLists(userListsData);
      let updatedLists = getListsForTab(userListsData, activeTab);
      setTabLists(updatedLists);
      let activeList = updatedLists.length > 0 ? updatedLists[0] : -1;
      setActiveList(activeList.id);
      setCurrentListName(activeList.name)
      setDisplayedItems(activeList.allItems);
      toolbarRef.current.restartSorting(activeTab);
      toolbarRef.current.turnOffRecentlyDoneButton();
      toolbarRef.current.clearSearchInput();
      setInitLoading(false);
      taskService.clearTask();
    } catch (error) {
      taskService.setTask('Błąd serwera! Nie udało się pobrać danych :(');
      setInitLoading(false);
    }
  };

  const addItemToList = (item, listId) => {
    let list = findListById(listId);
    list.allItems.push(item);
    if(listId === activeList) {
      setDisplayedItems(list.allItems);
    }
    let updatedLists = getListsForTab(allUserLists, activeTab);
    setTabLists(updatedLists);
    let task = 'Dodałeś "' + decodeURIComponent(item.polishTitle ? item.polishTitle : item.title) + '" do listy "' + list.name + '"'
    taskService.setTask(task);
    synchronizationService.storeAndSendSyncInfo([listId])
  }

  const updateItemInLists = (item) => {
    let changedListIds = []
    for (let list of tabLists) {
      const index = list.allItems.findIndex(element => element.id === item.id);
      if (index !== -1) {
          list.allItems[index] = item;
          changedListIds.push(list.id)
      }
      if(list.id === activeList) {
        setDisplayedItems(list.allItems);
      }
    }
    synchronizationService.storeAndSendSyncInfo(changedListIds)
  }

  const findListById = (listId) => {
    return tabLists.filter(list => list.id === listId)[0]
  }

  const removeItemFromList = (itemToRemove, listId) => {
    let item = decodeItem(itemToRemove);
    let list = tabLists.filter(appList => appList.id === listId)[0];
    let index = list.allItems.map(listItem => listItem.id).indexOf(item.id);
    if (index > -1) {
      list.allItems.splice(index, 1);
    }
    if(listId === activeList) {
      setDisplayedItems(list.allItems);
    }
    let updatedLists = getListsForTab(allUserLists, activeTab);
    setTabLists(updatedLists);
    let title = item.polishTitle ? item.polishTitle : item.title;
    let task = 'Usunąłeś "' + title + '" z listy "' + findListById(listId).name + '"'
    taskService.setTask(task);
    synchronizationService.storeAndSendSyncInfo([listId])
  }

  const addNewList = (list) => {
    allUserLists.push(list)
    let updatedTabLists = getListsForTab(allUserLists, activeTab);
    setTabLists(updatedTabLists);
    synchronizationService.storeAndSendSyncInfo([list.id], allUserLists)
  }

  const removeList = (listId) => {
    let indexOfListToRemove = allUserLists.findIndex(l => l.id === listId)
    let listName = allUserLists[indexOfListToRemove].name
    allUserLists.splice(indexOfListToRemove, 1)
    let updatedTabLists = getListsForTab(allUserLists, activeTab);
    setTabLists(updatedTabLists);
    handleListChange(updatedTabLists[0].id)
    taskService.setTask('Usunąłeś listę "' + listName + '"');
    synchronizationService.storeAndSendSyncInfo([listId], allUserLists)
  }

  const renameList = (listId, newListName) => {
    console.log(listId)
    console.log(allUserLists)
    let listToUpdate = allUserLists.find(list => list.id === listId)
    listToUpdate.name = newListName
    let updatedTabLists = getListsForTab(allUserLists, activeTab);
    setTabLists(updatedTabLists);
    synchronizationService.storeAndSendSyncInfo([listId], allUserLists)
  }

  const refreshListsInApp = async () => {
    taskService.setTask('Odświeżam listy w apliakcji..', true);
    let userListsData = await getUserListInfo();
    setAllUserLists(userListsData);
    let updatedLists = getListsForTab(userListsData, activeTab);
    setTabLists(updatedLists);
    let currentList = updatedLists.filter(list => list.id === activeList)[0]
    setDisplayedItems(currentList.allItems)
    if(!updatedLists.map(list => list.id).includes(activeList) && updatedLists.length > 0) {
      setActiveList(updatedLists[0].id)
      setDisplayedItems(updatedLists[0].allItems);
    }
    taskService.clearTask();
  }


  return (
    <div className="app">
      <div className='top-menu'>
        {!isDesktop() && isLoggedIn &&
          <div>
            <AiOutlineMenu className='lists-menu' onClick={() => setIsMobileSideBarOpen(currentValue => !currentValue)} />
            <Modal isOpen={isMobileSideBarOpen} onRequestClose={() => setIsMobileSideBarOpen(false)} className="mobile-left-panel" overlayClassName="add-item-dialog-overlay">
              <Sidebar lists={tabLists} activeList={activeList} onListChange={handleListChange} activeApi={activeTab} addNewList={addNewList} renameList={renameList} taskService={taskService} removeListInApp={removeList} />
            </Modal>
         </div>
         }
        <div className='logo-placement' onClick={moveToDefaultView}>
          {isDesktop() && <img className='logo' src='logo.png' alt="Logo" />}
          {!isDesktop() && !taskService.getLoading() && <img className='logo' src='logo.png' alt="Logo" />}
          {!isDesktop() && taskService.getLoading() &&
              <div className={'small-loader-visible'}>
                <RingLoader color={'#69c5e9'} size={20} />
              </div>
          }
          {isDesktop() ? 'My Multimedia Manager' : currentListName}
        </div>
        {isDesktop() && <TaskServiceDisplay loading={taskService.getLoading()} task={taskService.getTask()} />}
        <div className='user-menu'>
          <CgProfile className='icon-user-menu'/>
          {isDesktop() ? username : ''}
        </div>
      </div>
      {(!isLoggedIn) && <Login onSuccessfulLogin={fetchInitialData} taskService={taskService} />}
      {(isLoggedIn) && (
      <div className="container">
        <InitLoader loading={initLoading} />
        {isDesktop() &&
          <Sidebar lists={tabLists} activeList={activeList} onListChange={handleListChange} activeApi={activeTab} addNewList={addNewList} renameList={renameList} taskService={taskService} removeListInApp={removeList} />
        }
        <div className='content-with-menu'>
          <div className="tab-menu-container">
            <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className='content-with-toolbar'>
            <Toolbar 
            ref={toolbarRef}
            handleRecentlyDone={recentlyDoneHandler}
            handleAddItem={() => setIsDialogOpen(true)}
            handleSortChange={setSortKey}
            handleSortDirectionChange={setSortDirection}
            handleSearchInputChange={handleInputSearch}
            switchShowTitle={setShowTitle}
            activeTab={activeTab}
            />
            <AddItemDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} lists={tabLists} activeApi={tabToApi(activeTab)} addItemToListId={addItemToList} taskService={taskService} />
            <Content items={displayedItems} activeItem={activeItem} onItemChange={handleItemChange} showTitle={showTitle} />
            <Paginator totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        </div>
        {(activeItem && activeTab==='BOOK_LIST' && isBook(activeItem)) && (<BookDetailedWindow book={activeItem} tabLists={tabLists} updateItem={updateItemInLists} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} closeDetails={() => setActiveItem(undefined)} />)}
        {(activeItem && activeTab==='MOVIE_LIST' && isMovie(activeItem)) && (<MovieDetailedWindow movie={activeItem} tabLists={tabLists} updateItem={updateItemInLists} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} closeDetails={() => setActiveItem(undefined)} />)}
        {(activeItem && activeTab==='GAME_LIST' && isGame(activeItem)) && (<GameDetailedWindow game={activeItem} tabLists={tabLists} updateItem={updateItemInLists} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} closeDetails={() => setActiveItem(undefined)} />)}
      </div>
      )}
    </div>
  );
};

export default App;
