class UserData {
    title;
    description;
    text;
    constructor(title, description, text) {
        this.title = title;
        this.description = description;
        this.text = text;
    }

    static GetUserData(title) {
        return new Promise(function(resolve, reject) {
            if (localStorage.getItem('TypeOfElement') == 'text') {
                $.ajax({
                    url: 'https://localhost:44369/api/usertexteditcontroller/getusertext',
                    headers: {
                        'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                    },
                    type: 'POST',
                    dataType: 'json',
                    data: title,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        alert('success');
                        resolve(response);
                    },
                    error: function(err) {
                        alert(err);
                        reject(err);
                    }
                });
            }
            else {
                resolve('error');
                reject('error');
            }
        });
    }

    static GetCollections() {
        return new Promise(function(resolve, reject) {
            if (localStorage.getItem('TypeOfElement') == 'text') {
                $.ajax({
                    url: 'https://localhost:44369/api/usertexteditcontroller/getusercollections',
                    headers: {
                        'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                    },
                    type: 'GET',
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        alert('success');                       
                        resolve(response);
                    },
                    error: function(err) {
                        alert(err);
                        reject(err);
                    }
                });
            }
            else {
                resolve('error');
                reject('error');
            }
        });
    }

    static UpdateUserTextTitle(newTitle, oldTitle) {
        if (newTitle != oldTitle) {
            $.ajax({
                url: 'https://localhost:44369/api/usertexteditcontroller/updatetexttitle',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'PUT',
                dataType: 'json',
                data: JSON.stringify({newTitle: newTitle, oldTitle: oldTitle}),
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('success');
                    if (response == 'Success') {
                        $('#TitleInput').val(newTitle);
                        EventListeners.prevTitle = newTitle;
                        EventListeners.UpdateLocalStorage('title', newTitle, oldTitle);
                    }
                    else if (response == 'Already Exists') {
                        EventListeners.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                            'One of your texts already has this title! Type a different one.');
                    }
                    else {
                        EventListeners.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                            'Something went wrong! Try again later.');
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        }
    }

    static UpdateUserTextDescription(newDescription, currentTitle) {
        $.ajax({
            url: 'https://localhost:44369/api/usertexteditcontroller/updatetextdescription',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({newDescription: newDescription, currentTitle: currentTitle}),
            processData: false,
            contentType: false,
            success: function(response) {
                alert('success');
                if (response == 'Success') {
                    $('#CollectionDescription').val(newDescription);
                    EventListeners.UpdateLocalStorage('description', newDescription, EventListeners.prevTitle);
                }
                else {
                    EventListeners.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                        'Something went wrong! Try again later.');
                }
            },
            error: function(err) {
                alert(err);               
            }
        });
    }

    static UpdateUserText(newText, currentTitle) {
        $.ajax({
            url: 'https://localhost:44369/api/usertexteditcontroller/updatetext',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({newText: newText, currentTitle: currentTitle}),
            processData: false,
            contentType: false,
            success: function(response) {
                alert('success');
                if (response == 'Success') {
                    $('#Text').val(newText);
                }
                else {
                    EventListeners.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                        'Something went wrong! Try again later.');
                }
            },
            error: function(err) {
                alert(err);               
            }
        });
    }

    static LoadText(title) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/usertextmanagementcontroller/loadfromexternalsource',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'POST',
                dataType: 'json',
                data: title,
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('loaded');
                    resolve(response);
                },
                error: function(err) {
                    alert('error');
                    reject();
                }
            });
        });
    }

    static LoadCollection(title) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/textwithcollectioncontroller/loadusercollection',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'POST',
                dataType: 'json',
                data: title,
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('loaded');
                    resolve(response);
                },
                error: function(err) {
                    alert('error');
                    reject();
                }
            });
        });
    }
}

class EventListeners {
    static prevTitle = '';
    static collectionTitlesList = [];

    static RenderUserCollections() {
        if (EventListeners.collectionTitlesList.length > 0) {
            EventListeners.collectionTitlesList.forEach(collectionTitle => {
                const UserCollection = document.createElement('div');
                UserCollection.classList.add('user-text-open-with-collection');
                UserCollection.innerHTML = 
                `<h3>${collectionTitle}</h3>
                <h2><i class="bi bi-journals"></i></h2>`;

                const CollectionsList = document.getElementById('TextList');
                CollectionsList.append(UserCollection);
                UserCollection.addEventListener('click', function() {
                    UserCollection.classList.toggle('user-text-open-with-collection-active');
                });
            });
        }
    }

    static UpdateTextTitle() {
        $('#TitleInput').on('change', function() {
            if ($(this).val().length > 100) {
                this.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Title cannot have more than 100 characters! Type a shorter one.');
            }
            else {
                UserData.UpdateUserTextTitle($(this).val(), EventListeners.prevTitle);
                $('#EditButtonTitle i').parent().prev().attr('readonly', true);
                $('#EditButtonTitle i').parent().prev().removeClass('TitleInput-active');
                $('#EditButtonTitle i').parent().removeClass('TitleButton-active');
            }
        });
    }

