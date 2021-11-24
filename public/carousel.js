export default function carousel() {
  window.onload = function() {
    const carouselEl = document.getElementById("carousel")
    const nodeList = document.querySelectorAll(".carousel-item")
    const leftArrowEl = document.querySelector(".left-arrow")
    const rightArrowEl = document.querySelector(".right-arrow")
    console.log("I got called from testimonial carousel");
    console.log(nodeList.length);
    let currentTestimonial = 0

    let previousTestimonial = ""

    const displayCarousel = (currentTestimonial, previousTestimonial, array) => {
      array[currentTestimonial].classList.remove("hidden")
      array[previousTestimonial].classList.add("hidden")
      restartAutoScroll()
    }

    const nextSlideLeft = () => {
     if(currentTestimonial === 0) {
       currentTestimonial = nodeList.length-1
       previousTestimonial = 0
     } else {
       previousTestimonial = currentTestimonial
       currentTestimonial -= 1
     }
     displayCarousel(currentTestimonial, previousTestimonial, nodeList)
     pauseScroll()
    }

    const nextSlideRight = () => {

       if(currentTestimonial === nodeList.length-1) {
         currentTestimonial = 0
         previousTestimonial = nodeList.length-1
       } else {
         previousTestimonial = currentTestimonial
         currentTestimonial += 1
       }
         displayCarousel(currentTestimonial, previousTestimonial, nodeList)
    }

    let autoScroll = setInterval(nextSlideRight, 5000)

    const restartAutoScroll = () => {
       clearInterval(autoScroll)
       autoScroll = setInterval(nextSlideRight, 2000)
    }

    const pauseScroll = () => {
       clearInterval(autoScroll)
    }

    leftArrowEl.addEventListener("click", nextSlideLeft)
    rightArrowEl.addEventListener("click", nextSlideRight)
    rightArrowEl.addEventListener("click", pauseScroll) //pauses the carousel until the user leaves the carousel element
    carouselEl.addEventListener("mouseover", pauseScroll)
    carouselEl.addEventListener("mouseleave", restartAutoScroll)

    restartAutoScroll()



  }
}

carousel()
