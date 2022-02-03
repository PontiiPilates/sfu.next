<footer class="footer fixed-bottom" style="border-top: 1px solid #dbdbdb">
    <div class="container">
        <div class="row">
            <div class="col-md-12 col-sm-12">
                <!-- <div class="footer-contacts">
                    <div>
                        <a href="#" class="footer-link footer-big-link">Редакция сайта</a>
                        <a href="#" class="footer-link footer-big-link">Контактная информация</a>
                        <a href="#" class="footer-link footer-big-link footer-big-link-last">Сообщить об ошибке</a>
                        <a href="#" class="footer-link">Сведения об образовательной организации</a>
                        <a href="#" class="footer-link">Противодействие коррупции</a>
                    </div>
                    <div class="footer-numbers">
                        <div class="footer-link-block">
                            <span href="#" class="footer-label">Единая справочная служба</span>
                            <a href="#" class="footer-link footer-big-link">+7 (391) 206-22-22</a>
                        </div>
                        <div class="footer-link-block">
                            <span href="#" class="footer-label">Приёмная комиссия</span>
                            <a href="#" class="footer-link footer-big-link">+7 (800) 500-73-63</a>
                            <a href="#" class="footer-link footer-big-link">+7 (391) 206-20-04</a>
                        </div>
                    </div>
                </div> -->
                <!--Кнопка обратной связи-->
                <div class="feedback">
                    <button type="button" class="btn btn-outline-secondary btn-sm feedBack_button">Сделать сайт лучше</button>
                </div>
                <!---->
                <div class="copyright">
                    <div class="copyright-sfu text-right sfu_copy">© Сибирский федеральный университет, 2006-2021</div>
                    <!-- <div class="copyright-sfu2">При использовании текстовых и графических материалов ссылка на сайт обязательна </div> -->
                </div>
            </div>
        </div>
    </div>
</footer>

<script>

    let winWidth = $(window).width();
    let footer = document.querySelector(".footer");

    if (winWidth < 1000) {
        footer.classList.remove('fixed-bottom');
    }else {
        footer.classList.add('fixed-bottom');
    }




    $(window).resize(function() {
        var curW = $(this).width(); 
        
        if (curW < 1000) {
            footer.classList.remove('fixed-bottom');
        } else {
            footer.classList.add('fixed-bottom');
        }
    });
</script>

<!--Стили для кнопки обратоно связи-->
<style>

    .feedback {
        position: absolute;
        right: 10px;
        top: 20px;
    }

    .btn-outline-secondary {
        border-radius: 3px;
    }

    .btn-outline-secondary:hover {
        transform: scale(1.03);
    }

    .btn-outline-secondary:focus {
        box-shadow: none;
    }

    @media (max-width: 1000px) {
        .feedBack_button {
            display: none;
        }

        .sfu_copy {
            text-align: center; 
        }
    }

</style>
<!---->