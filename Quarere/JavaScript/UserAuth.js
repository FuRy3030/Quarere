if (document.getElementById('SessionID').value != "" && 
document.getElementById('SessionID').value != null)
{
    localStorage.setItem('id', document.getElementById('SessionID').value);
    localStorage.setItem('username', document.getElementById('Username').value);
}

function ShowModalPageAccess(modalTitle, modalBody) {
    var ModalError = $('#ModalAuth');
    ModalError.addClass('modalShow');
    $('.modal-title').text(modalTitle);
    $('.modal-body').text(modalBody);
    $('#ModalAuth .close-modal').on('click', function() {
        ModalError.removeClass('modalShow');
        document.querySelector('.modal-login').style.display = 'block';
        let loginForm = document.querySelector('.login');
        let registerForm = document.querySelector('.register');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
    $('.modal-auth-button').on('click', function(event) {
        event.preventDefault();
        ModalError.removeClass('modalShow');
        document.querySelector('.modal-login').style.display = 'block';
        let loginForm = document.querySelector('.login');
        let registerForm = document.querySelector('.register');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });    
}

function ShowModalPageUnexpectedError(modalTitle, modalBody) {
    var ModalError = $('#ModalAuth');
    ModalError.addClass('modalShow');
    $('.modal-title').text(modalTitle);
    $('.modal-body').text(modalBody);
    $('#ModalAuth .close-modal').on('click', function() {
        ModalError.removeClass('modalShow');
    });
    $('.modal-auth-button').on('click', function(event) {
        event.preventDefault();
        ModalError.removeClass('modalShow');
        document.querySelector('.modal-login').style.display = 'block';
        let loginForm = document.querySelector('.login');
        let registerForm = document.querySelector('.register');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });    
}

if (localStorage.getItem('username') == 'notLogged') {
    ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
}