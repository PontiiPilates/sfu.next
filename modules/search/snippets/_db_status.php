<?php

/**
 ** Снимает с поисковой выдачи строки, утерявшие актуальность
 * снятие осуществляется путем присвоения нулевого статуса строкам, которых нет в источнике
 */

function _db_status()
{
    // предоставление доступа к PDO внутри функции
    global $pdo;

    // предоставление доступа к рабочей таблице
    global $table;

    // предоставление доступа к источникам данных
    global $sources;

    // предоставление доступа к источникам данных
    global $sources_limit;

    // счетчик элементов, поставляемых всеми источниками
    $counter_items_sources = '';

    // счетчик элементов, записанных в таблице
    $counter_items_table = '';

    // обход всех источников
    foreach ($sources as $k => $v) {

        // получение данных хоста
        $data = file_get_contents($v);
        $data = json_decode($data);

        // ограничение массива для тестирования
        $data = array_slice($data, 0, $sources_limit);

        // обход данных хоста
        foreach ($data as $mk => $mv) {

            //* получение всех элементов
            $counter_items_sources++;
        }
    }

    // получение количества элементов поисковой выдачи, хранимых в базе данных
    $counter_items_table = $pdo->query("SELECT COUNT(*) FROM $table WHERE status = 1");
    $counter_items_table = $counter_items_table->fetchColumn();

    // сохранение значений в сессии
    $_SESSION['logs']['Количество элементов в источнике'] = $counter_items_sources;
    $_SESSION['logs']['Количество элементов в таблице'] = $counter_items_table;


    if ($counter_items_table > $counter_items_sources) {
        $_SESSION['logs']['В таблице больше записей чем в источнике'] = $counter_items_table - $counter_items_sources;
    } elseif ($counter_items_sources > $counter_items_table) {
        $_SESSION['logs']['В источнике больше записей чем в таблице'] = $counter_items_sources - $counter_items_table;
    }

    // получение информации о файловой системе
    $names_in_files = scandir('miniatures/avatars/');
    unset($names_in_files[0]);
    unset($names_in_files[1]);

    $_SESSION['logs']['В файловой системе находится миниатюр'] = count($names_in_files);
    
    // получение ссылок на исходные изображения и идентификаторов их строк
    $data = $pdo->query("SELECT COUNT(*) FROM $table WHERE source_img != '' AND source_img != 'unknown'");
    $data = $data->fetchAll(PDO::FETCH_COLUMN);

    $_SESSION['logs']['В базе данных находятся источников изображений'] = $data[0];
}

$time_start = microtime(true);
_db_status();
_time_metric($time_start);
_to_general();
