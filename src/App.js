import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './components/views/Toolbar';
import Sidebar from './components/views/Sidebar';
import TabMenu from './components/views/TabMenu';
import Content from './components/views/Content';
import Paginator from './components/views/Paginator';
import { getListById, getUserListInfo, getDetailsForItems, getRecentlyDone, findProductsByProperty, getItemById } from './components/api/MutlimediaManagerApi';
import { tabToApi, tabToListObjects, getListsForTab, isBook, isGame, isMovie, decodeItem } from './components/utils/Utils';
import InitLoader from './components/utils/InitLoader';
import TaskServiceDisplay from './components/utils/TaskServiceDisplay';
import TaskService from './components/utils/TaskService';
import AddItemDialog from './components/views/dialog/AddItemDialog';
import ReactModal from 'react-modal';
import BookDetailedWindow from './components/views/detailed/BookDetailedWindow';
import GameDetailedWindow from './components/views/detailed/GameDetailedWindow';
import MovieDetailedWindow from './components/views/detailed/MovieDetailedWindow';
import Login from './components/credentials/Login';
import { CgProfile } from 'react-icons/cg';

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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState('createdOn');
  const [sortDirection, setSortDirection] = useState('ASC');
  const [searchInputData, setSearchInputData] = useState({});
  const [initLoading, setInitInitLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  const taskService = TaskService();

  const handlePageChange = async (page) => {
    console.log("Zmieniam na strone: ", page + 1)
    setCurrentPage(page);
    if(sortKey === 'createdOn' && sortDirection === 'ASC') {
      let currentList = tabLists.filter(listFromTab => listFromTab.id === activeList)[0];
      setDisplayedItemsWithPage(currentList.allItems, page)
    } else {
      let sortedList = await getListById(activeList, tabToApi(activeTab), page, sortDirection, sortKey, pageSize);
      console.log(tabToListObjects(sortedList, activeTab))
      setDisplayedItemsFunc(tabToListObjects(sortedList, activeTab));
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
    if(finalItems.length > 0 && !finalItems[0].createdOn) {
      getDetailsForItems(finalItems, username, tabToApi(activeTab), response => {
        setDisplayedItemsFunc((currentItems) => {
          if(JSON.stringify(currentItems.map(arrayItem => arrayItem.id)) === JSON.stringify(response.data.map(arrayItem => arrayItem.id))) {
            return response.data;
          }
          return currentItems;
        })
      });
    }
  }

  const setDisplayedItems = (items) => {
    setDisplayedItemsWithPage(items, currentPage)
  }

  useEffect(() => {
    async function fetchSortedData() {
      if(!activeList) {
        return;
      }
      let currentList = tabLists.filter(listFromTab => listFromTab.id === activeList)[0];
      taskService.setTask('Sortuję listę...', true);
      setCurrentPage(0);
      let sortedList = await getListById(currentList.id, tabToApi(activeTab), 0, sortDirection, sortKey, pageSize);
      setDisplayedItemsFunc(tabToListObjects(sortedList, activeTab));
      taskService.clearTask();
    }
    console.log("Zmieniam sortowania na: " + sortKey + " " + sortDirection)
    fetchSortedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, sortDirection]);

  
  useEffect(() => {
    if(username) {
      handleTabChange(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleTabChange = async (tab) => {
    console.log("Changing tab to: " + tab)
    setActiveTab(tab);
    let updatedLists = getListsForTab(allUserLists, tab)
    setTabLists(updatedLists);
    let currentList = updatedLists.length > 0 ? updatedLists[0] : null;
    setActiveItem(undefined);
    if(currentList) {
      setActiveList(currentList.id);
      console.log("Changing list to: " + currentList.name)
      setCurrentPage(0);
      setTotalPages(Math.ceil((currentList.items)/pageSize));
      setDisplayedItems(currentList.allItems)
    }
    toolbarRef.current.turnOffRecentlyDoneButton();
    toolbarRef.current.clearSearchInput();
    toolbarRef.current.restartSorting(tab);
    };  
  
  const handleListChange = async (listId) => {
    if(!listId) return;
    let newList = tabLists.filter(listFromTab => listFromTab.id === listId)[0];
    changeList(newList)
  };

  const changeList = (list) => {
    console.log("Changing list to: " + list.name)
    setActiveList(list.id);
    setDisplayedItems(list.allItems)
    setCurrentPage(0);
    setTotalPages(Math.ceil((list.items)/pageSize));
    toolbarRef.current.turnOffRecentlyDoneButton();
    toolbarRef.current.clearSearchInput();
    toolbarRef.current.restartSorting(activeTab);
    setSortKey('createdOn');
    setSortDirection('ASC');
  }

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
      console.log(propertyName + ": " + valueToFind)
      setSearchInputData({
        propertyName: propertyName,
        valueToFind: valueToFind})
      let currentList = tabLists.filter(listFromTab => listFromTab.id === activeList)[0];
      taskService.setTask('Szukam na tej liście: ' + valueToFind, true);
      const allFoundItems = await findProductsByProperty(currentList.id, propertyName, valueToFind, tabToApi(activeTab), 0, sortDirection, sortKey, pageSize)
      taskService.clearTask();
      setCurrentPage(0);
      setTotalPages(Math.ceil(allFoundItems.length / pageSize));
      setDisplayedItems(allFoundItems);
    }
  }

  const moveToDefaultView = () => {
    if(isLoggedIn) {
      handleTabChange('BOOK_LIST');
      taskService.setTask('Miłego dzionka i smacznej kawusi! :-)');
    }
  }

  const fetchInitialData = async (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    taskService.setTask('Uruchamiam funkcję lambda...');
    console.log("Fetching init data")
    try {
      setInitInitLoading(true);
      let userListsData = await getUserListInfo();
      let savedShowTitle = localStorage.getItem('savedShowTitle');
      if(savedShowTitle) {
        setShowTitle(savedShowTitle === 'true');
      }
      setAllUserLists(userListsData);
      let updatedLists = getListsForTab(userListsData, activeTab);
      setTabLists(updatedLists);
      let activeList = updatedLists.length > 0 ? updatedLists[0] : -1;
      setActiveList(activeList.id);
      setDisplayedItems(activeList.allItems);
      toolbarRef.current.restartSorting(activeTab);
      toolbarRef.current.turnOffRecentlyDoneButton();
      toolbarRef.current.clearSearchInput();
      setInitInitLoading(false);
      taskService.clearTask();
    } catch (error) {
      console.error('Error fetching user lists:', error);
      taskService.setTask('Błąd serwera! Nie udało się pobrać danych :(');
      setInitInitLoading(false);
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
  }

  const updateItem = (item) => {
    handleListChange(activeList);
  }

  const addNewList = (list) => {
    allUserLists.push(list)
    let updatedTabLists = getListsForTab(allUserLists, activeTab);
    setTabLists(updatedTabLists);
  }

  const refreshListsInApp = async () => {
    taskService.setTask('Odświeżam listy w apliakcji..', true);
    let userListsData = await getUserListInfo();
    setAllUserLists(userListsData);
    let updatedLists = getListsForTab(userListsData, activeTab);
    setTabLists(updatedLists);
    if(!updatedLists.map(list => list.id).includes(activeList) && updatedLists.length > 0) {
      setActiveList(updatedLists[0].id)
      setDisplayedItems(updatedLists[0].allItems);
    }
    taskService.clearTask();
  }

  return (
    <div className="app">
      <div className='top-menu'>
        <div className='logo-placement' onClick={moveToDefaultView}>
            <img className='logo' src='logo.png' alt="Logo" />
            My Multimedia Manager
        </div>
        <TaskServiceDisplay loading={taskService.getLoading()} task={taskService.getTask()} />
        <div className='user-menu'>
          <CgProfile className='icon-user-menu'/>
          {username}
        </div>
      </div>
      {(!isLoggedIn) && <Login onSuccessfulLogin={fetchInitialData} />}
      {(isLoggedIn) && (
      <div className="container">
        <InitLoader loading={initLoading} />
        <Sidebar lists={tabLists} activeList={activeList} onListChange={handleListChange} activeApi={activeTab} addNewList={addNewList} refreshListsInApp={refreshListsInApp} taskService={taskService} />
        <div className='content-with-menu'>
          <div className="tab-menu-container">
            <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className='content-with-toolbar'>
            <Toolbar 
            ref={toolbarRef}
            handleRecentlyDone={recentlyDoneHandler}
            handleAddItem={handleOpenDialog}
            handleSortChange={setSortKey}
            handleSortDirectionChange={setSortDirection}
            handleSearchInputChange={handleInputSearch}
            switchShowTitle={setShowTitle}
            activeTab={activeTab}
            />
            <AddItemDialog isOpen={isDialogOpen} onClose={handleCloseDialog} lists={tabLists} activeApi={tabToApi(activeTab)} addItemToListId={addItemToList} taskService={taskService} />
            <Content items={displayedItems} activeItem={activeItem} onItemChange={handleItemChange} showTitle={showTitle} />
            <Paginator totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        </div>
        {(activeItem && activeTab==='BOOK_LIST' && isBook(activeItem)) && (<BookDetailedWindow book={activeItem} tabLists={tabLists} updateItem={updateItem} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} />)}
        {(activeItem && activeTab==='MOVIE_LIST' && isMovie(activeItem)) && (<MovieDetailedWindow movie={activeItem} tabLists={tabLists} updateItem={updateItem} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} />)}
        {(activeItem && activeTab==='GAME_LIST' && isGame(activeItem)) && (<GameDetailedWindow game={activeItem} tabLists={tabLists} updateItem={updateItem} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} />)}
      </div>
      )}
    </div>
  );
};

export default App;
