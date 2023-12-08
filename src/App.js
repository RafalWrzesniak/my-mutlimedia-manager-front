import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './components/views/Toolbar';
import Sidebar from './components/views/Sidebar';
import TabMenu from './components/views/TabMenu';
import Content from './components/views/Content';
import Paginator from './components/views/Paginator';
import { getListById, getUserListInfo, getDetailsForItems, getRecentlyDone, findProductsByProperty, getItemById } from './components/api/MutlimediaManagerApi';
import { tabToApi, tabToListObjects, getListsForTab, isBook, isGame, isMovie } from './components/utils/Utils';
import AddItemDialog from './components/views/AddItemDialog';
import ReactModal from 'react-modal';
import BookDetailedWindow from './components/views/detailed/BookDetailedWindow';
import GameDetailedWindow from './components/views/detailed/GameDetailedWindow';
import MovieDetailedWindow from './components/views/detailed/MovieDetailedWindow';
import Login from './components/credentials/Login';
import { CgProfile } from 'react-icons/cg';

ReactModal.setAppElement('#root');

const App = () => {
  const toolbarRef = useRef(null);  
  const [pageSize] = useState(36);
  const [activeTab, setActiveTab] = useState('BOOK_LIST');
  const [username, setUsername] = useState('');
  const [activeList, setActiveList] = useState(null);
  const [allUserLists, setAllUserLists] = useState([]);
  const [tabLists, setTabLists] = useState([]);
  const [displayedItems, setDisplayedItemsFunc] = useState([]);
  const [activeItem, setActiveItem] = useState();
  const [rememeredList, setRememberedList] = useState();  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [searchInputData, setSearchInputData] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlePageChange = async (page) => {
    console.log("Zmieniam na strone: ", page + 1)
    setCurrentPage(page);
    let currentList = tabLists.filter(listFromTab => listFromTab.id === activeList)[0];
    setDisplayedItemsWithPage(currentList.allItems, page)
  };

  const setDisplayedItemsWithPage = (items, pageNumber) => {    
    let startIndex = pageNumber * pageSize;
    let endIndex = startIndex + pageSize;
    if (endIndex > items.length) {
      endIndex = items.length;
    }
    let finalItems = items.slice(startIndex, endIndex);
    if(finalItems.length > 0 && !finalItems[0].createdOn) {
      getDetailsForItems(finalItems, username, tabToApi(activeTab), response => {
        let item = response.data[0]
        if(!item) {
          return;
        }
        
        if(JSON.stringify(finalItems.map(arrayTtem => arrayTtem.id)) === JSON.stringify(response.data.map(arrayTtem => arrayTtem.id))) {
          console.log('ustawiam dla ' + activeTab)
          setDisplayedItemsFunc(response.data)
        }        
      });
    }    
    setDisplayedItemsFunc(finalItems);
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
      let sortedList = await getListById(currentList.id, tabToApi(activeTab), 0, sortDirection, sortKey, pageSize);
      setDisplayedItemsWithPage(tabToListObjects(sortedList, activeTab), currentPage);
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
    console.log('Lista zmieniona')
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
      toolbarRef.current.clearSearchInput();
      setSearchInputData({})
      let recentlyDoneItems = await getRecentlyDone(tabToApi(activeTab))
      setDisplayedItems(recentlyDoneItems)
      if(activeList !== -1) {
        setRememberedList(activeList)
      }
      setActiveList(-1);
      setCurrentPage(0);
      setTotalPages(1)
    } else if(activeList) {
      handleListChange(rememeredList)
    }
  }

  const handleInputSearch = async (propertyName, valueToFind) => {
    if(searchInputData.valueToFind && valueToFind.length === 0) {
      console.log(rememeredList)
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
      const allFoundItems = await findProductsByProperty(currentList.id, propertyName, valueToFind, tabToApi(activeTab), 0, sortDirection, sortKey, pageSize)
      console.log(allFoundItems)
      setCurrentPage(0);
      setTotalPages(Math.ceil(allFoundItems.length / pageSize));
      setDisplayedItems(allFoundItems);
    }
  }

  const moveToDefaultView = () => {
    handleTabChange('BOOK_LIST')
  }

  const fetchInitialData = async (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    console.log("Fetching init data")
    try {
      let userListsData = await getUserListInfo();
      setAllUserLists(userListsData);
      let updatedLists = getListsForTab(userListsData, activeTab);
      setTabLists(updatedLists);
      let activeList = updatedLists.length > 0 ? updatedLists[0] : -1;
      setActiveList(activeList.id);
      setDisplayedItems(activeList.allItems);
      toolbarRef.current.restartSorting(activeTab);
      toolbarRef.current.turnOffRecentlyDoneButton();
      toolbarRef.current.clearSearchInput();
    } catch (error) {
      console.error('Error fetching user lists:', error);
    }
  };

  const addItemToList = (item, listId) => {
    let list = tabLists.filter(appList => appList.id === listId)[0];
    list.allItems.push(item);
    if(listId === activeList) {
      setDisplayedItems(list.allItems);
    }
    let updatedLists = getListsForTab(allUserLists, activeTab);
    setTabLists(updatedLists);
  }

  const removeItemFromList = (item, listId) => {
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
  }

  const updateItem = (item) => {
    handleListChange(activeList);
  }

  const addNewList = (list) => {
    allUserLists.push(list)
    let updatedTabLists = getListsForTab(allUserLists, activeTab);
    setTabLists(updatedTabLists);
  }

  if (!isLoggedIn) {
    return <Login onSuccessfulLogin={fetchInitialData} />;
  }

  return (
    <div className="app">
      <div className='top-menu'>
        <div className='logo-placement' onClick={moveToDefaultView}>
            <img className='logo' src='logo.png' alt="Logo" />
            My Multimedia Manager
        </div>
        <div className='user-menu'>
          <CgProfile className='icon-user-menu'/>
          {username}
        </div>
      </div>
      <div className="container">
        <Sidebar 
        lists={tabLists} 
        activeList={activeList}
        onListChange={handleListChange}
        activeApi={activeTab}
        addNewList={addNewList}
        />
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
            activeTab={activeTab}
            />
            <AddItemDialog isOpen={isDialogOpen} onClose={handleCloseDialog} lists={tabLists} activeApi={tabToApi(activeTab)} addItemToListId={addItemToList} />            
            <Content items={displayedItems} activeItem={activeItem} onItemChange={handleItemChange} />
            <Paginator totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}
            />
          </div>
        </div>
        {(activeItem && activeTab==='BOOK_LIST' && isBook(activeItem)) && (<BookDetailedWindow book={activeItem} tabLists={tabLists} updateItem={updateItem} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} />)}
        {(activeItem && activeTab==='MOVIE_LIST' && isMovie(activeItem)) && (<MovieDetailedWindow movie={activeItem} tabLists={tabLists} updateItem={updateItem} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} />)}
        {(activeItem && activeTab==='GAME_LIST' && isGame(activeItem)) && (<GameDetailedWindow game={activeItem} tabLists={tabLists} updateItem={updateItem} addItemToListId={addItemToList} removeItemFromListId={removeItemFromList} />)}
      </div>
    </div>
  );
};

export default App;
