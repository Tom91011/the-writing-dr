// code for the testimonial carousel on the homepage

$(".right-arrow").on("click", function () {
    $.ajax({
    type: 'GET',
    url: '/testimonial-carousel',
    success: function(result) {
         $('#champ').html(result);
    }
  });
})

function updateCarousel() {
  $.ajax({
    type: 'GET',
    url: '/testimonial-carousel',
    success: function(result) {
         $('#champ').html(result);
    },
    complete: function(result) {
      setTimeout(updateCarousel,2000)
    }
  });
}

const timeout = setTimeout(updateCarousel(),2000);

$(document).ready(function(){
 timeout
});


// code for the promises carousel on the about-page

$(".right-arrow").on("click", function () {
    $.ajax({
    type: 'GET',
    url: '/carousel',
    success: function(result) {
         $('#champ').html(result);
    }
  });
})

function updatePromisesCarousel() {
  $.ajax({
    type: 'GET',
    url: '/promises-carousel',
    success: function(result) {
         $('#promise').html(result);
    },
    complete: function(result) {
      setTimeout(updatePromisesCarousel,3000)
    }
  });
}

const promisestimeout = setTimeout(updatePromisesCarousel(),3000);

$(document).ready(function(){
 timeout
});

$("#carousel").hover(function(){
  console.log("hovered");
  console.log(timeout);
  clearInterval(timeout)
  console.log(timeout);
})
