<!DOCTYPE html>
<html lang="ru">

<head>

  <?php require('chunks/head.php'); ?>

  <?php require('core/config.php'); ?>
  <?php require('core/contents.php'); ?>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

</head>

<body>




  <!--<button type="button" class="btn btn-primary feedbackBody" data-bs-toggle="modal" data-bs-target="#exampleModal">Сделать сайт лучше</button>

  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Обратная связь</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">Имя:</label>
              <input type="text" class="form-control" id="recipient-name" required>
            </div>
            <div class="mb-3">
              <label for="recipient-email" class="col-form-label">Почта:</label>
              <input type="email" class="form-control" id="recipient-email" required>
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label">Что бы вы хотели видеть на сайте:</label>
              <textarea class="form-control" id="message-text" required></textarea>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary form_button">Сделать сайт лучше</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <style>

    .feedbackBody {
      position: absolute;
      right: 5%;
      top: 5%;
      font-size: 12px;
      font-weight: 600;
      opacity: 0.6;
    }

    .feedbackBody:hover {
      opacity: 1;
    }


    .modal-body {
      border: none;
    }

    .modal-header {
      border: none;
    }

    .modal-footer {
      border: none;
    }

    .btn-primary {
      background: -webkit-linear-gradient(90deg, rgb(31, 237, 255), rgb(33, 123, 255));
      background: -moz-linear-gradient(90deg, rgb(31, 237, 255), rgb(33, 123, 255));
      background: linear-gradient(90deg, rgb(31, 237, 255), rgb(33, 123, 255));
      border-radius: 3px;
      border: none;
      outline: none;
    }


    .btn-primary:focus {
      box-shadow: none;
    }

    .btn-primary:hover {
      transform: scale(1.03);
      border: none;
    }

    @media (max-width: 1200px) {
      .feedbackBody {
        width: 100px;
      }
    }

    @media (max-width: 1000px) {
      .feedbackBody {
        display: none;
      }
    }

    /*.form-control {
      outline: none;
    }

    .form-control:focus {
      box-shadow: 0px 0px 5px 2px rgba(25, 145, 255, 0.5);
    }*/


  </style>-->
    <div class="modal fade myModel" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Обратная связь</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form> 
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="recipient-name" class="col-form-label">Имя:</label>
                            <input type="text" name="name" class="form-control recipient_name" id="recipient-name" required>
                        </div>
                        <div class="mb-3">
                            <label for="recipient-email" class="col-form-label">Почта:</label>
                            <input type="email" name="email" class="form-control recipient_email" id="recipient-email" required>
                        </div>
                        <div class="mb-3">
                            <label for="message-text" class="col-form-label">Что бы вы хотели видеть на сайте:</label>
                            <textarea class="form-control message_text form-control" name="text" id="message-text" required></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary add_feedback">Сделать сайт лучше</button>
                    </div>
                </form>
            </div>
        </div>


        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
          <div id="liveToastError" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
              <img src="img/mysfu_service.svg" class="rounded me-2" alt="logo_sfu">
              <strong class="me-auto"></strong>
              <small>прямо сейчас</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
            </div>
            <div class="toast-body">
              <p class="text-danger">Что то пошло не так! Повторите попытку позже!</p>
            </div>
          </div>
        </div>
    </div>



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

  <?php //require('chunks/section__ads.php'); ?>

  <?php //require('chunks/section__slider.php'); ?>

  <?php //require('chunks/section__news.php'); ?>

  <?php //require('chunks/section__annonces.php'); ?>

  <div class="position-fixed top-0 end-0 p-3" style="z-index: 100">
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

    <footer class="fixed-bottom">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-sm-12">
                    <div class="feedback">
                        <button type="button" class="btn btn-outline-secondary btn-sm feedBack_button">Сделать сайт лучше</button><!--data-bs-toggle="modal" data-bs-target="#exampleModal"-->
                    </div>  
                    <div class="copyright">
                        <div class="copyright-sfu text-right sfu_copy">© Сибирский федеральный университет, 2006-2021</div>
                    </div>
                </div>
            </div>
        </div>

        
    </footer>

    <script>

      $(document).ready(function(){
        $(".feedBack_button").click(function(){
          $("#exampleModal").modal('show');
        });
      });

      $(document).ready(function(){

        //let feedbackURL = 'https://next.sfu-kras.ru/modules/feedback/feedback.php?';
        //let myModel = document.querySelector(".myModel");
        //let requestFeedback = new XMLHttpRequest();
        let recipient_name = document.querySelector(".recipient_name");
        let recipient_email = document.querySelector(".recipient_email");
        let message_text = document.querySelector(".message_text");
        //let add_feedback_button = document.querySelector(".add_feedback");

        let toastLiveExample = document.getElementById('liveToast')
        let toastLiveExampleError = document.getElementById('liveToastError')
        $(".add_feedback").click(function(){
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
        });
      });
    </script>
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

  <?php require('chunks/scripts.php'); ?>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>

</html>