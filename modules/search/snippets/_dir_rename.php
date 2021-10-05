<?php

/**
 * Переименовывает дирректории
 */

function _dir_rename()
{
    global $persistent_storage;
    global $temporary_storage;
    global $disabled_storage;

    $dir_1 = rename("miniatures/$persistent_storage/", "miniatures/$disabled_storage/");

    $dir_2 = rename("miniatures/$temporary_storage/", "miniatures/$persistent_storage/");

    if ($dir_1 && $dir_2) {
        $_SESSION['logs']['Использование нового хранилища'] = 'true';
    } else {
        $_SESSION['logs']['Использование нового хранилища'] = 'false';
    }
}

_dir_rename();
_to_general();
