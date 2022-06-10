$(document).ready(function () {
    $(".feedBack_button").click(function () {
        $("#exampleModal").modal('show');
    });
});


$(document).ready(function () {
    let recipient_name = document.querySelector(".recipient_name");
    let recipient_email = document.querySelector(".recipient_email");
    let message_text = document.querySelector(".message_text");

    let toastLiveExample = document.getElementById('liveToast')
    let toastLiveExampleError = document.getElementById('liveToastError')

    $(".add_feedback").click(function () {
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
                }
            })
                .then(response => {
                    $("#exampleModal").modal('hide');
                    document.querySelector(".feedbackWindow").style.display = "block";
                    var toast = new bootstrap.Toast(toastLiveExample);
                    toast.show();
                    recipient_name.value = '';
                    recipient_email.value = '';
                    message_text.value = '';
                    message_text.classList.remove('is-valid');
                })
                .catch(err => {
                    document.querySelector(".errorModalWindow").style.display = "block";
                    var toastError = new bootstrap.Toast(toastLiveExampleError);
                    toastError.show();
                })
        }
    });

});