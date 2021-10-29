<script type="text/javascript" src="js/jquery-3.4.1.min.js"></script>
<script type="text/javascript" scr="js/jquery.lazy.min.js"></script>
<script type="text/javascript" src="owl/owl.carousel.min.js"></script>
<script type="text/javascript" src="js/lodash.min.js"></script>
<script type="module" src="js/main.js"></script>

<script type="text/javascript">
    $(document).on("ready", function() {
        $(".banner-image").lazy();
    });
</script>

<!-- from search -->
<script src="modules/search/script.js<? print $anti_cache; ?>"></script>
<!-- /from search -->

<!-- from ads -->
<script src="modules/search/scriptForDesctopSliderNews.js<? print $anti_cache; ?>"></script>
<!-- /from ads -->

<!-- Артем, ты разместил скрипт для объявлений в модуле search. Модуль search архитектурно предназначен для всего, что относится к поиску. Одновременно с этим скрипт для объявлений слишком мал, чтобы создавать для него собственное модульное ответвление. Поэтому расположи его на уровне общих стилей.
Поскольку изменится путь, то придется его поменять и в подключении. Подключение располагается по этому пути: chunks\scripts.php
В подключения скриптов я добавил анти-кеш. Это чтобы в каждом подключении не прописывать значение, провто изменяешь цифру на ++ в переменной $anti_cache в этом файле: core\config.php -->