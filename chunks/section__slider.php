<?php foreach($section_agenda as $k => $v) : ?>

<!-- Desctop -->
<section class="banner-section desktop">
  <div class="container">
    <div class="row">
      <div class="col-md-12 col-sm-12">
        <div class="banner-container">
          <!-- <div class="banner-arrow banner-arrow-left"></div> -->
          <!-- <div class="banner-arrow banner-arrow-right"></div> -->
          <div class="owl-carousel banner-slides" style="opacity: 0">
            <div class="banner-slide">
              <a href="<?= $v['link'] ?>" class="banner-image" data-src="img/banner.png" style=" background-image: url(files/slider/<?= $v['image'] . $anti_cache ?>);"></a>
              <div class="banner-text-block">
                <h2 class="banner-head">
                  <a href="<?= $v['link'] ?>"><?= $v['title'] ?></a>
                </h2>
                <p class="banner-text"><?= $v['description'] ?></p>
                <a role="button" href="<?= $v['link'] ?>" class="banner-button">Подробнее</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- / Desctop -->

<!-- Mobile -->
<section class="banner-section banner-section-mobile mobile">
  <div class="mobile-scroller mobile-scroller-banners">
    <div class="banner-item">
      <div href="<?= $v['link'] ?>" class="banner-mobile" style="background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%), url(files/slider/<?= $v['image'] . $anti_cache ?>);">
        <div class="banner-mobile-content">
          <h2 class="banner-head-mobile"><?= $v['title'] ?></h2>
          <p class="banner-text banner-text-mobile"><?= $v['description'] ?></p>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- / Mobile -->

<?php endforeach; ?>