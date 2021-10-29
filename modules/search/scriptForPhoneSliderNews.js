let swipeNewsBody = document.querySelector('.news_for_mobile');
//let swipeNews = document.querySelectorAll('.item');
var initialPoint;
var finalPoint;

let itemsMobileNews = document.querySelectorAll('.item');
let heightMobile = 0;
let maxHeightMobile = 0;

function changeSizeMobile() {
  for (let i = 0; i< itemsMobileNews.length; i++) {
    heightMobile = itemsMobileNews[i].clientHeight;
    if (heightMobile > maxHeightMobile) {
      maxHeightMobile = heightMobile;
    }
  }
  for (let i = 0; i< itemsMobileNews.length; i++) {
    itemsMobileNews[i].style.height = maxHeightMobile +"px";
  }
}

changeSizeMobile();

window.addEventListener('resize', event => {
  heightMobile = 0;
  maxHeightMobile = 0;
  changeSizeMobile();
}, false);

var slideIndex = 1;
showSlides(slideIndex);

function plusSlide() {
    showSlides(slideIndex += 1);
}

function minusSlide() {
    showSlides(slideIndex -= 1);  
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("item");
    var dots = document.getElementsByClassName("slider-dots-mobile_item");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active1", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active1";
}
      /*for(let i = 0; i < swipeNews.length; i++) {
        swipeNews[i].addEventListener('touchstart', function(event) {
          //event.preventDefault();
          event.stopPropagation();
          initialPoint=event.changedTouches[0];
          console.log("aaaa");
        }, 
        {
          passive: true
        });

        swipeNews[i].addEventListener('touchend', function(event) {
          //event.preventDefault();
          event.stopPropagation();
          finalPoint=event.changedTouches[0];
          var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
          var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
          console.log("bbb");
          if (xAbs > 20 || yAbs > 20) {
            if (xAbs > yAbs) {
              if (finalPoint.pageX < initialPoint.pageX){
                plusSlide();
              }
              else{
                minusSlide();
              }
            }
          } 
        }, 
        {
          passive: true
        });
      }*/

swipeNewsBody.addEventListener('touchstart', function(event) {
    event.stopPropagation();
    initialPoint=event.changedTouches[0];
});

swipeNewsBody.addEventListener('touchend', function(event) {
    event.stopPropagation();
    finalPoint=event.changedTouches[0];
    var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
    var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
    if (xAbs > 20 || yAbs > 20) {
        if (xAbs > yAbs) {
            if (finalPoint.pageX < initialPoint.pageX){
              plusSlide();
            }
            else{
              minusSlide();
            }
        }
    } 
});