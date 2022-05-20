<?php

/**
 * Происзодит наполнение таблицы псевдонимов из файла: core\aliases.php
 */

function _db_aliases_uploader()
{
    // предоставление доступа к переменной
    global $pdo;

    // предоставление доступа к переменной
    global $next_table;

    // подключение доступа к псевдонимам
    global $aliases;

    foreach ($aliases as $k => $v) {

        // Извлечение имени категории
        $category = $k;

        foreach ($v as $mk => $mv) {

            // Получение ссылки
            $link = $mk;
            // Получение псевдонима
            $alias = $mv;

            // Принято решение о записи несуществующего элемента в формате "псевдоним:заголовок"
            if (strpos($alias, ':')) {
                // Если обнаружена такая запись, то извлечение псевдонима и заголовка происходит следующим образом
                $data = explode(':', $alias);
                // Получение псевдонима
                $alias = $data[0];
                // Получение заголовка
                $name = $data[1];
            }

            // добавление псевдонима в таблицу
            $sql = "INSERT INTO aliases (link, name, alias, category) VALUES ('$link', '$name', '$alias','$category')";
            $sql = $pdo->exec($sql);

            // Удаление заголовка, иначе он продолжает поступать в базу данных
            unset($name);

            if ($sql) {
                $_SESSION['logs']['Добавлено псевдонимов']++;
            } else {
                $_SESSION['logs']['Не удалось добавить псевдоним']++;
            }
        }
    }
}

/**
 * Реализация
 */
_db_aliases_uploader();
_to_general();
