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

  // Creates a new element for the next set of articles
  const createElement = () => {
    const gridContainer = document.querySelector(".articles-container-inner")
    const newBlock = document.createElement("div")   
    
    gridContainer.appendChild(newBlock)
    
    newBlock.innerHTML = `<div id=articles-${loadMoreClickCount} class="article-row-inner"><%- include("articles-loop")-%></div>`
    newBlock.classList.add("article-row")
   }
}
