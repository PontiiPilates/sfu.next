<?php

/**
 * 
 */

function _db_aliases_exporter()
{
    // предоставление доступа к переменной
    global $pdo;

    // подключение доступа к псевдонимам
    global $aliases;

    // предоставление доступа к имени поисковой таблицы
    global $current_table;

    // получение всех псевдонимов из базы данных
    $sql = "SELECT * FROM aliases";
    $sql = $pdo->query($sql);
    $sql = $sql->fetchAll(PDO::FETCH_OBJ);

    // обход каждого псевдонима
    foreach ($sql as $v) {
        $link = $v->link;
        $alias = $v->alias;

        // применение псевдонима к поисковой таблице
        $sql = "SELECT id FROM $current_table WHERE link = '$link'";
        $sql = $pdo->query($sql);
        $id = $sql->fetchColumn();

        // если запись существует, то обновляем ее псевдоним
        // если записи нет, то добавляем 
        if ($id) {
            $sql = "UPDATE $current_table SET alias = '$alias' WHERE id = '$id'";
            $sql = $pdo->exec($sql);
            // формирование лога
            if ($sql) {
                $_SESSION['logs']['Применено псевдонимов']++;
            }
        }
    }
}

/**
 * Реализация
 */
_db_aliases_exporter();
_to_general();
