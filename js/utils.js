const AVATAR_PATH =
  "https://next.sfu-kras.ru/modules/search/miniatures/avatars/";

export function SuggestFewWords(element, search, fewWords) {
  let len = element.name.indexOf(fewWords);

  switch (element.type) {
    case "page":
      return (
        '<a title="Страница на сайте СФУ" href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest suggest-center">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        element.name.substr(0, len) +
        "<b>" +
        fewWords.substr(0, search.length) +
        "</b>" +
        fewWords.substr(search.length, fewWords.length) +
        "</div>" +
        // + '<div class="suggest-label">'+ clearLink +'</div>'
        "</div>" +
        "</a>"
      );

    case "anteroom":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        element.name.substr(0, len) +
        "<b>" +
        fewWords.substr(0, search.length) +
        "</b>" +
        fewWords.substr(search.length, fewWords.length) +
        "</div>" +
        '<div class="suggest-label">Приёмная</div>' +
        "</div>" +
        "</a>"
      );

    case "news":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">Новость</div>' +
        "</div>" +
        "</a>"
      );

    case "event":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">Событие</div>' +
        "</div>" +
        "</a>"
      );

    case "ad":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">Объявление</div>' +
        "</div>" +
        "</a>"
      );

    case "person":
      element.file_img = element.file_img
        ? element.file_img
        : "/img/person_black_24dp.svg";
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest suggest-person">' +
        '<div class="suggest-avatar" style="background-image: url(' +
        `${AVATAR_PATH}${element.file_img}` +
        ');" src="' +
        `${AVATAR_PATH}${element.file_img}` +
        '"></div>' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        element.name.substr(0, len) +
        "<b>" +
        fewWords.substr(0, search.length) +
        "</b>" +
        fewWords.substr(search.length, fewWords.length) +
        "</div>" +
        '<div class="suggest-label">' +
        element.description +
        "</div>" +
        "</div>" +
        "</a>"
      );

    case "pdf":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/pdf_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        element.name.substr(0, len) +
        "<b>" +
        fewWords.substr(0, search.length) +
        "</b>" +
        fewWords.substr(search.length, fewWords.length) +
        "</div>" +
        '<div class="suggest-label">Открыть документ</div>' +
        "</div>" +
        "</a>"
      );
  }
}
export function SuggestPositionSelected(element, search, fewWords = null) {
  let len = element.description.indexOf(fewWords);
  if (element.type == "person") {
    if (fewWords == null) {
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest suggest-person">' +
        '<div class="suggest-avatar" style="background-image: url(' +
        `${AVATAR_PATH}${element.file_img}` +
        ');" src="' +
        `${AVATAR_PATH}${element.file_img}` +
        '"></div>' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        element.name +
        "</div>" +
        '<div class="suggest-label">' +
        "<b>" +
        element.description.substr(0, search.length) +
        "</b>" +
        element.description.substr(search.length, element.description.length) +
        "</div>" +
        "</div>" +
        "</a>"
      );
    } else {
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest suggest-person">' +
        '<div class="suggest-avatar" style="background-image: url(' +
        `${AVATAR_PATH}${element.file_img}` +
        ');" src="' +
        `${AVATAR_PATH}${element.file_img}` +
        '"></div>' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        element.name +
        "</div>" +
        '<div class="suggest-label">' +
        element.description.substr(0, len) +
        " <b>" +
        fewWords.substr(0, search.length) +
        "</b>" +
        fewWords.substr(search.length, fewWords.length) +
        "</div>" +
        "</div>" +
        "</a>"
      );
    }
  }
}
export function Suggest(element, search, otherWord = null) {
  let clearLink = getClearLink(element);
  let otherWordNumber = getOtherWordNumber(element, otherWord);

  switch (element.type) {
    case "simple":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest suggest-simple">' +
        '<div class="suggest-text-block suggest-simple-text">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        "</div>" +
        "</a>"
      );

    case "anteroom":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">Приёмная</div>' +
        "</div>" +
        "</a>"
      );

    case "news":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">Новость</div>' +
        "</div>" +
        "</a>"
      );

    case "event":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">Событие</div>' +
        "</div>" +
        "</a>"
      );

    case "ad":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">Объявление</div>' +
        "</div>" +
        "</a>"
      );

    case "page":
      return (
        '<a title="Страница на сайте СФУ" href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest suggest-center">' +
        '<img class="suggest-logo" src="img/page_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        // + '<div class="suggest-label">'+ clearLink +'</div>'
        "</div>" +
        "</a>"
      );

    case "service":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="' +
        element.logo +
        '" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">' +
        clearLink +
        "</div>" +
        "</div>" +
        "</a>"
      );

    case "person":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest suggest-person">' +
        '<div class="suggest-avatar" style="background-image: url(' +
        `${AVATAR_PATH}${element.file_img}` +
        ');" src="' +
        `${AVATAR_PATH}${element.file_img}` +
        '"></div>' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">' +
        element.description +
        "</div>" +
        "</div>" +
        "</a>"
      );

    case "document":
    case "pdf":
      return (
        '<a href="' +
        element.link +
        '" target="_blank" rel="noopener noreferrer" class="suggest">' +
        '<img class="suggest-logo" src="img/pdf_suggest.svg" alt="' +
        element.name +
        '">' +
        '<div class="suggest-text-block">' +
        '<div class="suggest-head">' +
        "<b>" +
        element.name.substr(0, search.length) +
        "</b>" +
        element.name.substr(search.length, element.name.length) +
        "</div>" +
        '<div class="suggest-label">Открыть документ</div>' +
        "</div>" +
        "</a>"
      );

    default:
      break;
  }
}
export function clearWord(text) {
  if (!text) {
    return;
  }
  return text
    .replace("ё", "е")
    .replace("«", '"')
    .replace("»", '"')
    .replace("—", "-");
}
function insertLastWords(element, otherWordNumber) {
  if (otherWordNumber + 1 != element.name.split(" ").length)
    return element.name.substr(
      element.name.length -
        element.name.split(" ")[element.name.split(" ").length - 1].length,
      element.name.length
    );
  else return "";
}
function getLengthNotSelected(otherWordNumber, element) {
  let len = 0;
  for (let index = 0; index < otherWordNumber; index++) {
    len = len + element.name.split(" ")[index].length;
    if (index + 1 < otherWordNumber) len = len + 1;
  }
  return len;
}
function getOtherWordNumber(element, otherWord) {
  for (let index = 0; index < element.name.split(" ").length; index++) {
    if (otherWord == element.name.split(" ")[index]) {
      return index;
    }
  }
}
function getClearLink(element) {
  let clearLink = "";
  if (element.link.indexOf("https://") != -1)
    clearLink = element.link.substr("https://".length, element.link.length);
  else if (element.link.indexOf("http://") != -1)
    clearLink = element.link.substr("http://".length, element.link.length);
  else if (element.link.indexOf("www.") != -1)
    clearLink = element.link.substr("www.".length, element.link.length);

  if (clearLink.indexOf("/") == clearLink.length - 1)
    clearLink = clearLink.substr(0, clearLink.length - 1);

  return clearLink;
}
export function toMatchCase(elem, search) {
  let word = elem.name.split("");
  let cases = search.split("").map((element) => {
    if (element.toUpperCase() == element && element != " ") return true;
    else if (element.toLowerCase() == element && element != " ") return false;
  });
  elem.name.split("").map((element, index) => {
    cases.map((e, i) => {
      if (i == index) {
        if (e) word[index] = word[index].toUpperCase();
        else word[index] = word[index].toLowerCase();
      }
    });
  });
  return word.join("");
}
