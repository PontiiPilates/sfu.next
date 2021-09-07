<?php

/**
 * Главный сценарий
 */

// подключение библиотеки функций для работы программы
require('functions.php');

/**
 * Маршрутизация
 */

//! первичное наполнение таблицы
route('uploader', '_db_uploader.php');

//! очистка таблицы
route('db_cleaner', '_db_cleaner.php');

//! очистка логов
route('lg_cleaner', '_lg_cleaner.php');

//! актуализация базы данных в сторону добавления
route('actualize_updater', '_db_actualize_updater.php');

//! актуализация базы данных в сторону удаления
route('actualize_deleter', '_db_actualize_deleter.php');

//! запрос статуса
route('db_status', '_db_status.php');

//! создать аватарки
route('img_upload', '_img_uploader.php');

//! очистить файлы на сервере
route('img_delete', '_img_deleter.php');

/**
 * Интерфейс
 */

require('tpl_interface.php');