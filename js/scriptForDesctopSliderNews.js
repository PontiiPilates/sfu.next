var wrapper = document.querySelector("#wrapper");
let itemLinksLeft = document.querySelector(".itemLinksLeft");
let itemLinksRight = document.querySelector(".itemLinksRight");
let contentContainer = document.querySelector("#contentContainer");

let news_slider = document.querySelector(".news_slider");
let contentsNews = document.querySelectorAll('.content');

let contents = document.querySelectorAll(".content");
let window_size = window.innerWidth;
let end = countMove(contents.length);
let start = 0;
var activeLink = 0;
let position = 0;

let height = 0;
let maxHeight = 0;

for (let i = 0; i< contentsNews.length; i++) {
    height = contentsNews[i].offsetHeight;
    if (height > maxHeight) {
        maxHeight = height;
    }
}

maxHeight = maxHeight + 8;
for (let i = 0; i< contentsNews.length; i++) {
    contentsNews[i].style.height = maxHeight +"px";
}

news_slider.style.height = (maxHeight + 20) +"px";

window.addEventListener('resize', event => {
    window_size = window.innerWidth;
    wrapper.style.left = "0px";
    end = countMove(contents.length);
    start = 0;
    position = 0;
    if (window_size > 1000) {
        if (contents.length == 3) {
            itemLinksRight.style.display = "none";
            itemLinksLeft.style.display = "none";
        } else {
            itemLinksRight.style.display = "block";
            itemLinksLeft.style.display = "none";
        }
    } else {
        slideIndex = 1;
        showSlides(slideIndex);
    }

    maxHeight = 0;

    for (let i = 0; i< contentsNews.length; i++) {
        contentsNews[i].style.height = "auto";
    }

    for (let i = 0; i< contentsNews.length; i++) {
        height = contentsNews[i].offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    }
    
    maxHeight = maxHeight + 8;
    for (let i = 0; i< contentsNews.length; i++) {
        contentsNews[i].style.height = maxHeight +"px";
    }
    news_slider.style.height = (maxHeight + 20) +"px";
}, false);

function countMove(x) {
    let unvisibleBox;
    if (window_size > 1000) {
        unvisibleBox = x - 3;
    } else {
        unvisibleBox = x - 1;
    }
    let end;
    if (window_size > 1200) {
        contentContainer.style.width = 1128 + "px";
        news_slider.style.width = 1160 + "px";
        for (let i = 0; i< contentsNews.length; i++) {
            contentsNews[i].style.width = 360 + "px";
        }
        end = unvisibleBox * (-376);
    } else if (window_size > 1000) {
        contentContainer.style.width = 948 + "px";
        news_slider.style.width = 984 + "px";
        for (let i = 0; i< contentsNews.length; i++) {
            contentsNews[i].style.width = 300 + "px";
        }
        end = unvisibleBox * (-316);
    } else if (window_size > 770){
        contentContainer.style.width = 440 + "px";
        news_slider.style.width = 440 + "px";
        for (let i = 0; i< contentsNews.length; i++) {
            contentsNews[i].style.width = 440 + "px";
        }
        end = unvisibleBox * (-440);
    } else {
        let theSameSize = document.querySelector(".search_area");
        let size = theSameSize.offsetWidth;
        contentContainer.style.width = size + "px";
        news_slider.style.width = size + "px";
        for (let i = 0; i< contentsNews.length; i++) {
            contentsNews[i].style.width = size + "px";
        }
        end = unvisibleBox * (-(size));
    }
        
    return end;
}

if (contents.length == 3) {
    itemLinksRight.style.display = "none";
    itemLinksLeft.style.display = "none";
} else {
    itemLinksRight.style.display = "block";
    itemLinksLeft.style.display = "none";
}

itemLinksLeft.addEventListener('click', changePositionLeft, false);
itemLinksRight.addEventListener('click', changePositionRight, false);

function changePositionRight() {
    if (window_size > 1200) {
        position = position - 376;
    } else if (window_size > 1000){
        position = position - 316;
    } else if(window_size > 770) {
        position = position - 440;
    } else {
        let theSameSize = document.querySelector(".search_area");
        let size = theSameSize.offsetWidth;
        position = position - size;
    }
    let move = position + "px";
    wrapper.style.left = move;
    if(window_size > 1000) {
        if (position == end) {
            itemLinksRight.style.display = "none";
            itemLinksLeft.style.display = "block";
        } else {
            itemLinksRight.style.display = "block";
            itemLinksLeft.style.display = "block";
        }
    }
}

function changePositionLeft() {
    if (window_size > 1200) {
        position = position + 376;
    } else if (window_size > 1000 && window_size < 1200) {
        position = position + 316;
    } else if(window_size > 770 && window_size < 1000) {
        position = position + 440;
    } else {
        let theSameSize = document.querySelector(".search_area");
        let size = theSameSize.offsetWidth;
        position = position + size;
    }
    let move = position + "px";
    wrapper.style.left = move;
    if(window_size > 1000) {
        if (position == start) {
            itemLinksRight.style.display = "block";
            itemLinksLeft.style.display = "none";
        } else {
            itemLinksRight.style.display = "block";
            itemLinksLeft.style.display = "block";
        }
    }
}

news_slider.addEventListener('touchstart', function(event) {
    event.stopPropagation();
    initialPoint=event.changedTouches[0];
});

let peremeshenie;
let touchLang = 0;
let miniPos = 0;

news_slider.addEventListener('touchmove', function(event) {
    peremeshenie = event.changedTouches[0];
    wrapper.style.transition = "left";
    touchLang = initialPoint.pageX - peremeshenie.pageX;
    miniPos = position - touchLang;
    if(miniPos > end && miniPos < start) {
        let move = miniPos + "px";
        wrapper.style.left = move;
    }
});

news_slider.addEventListener('touchend', function(event) {
    event.stopPropagation();
    finalPoint=event.changedTouches[0];
    wrapper.style.transition = "left .5s ease-in-out";
    var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
    var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
    if (xAbs > 20 || yAbs > 20) {
        if (xAbs > yAbs) {
            if (Math.abs(touchLang) < 50) {
                let move = position + "px";
                wrapper.style.left = move;
            } else {
                if (finalPoint.pageX < initialPoint.pageX){
                    if (position != end) {
                        changePositionRight(); 
                        showSlides(slideIndex += 1); 
                    }
                }
                else{
                    if (position != start){
                        changePositionLeft();
                        showSlides(slideIndex -= 1);
                    };
                }
            }   
        }
    } 
});

var slideIndex = 1;
showSlides(slideIndex);

/*function currentSlide(n) {
    showSlides(slideIndex = n);
}*/

function showSlides(n) {
    var i;
    //var slides = document.getElementsByClassName("item");
    var dots = document.getElementsByClassName("slider-dots_item");
    if (n > contents.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = contents.length
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active1", "");
    }
    //slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active1";
}