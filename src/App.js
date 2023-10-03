import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './components/views/Toolbar';
import Sidebar from './components/views/Sidebar';
import TabMenu from './components/views/TabMenu';
import Content from './components/views/Content';
import Paginator from './components/views/Paginator';
import { getListByName, getUserListInfo, getRecentlyDone, findProductsByProperty, getItemById } from './components/api/MutlimediaManagerApi';
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
  const [pageSize] = useState(30);
  const [activeTab, setActiveTab] = useState('BOOK_LIST');
  const [username, setUsername] = useState('');
  const [activeList, setActiveList] = useState(null);
  const [allUserLists, setAllUserLists] = useState([]);
  const [tabLists, setTabLists] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
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
    let listDetailes;
    if(searchInputData.propertyName && searchInputData.valueToFind) {
      listDetailes = await findProductsByProperty(searchInputData.propertyName, searchInputData.valueToFind, tabToApi(activeTab), page, sortDirection, sortKey, pageSize)
      setDisplayedItems(listDetailes)
    } else {
      listDetailes = await getListByName(currentList.name, tabToApi(activeTab), page, sortDirection, sortKey, pageSize);
      setDisplayedItems(tabToListObjects(listDetailes, activeTab))
    }
  };

  useEffect(() => {
    console.log("Zmieniam sortowania na: " + sortKey + " " + sortDirection)
    handleListChange(activeList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, sortDirection]);

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
      let listDetailes = await getListByName(currentList.name, tabToApi(tab), 0, undefined, undefined, pageSize);
      setCurrentPage(0);
      setTotalPages(Math.ceil((listDetailes.booksNumber | listDetailes.gamesNumber | listDetailes.moviesNumber)/pageSize)); 
      setDisplayedItems(tabToListObjects(listDetailes, tab))
    }
    toolbarRef.current.turnOffRecentlyDoneButton();
    toolbarRef.current.clearSearchInput();
    toolbarRef.current.restartSorting(tab);
    };  
  
  const handleListChange = async (listId) => {
    if(!listId) return;
    setActiveList(listId);
    let currentList = tabLists.filter(listFromTab => listFromTab.id === listId)[0];
    console.log("Changing list to: " + currentList.name)
    let listDetailes = await getListByName(currentList.name, tabToApi(activeTab), 0, sortDirection, sortKey, pageSize);
    setDisplayedItems(tabToListObjects(listDetailes, activeTab))
    setCurrentPage(0);
    setTotalPages(Math.ceil((listDetailes.booksNumber | listDetailes.gamesNumber | listDetailes.moviesNumber)/pageSize));
    toolbarRef.current.turnOffRecentlyDoneButton();
    toolbarRef.current.clearSearchInput();

  };

  const refreshSideBarList = async () => {
    console.log('HALO')
    let userListsData = await getUserListInfo();
    setAllUserLists(userListsData);
    let updatedLists = getListsForTab(userListsData, activeTab);  
    setTabLists(updatedLists);
  }

  const refreshAppState = async () => {
    await refreshSideBarList();
    handleListChange(activeList > 0 ? activeList : rememeredList);
    if(activeItem) {
      let updatedItem = await getItemById(activeItem.id, tabToApi(activeTab));
      setActiveItem(updatedItem);
    }
  }

  const handleItemChange = (item) => {
    setActiveItem(item !==  activeItem ? item : undefined)
    console.log(item)
  };

  const recentlyDoneHandler = async () => {
    if((activeList && activeList !== -1) || searchInputData.propertyName) {
      toolbarRef.current.clearSearchInput();
      setSearchInputData({})
      let recentlyDoneItems = await getRecentlyDone(tabToApi(activeTab))
      setDisplayedItems(recentlyDoneItems)
      if(activeList >= 0) {
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
    if(!propertyName || valueToFind.length < 3) {
        setSearchInputData({})
        if(activeList === -1) {
          handleListChange(rememeredList);
        }
        return;
    }
    if(valueToFind.length >= 3) {
      console.log(propertyName + ": " + valueToFind)
      setSearchInputData({
        propertyName: propertyName,
        valueToFind: valueToFind})
      const allFoundItems = await findProductsByProperty(propertyName, valueToFind, tabToApi(activeTab), 0, sortDirection, sortKey, 200)
      if(activeList >= 0) {
        setRememberedList(activeList)
      }
      setActiveList(-1);
      setCurrentPage(0);
      setTotalPages(Math.ceil(allFoundItems.length / pageSize));
      setDisplayedItems(allFoundItems.slice(0, pageSize));
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
      let listDetailes = await getListByName(activeList.name, tabToApi(activeTab), 0, sortDirection, sortKey, pageSize);
      setDisplayedItems(listDetailes.bookWithUserDetailsDtos);
      toolbarRef.current.restartSorting(activeTab);
    } catch (error) {
      console.error('Error fetching user lists:', error);
    }
  };

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
        refreshSideBarList={refreshSideBarList}
        />
        <div className='content-with-menu'>
          <div className="tab-menu-container">
            <TabMenu activeTab={activeTab} onTabChange={handleTabChange} />
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
            <AddItemDialog isOpen={isDialogOpen} onClose={handleCloseDialog} lists={tabLists} activeApi={tabToApi(activeTab)} refreshState={refreshAppState} />            
            <Content items={displayedItems} activeItem={activeItem} onItemChange={handleItemChange} />
            <Paginator totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}
            />
          </div>
        </div>
        {(activeItem && activeTab==='BOOK_LIST' && isBook(activeItem)) && (<BookDetailedWindow book={activeItem} tabLists={tabLists} refreshState={refreshAppState} />)}
        {(activeItem && activeTab==='MOVIE_LIST' && isMovie(activeItem)) && (<MovieDetailedWindow movie={activeItem} tabLists={tabLists} refreshState={refreshAppState} />)}
        {(activeItem && activeTab==='GAME_LIST' && isGame(activeItem)) && (<GameDetailedWindow game={activeItem} tabLists={tabLists} refreshState={refreshAppState} />)}
      </div>
    </div>
  );
};

export default App;
