let loadMoreClickCount = 0

$(".load-more").on("click", function () {
  loadMoreClickCount += 1
  createElement()
    $.ajax({
    type: 'GET',
    url: '/blogs-loop',
    success: function(result) {
         $('#blogs').html(result);
    }
  });
})

const createElement = () => {
  const newBlock = document.createElement("div")
  newBlock.innerHTML = `<div id="blogs" class="blog-grid">""</div>`
  const myElement = document.querySelector(".blog-container")
  myElement.appendChild(newBlock)
}
