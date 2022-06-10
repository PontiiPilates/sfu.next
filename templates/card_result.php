<!-- Информация о выдаче -->
<? if ($_GET['search']) : ?>
    <? if ($num_found) : ?>
        <p class="find_count_result card-text">Обнаружено <b><?= $num_found ?></b> результатов</p>
    <? else : ?>
        <p class="find_count_result card-text">По данному запросу ничего не найшлось :(</p>
    <? endif; ?>
<? endif; ?>
<!-- /Информация о выдаче -->

<?php
foreach ($data->response->docs as $item) {

    // Получение переменных
    $sid            = $item->id;
    $name           = $data->highlighting->$sid->name[0];
    $link           = $item->link[0];
    $text           = $data->highlighting->$sid->text[0];
    $timestamp      = $item->timestamp[0];
    $date           = date('Y-m-d', $timestamp);

    // Если поле name не найдено в highlights то, его получение происходит из docs
    if (!$name) {
        $name = $item->name[0];
    }
?>

    <div class="card find_item shadow bg-white rounded">
        <div class="card-body">
            <h5 class="card-title"><?= $name; ?></h5>
            <a href="<?= $link; ?>" class="find_item__item_link"><?= $link; ?></a>
            <p class="card-text find_item__item_text">...<?= $text; ?>...</p>
            <p class="card-text find_item__item_date"><?= $date; ?></p>
        </div>
    </div>

<?php
}
?>