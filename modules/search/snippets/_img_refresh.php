<?php

/**
 ** Удаляет файлы с сервера, которые не участвуют в поиске
 * возвращает количество удаленных файлов в виде значения массива сессии
 * возвращает количество ошибок, связанных с удаление файла в виде значения массива сессии
 */
function _img_refresh()
{

    // получение массива имен файлов, находящихся в дирректории
    $names_in_files = scandir('miniatures/avatars/');
    unset($names_in_files[0]);
    unset($names_in_files[1]);

    // предоставление доступа к pdo внутри функции
    global $pdo;

    // получение массива имен файлов, находящихся в базе данных
    $stmt = $pdo->query("SELECT file_img FROM search WHERE file_img != ''");
    $stmt = $stmt->fetchAll(PDO::FETCH_OBJ);

    // пересборка массива
    $names_in_db = [];
    foreach ($stmt as $k => $v) {
        $names_in_db[] = $v->file_img;
    }

    // удаление файлов, имена которых отсутствуют в базе данных
    foreach ($names_in_files as $k => $v) {

        // если имя файла не обнаружено в базе данных
        if (!in_array($v, $names_in_db)) {

            // проверка удаления файла
            if (unlink("miniatures/avatars/$v")) {
                $_SESSION['logs']['files_delete_s'] += 1;
            } else {
                $_SESSION['logs']['files_delete_f'] += 1;
            }
        }
    }
}
