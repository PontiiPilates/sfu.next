<?php

/**
 * Изменяет таблицу для работы программы
 */

function _db_switch()
{

    global $pdo;
    global $next_table;
    global $current_table;

    // Использовать новую таблицу
    $sql = "UPDATE migrate SET status = 1 WHERE name = '$next_table'";
    $sql = $pdo->exec($sql);

    if ($sql) {
        $_SESSION['logs']['Использование новой таблицы в качестве рабочей'] = 'true';
    }

    // Прекратить использование старой таблицы
    $sql = "UPDATE migrate SET status = 0 WHERE name = '$current_table'";
    $sql = $pdo->exec($sql);

    if ($sql) {
        $_SESSION['logs']['Освобождение рабочей таблицы'] = 'true';
    }
}

_db_switch();
_to_general();
