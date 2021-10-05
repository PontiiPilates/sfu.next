let requestURL = 'https://next.sfu-kras.ru/modules/search/data_getter.php?search=';
let request = new XMLHttpRequest();
let find_text = document.querySelector(".find_text");
let find_results = document.querySelector(".find_results");
let json;

find_text.oninput = function(){
    let val = this.value.trim();
    get_json_url = requestURL + val;
    request.open('GET', get_json_url);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        json = request.response;
        let delete_results = document.querySelectorAll(".result");
        for (var i = 0, len = delete_results.length; i < len; i++) {
            delete_results[i].parentNode.removeChild(delete_results[i]);
        }

        let key_type;
        let key_position;
        let key_avatar;
        let key_name;
        let key_source;
        if (json !=  null) {

            if (json.length == 0) {
                let result = document.createElement("div");
                result.className = "result";
                let result_nothing = document.createElement("p");
                result_nothing.className = "result_nothing";

                result_nothing.innerHTML = "По вашему запросу ничего не найдено...";

                result.appendChild(result_nothing);

                find_results.appendChild(result);
            }

            json.forEach(function(item){
                key_type = item.type;
                key_position = item.description;
                if (item.filename_img == "") {
                    if (item.source == "about") {
                        key_avatar = "modules/search/miniatures/others/about.png"
                    }
                    else if (item.source == "admissions") {
                        key_avatar = "modules/search/miniatures/others/admissions.png"
                    }
                    else if (item.source == "edu") {
                        key_avatar = "modules/search/miniatures/others/edu.png"
                    }
                    else if (item.source == "general") {
                        key_avatar = "modules/search/miniatures/others/general.png"
                    }
                    else if (item.source == "international") {
                        key_avatar = "modules/search/miniatures/others/international.png"
                    }
                    else if (item.source == "my") {
                        key_avatar = "modules/search/miniatures/others/my.png"
                    }
                    else if (item.source == "news") {
                        key_avatar = "modules/search/miniatures/others/news.png"
                    }
                    else if (item.source == "research") {
                        key_avatar = "modules/search/miniatures/others/research.png"
                    }
                    else if (item.source == "sport") {
                        key_avatar = "modules/search/miniatures/others/sport.png"
                    }
                    else if (item.source == "structure") {
                        key_avatar = "modules/search/miniatures/others/structure.png"
                    }
                }
                else {
                    key_avatar = "modules/search/miniatures/avatars/" + item.filename_img;
                }
                key_name = item.name;

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

                find_results.appendChild(result);

                let str = find_name.innerText;
                if (key_name.search(RegExp(val,"gi")) != -1) {
                    find_name.innerHTML = insertMark(str, str.search(RegExp(val,"gi")), val.length);
                } 
            });
        }

        let mouse_actions = document.querySelectorAll(".result");
        let mouse_action_link = document.querySelectorAll(".find_name");
        for (var i = 0, len = mouse_actions.length; i < len; i++) {
            mouse_actions[i].addEventListener('mouseenter', function () {
                this.style.background = '#E6E6E6';
            });
            mouse_actions[i].addEventListener('mouseleave', function () {
                this.style.background = '';
            });
            mouse_actions[i].addEventListener('click', function () {
                let str = this.innerText;
                let name_for_sort = str.split("\n\n");
                let link;
                json.forEach(function(item){
                    if (item.name == name_for_sort[0]) {
                        link = item.link
                        document.location.href = link;
                    } 
                });
            });  
        }
    }
}


let count = -1;
find_text.addEventListener ('keydown', function (event){
    if (event.key == "Enter"){
        let button_actions = document.querySelectorAll(".result");
        let str;
        let name_for_sort;
        if (count >= 0) {
            str = button_actions[count].innerText;
            name_for_sort = str.split("\n\n");
        }
        json.forEach(function(item){
            if (item.name == name_for_sort[0]) {
                links = item.link
                document.location.href = links;
            }
        });
    }
    if (event.key == "ArrowDown") {
        let button_actions = document.querySelectorAll(".result");
        let tmp = button_actions.length;
        count = findListDown(tmp, count, button_actions, find_text);
        let str = button_actions[count].innerText;
        let name_for_sort = str.split("\n\n");
        find_text.value = name_for_sort[0];
    }
    if (event.key == "ArrowUp") {
        let button_actions = document.querySelectorAll(".result");
        let tmp = button_actions.length;
        count = findListUp(tmp, count, button_actions, find_text);
        let str = button_actions[count].innerText;
        let name_for_sort = str.split("\n\n");
        find_text.value = name_for_sort[0];
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