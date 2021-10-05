<?php

/**
 ** Наполняет базу данных из источников
 *
 * наполнение происходит без проверки на существование
 * вызывается один раз для заполнения таблицы
 * формирует лог о результатах работы
 */

function _db_uploader()
{
    // предоставление доступа к PDO внутри функции
    global $pdo;

    // предоставление доступа к рабочей таблице
    global $next_table;

    // предоставление доступа к источникам данных
    global $sources;

    // предоставление доступа к источникам данных
    global $sources_limit;

    // ! родительский фрагмент для сниппета _db_actualize_updater.php
    $source                 = '';   // псевдиним источника данных
    $type                   = '';   // тип данных, определенный источником
    $name                   = '';   // заголовок материала
    $description            = '';   // описание материала (например должность)
    $alias                  = '';   // псевдоним для поиска (высший приоритет)
    $link                   = '';   // ссылка на материал
    $source_img             = '';   // адрес источника изображения
    $filename_img           = '';   // имя файла сконвертированного изображения
    $created_at             = '';   // дата создания записи
    $created_source         = '';   // дата появления записи
    $changed_source         = '';   // дата изменения записи
    $status                 = '';   // участвует в поисковой выдаче или нет
    $weight                 = '';   // вес в поисковой выдаче
    // ! /родительский фрагмент для сниппета _db_actualize_updater.php

    // обход всех источников
    foreach ($sources as $k => $v) {

        $source = $k;

        // получение данных хоста
        $data = file_get_contents($v);
        $data = json_decode($data);

        // ограничение массива для тестирования
        $data = array_slice($data, 0, $sources_limit);

        // echo '<pre>';
        // print_r($data);
        // echo '</pre>';

        // обход данных хоста
        foreach ($data as $mk => $mv) {

            // формирование данных для занесения в базу данных
            // ! родительский фрагмент для сниппета _db_actualize_updater.php
            $type           = $mv->type;
            $name           = $mv->name;
            $description    = $mv->position;
            $link           = $mv->link;
            $source_img     = $mv->avatar;
            $created_at     = date('Y-m-d H:i:s');
            $created_source = $mv->created;
            $changed_source = $mv->changed;
            // ! /родительский фрагмент для сниппета _db_actualize_updater.php


            // преобразование некоторых данных
            $name = htmlspecialchars($name, ENT_QUOTES);

            // ! родительский фрагмент для сниппета _db_actualize_updater.php
            $sql = "INSERT INTO $next_table (
                    `source`,
                    `type`,
                    `name`,
                    `description`,
                    `alias`,
                    `link`,
                    `source_img`,
                    `filename_img`,
                    `created_at`,
                    `created_source`,
                    `changed_source`,
                    `status`,
                    `weight`
                ) VALUES (
                    '$source',
                    '$type',
                    '$name',
                    '$description',
                    '',
                    '$link',
                    '$source_img',
                    '$filename_img',
                    '$created_at',
                    '$created_source',
                    '$changed_source',
                    '1',
                    ''
                )";
            // ! /родительский фрагмент для сниппета _db_actualize_updater.php

            $sql = $pdo->exec($sql);

            // формирование логов о сохранении в базу данных
            if ($sql) {
                $s++;
                $_SESSION['logs']['Добавлено в базу данных'] = $s;
            } else {
                $e++;
                $_SESSION['logs']['Ошибок при добавлении в базу данных'] = $e;
                $_SESSION['logs']['uploader_error_row'][$e]['name'] = $name;
                $_SESSION['logs']['uploader_error_row'][$e]['link'] = $link;
            }
            // родительский фрагмент для сниппета _db_actualizer.php
        }
    }
}

/**
 ** Реализация
 */
$time_start = microtime(true);
_db_uploader();
_time_metric($time_start);
_to_general();
