<!DOCTYPE html>
<html lang="ru">

<head>

  <?php require('chunks/head.php'); ?>

  <?php require('core/config.php'); ?>
  <?php require('core/contents.php'); ?>

</head>

<body>
  <?php // require('chunks/section__top_menu.php'); 
  ?>
  <?php require('chunks/feedback_window.php'); ?>

  <section class="first">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-12">
          <div class="first-block">

            <?php require('chunks/section__title.php'); ?>

            <?php require('chunks/section__search.php'); ?>

            <?php require('chunks/section__service_icons.php'); ?>

          </div>
        </div>
      </div>
    </div>
  </section>

  <?php require('chunks/section__ads.php'); ?>

  <?php // require('chunks/section__slider.php'); 
  ?>
















  <?php // require('chunks/section__news.php'); 
  ?>

  <?php // require('chunks/section__annonces.php'); 
  ?>

  <div class="feedbackWindow position-fixed top-0 end-0 p-3" style="z-index: 100">
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <img src="img/mysfu_service.svg" class="rounded me-2" alt="logo_sfu">
        <strong class="me-auto"></strong>
        <small>прямо сейчас</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
      </div>
      <div class="toast-body">
        <p>Форма отправлена!</p>
      </div>
    </div>
  </div>

  <?php require('chunks/footer.php'); ?>

  <?php require('chunks/scripts.php'); ?>

  <script>
    $(document).ready(function() {
      $(".feedBack_button").click(function() {
        $("#exampleModal").modal('show');
      });
    });


    $(document).ready(function() {
      let recipient_name = document.querySelector(".recipient_name");
      let recipient_email = document.querySelector(".recipient_email");
      let message_text = document.querySelector(".message_text");

      let toastLiveExample = document.getElementById('liveToast')
      let toastLiveExampleError = document.getElementById('liveToastError')

      $(".add_feedback").click(function() {
        let empty_text = 0;

        if (message_text.value == '') {
          message_text.classList.remove('is-valid');
          message_text.classList.add('is-invalid');
          empty_text = 0;
        } else {
          message_text.classList.remove('is-invalid');
          message_text.classList.add('is-valid');
          empty_text = 1;
        }

        if (empty_text == 1) {
          $.ajax({
            type: 'GET',
            url: '/modules/feedback/feedback.php',
            data: {
              'name': recipient_name.value,
              'email': recipient_email.value,
              'text': message_text.value
            },
            success: function(res) {

              if (res == 1) {
                $("#exampleModal").modal('hide');
                var toast = new bootstrap.Toast(toastLiveExample);
                toast.show();
                recipient_name.value = '';
                recipient_email.value = '';
                message_text.value = '';
                message_text.classList.remove('is-valid');
              } else {
                var toastError = new bootstrap.Toast(toastLiveExampleError);
                toastError.show();
              }
            }
          });
        }
      });

    });
  </script>

  <style>
    @media (max-width: 1000px) {
      .feedbackWindow {
        display: none;
      }

    }

    @media (max-width: 770px) {
      .feedbackWindow {
        display: none;
      }
    }
  </style>

</body>

</html>