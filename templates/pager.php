<?php

// Получение переменных, участвующих в запросе
parse_str($_SERVER['QUERY_STRING']);
?>


<?php

// Количество страниц
$page_count = $num_found / $rrows;
// Приведение количества страниц к целому числу, округлённому в большую сторону
$page_count = ceil($page_count);

// Курсор
$cursor = $start / $rows + 1;

?>






<nav aria-label="Page navigation example" class="navigation_count_page">

    <?
    // Показывать пагинатор если страниц больше одной
    if ($page_count > 1) :
    ?>
        <ul class="pagination justify-content-center">


            <!-- Если страница является первой, то кнопка должны быть отключенной -->
            <li class="page-item navigation_count_page__items <? if ($cursor == 1) : ?> disabled <? endif; ?>">
                <? $start = $start - $rows; ?>
                <a class="page-link" href='<? print "index.php?search=$search&selector=$selector&date_start=$date_start&date_end=$date_end&rows=$rows&start=$start&sort=$sort" ?>'>
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <?
            $page_start = 1;
            $page_end = 8;

            if ($cursor >= ($page_end - 1)) {
                $page_end = $cursor + 3;
                $page_start = $cursor - 3;
            }
            // print $cursor;
            // print '<br>';
            // print $page_count;
            // print '<br>';
            // print $page_end;
            ?>

            <?php for ($i = $page_start; $i <= $page_count; $i++) : ?>

                <li class="page-item navigation_count_page__items <? if ($cursor == $i) : ?> active <? endif; ?>">

                    <?php
                    // Преобразование значения старт
                    if ($i > 1) {
                        // Если страница больше первой, то высчитывать старт по формуле
                        $start = ($i - 1) * $rrows;
                    }
                    if ($i == 1) {
                        // Если страница первая, то старт будет дефолтным
                        $start = $rstart;
                    }

                    ?>

                    <a class="page-link items__item_link" href='<? print "index.php?search=$search&selector=$selector&date_start=$date_start&date_end=$date_end&rows=$rows&start=$start&sort=$sort" ?>'>
                        <?= $i ?>
                    </a>
                </li>
                <?
                if ($i == $page_end) {
                    break;
                }
                ?>

            <?php endfor; ?>


            <!-- Если страница является последней, то кнопка должны быть отключенной -->
            <li class="page-item navigation_count_page__items items__item_link <? if ($cursor == $page_count) : ?> disabled <? endif; ?>">
                <? $start = $cursor * $rows ?>
                <a class="page-link" href='<? print "index.php?search=$search&selector=$selector&date_start=$date_start&date_end=$date_end&rows=$rows&start=$start&sort=$sort" ?>'>
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>

        </ul>

    <? endif; ?>

</nav>



<?php
// Отладка
// echo '<pre>';
// print $cursor;
// echo '<br>';
// print $page_count;
// print_r($_GET);
// print_r($data->response->numFound);
// print_r($data->response->docs);
// print_r($data->highlighting);
// echo '</pre>';
?>