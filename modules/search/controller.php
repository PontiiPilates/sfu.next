<?php

/**
 ** Главный сценарий модуля
 * Псевдомодель MVC реализуемая модулем
 * В приоритете модульная модель построения проекта, поскольку допускается наличие многих разработчиков, использующих разные подходы
 * В модуле допускается реализация собственной парадигмы
 * Функцию View возлагается на tpl_ файлы, которые используются для подключения в контроллере
 * Функция Model возлагается на functions.php, который представляет собой коллекцию различных функций, обеспечивающих работу программы
 * Функция Controller возлагается на controller.php, в котором реализуется сценарий работы модуля
 * Роутинг представляет собой на данный момент обычное перемещение по файловой структуре
 */

// подключение библиотеки функций для работы программы
require('functions.php');

// подключение шаблона с интерфейсом
require('tpl_interface.php');

// источники
// // todo: добавить все источники
$sources = [
    'about'             => 'http://about.sfu-kras.ru/get-about', // 1842
    'admissions'        => 'http://admissions.sfu-kras.ru/get-admissions', // 83
    'edu'               => 'http://edu.sfu-kras.ru/get-edu', // 2215
    'sport'             => 'http://sport.sfu-kras.ru/get-sport', // 241
    'international'     => 'http://international.sfu-kras.ru/get-international', // 34
    'structure'         => 'https://structure.sfu-kras.ru/get-structure', // 4200
    // 'my'                => 'http://my.sfu-kras.ru/get-my',
    'research'          => 'http://research.sfu-kras.ru/get-research', // 9822
    'general'           => 'http://www.sfu-kras.ru/get-sfu', // 479
    'news'              => 'http://news.sfu-kras.ru/get-news', // 23758
    // 'photo'             => 'http://photo.sfu-kras.ru/get-photo',
    // 'tube'              => 'http://tube.sfu-kras.ru/get-tube',
];

//! начало выполнения программы
if ($_GET['directive'] == 'start') {

    // старт замера времени работы программы
    $time_start = microtime(true);

    // обход всех источников
    foreach ($sources as $k => $v) {

        $source_name    = $k;
        $host           = $v;

        // получение данных хоста
        $data = file_get_contents($host);
        $data = json_decode($data);

        // ограничение массива для тестирования
        // // todo: убрать ограничение массива
        // $data = array_slice($data, 0, 10);

        // echo '<pre>';
        // print_r($data);
        // echo '</pre>';

        // обход данных хоста
        foreach ($data as $mk => $mv) {

            // формирование данных для занесения в базу данных
            $time       = date('Y-m-d H:i:s');
            $type       = $mv->type;
            $name       = $mv->name;
            $link       = $mv->link;
            $position   = $mv->position;
            $avatar     = $mv->avatar;

            // преобразование некоторых данных
            $name = htmlspecialchars($name, ENT_QUOTES);

            // если есть путь к аватарке, то произойдет ее конвертация
            // TODO: нужно проверить есть ли в базе данных имена новых изображений
            // TODO: и как-то это должно работать рядом с нижней функцией занесения в базу данных

            // print $avatar . '<br>';

            // конструктор запроса для проверки
            $check = $pdo->query("SELECT id FROM search WHERE link = '$link'");
            // счетчик количества выполненных проверок
            $_SESSION['logs']['check_count'] += 1;

            // проверка наличия элемента в базе данных по link
            if (!$check->fetch(PDO::FETCH_OBJ)) {

                // если есть изображение            
                if ($avatar) {
                    // конвертация изображения
                    $file_name = _img_controller($avatar);
                    // счетчик сконвертированных изображений
                    $_SESSION['logs']['image_converter_count'] += 1;
                }

                // если записи не найдено, то формирование запроса
                // // todo: при занесении в базу данных информация с последней ячейки структуры задублировалась на все последующие записи
                $insert = "INSERT INTO search
                    (`source`, `name`, `alias`, `description`, `link`, `type`, `base_img`, `file_img`, `create`, `update`, `parameter_1`, `parameter_2`, `parameter_3`)
                VALUES
                    ('$source_name', '$name', '', '$position', '$link', '$type', '$avatar', '$file_name', '$time', '', '', '', '')";

                // очистка значение, чтобы оно не использовалось при дальнейшей работе с базой данных
                unset($file_name);

                // сохранение в базу данных
                if ($pdo->exec($insert)) {
                    // +1 за успешную транзакцию
                    $_SESSION['logs']['insert_count_success'] += 1;
                } else {
                    // +1 за неудавшуюся транзакцию
                    $_SESSION['logs']['insert_count_error'] += 1;
                    // формирование массива с записями, которые не удалось сохранить
                    $i += 1;
                    $_SESSION['logs']['insert_erro_row'][$i]['name'] = $name;
                    $_SESSION['logs']['insert_erro_row'][$i]['link'] = $link;
                    $_SESSION['logs']['insert_erro_row'][$i]['type'] = $type;
                }
            }
        }
    }

    // актуализация изображений на сервере в соответствии с информацией, хранимой в базе данных
    _img_refresh();

    // закрытие соединения с базой данных
    $pdo = null;

    // финалицация замера времени работы программы
    $time_end = microtime(true);
    $time_length = $time_end - $time_start;
    $time_length = number_format($time_length, 3);
    $_SESSION['logs']['code_time'] = $time_length;

    // редирект в конце
    // _general();
    header('Location: http://next.sfu-kras.ru/modules/search/controller.php');

}
//! конец выполнения программы


// дроп всей таблицы
// todo: добавить функцию удаления файлов с сервера
// // todo: добавить обновление id
if ($_GET['directive'] == 'delete_table_search') {

    // мягкое удаление: удаление выборочных записей по условию
    // $stmt = $pdo->query("DELETE FROM search WHERE 1 = 1");
    // возвращает количество удаленных строк
    // $stmt = $stmt->rowCount();

    // жосткое удаление: очистка всех записей и сброс счетчика идентификатора
    if ($pdo->query("TRUNCATE TABLE search")) {
        // информация о количестве удаленных строк
        $_SESSION['logs']['drop_table'] = 'true';
    }

    _img_drop();

    // редирект в конце
    _general();
}

// очистка логов
if ($_GET['directive'] == 'clear') {

    unset($_SESSION['logs']);

    // редирект в конце
    _general();
}
