<?php

/**
 * Библиотека функций для работы программы
 */

//! подключение сессии для хранения данных
session_start();

//! подключение файла с настройками
require('../../core/config.php');

//! подключение файла с псевдонимами
require('../../core/aliases.php');

/**
 * Редирект на главную
 * Назначение - очистка гет-параметров
 */
function _to_general()
{
    header('Location: http://next.sfu-kras.ru/modules/search/controller.php');
}

/**
 * Роутинг
 * Принимает гет-параметр
 * Подключает файл
 */
function route($get, $snippet)
{
    if ($_GET['directive'] == $get) {
        require("snippets/$snippet");
    }
}

/**
 * Измеряет время работы программы
 * Перед выполнением программы необходимо добавить @param: $time_start = microtime(true);
 * В конце программы необходимо вызвать функцию @param: _time_metric($time_start);
 */
function _time_metric($time_start)
{
    $time_end = microtime(true);
    $time_length = $time_end - $time_start;
    $time_length = number_format($time_length, 3);
    return $_SESSION['logs']['Выполнение программы заняло'] = $time_length;
}

/**
 * Останавливает работу программы, если ее выполнение занимает больше положенного времени
 * Перед выполнением программы необходимо добавить @param: $time_start = microtime(true);
 * Определение лимита находится: \core\config.php
 */
function _stop($time_start)
{
    // предоставление доступа к параметру конфигурации
    global $time_limit;

    $now = time() - $time_start;

    if ($now > $time_limit) die(_to_general());
}
