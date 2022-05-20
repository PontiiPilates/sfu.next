<?php

//! подключение файла с настройками
require('../../core/config.php');

$sql = "SELECT name, email, text FROM feedback ORDER BY id DESC";

$res = $pdo->query($sql);

$res = $res->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="ru">

<head>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- jquery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <!-- /jquery -->

    <!-- bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <!-- /bootstrap -->

    <title>Search</title>

    <link rel="icon" type="image/svg" href="/favicon.svg">

</head>

<body class="bg-dark text-light">

    <div class="container">

        <div class="row mt-5">
            <a href="#" style="text-decoration: none; color: inherit;">
                <h3>
                    Feedback-модуль<br>
                    <small class="text-muted">Просмотр сообщений от пользователей</small>
                </h3>
                <!-- <p class="text-info bg-dark">Alpha-версия 3.0</p> -->
            </a>
        </div>

        <div class="row mt-5">

            <div class="col">
            </div>
            <div class="col">
                <? if ($_SESSION) : ?>
                    <?php foreach ($_SESSION['logs'] as $k => $v) : ?>
                        <small><?= $k ?>: <b><?= $v ?></b></small></br>
                    <?php endforeach; ?>
                <? endif; ?>
            </div>
        </div>

        <div class="row mt-3">
            <table class="table table-borderless text-light">
                <?php foreach ($res as $k => $v) : ?>
                    <?php
                    $name = $v['name'];
                    $email = $v['email'];
                    $text = $v['text'];
                    ?>

                    <tr class="border-bottom">
                        <td><?= $v['name'] ?></td>
                        <td><?= $v['email'] ?></td>
                        <td><?= $v['text'] ?></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        </div>

    </div>

</body>

</html>