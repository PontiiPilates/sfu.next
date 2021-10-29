<section class="news_for_desctop">
    <div class="news_slider">
        <div id="contentContainer">
            <div id="wrapper">

                <?php foreach ($section_ads as $v) : ?>
                    <?php if ($v['stop'] > $current_date) : ?>

                        <a href="<?= $v['link'] ?>" target="_blank" class="content_link">
                            <div id="itemOne" onmouseover="ChangeOver(this)" onmouseout="ChangeOut(this)" class="content <?= $v['color'] ?>-gradient for_brightness">
                                <h6><?= $v['title'] ?></h6>
                                <small><?= $v['text'] ?></small>
                            </div>
                        </a>

                    <?php endif; ?>
                <?php endforeach; ?>

            </div>
        </div>
        <div class="itemLinksLeft" onmouseover="RightButtonOver(this)" onmouseout="RightButtonOut(this)">
            <img src="img/VectorvectorLeft.png" class="slider_vector">
        </div>
        <div class="itemLinksRight" onmouseover="LeftButtonOver(this)" onmouseout="LeftButtonOut(this)">
            <img src="img/VectorvectorRight.png" class="slider_vector">
        </div>
    </div>

    <div class="slider-dots">

        <?php while ($i < count($section_ads)) : $i++ ?>

            <span class="slider-dots_item" onclick=""></span>

        <?php endwhile; ?>

    </div>
</section>