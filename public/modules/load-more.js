export default function loadMore() {
  let loadMoreClickCount = 0
  console.log(loadMoreClickCount);
  const loadMoreButton = document.querySelector(".load-more")


  $(".load-more").on("click", function () {
    loadMoreClickCount += 1
    createElement()
      $.ajax({
      type: 'GET',
      url: '/blogs-loop',
      data: {
        clicks: loadMoreClickCount
      },
      success: function(result) {
           $(`#blogs-${loadMoreClickCount}`).html(result);
      }
    });
  })

  loadMoreButton.addEventListener("click", () => {
    loadMoreButton.classList.add(loadMoreClickCount + 2)
    console.log(loadMoreClickCount);
  })

  // Creates a new element for the next set of blogs
  const createElement = () => {
    const newBlock = document.createElement("div")
    newBlock.innerHTML = `<div id=blogs-${loadMoreClickCount} class="blog-grid"><%- include("blogs-loop")-%></div>`
    const myElement = document.querySelector(".blogs-container-inner")
    myElement.appendChild(newBlock)
  }
}
