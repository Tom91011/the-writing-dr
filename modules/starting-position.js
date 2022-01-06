function getStartingPostion(
    foundItems, 
    loadMoreClickCount, 
    articlesToShow
  )  {
      let startingArticleArrayPostion = foundItems.length - (loadMoreClickCount * articlesToShow) - 1

      return startingArticleArrayPostion
}

module.exports = { 
  getStartingPostion
}



  