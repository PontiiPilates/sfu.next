//fumction: clean select values
$("#clean_btn").click(function () {
    //find select elements
    let sort = document.querySelector("#sort");
    let sections = document.querySelector("#sections");
    let fromThisDate = document.querySelector("#fromThisDate");
    let byThisDate = document.querySelector("#byThisDate");
    let searchInput = document.querySelector("#search");
    // cclean select elements
    sort.value = "desc";
    sections.value = "";
    fromThisDate.value = "";
    byThisDate.value = "";
    // searchInput.value = "";

});
