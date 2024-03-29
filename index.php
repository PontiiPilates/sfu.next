<?php

/**
 * * Управляющие переменные
 * * Это самые базовые параметры, которые участвуют в самой структуре запроса
 */

// Имя ядра (индекса)
$core = 'sfu';

// Сортировать по времени и в обратном порядке
$sort = 'timestamp desc';

// Поля, по которым необходимо производить поиск
$qf = 'name | text';

// Фильтр, ограничивающий выдачу результата запроса
$fq = '';

/**
 * * Преобразование сортировки
 */

$dsort = $_GET['sort'];

switch ($dsort) {

        // Если она содержит значение admissions
    case 'desc';
        // То этой переменной присвоить это значение
        $sort = 'timestamp desc';
        break;

        // Если она содержит значение sport
    case 'asc';
        // То этой переменной присвоить это значение
        $sort = 'timestamp asc';
        break;
}

/**
 * * Получение динамических данных
 * * Это такие данные, которые меняются при обработке каждого запроса
 */

// Тело запроса
$rq = $_GET['search'];

// Селектор запроса
$selector = $_GET['selector'];

// Ограничение по количеству выводимых строк
$rows = $_GET['rows'];

// С какого элемента осуществлять вывод
$start = $_GET['start'];

/**
 * * Преобразование селектора
 * * Селектор - это выбиралка. Можно выбрать поиск по спортивному разделу или по поступлению
 */

// Если $selector существует. То есть если пользователь тыкнул по кнопочке, то данные поступили в $_GET['selector']. В таком случае теперь переменная $selector содержит какое-то значение
switch ($selector) {

        // Если она содержит значение admissions
    case 'admissions';
        // То этой переменной присвоить это значение
        $fq = 'host:admissions';
        break;

        // Если она содержит значение sport
    case 'sport';
        // То этой переменной присвоить это значение
        $fq = 'host:sport';
        break;

        // Если она содержит значение sport
    case 'about';
        // То этой переменной присвоить это значение
        $fq = 'host:about';
        break;

        // Если она содержит значение sport
    case 'edu';
        // То этой переменной присвоить это значение
        $fq = 'host:edu';
        break;

        // Если она содержит значение sport
    case 'research';
        // То этой переменной присвоить это значение
        $fq = 'host:research';
        break;

        // Если она содержит значение sport
    case 'international';
        // То этой переменной присвоить это значение
        $fq = 'host:international';
        break;

        // Если она содержит значение sport
    case 'news';
        // То этой переменной присвоить это значение
        $fq = 'host:news';
        break;

        // Если она содержит значение sport
    case 'structure';
        // То этой переменной присвоить это значение
        $fq = 'host:structure';
        break;
}

// Ранее это был пирожок без никто, а теперь это пирожок с чем-то

/**
 * * Преобразование переменных
 * * На языке программирования - это совершенно бюрократическая хуйня. Дело в том, что в запросе должна быть правильная кодировка. Например пробел должен значиться как %20. А при кодировании вместо этого получается +. В PHP так исторически сложилось. Так что в программировании тоже есть вещи, которые работают через заднее отверстие. Далее я не только кодирую, но и заменяю символ в строке на правильный.
 */

// Закодировать в надлежащий формат
$sort = urlencode($sort);
// Заменить символ на другой символ
$sort = str_replace('+', '%20', $sort);

// Закодировать в надлежащий формат
$qf = urlencode($qf);
// Заменить символ на другой символ
$qf = str_replace('+', '%20', $qf);

// Закодировать в надлежащий формат
$fq = urlencode($fq);
// Заменить символ на другой символ
$fq = str_replace('+', '%20', $fq);

// Закодировать в надлежащий формат
$q = urlencode($rq);
// Заменить символ на другой символ
$q = str_replace('+', '%20', $q);

/**
 * * Сборка запроса
 */

// Начальный запрос
$url = "http://10.100.6.8:8983/solr/$core/select?defType=dismax&fq=$fq&hl.fl=*&hl=true&indent=true&q.op=OR&q=$q&qf=$qf&rows=$rows&start=$start&sort=$sort";

// Дата начала (r - row - сырой)
$rds = $_GET['date_start'];
// Дата окончания (r - row - сырой)
$rde = $_GET['date_end'];

// Если есть дата старта
if ($rds) {
    // Преобразовать дату старта в метку времени
    $ds = strtotime($rds);
    // Сборка условия
    $ds = "timestamp:[$ds TO *]";
    // Закодировать в надлежащий формат
    $ds = urlencode($ds);
    // Заменить символ на другой символ
    $ds = str_replace('+', '%20', $ds);
    // Сборка запроса
    $url .= "&fq=$ds";
}

// Если есть дата окончания
if ($rde) {
    // Преобразовать дату старта в метку времени
    $de = strtotime($rde);
    // Сборка условия
    $de = "timestamp:[* TO $de]";
    // Закодировать в надлежащий формат
    $de = urlencode($de);
    // Заменить символ на другой символ
    $de = str_replace('+', '%20', $de);
    // Сборка запроса
    $url .= "&fq=$de";
}

/**
 * * Приём данных
 * * Дальше я просто получаю данные, которые мне отдал сервер по запросу и строю из них страничку, которую видит пользователь. Но это уже совсем другая история.
 */

// Получение данных для выдачи
$data = file_get_contents($url);

// Преобразование данных
$data = json_decode($data);

// Теперь переменная $data содержит данные, которые будут отрисованы пользователю

// Получение количества полученных результатов
$num_found = $data->response->numFound;



?>

<!doctype html>
<html lang="ru">

<head>
    <?php require 'templates/head.php'; ?>
</head>

<body>

    <?php require 'templates/header.php'; ?>

    <div class="main_content">

        <?php require 'templates/icons.php'; ?>
        <?php require 'templates/form_search.php'; ?>
        <?php require 'templates/card_result.php'; ?>
        <?php require 'templates/pager.php'; ?>

    </div>

    <?php require 'templates/feedback_window.php'; ?>

    <?php require 'templates/footer.php'; ?>

    <?php require 'templates/scripts.php'; ?>

    <!-- Немного стилей -->
    <style>
        em {
            color: #E63E11;
            font-weight: bold;
            font-style: normal;
        }
    </style>
    <!-- /Немного стилей -->

</body>

</html>