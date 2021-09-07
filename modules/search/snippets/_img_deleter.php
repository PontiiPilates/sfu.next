<?php



/**
 ** Удаляет все изображения с сервера
 */
function _img_deleter()
{
    // получение массива имен файлов, находящихся в дирректории
    $names_in_files = scandir('miniatures/avatars/');
    unset($names_in_files[0]);
    unset($names_in_files[1]);
    
    foreach ($names_in_files as $k => $v) {
        
        // проверка удаления файла
        if (unlink("miniatures/avatars/$v")) {
            $_SESSION['logs']['Изображений удалено']++;
        } else {
            $_SESSION['logs']['Ошибок при удалении изображений']++;
        }
    }
}


// старт таймера
$time_start = microtime(true);

_img_deleter();
_time_metric($time_start);
_to_general();
