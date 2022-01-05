export default function loadMore() {
  let loadMoreClickCount = 0
  console.log(loadMoreClickCount);
  const loadMoreButton = document.querySelector(".load-more")


  $(".load-more").on("click", function () {
    loadMoreClickCount += 1
    createElement()
      $.ajax({
      type: 'GET',
      url: '/articles-loop',
      data: {
        clicks: loadMoreClickCount
      },
      success: function(result) {
           $(`#articles-${loadMoreClickCount}`).html(result);
      }
    });
  })

  loadMoreButton.addEventListener("click", () => {
    loadMoreButton.classList.add(loadMoreClickCount + 2)
    console.log(loadMoreClickCount);
  })

  // Creates a new element for the next set of articles
  const createElement = () => {
    const newBlock = document.createElement("div")
    newBlock.innerHTML = `<div id=articles-${loadMoreClickCount} class="article-grid"><%- include("articles-loop")-%></div>`
    const myElement = document.querySelector(".articles-container-inner")
    myElement.appendChild(newBlock)
  }
}
