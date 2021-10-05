<?php

/**
 * Создает новую дирректорию
 */

function _dir_create()
{
    global $temporary_storage;

    $dir = mkdir("miniatures/$temporary_storage/");

    if ($dir) {
        $_SESSION['logs']['Создание временного хранилища'] = 'true';
    } else {
        $_SESSION['logs']['Создание временного хранилища'] = 'false';
    }
}

_dir_create();
_to_general();
