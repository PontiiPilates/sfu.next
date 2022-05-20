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
        $category = $v->category;
        $link = $v->link;
        $name = $v->name;
        $alias = $v->alias;

        $created_at     = date('Y-m-d H:i:s');
        $created_source = time();

        // применение псевдонима к поисковой таблице
        $sql = "SELECT id FROM $current_table WHERE link = '$link'";
        $sql = $pdo->query($sql);
        $id = $sql->fetchColumn();

        if ($id) {
            // если запись существует, то обновляем ее псевдоним
            $sql = "UPDATE $current_table SET alias = '$alias' WHERE id = '$id'";
            $sql = $pdo->exec($sql);
            // формирование лога
            if ($sql) {
                $_SESSION['logs']['Применено псевдонимов']++;
            }
        } else {
            // если записи нет, то добавляем 
            $sql = "INSERT INTO $current_table (
                           `source`,
                           `type`,
                           `name`,
                           `description`,
                           `alias`,
                           `link`,
                           `source_img`,
                           `filename_img`,
                           `created_at`,
                           `created_source`,
                           `changed_source`,
                           `status`,
                           `weight`
                        ) VALUES (
                           '$category',
                           '',
                           '$name',
                           '',
                           '$alias',
                           '$link',
                           '',
                           '',
                           '$created_at',
                           '$created_source',
                           '',
                           '1',
                           ''
                        )";
            if ($sql = $pdo->exec($sql)) {
                $_SESSION['logs']['Добавлено новых']++;
            } else {
                $_SESSION['logs']['Что-то пошло не так']++;
            }
        }
    }
}

/**
 * Реализация
 */
_db_aliases_exporter();
_to_general();
