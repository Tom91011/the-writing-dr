function getStartingPostion(
    foundItems, 
    loadMoreClickCount, 
    articlesToShow
  )  {
    console.log("in getStartingPosition");
      let startingArticleArrayPostion = foundItems.length - (loadMoreClickCount * articlesToShow) - 1

      return startingArticleArrayPostion
}

module.exports = { 
  getStartingPostion
}



  