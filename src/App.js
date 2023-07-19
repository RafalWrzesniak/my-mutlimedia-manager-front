import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './components/views/Toolbar';
import Sidebar from './components/views/Sidebar';
import TabMenu from './components/views/TabMenu';
import Content from './components/views/Content';
import Paginator from './components/views/Paginator';
import { getListByName, getUserListInfo, getRecentlyDone, findProductsByProperty } from './components/MutlimediaManagerApi';
import { tabToApi, tabToListObjects, getListsForTab } from './components/Utils';
import AddItemDialog from './components/views/AddItemDialog';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

const App = () => {
  const pageSize = 20;
  const toolbarRef = useRef(null);  
  const [activeTab, setActiveTab] = useState(null);
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

  const handlePageChange = async (page) => {
    console.log("Zmieniam na strone: ", page)
    setCurrentPage(page);
    let currentList = tabLists.filter(listFromTab => listFromTab.id === activeList)[0];
    let listDetailes;
    if(searchInputData.propertyName && searchInputData.valueToFind) {
      listDetailes = await findProductsByProperty(searchInputData.propertyName, searchInputData.valueToFind, tabToApi(activeTab), page, sortDirection, sortKey, pageSize)
      setDisplayedItems(listDetailes)
    } else {
      listDetailes = await getListByName(currentList.name, tabToApi(activeTab), page, sortDirection, sortKey);
      setDisplayedItems(tabToListObjects(listDetailes, activeTab))
    }
  };

  useEffect(() => {
    console.log("Zmieniam sortowania na: " + sortKey + " " + sortDirection)
    handleListChange(activeList);
  }, [sortKey, sortDirection]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    handleListChange(activeList);
  };

  const handleTabChange = async (tab) => {
    console.log("Changing tab to: " + tab)
    setActiveTab(tab);
    let updatedLists = getListsForTab(allUserLists, tab)
    setTabLists(updatedLists);
    let currentList = updatedLists.length > 0 ? updatedLists[0] : null;
    if(currentList) {
      setActiveList(currentList.id);
      console.log("Changing list to: " + currentList.name)
      let listDetailes = await getListByName(currentList.name, tabToApi(tab));
      setCurrentPage(0);
      setTotalPages(Math.ceil((listDetailes.booksNumber | listDetailes.gamesNumber | listDetailes.moviesNumber)/pageSize)); 
      setDisplayedItems(tabToListObjects(listDetailes, tab))
    }
    toolbarRef.current.turnOffRecentlyDoneButton();
    toolbarRef.current.clearSearchInput();
    };  
  
  const handleListChange = async (listId) => {
    if(!listId) return;
    setActiveList(listId);
    let currentList = tabLists.filter(listFromTab => listFromTab.id === listId)[0];
    console.log("Changing list to: " + currentList.name)
    let listDetailes = await getListByName(currentList.name, tabToApi(activeTab), 0, sortDirection, sortKey);
    setDisplayedItems(tabToListObjects(listDetailes, activeTab))
    setCurrentPage(0);
    setTotalPages(Math.ceil((listDetailes.booksNumber | listDetailes.gamesNumber | listDetailes.moviesNumber)/pageSize));
    toolbarRef.current.turnOffRecentlyDoneButton();
    toolbarRef.current.clearSearchInput();

  };

  const handleItemChange = (item) => {
    setActiveItem(item.id !==  activeItem ? item.id : -1)
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
      console.log(activeList)
      handleListChange(rememeredList)
    }
  }

  const handleInputSearch = async (propertyName, valueToFind) => {
    if(!propertyName || valueToFind.length < 3) {
        setSearchInputData({})
        console.log(activeList)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userListsData = await getUserListInfo();
        setAllUserLists(userListsData);
        setActiveTab('BOOK_LIST');
        let updatedLists = getListsForTab(userListsData, 'BOOK_LIST');  
        setTabLists(updatedLists);
        let activeList = updatedLists.length > 0 ? updatedLists[0] : -1;
        setActiveList(activeList.id);
        let listDetailes = await getListByName(activeList.name, 'book', 0, sortDirection, sortKey);
        setDisplayedItems(listDetailes.bookWithUserDetailsDtos);
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <Sidebar lists={tabLists} activeList={activeList} onListChange={handleListChange} />
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
            activeTab={activeTab ? activeTab : 'BOOK_LIST'}
            />
            <AddItemDialog isOpen={isDialogOpen} onClose={handleCloseDialog} lists={tabLists} activeApi={tabToApi(activeTab)} />            
            <div className="content">
              <Content 
              items={displayedItems} 
              activeItem={activeItem} 
              onItemChange={handleItemChange} />
              <Paginator
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
