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

<body class="bg-dark text-light">

    <div class="container">

        <div class="row mt-5">
            <a href="http://next.sfu-kras.ru/modules/search/controller.php" style="text-decoration: none; color: inherit;">
                <h3>
                    Search-модуль<br>
                    <small class="text-muted">Административная панель</small>
                </h3>
                <p class="text-info bg-dark">Alpha-версия 2.0</p>
            </a>
        </div>

        <div class="row mt-5">
            <div class="col">
                <table class="table table-dark">
                    <tr>
                        <td>Элементов в источнике</td>
                        <td><b><?= $_SESSION['logs']['Количество элементов в источнике'] ?></b></td>
                    </tr>
                    <tr>
                        <td>Элементов в базе данных</td>
                        <td><b><?= $_SESSION['logs']['Количество элементов в таблице'] ?></b></td>
                    </tr>
                    <tr>
                        <td>Источников изображений</td>
                        <td><b><?= $_SESSION['logs']['В базе данных находятся источников изображений'] ?></b></td>
                    </tr>
                    <tr>
                        <td>Изображений на сервере</td>
                        <td><b><?= $_SESSION['logs']['В файловой системе находится миниатюр'] ?></b></td>
                    </tr>
                </table>
            </div>
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

        <div class="row mt-5">
            <!-- <p><small>TODO: оптимизировать поисковую таблицу базы данных таким образом, чтобы от источника добавлять метку материала mark вместо id. Поскольку id для последующей таблицы и предыдущей с момента появления новых материалов становятся различными, то идентифицировать материалы по id - невозможно, а по link - слишком долго. Поэтому нужно компромиссное решение, но уникальное.</small></p> -->
            <!-- <p><small>TODO: сделать менеджмент баз данных повторяющим принцип менеджмента дирректорий.</small></p> -->
            <p><small>TODO: протестировать работу функционала, сделать коммит.</small></p>
        </div>


        <div class="row mt-5">
            <div class="col">
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-info w-100" href="?directive=db_status">Обновить статус</a>
                </div>
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-warning w-100" href="?directive=lg_cleaner">Очистить логи</a>
                </div>
            </div>
            <div class="col">
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-secondary w-100" href="?directive=db_create">Создать новую таблицу</a>
                </div>
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-secondary w-100" href="?directive=db_uploader">Наполнить новую таблицу</a>
                </div>
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-secondary w-100" href="?directive=db_switch">Использовать новую таблицу</a>
                </div>
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-danger w-100" href="?directive=db_cleaner">Удалить прежнюю таблицу</a>
                </div>
            </div>
            <div class="col">
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-secondary w-100" href="?directive=dir_create">Создать временное хранилище</a>
                </div>
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-secondary w-100" href="?directive=img_upload">Создать портреты сотрудников</a>
                </div>
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-secondary w-100" href="?directive=dir_rename">Использовать новое хранилище</a>
                </div>
                <div class="conteiner-fluid mt-3">
                    <a class="btn btn-danger w-100" href="?directive=dir_delete">Удалить прежнее хранилище</a>
                </div>
            </div>
        </div>

        <div class="row mt-5">
            <form action="" method="post">
                <div>
                    <table>

                        <tr>
                            <td class="w-100">
                                <input class="form-control" type="text" name="search" id="search" placeholder="Начни искать">
                            </td>
                            <td class="ml-3 ps-3">
                                <input class="btn btn-primary" type="submit" value="Искать">
                            </td>
                        </tr>
                    </table>
                </div>
            </form>
        </div>

        <?php

        // замер времени исполнения запроса
        $time_start = microtime(true);


        $query = $_POST['search'];

        if ($query) {

            // начальный запрос
            $sql = "SELECT * FROM search_3 WHERE (name like '%$query%')";

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
                $sql = "SELECT * FROM search_3 WHERE ($consctruct)";
            }

            $res = $pdo->query($sql);
            $res = $res->fetchAll(PDO::FETCH_ASSOC);
        }

        // /замер времени исполнения запроса
        _time_metric($time_start);

        ?>

        <div class="row mt-3">
            <table class="table table-borderless text-light">
                <?php foreach ($res as $k => $v) : ?>
                    <?php
                    $thumbler = NULL;
                    $description = $v['description'];
                    if ($v['source'] !== 'structure') {
                        $path = "miniatures/others/{$v['source']}.png";
                        $description = date('Y.m.d', $v['created_source']);
                    } else {
                        if (!$v['filename_img']) {
                            $path = "miniatures/others/structure.png";
                        } else {
                            $thumbler = 1;
                            $path = "miniatures/avatars/{$v['filename_img']}?v=1";
                        }
                    }
                    ?>

                    <tr>
                        <td rowspan="2"><img src="<?= $path ?>" <?php if ($thumbler) print 'width="60" height="60"' ?> alt=""></td>
                        <td width="100%"><b><?= $v['name'] ?></b></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #373b3e;">
                        <td width="100%"><small><?= $description; ?></small></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        </div>

    </div>

</body>

</html>