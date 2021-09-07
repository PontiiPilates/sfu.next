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
    global $table;

    // предоставление доступа к источникам данных
    global $sources;

    // предоставление доступа к источникам данных
    global $sources_limit;

    $source                 = '';   // псевдиним источника данных
    $type                   = '';   // тип данных, определенный источником
    $name                   = '';   // заголовок материала
    $description            = '';   // описание материала (например должность)
    $alias                  = '';   // псевдоним для поиска (высший приоритет)
    $link                   = '';   // ссылка на материал
    $source_img             = '';   // адрес источника изображения
    $filename_img           = '';   // имя файла сконвертированного изображения
    $create                 = '';   // дата создания записи в человекопонятном формате
    $status                 = '';   // участвует в поисковой выдаче или нет
    $weight                 = '';   // вес в поисковой выдаче

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
            $type           = $mv->type;
            $name           = $mv->name;
            $description    = $mv->position;
            $link           = $mv->link;
            $source_img     = $mv->avatar;
            $create         = date('Y-m-d H:i:s');

            // преобразование некоторых данных
            $name = htmlspecialchars($name, ENT_QUOTES);

            // родительский фрагмент для сниппета _db_actualizer.php
            $sql = "INSERT INTO $table (`source`,`type`,`name`,`description`,`alias`,`link`,`source_img`,`filename_img`,`create`,`status`,`weight`) VALUES ('$source','$type','$name','$description','','$link','$source_img','$filename_img','$create','1','')";
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
