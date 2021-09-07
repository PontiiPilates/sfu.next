<?php

/**
 * 
 */


function _db_actualize_updater()
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

            // проверка на существовавние источника в базе данных
            $sql = $pdo->query("SELECT COUNT(*) FROM $table WHERE link = '$link'");
            $sql = $sql->fetchColumn();

            // echo '<pre>';
            // print_r($sql);
            // echo '</pre>';

            // $c++;
            // $_SESSION['logs']['Проверено элементов в базе данных на соответствие '] = $c;


            if (!$sql) {

                $_SESSION['logs']['В базе данных не хватает элементов']++;

                // фрагмент из сниппета _db_uploader.php
                $sql = "INSERT INTO $table (`source`,`type`,`name`,`description`,`alias`,`link`,`source_img`,`filename_img`,`create`,`status`,`weight`) VALUES ('$source','$type','$name','$description','','$link','$source_img','$filename_img','$create','1','')";
                $sql = $pdo->exec($sql);

                // формирование логов о сохранении в базу данных
                if ($sql) {
                    $_SESSION['logs']['Элементов добавлено в базу данных']++;
                } else {
                    $_SESSION['logs']['Ошибок при добавлении элементов в базу данных']++;
                    $i++;
                    $_SESSION['logs']['Элемент'][$i]['name'] = $name;
                    $_SESSION['logs']['Элемент'][$i]['link'] = $link;
                }
                // фрагмент из сниппета _db_uploader.php
            }
        }
    }
}

// UPDATE search_2 SET status = 1


$time_start = microtime(true);
_db_actualize_updater();
_time_metric($time_start);
_to_general();
