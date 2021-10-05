<?php

/**
 ** Масштабирует и сохраняет изображение
 * Принимает путь или URL к существующему файлу
 * Возвращает новое имя файла
 */

function _img_uploader($source)
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

    global $temporary_storage;

    // генерация пути и имени файла
    $dir_name = "miniatures/$temporary_storage/";
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
            if (!imagepng($image, $full_path)) exit('Не удалось сохранить объект GdImage в .png-файл');
            break;
        case 'image/jpeg';
            // сохранение объекта в джпг
            if (!imagejpeg($image, $full_path)) exit('Не удалось сохранить объект GdImage в .png-файл');
            break;
    }

    // очистка памяти посредствам уничтожения объекта GdImage
    if (!imagedestroy($image)) exit('Очистка памяти не произведена');

    return $file_name;
}

/**
 ** Реализация
 */

// предоставление доступа к PDO внутри функции
global $pdo;

// предоставление доступа к рабочей таблице
global $next_table;

// старт таймера
$time_start = microtime(true);

// получение ссылок на исходные изображения и идентификаторов их строк
$data = $pdo->query("SELECT id, source_img FROM $next_table WHERE source_img != '' AND source_img != 'unknown' AND filename_img = ''");
$data = $data->fetchAll(PDO::FETCH_OBJ);

// очистка таблицы от имен сконвертированных изображений
// UPDATE `search_2` SET filename_img = '' WHERE source_img = 'unknown'

// исполнение сценария 
if ($data) {

    // обход массива
    foreach ($data as $k => $v) {

        // сохранение ссылки на исходное изображение в переменную
        $source_img = $v->source_img;
        // сохранение идентификатора строки в переменную
        $id = $v->id;

        // конвертация изображения, его сохранение и получение имени этого файла
        if (!$filename = _img_uploader($source_img)) die('Не удалось получить имя сконвертированного изображения');

        // добавление новых имен изображений в базу данных
        $sql = "UPDATE $next_table SET filename_img = '$filename' WHERE id = '$id'";
        if (!$sql = $pdo->exec($sql)) die('Не удалось добавить имя сконвертированного изображения в базу данных');

        // счётчик для интерфейса
        $_SESSION['logs']['Произведено портретов']++;

        // остановка выполнения программы
        // _stop($time_start);
    }
}

_time_metric($time_start);
_to_general();
