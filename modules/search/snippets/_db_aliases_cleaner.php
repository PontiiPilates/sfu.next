<?php

/**
 * 
 */

function _db_aliases_cleaner()
{
    // предоставление доступа к переменной
    global $pdo;

    // подключение доступа к псевдонимам
    global $aliases;

    // очистка таблицы псевдонимов
    $sql = "TRUNCATE TABLE aliases";
    $sql = $pdo->query($sql);

    // создание лога
    if ($sql) {
        $_SESSION['logs']['Очистка таблицы псевдонимов'] = 'true';
    }
}

/**
 * Реализация
 */
_db_aliases_cleaner();
_to_general();
