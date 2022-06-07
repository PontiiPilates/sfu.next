<?php

/**
 * * Управляющие переменные
 * * Это самые базовые параметры, которые участвуют в самой структуре запроса
 */

// Имя ядра (индекса)
$core = 'sfu';

// Ограничение по количеству выводимых строк
$rows = 200;

// Сортировать по времени и в обратном порядке
$sort = 'timestamp desc';

// Поля, по которым необходимо производить поиск
$qf = 'name | text';

// Фильтр, ограничивающий выдачу результата запроса
$fq = '';

/**
 * * Получение динамических данных
 * * Это такие данные, которые меняются при обработке каждого запроса
 */

// Тело запроса
$rq = $_GET['search'];

// Селектор запроса
$selector = $_GET['selector'];

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
$url = "http://10.100.6.8:8983/solr/$core/select?defType=dismax&fq=$fq&hl.fl=*&hl=true&indent=true&q.op=OR&q=$q&qf=$qf&rows=$rows&sort=$sort";

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

// Отладка
// echo '<pre>';
// print_r($url);
// print_r($data->response->numFound);
// print_r($data->response->docs);
// print_r($data->highlighting);
// echo '</pre>';

?>

<!doctype html>
<html lang="ru">

<head>
    <?php require '../templates/head.php'; ?>
</head>

<body>


    <nav class="navbar navbar-dark bg-dark mb-3">
        <div class="container-fluid" style="max-width: 720px;">
            <a class="navbar-brand" href="https://next.sfu-kras.ru/solr/public/index.php">Home</a>
        </div>
    </nav>

    <!-- Немного прилюдий -->
    <div class="container mb-3" style="max-width: 720px;">
        <small>Если вам попадутся результаты с "артефактами", то сообщите об этом нам</small>
    </div>
    <!-- /Немного прилюдий -->

    <div class="container d-flex justify-content-center mb-5" style="max-width: 720px;">

        <!-- Форма для поиска -->
        <form action="" method="get" style="width: 100%;">

            <!-- Поле для поиска -->
            <div class="mb-3">
                <label for="search" class="form-label">Поиск СФУ</label>
                <input name="search" type="text" class="form-control" id="search" aria-describedby="emailHelp" <? if ($rq) : ?> value="<?= ($rq) ?>" <? endif; ?>>
                <div id="search" class="form-text">Не надо пока баловаться со спецсимволами</div>
            </div>
            <!-- /Поле для поиска -->

            <!-- Селекторы поиска -->
            <div class="form-check">
                <input class="form-check-input" type="radio" name="selector" id="selector__all" value="" <? if ($selector == '') : ?> checked <? endif; ?>>
                <label class="form-check-label" for="selector__all">
                    Везде
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="selector" id="selector__admissions" value="admissions" <? if ($selector == 'admissions') : ?> checked <? endif; ?>>
                <label class="form-check-label" for="selector__admissions">
                    Поступление
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="selector" id="selector__sport" value="sport" <? if ($selector == 'sport') : ?> checked <? endif; ?>>
                <label class="form-check-label" for="selector__sport">
                    Спорт
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="selector" id="selector__about" value="about" <? if ($selector == 'about') : ?> checked <? endif; ?>>
                <label class="form-check-label" for="selector__about">
                    Об университете
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="selector" id="selector__edu" value="edu" <? if ($selector == 'edu') : ?> checked <? endif; ?>>
                <label class="form-check-label" for="selector__edu">
                    Обучение
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="selector" id="selector__research" value="research" <? if ($selector == 'research') : ?> checked <? endif; ?>>
                <label class="form-check-label" for="selector__research">
                    Наука
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="selector" id="selector__international" value="international" <? if ($selector == 'international') : ?> checked <? endif; ?>>
                <label class="form-check-label" for="selector__international">
                    Internationsl
                </label>
            </div>

            <div class="form-check mb-3">
                <input class="form-check-input" type="radio" name="selector" id="selector__news" value="news" <? if ($selector == 'news') : ?> checked <? endif; ?>>
                <label class="form-check-label" for="selector__news">
                    Новости
                </label>
            </div>

            <div class="row mb-3">
                <div class="col">
                    <label class="form-label" for="date_start">От</label>
                    <input class="form-control" type="date" name="date_start" id="date_start" value="<?php if ($rds) {print $rds;} ?>">
                </div>
                <div class="col">
                    <label class="form-label" for="date_end">До</label>
                    <input class="form-control" type="date" name="date_end" id="date_end" value="<?php if ($rde) {print $rde;} ?>">
                </div>
            </div>
            <!-- /Селекторы поиска -->

            <button type="submit" class="btn btn-warning">Искать</button>

        </form>
        <!-- Форма для поиска -->

    </div>


    <!-- Выдача результатов -->
    <div class="container" style="max-width: 720px;">

        <!-- Информация о выдаче -->
        <? if ($_GET['search']) : ?>
            <? if ($num_found) : ?>
                <p>Обнаружено <?= $num_found; ?> результатов:</p>
            <? else : ?>
                <p>По данному запросу ничего не найшлось :(</p>
            <? endif; ?>
        <? endif; ?>
        <!-- /Информация о выдаче -->

        <?php
        foreach ($data->response->docs as $item) {

            // Получение переменных
            $sid            = $item->id;
            $name           = $data->highlighting->$sid->name[0];
            $link           = $item->link[0];
            $text           = $data->highlighting->$sid->text[0];
            $timestamp      = $item->timestamp[0];
            $date           = date('Y-m-d', $timestamp);

            // Если поле name не найдено в highlights то, его получение происходит из docs
            if (!$name) {
                $name = $item->name[0];
            }
        ?>

            <div class="card mb-1" style="width: 100%;">
                <div class="card-body">
                    <h5 class="card-title"><?= $name; ?></h5>
                    <a href="#" class="card-link"><?= $link; ?></a>
                    <p class="card-text"><?= $text; ?></p>
                    <!-- <h6 class="card-subtitle mb-2 text-muted"><?= $date; ?></h6> -->
                    <small class="text-muted"><?= $date; ?></small>
                    <!-- <a href="#" class="card-link">Another link</a> -->
                </div>
            </div>

        <?php
        }
        ?>

    </div>
    <!-- Выдача результатов -->

    <!-- Немного стилей -->
    <style>
        em {
            color: var(--bs-indigo);
            font-weight: bold;
        }
    </style>
    <!-- /Немного стилей -->













    <?php require '../templates/scripts.php'; ?>
</body>

</html>