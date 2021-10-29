<?php
// $time_start = microtime(true);
header("Access-Control-Allow-Origin: *");

header("Content-type: application/json");

require('functions.php');

$query = $_GET['search'];

if ($query) {

    /**
     * Созранение запросов в базу данных
     */
    $sql = "INSERT INTO queryes (query, created_at) VALUES ('$query', now())";
    $sql = $pdo->exec($sql);

    /**
     * Статический запрос: обрабатывает вхождение как один запрос к базе данных
     * Поиск по: alias, затем по name
     * Сортировка по: alias, затем по source, затем по created_source
     */
    $sql = "SELECT
                id,
                source,
                name,
                alias,
                description,
                link,
                type,
                filename_img,
                created_source
            FROM $current_table
            WHERE alias
                LIKE '%$query%'
                OR name
                LIKE '%$query%'
                ORDER BY alias DESC, source DESC, created_source DESC
                LIMIT $selection_limit";

    /**
     * Подготовка к формарованию динамического запроса
     */

    // разбиение запроса на отдельные слова
    $words = explode(' ', $query);

    // проверка элементов в получившемся массиве
    if (count($words) > 1) {

        // стартовая часть конструкции запроса
        $consctruct = "(alias LIKE '%{$words[0]}%' OR name LIKE '%{$words[0]}%')";

        // удаление ее из последующего участия
        unset($words[0]);

        // обход оставшихся элементов массива
        foreach ($words as $v) {

            // достраивание части конструкции запроса
            $consctruct .= " AND (alias LIKE '%$v%' OR name LIKE '%$v%')";
        }

        /**
         * Статический запрос: обрабатывает вхождение, как некоторое количество запросов к базе данных в зависимости от количества отдельных слов в запросе
         * Поиск по: alias, затем по name
         * Сортировка по: alias, затем по source, затем по created_source
         */
        $sql = "SELECT
                    id,
                    source,
                    name,
                    alias,
                    description,
                    link,
                    type,
                    filename_img,
                    created_source
                FROM $current_table
                WHERE ($consctruct)
                    ORDER BY source DESC, created_source DESC
                    LIMIT $selection_limit";
    }

    $res = $pdo->query($sql);
    $res = $res->fetchAll(PDO::FETCH_ASSOC);

    $jsn = json_encode($res);
    echo $jsn;
}

// TODO: сортировка происходит по источнику и по дате, чистая случайность, что имя источника позволяет отсортировать так, как нужно. однако с появлением tube и photo сортировка будет происходить по ним. поэтому в таблицу нужно добавить колонку для указания приоритета в поиске, а запросы переписать с учетом этого. кроме того, указать приоритет желательно в одном месте, поэтому скорее всего сделать это придется в конфиге ну или в самих источниках.

// финалицация замера времени работы программы
// $time_end = microtime(true);
// $time_length = $time_end - $time_start;
// $time_length = number_format($time_length, 3);
// print $time_length;
