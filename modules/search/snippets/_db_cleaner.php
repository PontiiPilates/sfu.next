<?php

/**
 ** Очистка таблицы + обновление счетчика идентификаторов
 *
 * формирует лог о результатах работы
 */

function _db_cleaner()
{
    // предоставление доступа к PDO внутри функции
    global $pdo;

    // предоставление доступа к рабочей таблице
    global $table;

    if ($pdo->query("TRUNCATE TABLE $table")) {
        $_SESSION['logs']['Таблица очищена'] = 'true';
    } else {
        $_SESSION['logs']['Таблица очищена'] = 'false';
    }
}

/**
 ** Реализация
 */

$time_start = microtime(true);
_db_cleaner();
_time_metric($time_start);
_to_general();
