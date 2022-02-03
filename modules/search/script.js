let requestURL = 'https://next.sfu-kras.ru/modules/search/data_getter.php?search=';
let request = new XMLHttpRequest();
let find_text = document.querySelector(".find_text");
let find_results = document.querySelector(".find_results");
let json;

let contFind = document.querySelector(".text-area");


function doBold(val, key_name, find_name) {
    let tmp = val.split(" ");
    let poisk = find_name.innerText;

    for (var i = 0, len = tmp.length; i < len; i++){
        if (key_name.search(RegExp(tmp[i],"gi")) != -1) {
            poisk = insertMark(poisk, poisk.search(RegExp(tmp[i],"gi")), tmp[i].length);
        }
    }
    find_name.innerHTML = poisk;
}

function deleteList() {
    let delete_results = document.querySelectorAll(".result");
    for (var i = 0, len = delete_results.length; i < len; i++) {
        delete_results[i].parentNode.removeChild(delete_results[i]);
    }
}

function mouseAction(val, key_name) {
    let mouse_actions = document.querySelectorAll(".result");
    for (var i = 0, len = mouse_actions.length; i < len; i++) {
        mouse_actions[i].addEventListener('mouseenter', function () {
            this.style.background = '#E6E6E6';
        });
        mouse_actions[i].addEventListener('mouseleave', function () {
            this.style.background = '';
        });
        mouse_actions[i].addEventListener('mousedown', function () {
            let str = this.getAttribute("link");
            //new///
            get_json_url = requestURL + this.getAttribute("title");
            request.open('GET', get_json_url);
            request.responseType = 'json';
            request.send();
            ////
            window.open(str, '_blank');

            return false;
        }); 
    }
}

function nothingFind() {
    let result = document.createElement("div");
    result.className = "result";
    let result_nothing = document.createElement("p");
    result_nothing.className = "result_nothing";

    result_nothing.innerHTML = "По вашему запросу ничего не найдено...";

    result.appendChild(result_nothing);

    find_results.appendChild(result);
}

function drowFindListWithoutDateAndSource(key_name, key_position, key_avatar, key_link) {
    let result = document.createElement("div");
    result.className = "result";
    let find_name = document.createElement("p");
    find_name.className = "find_name";
    let find_type = document.createElement("p");
    find_type.className = "find_type";
    let find_img = document.createElement("div");
    find_img.className = "find_img";

    find_name.innerHTML = key_name;
    find_type.innerHTML = key_position;
    find_img.style.backgroundImage = "url(" + key_avatar + ")";

    result.appendChild(find_img);
    result.appendChild(find_name);
    result.appendChild(find_type);

    result.setAttribute("link", key_link);

    find_results.appendChild(result);
    result.setAttribute("title", key_name);

    return find_name;
}

function drowFindListWithDateAndSource(key_name, date, item, key_source, key_avatar, key_link) {
    let result = document.createElement("div");
    result.className = "result";
    let find_name = document.createElement("p");
    find_name.className = "find_name";
    let find_data = document.createElement("p");
    find_data.className = "find_data";
    let find_link = document.createElement("p");
    find_link.className = "find_link";
    let find_img = document.createElement("div");
    find_img.className = "find_img";

    find_name.innerHTML = key_name;
    find_data.innerHTML = date;
    if (item.source == "about") {
        key_source = ": about.sfu-kras.ru";
    }
    else if (item.source == "admissions") {
        key_source = ": admissions.sfu-kras.ru";
    }
    else if (item.source == "edu") {
        key_source = ": edu.sfu-kras.ru";
    }
    else if (item.source == "general") {
        key_source = ": general.sfu-kras.ru";
    }
    else if (item.source == "international") {
        key_source = ": international.sfu-kras.ru";
    }
    else if (item.source == "my") {
        key_source = ": my.sfu-kras.ru";
    }
    else if (item.source == "news") {
        key_source = ": news.sfu-kras.ru";
    }
    else if (item.source == "research") {
        key_source = ": research.sfu-kras.ru";
    }
    else if (item.source == "sport") {
        key_source = ": sport.sfu-kras.ru";
    }
    else if (item.source == "structure") {
        key_source = ": structure.sfu-kras.ru";
    }
    find_link.innerHTML = key_source;
    find_img.style.backgroundImage = "url(" + key_avatar + ")";

    result.appendChild(find_img);
    result.appendChild(find_name);
    result.appendChild(find_data);
    result.appendChild(find_link);

    result.setAttribute("link", key_link);
    result.setAttribute("title", key_name);

    find_results.appendChild(result);

    return find_name;
}

