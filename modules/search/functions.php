<?php

/**
 ** Файл с функциями, необходимыми для работы программы
 * Функции написаны сплошной простыней в виде коллекции
 * Файл только на первый взгляд кажется большим/нечитаемым, внимание стоит уделять лишь каждой отдельно вятой функции
 */

/**
 ** Реализация всех необходимых подключений
 */

//* сессия потребуется для хранения различных значений программы
session_start();

//* доступы к базе данных реализованы в ядре, подключаем их здесь
require('../../core/db_access.php');

/**
 ** Масштабирует и сохраняет изображение
 * Принимает путь или URL к существующему файлу
 * Возвращает новое имя файла
 */

function _img_controller($source)
{
    // получение параметров об исходном изображении
    $info = getimagesize($source);

    // формируем координаты
    $x = $info[0];
    $y = $info[1];

    // выбираем наименьшую сторону, по ней дальше будем кадрировать изображение
    $min = min($x, $y);

    $crop_x = $x - $min;
    $crop_y = $y - $min;

    // формируем отступ для кадрирования по длинной стороне изображения
    if ($crop_x > 0) {
        $crop_x = round($crop_x / 2);
    }
    if ($crop_y > 0) {
        $crop_y = round($crop_y / 2);
    }

    // проверяем тип исходного изображения для использования соответствующих функций
    switch ($info['mime']) {
        case 'image/png';
            // создание объекта пнг
            $image = imagecreatefrompng($source);
            // заодно получаем тип для последующей записи в имя файла
            $extention = image_type_to_extension(IMAGETYPE_PNG);
            break;
        case 'image/jpeg';
            // создание объекта джпг
            $image = imagecreatefromjpeg($source);
            // заодно получаем тип для последующей записи в имя файла
            $extention = image_type_to_extension(IMAGETYPE_JPEG);
            break;
    }

    // кадрирование изображения
    $image = imagecrop($image, ['x' => $crop_x, 'y' => $crop_y, 'width' => $min, 'height' => $min]);

    // тут можно задать параметры изображения, которое требуется получить на выходе
    $scale_x = 300;
    $scale_y = 300;

    // масштабирование изображения
    $image = imagescale($image, $scale_x, $scale_y);

    // генерация пути и имени файла
    $dir_name = 'miniatures/avatars/';
    $hash = 'qwertyuiopasdfghjklzxcvbnm';
    $hash = str_shuffle($hash);
    $hash = mb_strimwidth($hash, 0, 5);
    $file_name = date('Y_m_d_h_i_s') . '_' . $hash . $extention;
    $full_path = $dir_name . $file_name;

    // снова проверка типа источника для использования соответствующих функций
    // да, тут происходит дублирование кода, и следовало бы подумать над другой архитектурой, но пока так
    switch ($info['mime']) {
        case 'image/png';
            // сохранение объекта в пнг
            $image = imagepng($image, $full_path);
            break;
        case 'image/jpeg';
            // сохранение объекта в джпг
            $image = imagejpeg($image, $full_path);
            break;
    }

    return $file_name;
}


/** 
 ** Вернуться на шлавную
 * Очистка GET-параметров
 * Обновление страницы
 */
function _general()
{
    header('Location: http://next.sfu-kras.ru/modules/search/controller.php');
}

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

/**
 ** Удаляет все изображения с сервера
 */
function _img_drop()
{
    // получение массива имен файлов, находящихся в дирректории
    $names_in_files = scandir('miniatures/avatars/');
    unset($names_in_files[0]);
    unset($names_in_files[1]);

    foreach ($names_in_files as $k => $v) {

        // проверка удаления файла
        if (unlink("miniatures/avatars/$v")) {
            $_SESSION['logs']['files_delete_s'] += 1;
        } else {
            $_SESSION['logs']['files_delete_f'] += 1;
        }
    }
}