function GetLatestTextToLocalStorage(textData) {
    localStorage.setItem('LastReadText', JSON.stringify(textData));
}

function getCurrentDate() { 
    var currentdate = new Date(); 
    var datetime = currentdate.getFullYear() + "-"
        + ((currentdate.getMonth()+1).toString()).padStart(2, '0')  + "-" 
        + (currentdate.getDate().toString()).padStart(2, '0') + " @ "  
        + (currentdate.getHours().toString()).padStart(2, '0') + ":"  
        + (currentdate.getMinutes().toString()).padStart(2, '0') + ":" 
        + (currentdate.getSeconds().toString()).padStart(2, '0');
    return datetime;
}

function ShowModal(modalTitle, modalBody) {
    var ModalError = $('#ModalError');
    ModalError.addClass('modalShow');
    $('.modal-title').text(modalTitle);
    $('.modal-body').text(modalBody);
    $('#ModalError .close-modal').on('click', function() {
        ModalError.removeClass('modalShow');
    });
    $('.close-button-modal').on('click', function() {
        ModalError.removeClass('modalShow');
    });    
}

$(document).ready(function () {

    // Initial Setup
    $('textarea[name="floatingImportText"]').val('');
    const buttonBrowse = $('.drag-drop-big button');
    const inputFileHidden = document.querySelector('.drag-area').querySelector('input');

    let x = $('.form-floating').offset().left + 15;
    let y = $('.form-floating').offset().top + $('.form-floating').height() + 10;
    $('#ErrorTitle').css('top', `${y}px`).css('left', `${x}px`);

    x = $('#formDesc').offset().left + 7.5;
    y = $('#formDesc').offset().top + $('#formDesc').height() + 10;
    $('#ErrorDesc').css('top', `${y}px`).css('left', `${x}px`);

    let currentFile;
    let uploadType;
    let isFileValid = false;

    // Event Listeners
    $('#importSelect').on('change', function (event) {
        const fileType = event.target.value;
        if (fileType == 'text') {
            $('#textUpload').css('display', 'block');
            $('#DragDrop').css('display', 'none');
        }
        else {
            $('#textUpload').css('display', 'none');
            $('#DragDrop').css('display', 'block');
        }
    });

    buttonBrowse.on('click', function(event) {
        event.preventDefault();
        inputFileHidden.click();
    });

    // Event Listeners - Browse Event

    inputFileHidden.addEventListener('change', function(event) {
        event.preventDefault();
        currentFile = this.files[0];
        dragArea.classList.add('active');
        renderFileUploadHandler(currentFile);
    });

    // Event Listeners - Drag & Drop Area
    const dragArea = document.querySelector('.drag-area');
    const dragText = document.querySelector('.drag-drop-big');

    dragArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dragText.innerHTML = 'Uncling File to Upload';
        dragArea.classList.add('active');
    });

    dragArea.addEventListener('dragleave', (event) => {
        dragText.innerHTML = 'Drag & Drop a File Here';
        dragArea.classList.remove('active');
    });

    dragArea.addEventListener('drop', (event) => {
        event.preventDefault();
        currentFile = event.dataTransfer.files[0];
        renderFileUploadHandler(currentFile);
    });

    // Event Listeners - File & Data Export to Server
    $('#uploadTextButton').last().on('click', function(event) {
        event.preventDefault();
        let sendData = new FormData();
        const title = $('#floatingInputTitle').val().trim();
        const description = $('#floatingInputDetails').val().trim();
        const text = $('#floatingImportText').val().trim();
        $('#ErrorText').css('display', 'none');

        if(title == '') {
            const errorMessage = $('#ErrorTitle');
            errorMessage.html('Title must not be empty');
            errorMessage.css('display', 'block');
            $('#ErrorDesc').css('display', 'none');
        }
        else if(title.length > 30 && description.length > 100) {
            const errorMessage_title = $('#ErrorTitle');
            errorMessage_title.html('Given title is too long');
            errorMessage_title.css('display', 'block');

            const errorMessage_desc = $('#ErrorDesc');
            errorMessage_desc.css('display', 'block');
        }
        else if(title.length > 30) {
            const errorMessage_title = $('#ErrorTitle');
            errorMessage_title.html('Given title is too long');
            errorMessage_title.css('display', 'block');
            $('#ErrorDesc').css('display', 'none');
        }
        else if(description.length > 100) {
            const errorMessage_desc = $('#ErrorDesc');
            errorMessage_desc.css('display', 'block');
            $('#ErrorTitle').css('display', 'none');
        }
        else {
            $('#ErrorTitle').css('display', 'none');
            $('#ErrorDesc').css('display', 'none');

            if($('#importSelect').val() == 'text')
            {
                if(text == '') {
                    const errorMessage_text = $('#ErrorText');
                    errorMessage_text.css('display', 'block');
                }
                else {
                    sendData.append('title', title);
                    sendData.append('description', description);
                    sendData.append('text', text);

                    var currentDate = getCurrentDate();

                    textData = {
                        title: title,
                        description: description,
                        creationTime: currentDate
                    }
                    GetLatestTextToLocalStorage(textData);

                    try {
                        $.ajax({
                            url: 'https://localhost:44369/api/usertextmanagementcontroller/uploadviatextbox',
                            headers: {
                                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                            },
                            type: 'POST',
                            data: sendData,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                if (response == 'Title Exists') {
                                    ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                                        `Text with this title already exists! Try different one and proceed again.`);
                                }
                                else if (response == 'Success') {
                                    alert('success');
                                    window.location.href = "https://localhost:44369/ReadText.aspx";
                                }
                            },
                            error: function () {
                                ShowModalPageUnexpectedError(`Watch Out!`, 'Wait and try later or try to log in again.');
                            }
                        });
                    }
                    catch {
                        ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
                    }
                }
            }
            else
            {
                if(isFileValid == false) {
                    return;
                }
                else {
                    sendData.append('title', title);
                    sendData.append('description', description);
                    sendData.append('file', currentFile);
                    sendData.append('upload-method', uploadType);

                    var currentDate = getCurrentDate();

                    textData = {
                        title: title,
                        description: description,
                        creationTime: currentDate
                    }
                    GetLatestTextToLocalStorage(textData);

                    try {
                        $.ajax({
                            url: 'https://localhost:44369/api/usertextmanagementcontroller/uploadviafile',
                            headers: {
                                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                            },
                            type: 'POST',
                            data: sendData,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                if (response == 'Title Exists') {
                                    ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                                        `Text with this title already exists! Try different one and proceed again.`);
                                }
                                else if (response == 'Success') {
                                    alert('success');
                                    window.location.href = "https://localhost:44369/ReadText.aspx";
                                }
                            },
                            error: function () {
                                ShowModalPageUnexpectedError(`Watch Out!`, 'Wait and try later or try to log in again.');
                            }
                        });
                    }
                    catch {
                        ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
                    }
                }
            }
        }
    });
    function renderFileUploadHandler(file) {
        // Render file upload
        const size = file.size / 1024 / 1024; // in MiB
        const name = file.name;
        const fileType = file.type;
        let validExtensions = $('#importSelect').val().split(' ');
        uploadType = validExtensions.pop();
        if (validExtensions.includes(fileType) && size <= 10) {
            $('.uploaded-file').css('display', 'block');

            switch (fileType) {
            case 'application/pdf':
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-pdf')
                    .attr('style', 'color: #b71540;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#b71540');
                $('.uploaded-file-description h2').css('color', '#b71540');
                $('.uploaded-file-description i').last().attr('class', 'fa-3x fas fa-check-circle')
                    .attr('style', 'color: #b71540;');
                break;
            case 'image/jpg':
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-image')
                    .attr('style', 'color: #686de0;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#686de0');
                $('.uploaded-file-description h2').css('color', '#686de0');
                $('.uploaded-file-description i').last().attr('class', 'fa-3x fas fa-check-circle')
                    .attr('style', 'color: #686de0;');
                break;
            case 'image/png':
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-image')
                    .attr('style', 'color: #686de0;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#686de0');
                $('.uploaded-file-description h2').css('color', '#686de0');
                $('.uploaded-file-description i').last().attr('class', 'fa-3x fas fa-check-circle')
                    .attr('style', 'color: #686de0;');
                break;
            case 'image/jpeg':
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-image')
                    .attr('style', 'color: #4834d4;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#4834d4');
                $('.uploaded-file-description h2').css('color', '#4834d4');
                $('.uploaded-file-description i').last().attr('class', 'fa-3x fas fa-check-circle')
                    .attr('style', 'color: #4834d4;');
                break;
            }

            if(name.replace('.pdf', '').replace('.png', '').replace('.jpg', '').replace('.jpeg', '').length >= 22) {
                $('.uploaded-file-description h2').text(name.replace('.pdf', '').replace('.png', '')
                    .replace('.jpg', '').replace('.jpeg', '').substring(0, 22).concat('...'));
            }
            else {
                $('.uploaded-file-description h2').text(name.replace('.pdf', '').replace('.png', '')
                    .replace('.jpg', '').replace('.jpeg', '').substring(0, 22));
            }
            $('.uploaded-file-description .progress-bar').attr('aria-valuenow', '100').text('100%')
                .css('width', '100%');
            
            isFileValid = true;
        }
        else {
            // Display alert
            $('.uploaded-file').css('display', 'block');

            switch (fileType) {
            case 'application/pdf':
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-pdf')
                    .attr('style', 'color: #b71540;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#b71540');
                break;
            case 'image/jpg':
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-image')
                    .attr('style', 'color: #686de0;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#686de0');
                break;
            case 'image/png':
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-image')
                    .attr('style', 'color: #686de0;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#686de0');
                break;
            case 'image/jpeg':
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-image')
                    .attr('style', 'color: #4834d4;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#4834d4');
                break;
            default:
                $('.uploaded-file-description i').first().attr('class', 'fa-5x fas fa-file-alt')
                    .attr('style', 'color: #004aad;');
                $('.uploaded-file-description .progress-bar').css('background-color', '#004aad');
                break;
            }

            if(name.replace('.pdf', '').replace('.png', '').replace('.jpg', '').replace('.jpeg', '').length >= 10) {
                $('.uploaded-file-description h2').text(name.replace('.pdf', '').replace('.png', '')
                    .replace('.jpg', '').replace('.jpeg', '').substring(0, 10).concat('... - File too big or has invalid format'));
                $('.uploaded-file-description h2').css('color', '#EA2027');
            }
            else {
                $('.uploaded-file-description h2').text(name.replace('.pdf', '').replace('.png', '')
                    .replace('.jpg', '').replace('.jpeg', '').substring(0, 10).concat(' - File too big or has invalid format'));
                $('.uploaded-file-description h2').css('color', '#EA2027');
            }
            const loadNumber = Math.round(Math.random(1,100)*100);
            $('.uploaded-file-description .progress-bar').attr('aria-valuenow', `${loadNumber}`)
                .text(`${loadNumber}%`).css('width', `${loadNumber}%`);

            $('.uploaded-file-description i').last().attr('class', 'fa-3x fas fa-exclamation-circle')
                .attr('style', 'color: #EA2027;');
            
            isFileValid = false;
        }
    }
});