function findTrueImage(item, key_avatar) {
    if (item.filename_img == "") {
        /*let tmp;
        if (item.source == "about") {
            tmp = 'modules/search/miniatures/others/about.png';
        }
        else if (item.source == "admissions") {
            tmp = "modules/search/miniatures/others/admissions.png"
        }
        else if (item.source == "edu") {
            tmp = "modules/search/miniatures/others/edu.png"
        }
        else if (item.source == "general") {
            tmp = "modules/search/miniatures/others/general.png"
        }
        else if (item.source == "international") {
            tmp = "modules/search/miniatures/others/international.png"
        }
        else if (item.source == "my") {
            tmp = "modules/search/miniatures/others/my.png"
        }
        else if (item.source == "news") {
            tmp = "modules/search/miniatures/others/news.png"
        }
        else if (item.source == "research") {
            tmp = "modules/search/miniatures/others/research.png"
        }
        else if (item.source == "sport") {
            tmp = "modules/search/miniatures/others/sport.png"
        }
        else if (item.source == "structure") {
            tmp = "modules/search/miniatures/others/structure.png"
        }

        key_avatar = tmp;
        /*var img = new Image();
        img.src = "'" + tmp + "'";
        if (img.complete == false) {
            key_avatar = "modules/search/miniatures/others/molecule.png";
        } else {
            key_avatar = tmp;
        }*/
        /*if (key_avatar = "") {
            key_avatar = "modules/search/miniatures/others/molecule.png"
        }*/

        key_avatar = "modules/search/miniatures/others/molecule.png";
        
    }
    else {
        key_avatar = "modules/search/miniatures/avatars/" + item.filename_img;
    }

    return key_avatar;
}

function showList(val, requestURL, request, json) {
    get_json_url = requestURL + val;
    request.open('GET', get_json_url);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        json = request.response;

        let key_type;
        let key_position;
        let key_avatar;
        let key_name;
        let key_source;
        let key_date;
        //new
        let key_link;
        if (json !=  null) {
            if (json.length == 0) {
                nothingFind();
            }
    
            json.forEach(function(item){
                key_type = item.type;
                key_position = item.description;
                key_avatar = findTrueImage(item, key_avatar);
                key_name = item.name;
                //new
                key_link = item.link;
                key_date =  item.created_source * 1000;
                let date = new Date();
                date.setTime(key_date);
                //date = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
                date = date.getFullYear() + '.' + ('0' + (date.getMonth() + 1)).slice(-2) +  '.' + ('0' + date.getDate()).slice(-2);

                if (key_type == "person" || key_type == "department") {
                    let find_name = drowFindListWithoutDateAndSource(key_name, key_position, key_avatar, key_link);
                    doBold(val, key_name, find_name);
                }else {
                    let find_name = drowFindListWithDateAndSource(key_name, date, item, key_source, key_avatar, key_link);
                    doBold(val, key_name, find_name);
                }
            });
        }
        mouseAction(val, key_name);
    }
}

//delete button
let delete_button = document.querySelector(".delete_button");

delete_button.style.display = "none";

delete_button.addEventListener('click', function () {
    find_text.value = "";
    delete_button.style.display = "none";
    deleteList();
});


// punkt 3
find_text.onblur= function(){
    deleteList();
}

find_text.onfocus = function(){
    let val = this.value.trim();
    showList(val, requestURL, request, json);
}

//

let count = -1;

