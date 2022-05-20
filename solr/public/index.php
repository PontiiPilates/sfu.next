<?php


// Получение поискового запроса
$q = $_GET['search'];

// Приведение запроса к надлежащей кодировке
$q = urlencode($q);

// Ограничение по выборке
$limit = 10;

// Сборка URL

// Только подсвеченное тело выдачи
// $url = "http://10.100.6.8:8983/solr/sfu1/select?defType=dismax&df=text&hl.fl=*&hl=true&indent=true&q.op=OR&q=$q&rows=$limit";

// Подсвеченные заголовки и подсвеченное тело поисковой выдачи
$url = "http://10.100.6.8:8983/solr/sfu2/select?defType=dismax&df=text&hl.fl=*&hl.highlightMultiTerm=false&hl.requireFieldMatch=false&hl.usePhraseHighLighter=false&hl=true&indent=true&q.op=OR&q=$q&rows=$limit";

// Получение ответа от поискового сервера
$data = file_get_contents($url);

$data = json_decode($data);

// Отладка
echo '<pre>';
// print_r($data->responseHeader);
// print_r($data->response->docs);
// $test = "050bb888-c803-4ec9-b8ea-288f757c9ad6";
// print_r($data->highlighting);
// print_r($data);
echo '</pre>';

?>

<!doctype html>
<html lang="ru">

<head>
    <?php require '../templates/head.php'; ?>
</head>

<body>
    <div class="container" style="max-width: 720px;">
        <small>Если вам попадутся результаты с "артефактами", то сообщите об этом нам</small>
    </div>

    <div class="container d-flex justify-content-center mt-5" style="max-width: 720px;">
        <form action="" method="get" style="width: 100%;">
            <div class="mb-3">
                <label for="search" class="form-label">Поиск СФУ</label>
                <input name="search" type="text" class="form-control" id="search" aria-describedby="emailHelp">
                <div id="search" class="form-text">Не надо пока баловаться со спецсимволами</div>
            </div>
            <button type="submit" class="btn btn-warning">Искать</button>
        </form>
    </div>
    
    <div class="container mt-5" style="max-width: 720px;">
    <?php
    foreach ($data->response->docs as $item) {

        // Получение переменных
        $sid            = $item->id;
        $name           = $data->highlighting->$sid->name[0];
        $link           = $item->link[0];
        $text           = $data->highlighting->$sid->text[0];
        $timestamp      = $item->timestamp[0];

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
                <h6 class="card-subtitle mb-2 text-muted"><?= $timestamp; ?></h6>
                <!-- <a href="#" class="card-link">Another link</a> -->
            </div>
        </div>





    <?php
    }
    ?>
    </div>


























    <?php require '../templates/scripts.php'; ?>
</body>

</html>