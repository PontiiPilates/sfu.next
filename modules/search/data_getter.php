<?php
// $time_start = microtime(true);

header("Content-type: application/json");

require('functions.php');

$query = $_GET['search'];
// $query = $_POST['search'];

if ($query) {

    $sql = "SELECT id, source, name, alias, description, link, type, filename_img FROM $table WHERE name LIKE '%$query%' LIMIT 10";
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