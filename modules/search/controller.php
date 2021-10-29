<?php

/**
 * Главный сценарий
 */

// подключение библиотеки функций для работы программы
require('functions.php');

/**
 * Маршрутизация
 */

//! запрос статуса
route('db_status', '_db_status.php');

//! очистка логов
route('lg_cleaner', '_lg_cleaner.php');

/**
 * Администрирование базы данных
 */

//! создание новой таблицы в базе данных
route('db_create', '_db_create.php');

//! первичное наполнение новой таблицы
route('db_uploader', '_db_uploader.php');

//! переключение на использование новой таблицы
route('db_switch', '_db_switch.php');

//! удаление всех таблиц кроме текущей
route('db_cleaner', '_db_cleaner.php');

/**
 * Администрирование таблицы псевдонимов
 */

//! формирование таблицы псевдонимов
route('db_aliases_uploader', '_db_aliases_uploader.php');

//! наполнение поисковой таблицы псевыдонимами
route('db_aliases_exporter', '_db_aliases_exporter.php');

//! очистка таблицы псевдонимов
route('db_aliases_cleaner', '_db_aliases_cleaner.php');

/**
 * Администрирование файлового хранилища
 */

//! создание временного хранилища
route('dir_create', '_dir_create.php');

//! создание портреты сотрудников
route('img_upload', '_img_uploader.php');

//! переключение с прежнего хранилища на следующее
route('dir_rename', '_dir_rename.php');

//! удаление прежнего хранилища
route('dir_delete', '_dir_delete.php');

/**
 * Интерфейс
 */

require('tpl_interface.php');
