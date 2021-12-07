let loadMoreClickCount = 0

const loadMoreButton = document.querySelector(".load-more")
loadMoreButton.addEventListener("click", () => {lastBlogCheck()})

$(".load-more").on("click", function () {
  loadMoreClickCount += 1
  createElement()
    $.ajax({
    type: 'GET',
    url: '/blogs-loop',
    success: function(result) {
         $(`#blogs-${loadMoreClickCount}`).html(result);
    }
  });
})

// Creates a new element for the next set of blogs
const createElement = () => {
  const newBlock = document.createElement("div")
  newBlock.innerHTML = `<div id=blogs-${loadMoreClickCount} class="blog-grid"><%- include("blogs-loop")-%></div>`
  const myElement = document.querySelector(".blogs-container-inner")
  myElement.appendChild(newBlock)
}

// Checks if any blogs that are currently showing on the screen have a class of 1, if they do then the last blog has already been requested, in which case the button gets disabled and written over with "Thats all the blogs for now"
const lastBlogCheck = () => {
  setTimeout( function() {
    console.log(document.getElementsByClassName(1))
    if(document.getElementsByClassName(1).length === 0) {
      console.log(false)
    } else {
      console.log(true)
      loadMoreButton.innerHTML = "Thats all the blogs for now"
  }},1000)
}
lastBlogCheck()
