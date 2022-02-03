<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Чего Вам не хватает на этом сайте?</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <form>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="recipient-name" class="col-form-label">Имя:</label>
                        <input name="name" type="text" class="form-control recipient_name" id="recipient-name">
                    </div>
                    <div class="mb-3">
                        <label for="recipient-email" class="col-form-label">Почта:</label>
                        <input name="email" type="email" class="form-control recipient_email" id="recipient-email">
                    </div>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">Рассмотрим любые пожелания и предложения:</label>
                        <textarea name="text" class="form-control message_text" id="message-text" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary add_feedback">Отправить</button>
                </div>
            </form>
        </div>
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
