export default function lastArticleCheck() {

  const loadMoreButton = document.querySelector(".load-more")
  loadMoreButton.addEventListener("click", () => {removeButton()})

  // Checks if any articles that are currently showing on the screen have a class of 1, if they do then the last article has already been requested, in which case the button gets disabled and written over with "That's all the articles for now"
  const removeButton = () => {
    setTimeout( function() {
      console.log(document.getElementsByClassName(1))
      if(document.getElementsByClassName(1).length === 0) {
        console.log(false)
      } else {
        console.log(true)
        loadMoreButton.innerHTML = "That's all the articles for now"
        loadMoreButton.classList.add("no-more-articles")
        loadMoreButton.classList.remove("load-more")
    }},1000)
  }
  removeButton()
}
