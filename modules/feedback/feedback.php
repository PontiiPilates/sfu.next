<?php

header("Access-Control-Allow-Origin: https://next.sfu-kras.ru");

//! подключение файла с настройками
require('../../core/config.php');

$name = $_GET['name'];
$name = filter_var($name, FILTER_SANITIZE_STRING);

$email = $_GET['email'];
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

$text = $_GET['text'];
$text = filter_var($text, FILTER_SANITIZE_STRING);

// var_dump($name);

$sql = "INSERT INTO feedback (name, email, text, created_at) VALUES ('$name', '$email', '$text', now())";
$sql = $pdo->exec($sql);

// Проверка заполненности тектового поля
if (strlen($text) == 0) {
    die('2'); // Текстовое поле не заполнено
}

// Проверка поступления записи в базу данных
if ($sql) {
    die('1'); // Сообщение сохранено в базе данных
} else {
    die('0'); // Не удалось сохранить сообщение в базу данных
}

// ?name=ololo&email=ogogog&text=trololo