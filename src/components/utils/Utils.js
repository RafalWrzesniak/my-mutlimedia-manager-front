import moment from 'moment';

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
          name: list.name,
          items: list.items.length,
          allItems: list.items,
          listType: list.listType,
          allContentList: list.allContentList
        };
      }) : [];
  }

  function formatDate(date) {
    return moment(date).format('DD.MM.YYYY');
  }  
  
  function formatTime(time) {
    if(time < 60) {
      return `${time}min`
    }
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
  
    return `${hours}h ${minutes}min`;
  }

  function listToString(list) {
    let string = '';
    for (let i = 0; i < list.length; i++) {
      if (i > 0) {
        string += ', ';
      }
      string += list[i];
    }
    return string;
  }

  function isBook(item) {
    return item.id.includes('lubimyczytac') || item.lubimyCzytacUrl || item.numberOfPages;
  }

  function isGame(item) {
    return item.id.includes('gry-online') || item.gryOnlineUrl || item.studio;
  }

  function isMovie(item) {
    return item.id.includes('filmweb') || item.filmwebUrl || item.plotLocal;
  }

  function getFinishedOn(item) {
    return item.readOn ? item.readOn : item.watchedOn ? item.watchedOn : item.finishedOn;
  }

  function itemToApi(item) {
    if(isBook(item)) {
      return 'book';
    } 
    if(isMovie(item)) {
      return 'movie';
    }
    if(isGame(item)) {
      return 'game';
    }
    return '';
  }

  function isEncoded(text) {
    try {
      return decodeURIComponent(text) !== text;
    } catch (e) {
      return true;
    }
  }

  function decodeItem(item) {
     if(isEncoded(item.title)) {
       item.title = decodeURIComponent(item.title)
     }
     return item;
   }

  function encodeItem(item) {
     if(!isEncoded(item.title)) {
       item.title = encodeURIComponent(item.title)
     }
     return item;
   }

  export { tabToApi, tabToListObjects, getListsForTab, formatDate, formatTime, listToString,
     isBook, isGame, getFinishedOn, itemToApi, isMovie, isEncoded, encodeItem, decodeItem}