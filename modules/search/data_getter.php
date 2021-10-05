<?php
// $time_start = microtime(true);
header("Access-Control-Allow-Origin: *");

header("Content-type: application/json");

require('functions.php');

$query = $_GET['search'];

if ($query) {

    // начальный запрос
    $sql = "SELECT id, source, name, alias, description, link, type, filename_img, created_source FROM $current_table WHERE name LIKE '%$query%' ORDER BY created_source DESC LIMIT 7";

    // разбиение запроса на отдельные слова
    $words = explode(' ', $query);

    // проверка элементов в получившемся массиве
    if (count($words) > 1) {

        // стартовая часть конструкции запроса
        $consctruct = "name like '%{$words[0]}%'";

        // удаление ее из последующего участия
        unset($words[0]);

        // обход оставшихся элементов массива
        foreach ($words as $v) {

            // достраивание части конструкции запроса
            $consctruct .= " and name like '%$v%'";
        }

        // применение завершенной части строки запроса
        $sql = "SELECT id, source, name, alias, description, link, type, filename_img, created_source FROM $current_table WHERE ($consctruct) ORDER BY created_source DESC LIMIT 10";
    }

    $res = $pdo->query($sql);
    $res = $res->fetchAll(PDO::FETCH_ASSOC);

    $jsn = json_encode($res);
    echo $jsn;
}

// финалицация замера времени работы программы
// $time_end = microtime(true);
// $time_length = $time_end - $time_start;
// $time_length = number_format($time_length, 3);
// print $time_length;
