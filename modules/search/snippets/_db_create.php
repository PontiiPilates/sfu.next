<?php

/**
 * Создает новую поисковую таблицу для последующего наполнения данными
 * Создает запись о том, какая таблица была создана
 */

function _db_create()
{
    // предоставление доступа к переменной
    global $pdo;

    // предоставление доступа к переменной
    global $next_table;

    // создание таблицы
    $sql_1 = "
        CREATE TABLE $next_table (
            `id` int NOT NULL COMMENT 'идентификатор записи' AUTO_INCREMENT PRIMARY KEY,
            `source` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'алиас хоста, являющегося источником данных',
            `type` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'тип данных (например, для включения иконок)',
            `name` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'заголовок страницы, имя сотрудника',
            `description` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'описание страницы (например, должность)',
            `alias` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'псевдоним (высший приоритет для поиска)',
            `link` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'ссылка на страницу',
            `source_img` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'исходный адрес изображения',
            `filename_img` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'имя сконвертированного изображения',
            `created_at` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'дата создания записи',
            `created_source` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'дата появления записи в источнике',
            `changed_source` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'дата изменения записи в источнике',
            `status` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'участвует в поиске или нет',
            `weight` text COLLATE 'utf8_general_ci' NOT NULL COMMENT 'вес в поисковой выдаче'
            ) ENGINE='MyISAM' COLLATE 'utf8_general_ci'
        ";
    $sql_1 = $pdo->exec($sql_1);



    // проверка создания таблицы
    if ($sql_1 === 0) {
        $_SESSION['logs']['Создание новой таблицы'] = 'true';
        // занесение имени и даты созданной таблицы в таблицу
        $sql_2 = "INSERT INTO `migrate` (`name`, `status`, `created_at`) VALUES ('$next_table', 0, now())";
        $sql_2 = $pdo->exec($sql_2);
    } else {
        $_SESSION['logs']['Создание новой таблицы'] = 'false';
    }
}

/**
 * Реализация
 */
_db_create();
_to_general();
