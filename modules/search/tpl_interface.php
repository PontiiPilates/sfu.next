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
</head>

<body>

    <h3>Поисковой модуль</h3>
    <i>Кабинет администрирования</i>

    <div class="conteiner-fluid mt-3">
        <a class="btn btn-outline-success" href="?directive=start">Начать процесс актуализации данных</a>
    </div>
    <div class="conteiner-fluid mt-3">
        <a class="btn btn-outline-dark" href="?directive=clear">Очистить логи</a>
    </div>
    <div class="conteiner-fluid mt-3">
        <a class="btn btn-outline-danger" href="?directive=delete_table_search">Очистить таблицу</a>
    </div>

    <div class="conteiner-fluid mt-3">

        <?php
        // $data = $pdo->query("SELECT file_img FROM search");
        // $data = $data->fetchAll(PDO::FETCH_ASSOC);

        // foreach ($data as $k => $v) {
        //     if ($v['file_img']) {
        //         $path = 'miniatures/avatars/' . $v['file_img'];
        //         echo "<img src='$path' alt='' width='80' height='80'>";
        //     }
        // }
        ?>

    </div>

    <div class="bg-light bg-gradient border border-secondary mt-3">
        <p>Проверено записей: <b><?php print $_SESSION['logs']['check_count']; ?></b></p>
        <p>Успешных транзакций: <b><?php print $_SESSION['logs']['insert_count_success']; ?></b></p>
        <p>Ошибок во время транзакций: <b><?php print $_SESSION['logs']['insert_count_error']; ?></b></p>
        <?php if ($_SESSION['logs']['insert_erro_row']) : ?>
            <?php foreach ($_SESSION['logs']['insert_erro_row'] as $k => $v) : ?>
                <p><small>
                        <pre>
                    <?php print_r($v); ?>
                </pre>
                    </small></p>
            <?php endforeach; ?>
        <?php endif; ?>
        <p>Сконвертировано изображений: <b><?php print $_SESSION['logs']['image_converter_count']; ?></b></p>
        <p>На выполнение программы затрачено: <b><?php print $_SESSION['logs']['code_time']; ?></b></p>
        <p>Файлов удалено: <b><?php print $_SESSION['logs']['files_delete_s']; ?></b></p>
        <p>Не удалось удалить файлов: <b><?php print $_SESSION['logs']['files_delete_f']; ?></b></p>
        <p>Таблица очищена: <b><?php print $_SESSION['logs']['drop_table']; ?></b></p>
    </div>

    <form action="" method="post" class="mt-3">
        <div>
            <input type="text" name="search" id="search" placeholder="Начни искать">
            <input type="submit">
        </div>
    </form>

    <?php
    $query = $_POST['search'];

    //* все это имеет смысл если есть запрос
    if ($query) {

        $sql = "SELECT id, source, file_img, name FROM search WHERE name LIKE '%$query%'";
        $res = $pdo->query($sql);
        $res = $res->fetchAll(PDO::FETCH_ASSOC);
    }
    ?>

    <div class="container">

        <?php foreach ($res as $k => $v) : ?>

            <?php
            if ($v['source'] !== 'structure') {
                $path = "miniatures/others/{$v['source']}.png";
            } else {
                $path = "miniatures/avatars/{$v['file_img']}";
            }
            ?>

            <div class="item">
                <div class="img-box">

                    <img src="<?php print $path; ?>" alt="">

                </div>

                <p><?php print $v['name']; ?></p>
                <p><?php print $v['id']; ?></p>

            </div>

        <?php endforeach; ?>

    </div>


    <script src="functions.js"></script>

    <style>
        body {
            text-align: center;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

        }

        .item {
            border: 1px solid gray;
            text-align: center;
        }

        .item>p {
            width: 100px;
        }

        .img-box {
            width: 100px;
            height: 100px;
            overflow: hidden;
        }

        .img-box>img {
            width: 100px;
        }
    </style>

</body>

</html>