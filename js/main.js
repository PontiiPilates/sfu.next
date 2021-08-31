import {
  Suggest,
  SuggestFewWords,
  SuggestPositionSelected,
  toMatchCase,
  clearWord,
} from "./utils.js";

$(document).ready(function () {
  let placeholder = "";
  let isPlaceholderMode = false;
  let position = -1;
  let suggestsExist = false;
  let hashSuggests = [];
  const suggestionMargin = 8;
  const selectedSuggest = "selectedSuggest";

  // Меню
  $(".top-nav__list_li").click(function () {
    let id = $(this).children(".top-nav__list-li_mobile").attr("data-menuid");
    $(".top-nav__dropdown_mobile_visible").each(function () {
      // $('.top-nav__dropdown_mobile_visible').removeClass('top-nav__dropdown_mobile_visible');
      let opened = $(".top-nav__dropdown_mobile_visible");
      if (opened.attr("data-menuid") == id) {
        // $('body').removeClass('bodyNoScroll');
        return;
      } else {
        opened.removeClass("top-nav__dropdown_mobile_visible");
      }
    });
    $(
      ".top-nav__dropdown.top-nav__dropdown_mobile[data-menuid=" + id + "]"
    ).toggleClass("top-nav__dropdown_mobile_visible");
    // $('body').addClass('bodyNoScroll');
  });
  $(".top-nav__dropdown_mobile-close-btn").click(function () {
    $(this).parent().parent().removeClass("top-nav__dropdown_mobile_visible");
    // $('body').removeClass('bodyNoScroll');
  });

  // Поиск
  $(".search-placeholder").click(function () {
    $(".search").focus();
  });
  $(".search").click(function () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      let pos = $(this).offset().top;
      $(document).scrollTop(pos - 18);
    }
  });
  $(document).click(function (event) {
    if ($(event.target).closest(".search-suggestions").length) return;
    if ($(event.target).closest(".search").length) return;
    HideSuggestion();
    event.stopPropagation();
  });

  function isSuggestionVisible() {
    const suggestion = $(".search-suggestions");
    return (
      suggestion.children().length > 0 &&
      !suggestion.hasClass("search-suggestions_visible")
    );
  }

  let lastKeyDownTime;
  let fetching = false;

  $("#searchInput").on("keyup", function (event) {
    // searchAutoComplete(this, event, $(this));
  });

  const searchDebounced = _.debounce(function (event) {
    searchAutoComplete(this, event, $(".search-block"));
  }, 200);

  $(".search").on("keyup", searchDebounced);

  $(".search").on("keydown", function (event) {
    upDownArrowsHandler(event);
  });
  $(".search").focus(function () {
    if (isSuggestionVisible()) {
      const input = $(this);
      const parentWidth = $(".search-block").width();
      const suggestion = $(".search-suggestions");
      showSuggestion(
        input.offset().top,
        input.offset().left,
        input.height(),
        parentWidth
      ).then(() => {
        setTimeout(() => {
          suggestion.addClass("search-suggestions_visible");
        }, 25);
      });
    }
  });

  function refreshSelectedSuggestPosition() {
    position = -1;
  }

  // Выбор стрелочками/отмена Esc/переход по Enter
  function upDownArrowsHandler(event) {
    const key = event.key;
    const suggestion = $(".search-suggestions");
    const suggests = suggestion.children();

    if (!suggestion.hasClass("search-suggestions_visible")) {
      return;
    }

    if (key === "Enter") {
      const s = $(".selectedSuggest");
      if (s.length) {
        window.location = s.attr("href");
      }
    }

    if (key === "ArrowDown" || key === "Tab" || event.key === "ArrowRight") {
      if (key === "Tab") {
        event.preventDefault();
      }
      if (position !== suggests.length - 1) {
        position = position + 1;
      } else {
        position = 0;
      }
      $(".selectedSuggest").removeClass("selectedSuggest");
      $(suggests[position]).addClass("selectedSuggest");
      const selectedValue = $(suggests[position]).find(".suggest-head").text();
      setPlaceHolderSimply("");
      $(".search").val(selectedValue);
    } else if (key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      if (position !== -1) {
        position = position - 1;
      } else {
        position = suggests.length - 1;
      }
      $(".selectedSuggest").removeClass("selectedSuggest");
      $(suggests[position]).addClass("selectedSuggest");
      const selectedValue = $(suggests[position]).find(".suggest-head").text();
      setPlaceHolderSimply("");
      $(".search").val(selectedValue);
    } else if (key === "Escape") {
      HideSuggestion();
    } else {
      return;
    }
  }

  /**
   * Обработчик ввода в поле поиска. Только для события KeyUp.
   *
   * @param {HTMLBaseElement} context Контекст элемента, ставить всегда this
   * @param {event} event Само событие, ставить всегда event
   * @param {HTMLBaseElement} parent Родительский элемент, нужно для определения ширины подсказок
   * @param {string} api Ссылка для запросов
   */
  function searchAutoComplete(
    context = this,
    event,
    parent,
    api = ["suggests.json"]
  ) {
    let borderWidth = 0,
      parentWidth = 0;

    const input = $(context);
    const placeholderElement = $(".search-placeholder");

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "Enter" ||
      event.key === "Tab" ||
      event.key === "Escape"
    ) {
      return;
    }

    if (typeof api !== "Array" && typeof api !== "object") {
      throw new Error("Параметр API должен быть массивом ссылок");
    }

    if (parent.css("border")) {
      borderWidth = parseInt(parent.css("border").match(/^\d+/)) * 2;
    }

    parentWidth = parent.width() + borderWidth;

    if (placeholder != placeholderElement.html()) {
      clearPlaceholder();
    }

    if (input.val().length > 2) {
      let suggests = [];
      let suggestsPositionSelected = [];
      let suggestsPositionSelected2 = [];
      let suggestsFewWords = [];

      const value = input.val();

      // const promises = api.map((e) =>
      //   fetch(e + value, {
      //     method: "GET",
      //     // body: input.val(),
      //   })
      // );

      const searchValue = input.val();
      const searchExpression = new RegExp(searchValue, "gi");
      const suggestion = $(".search-suggestions");

      refreshSelectedSuggestPosition();

      isPlaceholderMode = false;
      suggestsExist = false;

      // Promise.all(promises)
      //   .then((value) => Promise.all(value.map((r) => r.json())))
      //   .then((value) => {

      fetch(
        "https://next.sfu-kras.ru/modules/search/data_getter.php?search=" +
          value
      )
        .then((res) => res.json())
        .then((value) => {
          // value = value[0].concat(value[1]);
          // value = value.reverse();
          value.map((element) => {
            if (!element) {
              return;
            }

            if (element.type !== "person") {
              element.name = element.name.toLowerCase();
            }

            if (suggests.length < 6 && element.name) {
              if (clearWord(element.name).search(searchExpression) === 0) {
                if (!isPlaceholderMode) {
                  // setPlaceHolder(element, searchValue);
                }
                suggests.push(Suggest(element, searchValue));
                // console.log(element);
              }
            }
            if (suggestsPositionSelected.length < 6 && element.position) {
              if (element.position.search(searchExpression) == 0) {
                suggestsPositionSelected.push(
                  SuggestPositionSelected(element, searchValue)
                );
              }
            }
            if (suggestsPositionSelected2.length < 6) {
              if (element.position && element.position.split(" ").length > 1) {
                for (
                  let index = 1;
                  index < element.position.split(" ").length;
                  index++
                ) {
                  const elem = element.position.split(" ")[index];
                  if (
                    element.position
                      .substr(
                        element.position.indexOf(elem),
                        element.position.length
                      )
                      .search(searchExpression) == 0
                  ) {
                    suggestsPositionSelected2.push(
                      SuggestPositionSelected(
                        element,
                        searchValue,
                        element.position.substr(
                          element.position.indexOf(elem),
                          element.position.length
                        )
                      )
                    );
                  }
                }
              }
            }
            if (suggestsFewWords.length < 6 && element.name.split(" ")[1]) {
              for (
                let index = 1;
                index < element.name.split(" ").length;
                index++
              ) {
                const elem = element.name.split(" ")[index];
                if (
                  element.name
                    .substr(element.name.indexOf(elem), element.name.length)
                    .search(searchExpression) == 0
                ) {
                  console.log(element.name);
                  suggestsFewWords.push(
                    SuggestFewWords(
                      element,
                      searchValue,
                      element.name.substr(
                        element.name.indexOf(elem),
                        element.name.length
                      )
                    )
                  );
                }
              }
            }
          });

          console.log(suggests);
          console.log(suggestsFewWords);
          // console.log(suggestsPositionSelected);
          // console.log(suggestsPositionSelected2);

          if (suggests.length > 0) {
            suggestion.html(suggests);
            suggestsExist = true;
          } else if (suggestsFewWords.length > 0) {
            suggestion.html(suggestsFewWords);
            suggestsExist = true;
            clearPlaceholder();
          } else if (suggestsPositionSelected.length > 0) {
            suggestion.html(suggestsPositionSelected);
            suggestsExist = true;
            clearPlaceholder();
          } else if (suggestsPositionSelected2.length > 0) {
            suggestion.html(suggestsPositionSelected2);
            suggestsExist = true;
            clearPlaceholder();
          }

          if (suggestsExist) {
            showSuggestion(
              input.offset().top,
              input.offset().left,
              input.height(),
              parentWidth
            ).then(() => {
              setTimeout(() => {
                suggestion.addClass("search-suggestions_visible");
              }, 25);
            });
          } else {
            HideSuggestion();
            placeholderElement.html("");
          }
        });
    } else {
      HideSuggestion();
      placeholderElement.html("");
    }
  }
  function showSuggestion(top, left, height, width) {
    $(".search-suggestions").css({
      top: top + height + suggestionMargin + "px",
      left: left + "px",
      width: width + "px",
    });
    if ($(".search-icon-close").css("display") != "block") {
      $(".search-icon-close").css("display", "block");
    }
    return new Promise((res, rej) => {
      $(".search-suggestions").css("display", "block");
      $(".search-suggestions").css("visibility", "visible");
      res();
    });
  }
  function clearPlaceholder() {
    placeholder = "";
    $(".search-placeholder").html("");
    isPlaceholderMode = false;
  }
  function setPlaceHolderSimply(value) {
    isPlaceholderMode = true;
    placeholder = value;
    $(".search-placeholder").html(placeholder);
  }
  function setPlaceHolder(element, search) {
    isPlaceholderMode = true;
    placeholder = toMatchCase(element, search);
    $(".search-placeholder").html(placeholder);
  }
  function HideSuggestion() {
    $(".search-placeholder").html(" ");
    isPlaceholderMode = false;
    if ($(".search-icon-close").css("display") != "none") {
      $(".search-icon-close").css("display", "none");
    }
    new Promise((res, rej) => {
      $(".search-suggestions").removeClass("search-suggestions_visible");
      res();
    }).then(() => {
      setTimeout(() => {
        $(".search-suggestions").css("visibility", "hidden");
        $(".search-suggestions").css("display", "none");
      }, 200);
    });
  }
  $(".search-icon-close").click(function () {
    $(".search").val("");
    $(this).css("display", "none");
  });

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    $(".owl-carousel").owlCarousel({
      items: 1,
    });
  } else {
    let owl = $(".owl-carousel");
    owl.owlCarousel({
      items: 1,
      mouseDrag: false,
      loop: true,
      smartSpeed: 500,
    });
    owl.css("opacity", "1");
    // Go to the next item
    $(".banner-arrow-right").click(function () {
      owl.trigger("next.owl.carousel");
    });
    // Go to the previous item
    $(".banner-arrow-left").click(function () {
      owl.trigger("prev.owl.carousel", [300]);
    });
  }
});
