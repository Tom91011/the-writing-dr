export default function lastBlogCheck() {


  const loadMoreButton = document.querySelector(".load-more")
  loadMoreButton.addEventListener("click", () => {removeButton()})

  // Checks if any blogs that are currently showing on the screen have a class of 1, if they do then the last blog has already been requested, in which case the button gets disabled and written over with "That's all the blogs for now"
  const removeButton = () => {
    setTimeout( function() {
      console.log(document.getElementsByClassName(1))
      if(document.getElementsByClassName(1).length === 0) {
        console.log(false)
      } else {
        console.log(true)
        loadMoreButton.innerHTML = "That's all the blogs for now"
    }},1000)
  }
  removeButton()
}
