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



    print '<pre>';
    foreach ($aliases as $k => $v) {
        $category = $k;
        foreach ($v as $mk => $mv) {
            $link = $mk;
            $alias = $mv;

            // добавление псевдонима в таблицу
            $sql = "INSERT INTO aliases (link, alias, category) VALUES ('$link','$alias','$category')";
            $sql = $pdo->exec($sql);

            if ($sql) {
                $_SESSION['logs']['Добавлено псевдонимов']++;
            }
        }
    }
    print '</pre>';
}

/**
 * Реализация
 */
_db_aliases_uploader();
_to_general();
