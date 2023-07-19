
  function tabToApi(tab) {
    const tabToApiMap = {
      BOOK_LIST: 'book',
      MOVIE_LIST: 'movie',
      GAME_LIST: 'game',
    };  
    return tabToApiMap[tab] || '';
  }

  function tabToListObjects(list, tab) {
    if(tab === 'BOOK_LIST')
      return list.bookWithUserDetailsDtos;
    if(tab === 'MOVIE_LIST')
      return list.movieWithUserDetailsDtos
    if(tab === 'GAME_LIST')
      return list.gameWithUserDetailsDtos;    
  }

  function getListsForTab(lists, tab) {
    return lists ? lists
      .filter(list => list.listType === tab)
      .map((list) => {
        return {
          id: list.id,
          name: list.name
        };
      }) : [];
  }

  export {tabToApi, tabToListObjects, getListsForTab}