find_text.oninput = function(){
    count = -1;
    let val = this.value.trim();
    get_json_url = requestURL + val;
    request.open('GET', get_json_url);
    request.responseType = 'json';
    request.send();

    //delete button
    delete_button.style.display = "block";
    //

    request.onload = function() {

        json = request.response;
        deleteList();

        let key_type;
        let key_position;
        let key_avatar;
        let key_name;
        let key_source;
        let key_date;
        //new
        let key_link;
        if (json !=  null) {

            if (json.length == 0) {
                nothingFind();
            }
            
            json.forEach(function(item){
                key_type = item.type;
                key_position = item.description;
                key_avatar = findTrueImage(item, key_avatar);
                key_name = item.name;
                key_date =  item.created_source * 1000;
                //new
                key_link = item.link;
                let date = new Date();
                date.setTime(key_date);
                //date = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
                date = date.getFullYear() + '.' + ('0' + (date.getMonth() + 1)).slice(-2) +  '.' + ('0' + date.getDate()).slice(-2);

                if (key_type == "person" || key_type == "department") {
                    let find_name = drowFindListWithoutDateAndSource(key_name, key_position, key_avatar, key_link);
                    doBold(val, key_name, find_name);
                    
                }else {
                    let find_name = drowFindListWithDateAndSource(key_name, date, item, key_source, key_avatar, key_link);
                    doBold(val, key_name, find_name);

                }
            });
        }

        mouseAction(val, key_name);

    }
}



find_text.addEventListener ('keydown', function (event){
    if (event.key == "Enter"){
        let button_actions = document.querySelectorAll(".result");
        let str;
        if (count >= 0) {
            str = button_actions[count].getAttribute("link");
            //new///
            get_json_url = requestURL + button_actions[count].getAttribute("title");
            request.open('GET', get_json_url);
            request.responseType = 'json';
            request.send();
            ////
        }
        window.open(str, '_blank');
        //new///
        find_text.blur();
        deleteList();
        ////
    }
    if (event.key == "ArrowDown") {
        let button_actions = document.querySelectorAll(".result");
        let tmp = button_actions.length;
        count = findListDown(tmp, count, button_actions, find_text);
        if (count >= 0) {
            str = button_actions[count].getAttribute("title");
        }
        find_text.value = str;
    }
    if (event.key == "ArrowUp") {
        let button_actions = document.querySelectorAll(".result");
        let tmp = button_actions.length;
        count = findListUp(tmp, count, button_actions, find_text);
        if (count >= 0) {
            str = button_actions[count].getAttribute("title");
        }
        find_text.value = str;
    }  
});

function findListUp(tmp, count1, list, input) {
    if (count1 >= 1 & count1 < tmp) {
        count1 --;
        list[count1].style.background = "#E6E6E6"
        list[count1 + 1].style.background = ""
    }
    else if (count1 == 0) {
        count1 = tmp-1;
        list[count1].style.background = "#E6E6E6"
        list[0].style.background = ""
    }
    else {
        count1 = tmp-1;
        list[count1].style.background = "#E6E6E6"
        list[0].style.background = ""
    }
    return count1;
}

function findListDown(tmp, count1, list) {
    if(count1 == -1){
        count1++;
        list[count1].style.background = "#E6E6E6"
    }
    else if (count1 >= 0 & count1 < tmp - 1) {
        count1++;
        list[count1 - 1].style.background = ""
        list[count1].style.background = "#E6E6E6"
    }
    else {
        list[0].style.background = "#E6E6E6"
        list[tmp-1].style.background = ""
        count1 = 0;
    }
    return count1;
}

function insertMark(string,pos,len) {
    return string.slice(0, pos)+'<b>'+string.slice(pos, pos + len)+'</b>'+string.slice(pos+len);
}

//--------------------------script for news----------------------------------------//
function ChangeOver(x) {
    let news = document.querySelectorAll(".for_brightness");
    for (let i = 0; i < news.length; i++) {
        if (x != news[i]) {
            news[i].style.filter = "brightness(50%)";
        }
    }
};
    
function ChangeOut(x) { 
    let news = document.querySelectorAll(".for_brightness");
    for (let i = 0; i < news.length; i++) {
        if (x != news[i]) {
            news[i].style.filter = "brightness(100%)";
        }
    }  
}

function LeftButtonOver(x) {
    x.style.transform = "scale(1.1)";
}

function LeftButtonOut(x) {
    x.style.transform = "scale(1)";
}

function RightButtonOver(x) {
    x.style.transform = "scale(1.1)";
}

function RightButtonOut(x) {
    x.style.transform = "scale(1)";
}