    static UpdateTextDescription() {
        $('#CollectionDescription').on('change', function() {
            if ($(this).val().length > 200) {
                this.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Description cannot have more than 200 characters! Type a shorter one.');
            }
            else {
                UserData.UpdateUserTextDescription($(this).val(), EventListeners.prevTitle);
                $('#DescriptionEdit i').parent().prev().attr('readonly', true);
                $('#DescriptionEdit i').parent().prev().removeClass('CollectionDescription-active');
                $('#DescriptionEdit i').parent().removeClass('CollectionDescriptionButton-active');
            }
        });
    }

    static UpdateText() {
        $('#Text').on('change', function() {
            if ($(this).val().length > 300000) {
                this.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Description cannot have more than 300000 characters! Type a shorter one.');
            }
            else {
                UserData.UpdateUserText($(this).val(), EventListeners.prevTitle);
            }
        });
    }

    static ShowModal(modalTitle, modalBody) {
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

    static UpdateLocalStorage(positionToUpdate, newValue, textTitle) {
        let recentTexts = JSON.parse(localStorage.getItem(`${localStorage.getItem('username')}RecentTexts`));
        console.log(recentTexts);
        const fixedElementIndex = recentTexts.findIndex(element => {
            return element.title == textTitle;
        });
        console.log(fixedElementIndex);
        recentTexts[fixedElementIndex][positionToUpdate] = newValue;
        recentTexts = JSON.stringify(recentTexts);
        localStorage.setItem(`${localStorage.getItem('username')}RecentTexts`, recentTexts);
        if (positionToUpdate == 'title') {
            localStorage.setItem('CurrentOpenElementTitle', newValue);
        }
    }
}

async function LoadData() {
    try {
        const userText = await UserData.GetUserData(localStorage.getItem('CurrentOpenElementTitle'));
        EventListeners.collectionTitlesList = await UserData.GetCollections();
        console.log(userText);
        let userData = new UserData(userText['Title'], userText['Description'], userText['Text']);
        $('#TitleInput').val(userData.title);
        $('#CollectionDescription').val(userData.description);
        $('#Text').val(userData.text);
        EventListeners.prevTitle = userData.title;
        console.log(EventListeners.prevTitle);
        EventListeners.UpdateText();
        EventListeners.UpdateTextDescription();
        EventListeners.UpdateTextTitle();

        const height = $('#TextData').height();
        $('#UserTexts').css('max-height', height + 'px');
        EventListeners.RenderUserCollections();
    }
    catch {
        ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
    }
}

LoadData();

$(document).ready(function() {
    $('#DescriptionEdit i').on('click', function() {
        if (!$(this).parent().prev().is('[readonly]')) {
            $(this).parent().prev().attr('readonly', true);
            $(this).parent().prev().removeClass('CollectionDescription-active');
            $(this).parent().removeClass('CollectionDescriptionButton-active');
        }
        else {
            $(this).parent().prev().attr('readonly', false);
            $(this).parent().prev().addClass('CollectionDescription-active');
            $(this).parent().addClass('CollectionDescriptionButton-active');
        }
    });

    $('#EditButtonTitle i').on('click', function() {
        if (!$(this).parent().prev().is('[readonly]')) {
            $(this).parent().prev().attr('readonly', true);
            $(this).parent().prev().removeClass('TitleInput-active');
            $(this).parent().removeClass('TitleButton-active');
        }
        else {
            $(this).parent().prev().attr('readonly', false);
            $(this).parent().prev().addClass('TitleInput-active');
            $(this).parent().addClass('TitleButton-active');
        }
    });

    $('#EditWithTextButton').on('click', function(event) {
        event.preventDefault();
        if ($('.user-text-open-with-collection-active').length > 1) {
            EventListeners.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                'You can select only one text at the time.');
        }
        else if ($('.user-text-open-with-collection-active').length == 0) {
            EventListeners.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                'You haven\'t selected any text. Select one and proceed.');
        }
        else {
            const title = $('.user-text-open-with-collection-active').children().first().text();
            console.log(title);
            Promise.all([UserData.LoadText(localStorage.getItem('CurrentOpenElementTitle')), UserData.LoadCollection(title)])
                .then(function(responses) {
                    let isValid = true;
                    responses.forEach(response => {
                        console.log(response);
                        if (response != "Success") {
                            isValid = false;
                        }
                    });
                    if (isValid) {
                        localStorage.setItem('CollectionTitle', title);
                        window.location.href = "https://localhost:44369/ReadTextWithCollection.aspx";
                    }
                });
        }
    });
});