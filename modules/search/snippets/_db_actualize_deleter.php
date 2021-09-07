<?php

// UPDATE search_2 SET status = 1

/**
 ** Снимает с поисковой выдачи строки, утерявшие актуальность
 * снятие осуществляется путем присвоения нулевого статуса строкам, которых нет в источнике
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

            //* формирование массива ссылок для идентификации элементов
            $links[] = "'" . $mv->link . "'";
        }
    }

    // получение количества элементов поисковой выдачи, хранимых в базе данных
    $counter_items_table = $pdo->query("SELECT COUNT(*) FROM $table WHERE status = 1");
    $counter_items_table = $counter_items_table->fetchColumn();

    // echo '<pre>';
    // print_r($counter_items_sources);
    // print_r($counter_items_table);
    // echo '</pre>';

    if ($counter_items_table > $counter_items_sources) {

        // получение списка всех id кроме
        $links = '(' . implode(',', $links) . ')';
        $sql = $pdo->query("SELECT id FROM $table WHERE link NOT IN $links AND status = 1");
        $sql = $sql->fetchAll(PDO::FETCH_OBJ);

        foreach ($sql as $k => $v) {

            $id = $v->id;

            // обновление статуса элемента
            $sql = $pdo->exec("UPDATE $table SET status = 0 WHERE id = '$id'");

            // проверка исполнения запроса
            if ($sql) {
                $_SESSION['logs']['Снято с публикации']++;
            } else {
                $_SESSION['logs']['Ошибок при снятии с публикации']++;
            }
        }
    }
}

$time_start = microtime(true);
_db_actualize_updater();
_time_metric($time_start);
_to_general();
