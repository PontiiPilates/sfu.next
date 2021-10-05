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


    $sql = "SELECT id, name FROM migrate WHERE status = 0";
    $sql = $pdo->query($sql);
    $sql = $sql->fetchAll(PDO::FETCH_ASSOC);

    foreach ($sql as $v) {
        $id = $v['id'];
        $name = $v['name'];

        $sql = $pdo->query("DROP TABLE $name");

        if ($sql) {
            $_SESSION['logs']['Удаление предшествующей таблицы'] = 'true';
        }

        $sql = "DELETE FROM migrate WHERE id = '$id'";
        $sql = $pdo->exec($sql);

        if ($sql) {
            $_SESSION['logs']['Удаление записи о предшествующей таблице'] = 'true';
        }
    }
}

/**
 ** Реализация
 */

$time_start = microtime(true);
_db_cleaner();
_time_metric($time_start);
_to_general();
