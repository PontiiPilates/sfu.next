let windowInnerHeight = document.documentElement.clientHeight;
let pageHeight = document.documentElement.scrollHeight;
let footer = document.querySelector(".footer");


if (pageHeight > windowInnerHeight) {
    footer.classList.remove('fixed-bottom');
} else {
    footer.classList.add('fixed-bottom');
}

$(window).resize(function () {
    windowInnerHeight = document.documentElement.clientHeight;
    pageHeight = document.documentElement.scrollHeight;

    if (pageHeight > windowInnerHeight) {
        footer.classList.remove('fixed-bottom');
    } else {
        footer.classList.add('fixed-bottom');
    }
});