let loadMoreClickCount = 0

const loadMoreButton = document.querySelector(".load-more")
loadMoreButton.addEventListener("click", () => {
})

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

const createElement = () => {
  const newBlock = document.createElement("div")
  newBlock.innerHTML = `<div id=blogs-${loadMoreClickCount} class="blog-grid"><%- include("blogs-loop")-%></div>`
  const myElement = document.querySelector(".blogs-container-inner")
  myElement.appendChild(newBlock)
}
