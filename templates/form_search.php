<form class="search_form" action="" method="get">

    <!-- Поле для поиска -->
    <div class="input-group shadow bg-white rounded">
        <input name="search" type="text" class="form-control form-control-lg search_form__search" id="search" placeholder="Поиск в СФУ" aria-label="Поиск в СФУ" aria-describedby="basic-addon2" <? if ($rq) : ?> value="<?= ($rq) ?>" <? endif; ?>>
        <div class="input-group-prepend">
            <button class="btn btn-outline-secondary btn-lg search_form__find_btn" type="submit">Найти</button>
        </div>
    </div>
    <!-- /Поле для поиска -->

    <!-- Селекторы поиска -->
    <div class="row">
        <div class="form-group col-md-3">
            <select name="sort" id="sort" class="form-select form-select-sm toMarginTop shadow-sm bg-white rounded search_form__sort_input">
                <option value="desc" <? if ($dsort == 'desc') : ?> selected <? endif; ?>>Сначала новые</option>
                <option value="asc" <? if ($dsort == 'asc') : ?> selected <? endif; ?>>Сначала старые</option>
            </select>
        </div>
        <div class="form-group col-md-2">
            <select name="selector" id="sections" class="form-select form-select-sm toMarginTop shadow-sm bg-white rounded search_form__part_input">
                <option value="" <? if ($selector == '') : ?> selected <? endif; ?>>Везде</option>
                <option value="about" <? if ($selector == 'about') : ?> selected <? endif; ?>>О вузе</option>
                <option value="admissions" <? if ($selector == 'admissions') : ?> selected <? endif; ?>>Поступление</option>
                <option value="edu" <? if ($selector == 'edu') : ?> selected <? endif; ?>>Обучение</option>
                <option value="international" <? if ($selector == 'international') : ?> selected <? endif; ?>>International</option>
                <option value="news" <? if ($selector == 'news') : ?> selected <? endif; ?>>Новости</option>
                <option value="research" <? if ($selector == 'research') : ?> selected <? endif; ?>>Наука</option>
                <option value="sport" <? if ($selector == 'sport') : ?> selected <? endif; ?>>Спорт</option>
                <option value="structure" <? if ($selector == 'structure') : ?> selected <? endif; ?>>Структура</option>
            </select>
        </div>
        <div class="form-group col-md-3 isWisible">

        </div>
        <div class="form-group col-md-2 isWisible">
            <input value="<?php if ($rds) { print $rds; } ?>" name="date_start" type="date" class="form-control form-control-sm toMarginTop" id="fromThisDate" placeholder="С данного числа">
        </div>
        <div class="form-group col-md-2 isWisible">
            <input value="<?php if ($rde) { print $rde; } ?>" name="date_end" type="date" class="form-control form-control-sm toMarginTop" id="byThisDate" placeholder="По данное число">
        </div>
    </div>
    <!-- /Селекторы поиска -->

    <?php
    $rrows = 15;
    $rstart = 0;
    ?>
    <input type="hidden" name="rows" value="<?= $rrows; ?>">
    <input type="hidden" name="start" value="<?= $rstart; ?>">

    <!-- <a class="btn btn-outline-secondary btn-sm" id="clean_btn" href="https://next.sfu-kras.ru/solr/public/index.php">Сброить значения</a> -->
    <button type="button" class="btn btn-outline-secondary btn-sm" id="clean_btn">Сбросить параметры</button>


</form>