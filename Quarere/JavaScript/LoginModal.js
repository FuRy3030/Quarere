let registerForm;
let loginForm;
let passwordResetForm;
let passwordSetForm;

if (document.getElementById('SessionID').value != "" && 
document.getElementById('SessionID').value != null)
{
    localStorage.setItem('id', document.getElementById('SessionID').value);
    localStorage.setItem('username', document.getElementById('Username').value);
}


function successfulRegisterModalHandler() {
    const registerSuccessfulModal = document.querySelector('.Register-Success');
    const loginSuccessfulModal = document.querySelector('.Login-Success');
    loginSuccessfulModal.style.top = (window.innerHeight / 8.5).toString() + 'px';
    registerSuccessfulModal.style.top = (window.innerHeight / 8.5).toString() + 'px';
    const backdrops = document.querySelectorAll('.backdrop');
    backdrops.forEach(backdrop => {
        backdrop.style.height = window.innerHeight.toString() + 'px';
        backdrop.style.width = window.innerWidth.toString() + 'px';
    });
    const backdropRegisterSuccessful = document.querySelector('.register-backrop');
    backdropRegisterSuccessful.addEventListener('click', function () {
        backdropRegisterSuccessful.style.display = 'none';
        registerSuccessfulModal.style.display = 'none';
    });
    const closeButtonRegister = document.querySelector('.close-register-success');
    closeButtonRegister.addEventListener('click', function () {
        registerSuccessfulModal.style.display = 'none';
        backdropRegisterSuccessful.style.display = 'none';
    });
    const loginModalButton = document.getElementById('RegisterSuccessButton');
    loginModalButton.addEventListener('click', function (event) {
        event.preventDefault();
        registerSuccessfulModal.style.display = 'none';
        backdropRegisterSuccessful.style.display = 'none';
        document.querySelector('.modal-login').style.display = 'block';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    const backdropLoginSuccessful = document.querySelector('.login-backdrop');
    backdropLoginSuccessful.addEventListener('click', function () {
        backdropLoginSuccessful.style.display = 'none';
        loginSuccessfulModal.style.display = 'none';
        window.location.reload();
    });
    const closeButtonLogin = document.querySelector('.close-login-success');
    closeButtonLogin.addEventListener('click', function () {
        backdropLoginSuccessful.style.display = 'none';
        loginSuccessfulModal.style.display = 'none';
        window.location.reload();
    });
    const dashboardRedirectButton = document.getElementById('LoginSuccessButton');
    dashboardRedirectButton.addEventListener('click', function(event) {
        event.preventDefault();
        loginSuccessfulModal.style.display = 'none';
        backdropLoginSuccessful.style.display = 'none';
        window.location.href = "https://localhost:44369/Dashboard.aspx";
    });
}

function renderCenterForms() {
    const windowHeight = window.innerHeight;
    const registerHeight = 780;
    let customTopMargin = 0;
    if (windowHeight - registerHeight > 0) {
        customTopMargin = (windowHeight - registerHeight) / 2;
    }
    else {
        customTopMargin = 0;
    }
    registerForm = document.querySelector('.register');
    registerForm.style.marginTop = customTopMargin.toString() + 'px';

    const loginHeight = 712.5;
    if (windowHeight - loginHeight > 0) {
        customTopMargin = (windowHeight - loginHeight) / 2;
    }
    else {
        customTopMargin = 0;
    }
    loginForm = document.querySelector('.login');
    loginForm.style.marginTop = customTopMargin.toString() + 'px';

    const passwordResetHeight = 721;
    if (windowHeight - passwordResetHeight > 0) {
        customTopMargin = (windowHeight - loginHeight) / 2;
    }
    else {
        customTopMargin = 0;
    }
    passwordResetForm = document.querySelector('.password-reset');
    passwordResetForm.style.marginTop = customTopMargin.toString() + 'px';

    const passwordSetHeight = 780;
    if (windowHeight - passwordSetHeight > 0) {
        customTopMargin = (windowHeight - loginHeight) / 2;
    }
    else {
        customTopMargin = 0;
    }
    passwordSetForm = document.querySelector('.new-password');
    passwordSetForm.style.marginTop = customTopMargin.toString() + 'px';
}

function formsEventsHandler() {
    const signUpOnButton = document.getElementById('login').querySelector('.alternative').querySelector('button');
    const loginOnButton = document.getElementById('register').querySelector('.alternative').querySelector('button');
    const passwordResetOnButton = document.getElementById('login').querySelector('.password-forgot');
    const passwordResetComeBackButton = document.getElementById('PasswordReset').querySelector('.alternative').querySelector('button');
    const passwordSetComeBackButton = document.getElementById('NewPasswordSet').querySelector('.alternative').querySelector('button');
    const closeIcon = document.querySelector('.modal-login').querySelector('i');

    signUpOnButton.addEventListener('click', (function (event) {
        event.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        passwordResetForm.style.display = 'none';
        passwordSetForm.style.display = 'none';
    }));

    loginOnButton.addEventListener('click', (function (event) {
        event.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        passwordResetForm.style.display = 'none';
        passwordSetForm.style.display = 'none';
    }));

    passwordResetOnButton.addEventListener('click', (function (event) {
        event.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        passwordResetForm.style.display = 'block';
        passwordSetForm.style.display = 'none';
    }));

    passwordSetComeBackButton.addEventListener('click', (function (event) {
        event.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        passwordResetForm.style.display = 'none';
        passwordSetForm.style.display = 'none';
    }));

    passwordResetComeBackButton.addEventListener('click', (function (event) {
        event.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        passwordResetForm.style.display = 'none';
        passwordSetForm.style.display = 'none';
    }));

    closeIcon.addEventListener('click', (function (event) {
        event.preventDefault();
        document.querySelector('.modal-login').style.display = 'none';
    }));
}

function centerHorizontallyAndVertically(element) {
    const windowWidth = window.innerWidth;
    const elementWidth = element.offsetWidth;
    const positionX = (windowWidth - elementWidth) / 2;
    element.style.left = positionX.toString() + 'px';

    const windowHeight = window.innerHeight;
    const elementHeight = element.offsetHeight;
    const positionY = (windowHeight - elementHeight) / 2;
    element.style.top = positionY.toString() + 'px';
}

function centerHorizontally(element) {
    const windowWidth = window.innerWidth;
    const elementWidth = element.offsetWidth;
    const positionX = (windowWidth - elementWidth) / 2;
    element.style.left = positionX.toString() + 'px';
}

function renderCenterSuccessModals() {
    centerHorizontally(document.querySelector('.Register-Success'));
    centerHorizontally(document.querySelector('.Login-Success'));
}

renderCenterForms();
formsEventsHandler();
successfulRegisterModalHandler();
renderCenterSuccessModals();

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}