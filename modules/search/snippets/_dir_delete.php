<?php

/**
 * Удаляет все файлы из дирректории
 */

function _file_deleter()
{
    global $disabled_storage;

    // получение массива имен файлов, находящихся в дирректории
    $names_in_files = scandir("miniatures/$disabled_storage/");
    unset($names_in_files[0]);
    unset($names_in_files[1]);

    foreach ($names_in_files as $k => $v) {

        // проверка удаления файла
        if (unlink("miniatures/$disabled_storage/$v")) {
            $_SESSION['logs']['Удалено файлов']++;
        } else {
            $_SESSION['logs']['Ошибок при удалении файлов']++;
        }
    }
}


/**
 * Удаляет дирректорию
 */

function _dir_delete()
{
    global $disabled_storage;

    $dir = rmdir("miniatures/$disabled_storage/");

    if ($dir) {
        $_SESSION['logs']['Удаление файлового хранилища'] = 'true';
    } else {
        $_SESSION['logs']['Удаление файлового хранилища'] = 'false';
    }
}

// старт таймера
$time_start = microtime(true);
_file_deleter();
_dir_delete();
_time_metric($time_start);
_to_general();
