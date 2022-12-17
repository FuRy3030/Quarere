class UserDataAccess {
    title;
    description;
    creationTime;
    termsCount;
    flashcards;
    constructor() {
        this.title = '';
        this.description = '';
        this.creationTime = '';
        this.termsCount = 0;
        this.flashcards = [];
    }

    GetFullCollectionData() {
        return new Promise(function(resolve, reject) {
            if (localStorage.getItem('TypeOfElement') == 'collection') {
                $.ajax({
                    url: 'https://localhost:44369/api/usercollectionmanagementcontroller/getallcollections',
                    headers: {
                        'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                    },
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({title: localStorage.getItem('CurrentOpenElementTitle')}),
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

    static UpdateFlashcardElementViaAJAX(currentElementToUpdate, newElementValue, flashcardOrder, collectionTitle) {
        $.ajax({
            url: 'https://localhost:44369/api/usercollectionmanagementcontroller/updateflashcardfield',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                    element: currentElementToUpdate, 
                    newValue: newElementValue, 
                    flashcardOrder: flashcardOrder,
                    title: collectionTitle
                }),
            processData: false,
            contentType: false,
            success: function(response) {
                if (response == 'Success' && currentElementToUpdate == 'word') {
                    const identifier = (flashcardOrder - 1).toString();
                    $(`#Accordion-${identifier}`).children().children().children().children().first().text(newElementValue);
                }
                else if (response == 'Success' && currentElementToUpdate == 'meaning') {
                    const identifier = (flashcardOrder - 1).toString();
                    $(`#Accordion-${identifier}`).children().children().children().children().first().next().text(newElementValue);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    }

    static UpdateCollectionInfo(currentElementToUpdate, newElementValue, collectionTitle) {
        $.ajax({
            url: 'https://localhost:44369/api/usercollectionmanagementcontroller/updatecollectioninfo',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({element: currentElementToUpdate, newValue: newElementValue, title: collectionTitle}),
            processData: false,
            contentType: false,
            success: function(response) {
                if (response == 'Success') {
                    UserDataAccess.UpdateLocalStorage(currentElementToUpdate, newElementValue, collectionTitle);
                    if (currentElementToUpdate == 'title') {
                        currentTitle = newElementValue;
                    }
                } 
                else if (response == 'Error' && currentElementToUpdate == 'title') {
                    RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                        `Collection with this title already exists! Keep in mind that its title shouldn't contain '_' character`);
                }              
            },
            error: function(err) {
                alert(err);
            }
        });
    }

    static DeleteElementFromCollection(term, meaning, collectionTitle) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/usercollectionmanagementcontroller/deleteflashcard',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'DELETE',
                dataType: 'json',
                data: JSON.stringify({word: term, meaning: meaning, title: collectionTitle}),
                processData: false,
                contentType: false,
                success: function(response) {    
                    resolve(response);                 
                },
                error: function(err) {
                    alert(err);
                    reject(err);
                }
            });
        });
    }

    static MakeElementFavourite(term, meaning, collectionTitle, action) {
        $.ajax({
            url: 'https://localhost:44369/api/usercollectionmanagementcontroller/updatefavourites',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({word: term, meaning: meaning, title: collectionTitle, action: action}),
            processData: false,
            contentType: false,
            success: function(response) {                     
            },
            error: function(err) {
                alert(err);
            }
        });
    }

    static AddNewFlashcard(flashcardData, collectionTitle) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/usercollectionmanagementcontroller/addnewflashcard',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({flashcard: flashcardData, title: collectionTitle}),
                processData: false,
                contentType: false,
                success: function(response) {    
                    resolve(response);                 
                },
                error: function(err) {
                    alert(err);
                    reject(err);
                }
            });
        });
    }

    GetTexts() {
        return new Promise(function(resolve, reject) {
            if (localStorage.getItem('TypeOfElement') == 'collection') {
                $.ajax({
                    url: 'https://localhost:44369/api/usercollectionmanagementcontroller/gettexts',
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

    static UpdateLocalStorage(positionToUpdate, newValue, collectionTitle) {
        let recentCollections = JSON.parse(localStorage.getItem(`${localStorage.getItem('username')}RecentCollections`));
        console.log(recentCollections);
        const fixedElementIndex = recentCollections.findIndex(element => {
            return element.title == collectionTitle;
        });
        console.log(fixedElementIndex);
        recentCollections[fixedElementIndex][positionToUpdate] = newValue;
        recentCollections = JSON.stringify(recentCollections);
        console.log(recentCollections);
        localStorage.setItem(`${localStorage.getItem('username')}RecentCollections`, recentCollections);
        console.log(positionToUpdate);
        if (positionToUpdate == 'title') {
            localStorage.setItem('CurrentOpenElementTitle', newValue);
            console.log(newValue);
        }
    }

    static ChnageProgressLevelByUser(word, meaning, newLevel) {
        $.ajax({
            url: 'https://localhost:44369/api/progresstrackercontroller/updateprogresslevelbyuser',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                word: word,
                meaning: meaning,
                newValue: newLevel,
                title: localStorage.getItem('CurrentOpenElementTitle')
            }),
            processData: false,
            contentType: false,
        });
    }
}

class RenderContent extends UserDataAccess {
    listOfFlashcards;
    favouriteIconClass;
    progressLevel;
    identifier;
    textTitlesList;
    constructor() {
        super();
        this.textTitlesList = [];
        this.listOfFlashcards = [];
        this.favouriteIconClass = '';
        this.progressLevel = '';
        this.identifier = 0;
    }

    RenderedDataGenerator() {
        let date = '';
        let day = this.creationTime.substring(8, 10);
        switch (day) {
            case '1':
                day = day + 'st';
                break;
            case '2':
                day = day + 'nd';
                break;
            case '3':
                day = day + 'rd';
                break;
            default:
                day = day + 'th';
                break;
        }
        let month = parseInt(this.creationTime.substring(5, 7));
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 
            'November', 'December'];
        month = months[month - 1];
        const year = this.creationTime.substring(0, 4);
        const time = this.creationTime.substring(11);
        date = day + ' of ' + month + ' ' + year + ' ' + time;
        return date;
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

    RenderFullIntitalGeneralContent() {
        $('#TitleInput').val(this.title);
        $('#CollectionDescription').val(this.description);
        $('.additional-info-collection').first().text(`${this.termsCount} Terms,`);
        $('.additional-info-collection').last().text(this.RenderedDataGenerator());
    }

    RenderAllFlashcards() {
        this.flashcards.forEach(flashcard => {
            if (flashcard['IsFavourite'] == '1') { 
                this.favouriteIconClass = 'left-icon-active'; 
            }
            else if (flashcard['IsFavourite'] == '0') { 
                this.favouriteIconClass = ''; 
            }

            switch(flashcard['ProgressLevel']) {
                case '0':
                    this.progressLevel = 'progress-ring__circle_new';
                    break;
                case '1':
                    this.progressLevel = 'progress-ring__circle_not-remembered';
                    break;
                case '2':
                    this.progressLevel = 'progress-ring__circle_to-be-repeated';
                    break;
                case '3':
                    this.progressLevel = 'progress-ring__circle_remembered';
                    break;
                case '4':
                    this.progressLevel = 'progress-ring__circle_learnt';
                    break;
            }

            const UserFlashcard = document.createElement('div');
            UserFlashcard.classList.add('col-12');
            UserFlashcard.classList.add('full-flashcard');
            UserFlashcard.innerHTML = 
            `<div class="accordion-item" id="Accordion-${this.identifier}">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#FlashcardEdit-${this.identifier}" aria-expanded="false">
                        <div class="collection-item-word-meaning">
                            <svg class="progress-ring">
                                <circle
                                    class="${this.progressLevel} progress-level-${this.identifier}"
                                    stroke="blue"
                                    stroke-width="3"
                                    fill="transparent"
                                    r="0.5vw"
                                    cx="0.65vw"
                                    cy="0.65vw"
                                />
                            </svg>
                            <span class="left">${flashcard['Word']}</span>
                            <span class="right">${flashcard['Meaning']}</span>
                            <i class="bi bi-star-fill left-icon ${this.favouriteIconClass}"></i>
                            <i class="bi bi-trash2 right-icon"></i>
                        </div>
                    </button>
                </h2>
                <div id="FlashcardEdit-${this.identifier}" class="accordion-collapse collapse" aria-labelledby="accordion-button">
                    <div class="accordion-body">
                        <li class="flashcard mx-auto">
                            <div class="col-6" style="padding-right: 25px;">
                                <div class="top-flashcard-element">
                                    <input data-order="${this.identifier}" value="${flashcard['Word']}" type="text" class="Quarere-universal-input word" placeholder="Word/Phrase...">
                                    <label class="Quarere-universal-label">Term</label>
                                </div>
                                <div class="input-group">
                                    <div class="input-group-text flashcard-checkbox">
                                        <input class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input data-order="${this.identifier}" value="${flashcard['Synonyms']}" placeholder="Synonyms..." type="text" class="form-control Quarere-universal-input checkbox-input synonyms"/>
                                </div>
                                <div class="input-group mt-1">
                                    <div class="input-group-text flashcard-checkbox">
                                        <input class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <div class="form-floating textarea-floating">
                                        <textarea data-order="${this.identifier}" class="form-control textarea-flashcard example" placeholder="for-label">${flashcard['Example']}</textarea>
                                        <label class="textarea-label-flashcard">Exemplary Usage</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6" style="padding-left: 25px;">
                                <div class="top-flashcard-element">
                                    <input data-order="${this.identifier}" value="${flashcard['Meaning']}" placeholder="Definition..." type="text" class="Quarere-universal-input meaning"/>
                                    <label class="Quarere-universal-label">Meaning</label>
                                </div>
                                <div class="input-group">
                                    <div class="input-group-text flashcard-checkbox">
                                        <input class="form-check-input mt-0" type="checkbox" value="">
                                    </div>                                   
                                    <input data-order="${this.identifier}" value="${flashcard['NativeDef']}" placeholder="Native Language Definition..." type="text" class="form-control Quarere-universal-input checkbox-input native_definition"/>                                    
                                </div>
                                <div class="input-group mt-1">
                                    <div class="input-group-text flashcard-checkbox">
                                        <input class="form-check-input mt-0" type="checkbox" value="">
                                    </div>                                   
                                    <div class="form-floating textarea-floating">
                                        <textarea data-order="${this.identifier}" class="form-control textarea-flashcard in_context_example" placeholder="for-label">${flashcard['InContext']}</textarea>
                                        <label class="textarea-label-flashcard">"InContext" Usage</label>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </div>
                </div>
            </div>`;

            this.listOfFlashcards.push({
                word: flashcard['Word'].toLowerCase(), 
                meaning: flashcard['Meaning'].toLowerCase(), 
                HTMLObject: UserFlashcard
            });
            const FlashcardList = document.getElementById('CollectionElementsList');
            FlashcardList.append(UserFlashcard);

            const tooltipProgressToggler = document.createElement('div');
            tooltipProgressToggler.classList.add('progress-configure-tooltip');
            tooltipProgressToggler.innerHTML = 
            `<svg class="progress-ring progress-ring-tooltip">
                <circle
                    class="progress-ring__circle_new"
                    stroke="blue"
                    stroke-width="3"
                    fill="transparent"
                    r="0.5vw"
                    cx="0.65vw"
                    cy="0.65vw"
                />
            </svg>
            <span class="progress-ring-tooltip-text">New Term</span>
            <svg class="progress-ring progress-ring-tooltip">
                <circle
                    class="progress-ring__circle_not-remembered"
                    stroke="blue"
                    stroke-width="3"
                    fill="transparent"
                    r="0.5vw"
                    cx="0.65vw"
                    cy="0.65vw"
                />
            </svg>
            <span class="progress-ring-tooltip-text">Unfamiliar Term</span>
            <svg class="progress-ring progress-ring-tooltip">
                <circle
                    class="progress-ring__circle_to-be-repeated"
                    stroke="blue"
                    stroke-width="3"
                    fill="transparent"
                    r="0.5vw"
                    cx="0.65vw"
                    cy="0.65vw"
                />
            </svg>
            <span class="progress-ring-tooltip-text">Partially Remembered Term</span>
            <svg class="progress-ring progress-ring-tooltip">
                <circle
                    class="progress-ring__circle_remembered"
                    stroke="blue"
                    stroke-width="3"
                    fill="transparent"
                    r="0.5vw"
                    cx="0.65vw"
                    cy="0.65vw"
                />
            </svg>
            <span class="progress-ring-tooltip-text">Understood Term</span>
            <svg class="progress-ring progress-ring-tooltip">
                <circle
                    class="progress-ring__circle_learnt"
                    stroke="blue"
                    stroke-width="3"
                    fill="transparent"
                    r="0.5vw"
                    cx="0.65vw"
                    cy="0.65vw"
                />
            </svg>
            <span class="progress-ring-tooltip-text">Mastered Term</span>`;

            FlashcardList.append(tooltipProgressToggler);
            AdjustToolipPosition($(tooltipProgressToggler), $(`.progress-level-${this.identifier}`));

            $(`.progress-level-${this.identifier}`).on('click', function(event) {
                event.stopImmediatePropagation();
                const parentElement = $(this).parent().parent().parent();
                if ($(this).parent().parent().parent().parent().next().height() == 0) {
                    parentElement.addClass('collapsed');
                    parentElement.parent().next().addClass('hidden');
                    parentElement.parent().next().addClass('collapse');
                    parentElement.parent().next().removeClass('collapsing');
                    setTimeout(function() {
                        parentElement.parent().next().removeClass('show');
                    }, 400);
                }
                else {
                    parentElement.removeClass('collapsed');
                    parentElement.parent().next().removeClass('hidden');
                    parentElement.parent().next().removeClass('collapse');
                    parentElement.parent().next().removeClass('collapsing');
                    parentElement.parent().next().addClass('show');
                }

                if ($(tooltipProgressToggler).css('visibility') == 'hidden') {
                    $(tooltipProgressToggler).css('visibility', 'visible');
                    $(tooltipProgressToggler).css('opacity', '1');
                }
                else {
                    $(tooltipProgressToggler).css('visibility', 'hidden');
                    $(tooltipProgressToggler).css('opacity', '0');
                }

                $(tooltipProgressToggler).siblings('.progress-configure-tooltip').each(function() {
                    $(this).css('visibility', 'hidden');
                    $(this).css('opacity', '0');
                });
            });

            $(tooltipProgressToggler).children().on('click', function() {
                switch ($(this).children().first().attr('class')) {
                    case 'progress-ring__circle_new':
                        UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 0);
                        $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#95a5a6');
                        $(this).parent().css('visibility', 'hidden');
                        $(this).parent().css('opacity', '0');
                        break;
                    case 'progress-ring__circle_not-remembered':
                        UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 1);
                        $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#c23616');
                        $(this).parent().css('visibility', 'hidden');
                        $(this).parent().css('opacity', '0');
                        break;
                    case 'progress-ring__circle_to-be-repeated':
                        UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 2);
                        $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#f39c12');
                        $(this).parent().css('visibility', 'hidden');
                        $(this).parent().css('opacity', '0');
                        break;
                    case 'progress-ring__circle_remembered':
                        UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 3);
                        $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#33FF00');
                        $(this).parent().css('visibility', 'hidden');
                        $(this).parent().css('opacity', '0');
                        break;
                    case 'progress-ring__circle_learnt':
                        UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 4);
                        $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#27ae60');
                        $(this).parent().css('visibility', 'hidden');
                        $(this).parent().css('opacity', '0');
                        break;
                }
            });

            $(tooltipProgressToggler).children('.progress-ring-tooltip').hover(function() {
                const $currentElement = $(this);
                setTimeout(function() {
                    if ($currentElement.filter(':hover').length > 0) {
                        $currentElement.next().show(500);
                    }
                }, 300);
            }, function() {
                $(this).next().hide(500);
            });

            this.identifier = this.identifier + 1;
        });
    }

    RenderNewFlashcard() {
        const UserFlashcard = document.createElement('div');
        UserFlashcard.classList.add('col-12');
        UserFlashcard.classList.add('full-flashcard');
        UserFlashcard.innerHTML = 
        `<div class="accordion-item" id="Accordion-${this.identifier}">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#FlashcardEdit-${this.identifier}" aria-expanded="false">
                    <div class="collection-item-word-meaning">
                        <svg class="progress-ring">
                            <circle
                                class="progress-ring__circle_new"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                            />
                        </svg>
                        <span class="left">Word</span>
                        <span class="right">Meaning</span>
                        <i class="bi bi-star-fill left-icon invisible"></i>
                        <i class="bi bi-trash2 right-icon invisible"></i>
                    </div>
                </button>
            </h2>
            <div id="FlashcardEdit-${this.identifier}" class="accordion-collapse collapse show" aria-labelledby="accordion-button">
                <div class="accordion-body">
                    <li class="flashcard mx-auto">
                        <div class="col-6" style="padding-right: 25px;">
                            <div class="top-flashcard-element">
                                <input data-order="${this.identifier}" value="" type="text" class="Quarere-universal-input word" placeholder="Word/Phrase...">
                                <label class="Quarere-universal-label">Term</label>
                            </div>
                            <div class="input-group">
                                <div class="input-group-text flashcard-checkbox">
                                    <input class="form-check-input mt-0" type="checkbox" value="">
                                </div>
                                <input data-order="${this.identifier}" value="" placeholder="Synonyms..." type="text" class="form-control Quarere-universal-input checkbox-input synonyms"/>
                            </div>
                            <div class="input-group mt-1">
                                <div class="input-group-text flashcard-checkbox">
                                    <input class="form-check-input mt-0" type="checkbox" value="">
                                </div>
                                <div class="form-floating textarea-floating">
                                    <textarea data-order="${this.identifier}" value="" class="form-control textarea-flashcard example" placeholder="for-label"></textarea>
                                    <label class="textarea-label-flashcard">Exemplary Usage</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-6" style="padding-left: 25px;">
                            <div class="top-flashcard-element">
                                <input data-order="${this.identifier}" value="" placeholder="Definition..." type="text" class="Quarere-universal-input meaning"/>
                                <label class="Quarere-universal-label">Meaning</label>
                            </div>
                            <div class="input-group">
                                <div class="input-group-text flashcard-checkbox">
                                    <input class="form-check-input mt-0" type="checkbox" value="">
                                </div>                                   
                                <input data-order="${this.identifier}" value="" placeholder="Native Language Definition..." type="text" class="form-control Quarere-universal-input checkbox-input native_definition"/>                                    
                            </div>
                            <div class="input-group mt-1">
                                <div class="input-group-text flashcard-checkbox">
                                    <input class="form-check-input mt-0" type="checkbox" value="">
                                </div>                                   
                                <div class="form-floating textarea-floating">
                                    <textarea data-order="${this.identifier}" value="" class="form-control textarea-flashcard in_context_example" placeholder="for-label"></textarea>
                                    <label class="textarea-label-flashcard">"InContext" Usage</label>
                                </div>
                            </div>
                            <div class="SubmitNewFlashcard-container">
                                <button id="SubmitNewFlashcard">
                                    <span id="SubmitNewFlashcardText" class="add-collection-element-text">Save</span>
                                    <span id="SubmitNewFlashcardIcon" class="add-collection-element-icon"><i class="fas fa-check"></i></span>
                                </button>
                            </div>
                        </div>
                    </li>
                </div>              
            </div>
        </div>`;

        const FlashcardList = document.getElementById('CollectionElementsList');
        FlashcardList.append(UserFlashcard);
        this.identifier = this.identifier + 1;
        AdjustContentHeight();

        var jQueryTrashIcon = $(UserFlashcard).children().children().first()
            .children().children().children().last();
        var jQueryStarIcon = $(UserFlashcard).children().children().first()
            .children().children().children().last().prev();
        var jQueryInputWord = $(UserFlashcard).children().children().last()
            .children().children().children().first()
            .children().first()
            .children().first();
        var jQueryInputMeaning = $(UserFlashcard).children().children().last()
            .children().children().children().last()
            .children().first()
            .children().first();
        var jQueryInputSynonyms = $(UserFlashcard).children().children().last()
            .children().children().children().first()
            .children().first().next()
            .children().last();
        var jQueryInputNativeDef = $(UserFlashcard).children().children().last()
            .children().children().children().last()
            .children().first().next()
            .children().last();
        var jQueryInputExample = $(UserFlashcard).children().children().last()
            .children().children().children().first()
            .children().last()
            .children().last()
            .children().first();
        var jQueryInputInContext = $(UserFlashcard).children().children().last()
            .children().children().children().last()
            .children().last().prev()
            .children().last()
            .children().first();

        jQueryInputWord.on('keyup', function() {
            $(UserFlashcard).children().children().first().children().children().children().first().text($(this).val());
        });
        jQueryInputMeaning.on('keyup', function() {
            $(UserFlashcard).children().children().first().children().children().children().first().next().text($(this).val());
        });

        $('#SubmitNewFlashcard').on('click', function(event) {
            event.preventDefault();
            const submitButton = $(this);
            if (jQueryInputWord.val().trim() == '' || jQueryInputWord.val().trim().length > 250) {
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Either term field is empty or it has exceeded character limit! Keep in mind that "term" can contain at most 250 characters.');
            }
            else if (jQueryInputMeaning.val().trim() == '' || jQueryInputMeaning.val().trim().length > 500) {
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Either meaning field is empty or it has exceeded character limit! Keep in mind that "meaning" can contain at most 500 characters.');
            }
            else if (jQueryInputSynonyms.val().trim().length > 250) {
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Synonyms have exceeded thier character limit! Keep in mind that synonyms can contain at most 250 characters.');
            }
            else if (jQueryInputNativeDef.val().trim().length > 250) {
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Native Language Definition has exceeded its character limit! Keep in mind that it can contain at most 250 characters.');
            }
            else if (jQueryInputExample.val().trim().length > 500) {
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Example word usage has exceeded its character limit! Keep in mind that it can contain at most 500 characters.');
            }
            else if (jQueryInputInContext.val().trim().length > 750) {
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    'Example from given text has exceeded its character limit! Keep in mind that it can contain at most 750 characters.');
            }
            else {
                let Flashcard = {
                    word: jQueryInputWord.val().trim(),
                    meaning: jQueryInputMeaning.val().trim(),
                    synonyms: jQueryInputSynonyms.val().trim(),
                    example: jQueryInputExample.val().trim(),
                    nativeDef: jQueryInputNativeDef.val().trim(),
                    inContext: jQueryInputInContext.val().trim()
                }
                UserDataAccess.AddNewFlashcard(Flashcard, localStorage.getItem('CurrentOpenElementTitle')).then(function(response) {
                    if (response == 'Success') {
                        submitButton.remove();
                        jQueryStarIcon.removeClass('invisible');
                        jQueryTrashIcon.removeClass('invisible');
                        DynamicEventListeners.NewFlashcardFavoriteItemToggler();
                        DynamicEventListeners.NewFlashcardTrashIconHandler();
                        DynamicEventListeners.NewFlashcardEditShow();
                        DynamicEventListeners.UpdateNewFlashcardElements();
                        DynamicEventListeners.MeaningTextToSpeechHandlerNewFlashcard();
                        DynamicEventListeners.WordTextToSpeechHandlerNewFlashcard();
                        const termsNumberString = $('.additional-info-collection').first().text().split(' ')[0];
                        const termsNumber = parseInt(termsNumberString) + 1;
                        $('.additional-info-collection').first().text(`${termsNumber} Terms,`);
                        AdjustContentHeight();

                        DataAccessAndRender.listOfFlashcards.push({
                            word: jQueryInputWord.val().trim(), 
                            meaning: jQueryInputMeaning.val().trim(), 
                            HTMLObject: UserFlashcard
                        });

                        const tooltipProgressToggler = document.createElement('div');
                        tooltipProgressToggler.classList.add('progress-configure-tooltip');
                        tooltipProgressToggler.innerHTML = 
                        `<svg class="progress-ring progress-ring-tooltip">
                            <circle
                                class="progress-ring__circle_new"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                            />
                        </svg>
                        <span class="progress-ring-tooltip-text">New Term</span>
                        <svg class="progress-ring progress-ring-tooltip">
                            <circle
                                class="progress-ring__circle_not-remembered"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                            />
                        </svg>
                        <span class="progress-ring-tooltip-text">Unfamiliar Term</span>
                        <svg class="progress-ring progress-ring-tooltip">
                            <circle
                                class="progress-ring__circle_to-be-repeated"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                            />
                        </svg>
                        <span class="progress-ring-tooltip-text">Partially Remembered Term</span>
                        <svg class="progress-ring progress-ring-tooltip">
                            <circle
                                class="progress-ring__circle_remembered"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                            />
                        </svg>
                        <span class="progress-ring-tooltip-text">Understood Term</span>
                        <svg class="progress-ring progress-ring-tooltip">
                            <circle
                                class="progress-ring__circle_learnt"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                            />
                        </svg>
                        <span class="progress-ring-tooltip-text">Mastered Term</span>`;

                        FlashcardList.append(tooltipProgressToggler);
                        AdjustToolipPosition($(tooltipProgressToggler), $(`.progress-level-${this.identifier}`));

                        $(`.progress-level-${this.identifier}`).on('click', function(event) {
                            event.stopImmediatePropagation();
                            const parentElement = $(this).parent().parent().parent();
                            if ($(this).parent().parent().parent().parent().next().height() == 0) {
                                parentElement.addClass('collapsed');
                                parentElement.parent().next().addClass('hidden');
                                parentElement.parent().next().addClass('collapse');
                                parentElement.parent().next().removeClass('collapsing');
                                setTimeout(function() {
                                    parentElement.parent().next().removeClass('show');
                                }, 400);
                            }
                            else {
                                parentElement.removeClass('collapsed');
                                parentElement.parent().next().removeClass('hidden');
                                parentElement.parent().next().removeClass('collapse');
                                parentElement.parent().next().removeClass('collapsing');
                                parentElement.parent().next().addClass('show');
                            }
            
                            if ($(tooltipProgressToggler).css('visibility') == 'hidden') {
                                $(tooltipProgressToggler).css('visibility', 'visible');
                                $(tooltipProgressToggler).css('opacity', '1');
                            }
                            else {
                                $(tooltipProgressToggler).css('visibility', 'hidden');
                                $(tooltipProgressToggler).css('opacity', '0');
                            }
            
                            $(tooltipProgressToggler).siblings('.progress-configure-tooltip').each(function() {
                                $(this).css('visibility', 'hidden');
                                $(this).css('opacity', '0');
                            });
                        });
            
                        $(tooltipProgressToggler).children().on('click', function() {
                            switch ($(this).children().first().attr('class')) {
                                case 'progress-ring__circle_new':
                                    UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 0);
                                    $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#95a5a6');
                                    $(this).parent().css('visibility', 'hidden');
                                    $(this).parent().css('opacity', '0');
                                    break;
                                case 'progress-ring__circle_not-remembered':
                                    UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 1);
                                    $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#c23616');
                                    $(this).parent().css('visibility', 'hidden');
                                    $(this).parent().css('opacity', '0');
                                    break;
                                case 'progress-ring__circle_to-be-repeated':
                                    UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 2);
                                    $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#f39c12');
                                    $(this).parent().css('visibility', 'hidden');
                                    $(this).parent().css('opacity', '0');
                                    break;
                                case 'progress-ring__circle_remembered':
                                    UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 3);
                                    $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#33FF00');
                                    $(this).parent().css('visibility', 'hidden');
                                    $(this).parent().css('opacity', '0');
                                    break;
                                case 'progress-ring__circle_learnt':
                                    UserDataAccess.ChnageProgressLevelByUser(flashcard['Word'], flashcard['Meaning'], 4);
                                    $(this).parent().prev().find('.progress-ring').first().children().first().css('stroke', '#27ae60');
                                    $(this).parent().css('visibility', 'hidden');
                                    $(this).parent().css('opacity', '0');
                                    break;
                            }
                        });
            
                        $(tooltipProgressToggler).children('.progress-ring-tooltip').hover(function() {
                            const $currentElement = $(this);
                            setTimeout(function() {
                                if ($currentElement.filter(':hover').length > 0) {
                                    $currentElement.next().show(500);
                                }
                            }, 300);
                        }, function() {
                            $(this).next().hide(500);
                        });
            
                        this.identifier = this.identifier + 1;
                    }
                });
            }
        });
    }

    RenderUserTexts() {
        if ( this.textTitlesList.length > 0) {
            this.textTitlesList.forEach(textTitle => {
                const UserText = document.createElement('div');
                UserText.classList.add('user-text-open-with-collection');
                UserText.innerHTML = 
                `<h3>${textTitle}</h3>
                <h2><i class="bi bi-journal-richtext"></i></h2>`;

                const TextsList = document.getElementById('TextList');
                TextsList.append(UserText);
                UserText.addEventListener('click', function() {
                    UserText.classList.toggle('user-text-open-with-collection-active');
                });
            });
        }
    }
}

class DynamicEventListeners {
    static UpdateCollectionInfo() {
        $('#TitleInput').on('change', function(event) {
            UserDataAccess.UpdateCollectionInfo('title', event.target.value, currentTitle);
            $(this).attr('readonly', true); 
            $(this).removeClass('TitleInput-active');
            $(this).next().removeClass('TitleButton-active');
        });
        $('#CollectionDescription').on('change', function(event) {
            console.log(currentTitle);
            UserDataAccess.UpdateCollectionInfo('description', event.target.value, currentTitle);
            $(this).attr('readonly', true);
            $(this).removeClass('CollectionDescription-active');
            $(this).next().removeClass('CollectionDescriptionButton-active');
        });
    }

    static UpdateFlashcardElements() {
        const elements = ['word', 'meaning', 'synonyms', 'example', 'native_definition', 'in_context_example'];
        const elementsHigherLevel = ['word', 'meaning', 'synonyms', 'native_definition'];
        elements.forEach(function(element) {
            $(`.${element}`).each(function() {
                let elementPosition = 0;
                if (elementsHigherLevel.includes(element)) {
                    elementPosition = $(this).parent().parent().parent().parent().parent().parent().parent().index();
                }
                else {
                    elementPosition = $(this).parent().parent().parent().parent().parent().parent().parent().parent().index();
                }
                $(this).on('change', function(event) {
                    UserDataAccess.UpdateFlashcardElementViaAJAX(element, event.target.value, elementPosition + 1, 
                        localStorage.getItem('CurrentOpenElementTitle'));
                });
            });
        });       
    }

    static FavoriteItemToggler() {
        $('.left-icon').each(function() {
            $(this).on('click', function(event) {
                event.stopImmediatePropagation();
                PreventEventPropagationCollectionElementClick($(this).parent().parent());               
                $(this).toggleClass('left-icon-active');
                if ($(this).hasClass('left-icon-active')) {
                    UserDataAccess.MakeElementFavourite($(this).prev().prev().text(), $(this).prev().text(), 
                        localStorage.getItem('CurrentOpenElementTitle'), 'makeFavourite');
                }
                else {
                    UserDataAccess.MakeElementFavourite($(this).prev().prev().text(), $(this).prev().text(), 
                        localStorage.getItem('CurrentOpenElementTitle'), 'disableFavourite');
                }                              
            });
        });      
    }

    static NewFlashcardFavoriteItemToggler() {
        $('.left-icon').last().on('click', function(event) {
            event.stopImmediatePropagation();
                PreventEventPropagationCollectionElementClick($(this).parent().parent());               
                $(this).toggleClass('left-icon-active');
                if ($(this).hasClass('left-icon-active')) {
                    UserDataAccess.MakeElementFavourite($(this).prev().prev().text(), $(this).prev().text(), 
                        localStorage.getItem('CurrentOpenElementTitle'), 'makeFavourite');
                }
                else {
                    UserDataAccess.MakeElementFavourite($(this).prev().prev().text(), $(this).prev().text(), 
                        localStorage.getItem('CurrentOpenElementTitle'), 'disableFavourite');
                }  
        });
    }

    static TrashIconHandler() {
        $('.right-icon').each(function() {
            $(this).on('click', function(event) {
                event.stopImmediatePropagation();
                PreventEventPropagationCollectionElementClick($(this).parent().parent());
                const currentFlashcard = $(this);
                UserDataAccess.DeleteElementFromCollection($(this).prev().prev().prev().text(), $(this).prev().prev().text(), 
                    localStorage.getItem('CurrentOpenElementTitle')).then(function(response) {
                        if (response == 'Success') {
                            currentFlashcard.parent().parent().parent().parent().parent().remove();
                            const termsNumberString = $('.additional-info-collection').first().text().split(' ')[0];
                            const termsNumber = parseInt(termsNumberString) - 1;
                            $('.additional-info-collection').first().text(`${termsNumber} Terms,`);
                            AdjustContentHeight();
                        }
                        else if (response == 'Not Enough Flashcards') {
                            RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                                `Collection cannot contain less than 3 elements! In order to delete this component, you must add a new one.`);
                        }
                    });
            });
        });
    }

    static WordTextToSpeechHandler() {
        $('.left').each(function() {
            $(this).on('click', function(event) {
                event.stopImmediatePropagation();
                PreventEventPropagationCollectionElementClick($(this).parent().parent());
                if ('speechSynthesis' in window) {
                    var speechSynthesisWord = new SpeechSynthesisUtterance();
                    speechSynthesisWord.text = $(this).text();
                    speechSynthesisWord.lang = 'en';
                    window.speechSynthesis.speak(speechSynthesisWord); 
                }
                else { 
                    RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    `Sorry, your browser doesn't support text to speech transformation!`);
                }
            });
        });
    }

    static MeaningTextToSpeechHandler() {
        $('.right').each(function() {
            $(this).on('click', function(event) {
                event.stopImmediatePropagation();
                PreventEventPropagationCollectionElementClick($(this).parent().parent());
                if ('speechSynthesis' in window) {
                    var speechSynthesisWord = new SpeechSynthesisUtterance();
                    speechSynthesisWord.text = $(this).text();
                    speechSynthesisWord.lang = 'en';
                    window.speechSynthesis.speak(speechSynthesisWord); 
                }
                else { 
                    RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    `Sorry, your browser doesn't support text to speech transformation!`);
                }
            });
        });
    }

    static WordTextToSpeechHandlerNewFlashcard() {
        const fieldToConvert = $('.left').last();
        fieldToConvert.on('click', function(event) {
            event.stopImmediatePropagation();
            PreventEventPropagationCollectionElementClick($(this).parent().parent());
            if ('speechSynthesis' in window) {
                var speechSynthesisWord = new SpeechSynthesisUtterance();
                speechSynthesisWord.text = $(this).text();
                speechSynthesisWord.lang = 'en';
                window.speechSynthesis.speak(speechSynthesisWord); 
            }
            else { 
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                `Sorry, your browser doesn't support text to speech transformation!`);
            }
        });
    }

    static MeaningTextToSpeechHandlerNewFlashcard() {
        const fieldToConvert = $('.right').last();
        fieldToConvert.on('click', function(event) {
            event.stopImmediatePropagation();
            PreventEventPropagationCollectionElementClick($(this).parent().parent());
            if ('speechSynthesis' in window) {
                var speechSynthesisWord = new SpeechSynthesisUtterance();
                speechSynthesisWord.text = $(this).text();
                speechSynthesisWord.lang = 'en';
                window.speechSynthesis.speak(speechSynthesisWord); 
            }
            else { 
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                `Sorry, your browser doesn't support text to speech transformation!`);
            }
        });
    }

    static NewFlashcardTrashIconHandler() {
        $('.right-icon').last().on('click', function(event) {
            event.stopImmediatePropagation();
                PreventEventPropagationCollectionElementClick($(this).parent().parent());
                const currentFlashcard = $(this);
                UserDataAccess.DeleteElementFromCollection($(this).prev().prev().prev().text(), $(this).prev().prev().text(), 
                    localStorage.getItem('CurrentOpenElementTitle')).then(function(response) {
                        if (response == 'Success') {
                            currentFlashcard.parent().parent().parent().parent().parent().remove();
                            const termsNumberString = $('.additional-info-collection').first().text().split(' ')[0];
                            const termsNumber = parseInt(termsNumberString) - 1;
                            $('.additional-info-collection').first().text(`${termsNumber} Terms,`);
                            AdjustContentHeight();
                        }
                        else if (response == 'Not Enough Flashcards') {
                            RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                                `Collection cannot contain less than 3 elements! In order to delete this component, you must add a new one.`);
                        }
                    });
        })
    }

    static UpdateNewFlashcardElements() {
        const elements = ['word', 'meaning', 'synonyms', 'example', 'native_definition', 'in_context_example'];
        const elementsHigherLevel = ['word', 'meaning', 'synonyms', 'native_definition'];
        elements.forEach(function(element) {
            const targetElement = $(`.${element}`).last();
            let elementPosition = 0;
            if (elementsHigherLevel.includes(element)) {
                elementPosition = targetElement.parent().parent().parent().parent().parent().parent().parent().index();
            }
            else {
                elementPosition = targetElement.parent().parent().parent().parent().parent().parent().parent().parent().index();
            }
            targetElement.on('change', function(event) {
                UserDataAccess.UpdateFlashcardElementViaAJAX(element, event.target.value, elementPosition + 1, 
                    localStorage.getItem('CurrentOpenElementTitle'));
            });
        });       
    }

    static FlashcardEditShow() {
        $('.accordion-button').each(function() {
            $(this).on('click', function(event) {
                $(this).parent().next().removeClass('hidden');
                setTimeout(function() {
                    AdjustContentHeight();
                }, 340);
            });
        });
    }

    static NewFlashcardEditShow() {
        $('.accordion-button').on('click', function(event) {
            $(this).parent().next().removeClass('hidden');
            setTimeout(function() {
                AdjustContentHeight();
            }, 340);
        });
    }
}

function PreventEventPropagationCollectionElementClick($CollectionElementHeader) {
    if ($CollectionElementHeader.parent().next().height() == 0) {
        $CollectionElementHeader.addClass('collapsed');
        $CollectionElementHeader.parent().next().addClass('hidden');
        $CollectionElementHeader.parent().next().addClass('collapse');
        $CollectionElementHeader.parent().next().removeClass('collapsing');
        setTimeout(function() {
            $CollectionElementHeader.parent().next().removeClass('show');
        }, 400);
    }
    else {
        $CollectionElementHeader.removeClass('collapsed');
        $CollectionElementHeader.parent().next().removeClass('hidden');
        $CollectionElementHeader.parent().next().removeClass('collapse');
        $CollectionElementHeader.parent().next().removeClass('collapsing');
        $CollectionElementHeader.parent().next().addClass('show');
    }
}

function AdjustToolipPosition($ToolTip, $ProgressCircle) {
    const leftOffset = $ProgressCircle.offset().left - $('#CollectionElementsList').offset().left;
    const topOffset = $ProgressCircle.offset().top - $('#CollectionElementsList').offset().top;
    console.log(topOffset);
    $ToolTip.css('top', (topOffset - 15 - $ToolTip.outerHeight()).toString() + 'px');
    $ToolTip.css('left', (leftOffset - ($ToolTip.outerWidth() / 2) + ($(window).width() / 200)).toString() + 'px');
}

function AdjustContentHeight() {
    let elementHeight = $(window).height() / 6.24; 
    $('#CollectionData').children().each(function() {
        elementHeight = $(this).outerHeight() + elementHeight;
    });
    
    $('#UserTexts').css('max-height', elementHeight.toString() + 'px');
    $('#UserTexts').css('height', elementHeight.toString() + 'px');
    $('#UserTexts').css('min-height', elementHeight.toString() + 'px');
}

async function GenerateInitialContent() {
    try {
        var collectionData = await DataAccessAndRender.GetFullCollectionData();
        DataAccessAndRender.textTitlesList = await DataAccessAndRender.GetTexts();
        console.log(collectionData);
        console.log(DataAccessAndRender.textTitlesList);
        DataAccessAndRender.title = collectionData['GeneralData']['Title'];
        DataAccessAndRender.description = collectionData['GeneralData']['Description'];
        DataAccessAndRender.termsCount = collectionData['GeneralData']['TermsCount'];
        DataAccessAndRender.creationTime = collectionData['GeneralData']['CreationTime'];
        DataAccessAndRender.flashcards = collectionData['Flashcards'];
        currentTitle = collectionData['GeneralData']['Title'];

        DataAccessAndRender.RenderFullIntitalGeneralContent();
        DataAccessAndRender.RenderAllFlashcards();
        DynamicEventListeners.UpdateFlashcardElements();
        DynamicEventListeners.UpdateCollectionInfo();
        DynamicEventListeners.FavoriteItemToggler();
        DynamicEventListeners.TrashIconHandler();
        DynamicEventListeners.FlashcardEditShow();
        DynamicEventListeners.WordTextToSpeechHandler();
        DynamicEventListeners.MeaningTextToSpeechHandler();

        const height = $('#CollectionData').height();
        $('#UserTexts').css('max-height', height + 'px');
        DataAccessAndRender.RenderUserTexts();
        AdjustContentHeight();
    }
    catch {
        ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
    }
}

let DataAccessAndRender = new RenderContent();
let currentTitle = '';
GenerateInitialContent();

$(document).ready(function() {
    $('#UserCollectionSelect').on('change', function(event) {
        const displayMethodValue = event.target.value;
        switch (displayMethodValue) {
            case '1':
                DataAccessAndRender.listOfFlashcards.forEach(flashcard => {
                    flashcard.HTMLObject.style.display = 'block';
                });

                const $DisplayedElementsOne = $('#CollectionElementsList .full-flashcard').filter(function() {
                    var $this = $(this);
                    return $this.css("display") == "block";
                });
        
                if ($DisplayedElementsOne.length == 0) {
                    $('.empty-results').css('display', 'flex');
                }
                else {
                    $('.empty-results').css('display', 'none');
                }
        
                AdjustContentHeight();
                break;
            case '2':
                DataAccessAndRender.listOfFlashcards.forEach(flashcard => {
                    var jQueryObj = $(flashcard.HTMLObject);
                    const hasClass = jQueryObj.children().children().first().children().children().children().last().prev()
                        .hasClass('left-icon-active');
                    if (hasClass) {
                        flashcard.HTMLObject.style.display = 'block';
                    }
                    else {
                        flashcard.HTMLObject.style.display = 'none';
                    }
                });

                const $DisplayedElementsSecond = $('#CollectionElementsList .full-flashcard').filter(function() {
                    var $this = $(this);
                    return $this.css("display") == "block";
                });
        
                if ($DisplayedElementsSecond.length == 0) {
                    $('.empty-results').css('display', 'flex');
                }
                else {
                    $('.empty-results').css('display', 'none');
                }
        
                AdjustContentHeight();
                break;
            case '3':
                DataAccessAndRender.listOfFlashcards.forEach(flashcard => {
                    var jQueryObj = $(flashcard.HTMLObject);
                    const hasClass = jQueryObj.children().children().first().children().children().children().last().prev()
                        .hasClass('left-icon-active');
                    if (hasClass) {
                        flashcard.HTMLObject.style.display = 'none';
                    }
                    else {
                        flashcard.HTMLObject.style.display = 'block';
                    }
                });

                const $DisplayedElementsThird = $('#CollectionElementsList .full-flashcard').filter(function() {
                    var $this = $(this);
                    return $this.css("display") == "block";
                });
        
                if ($DisplayedElementsThird.length == 0) {
                    $('.empty-results').css('display', 'flex');
                }
                else {
                    $('.empty-results').css('display', 'none');
                }
        
                AdjustContentHeight();
                break;
        }
    });

    $('#FlashcardSearchInput').on('keyup', function() {
        const SearchValue = $(this).val().toLowerCase();
        const FilteredElements = DataAccessAndRender.listOfFlashcards.filter(flashcard => {
            return (flashcard.word.toLowerCase().includes(SearchValue) || flashcard.meaning.toLowerCase().includes(SearchValue));
        });
        DataAccessAndRender.listOfFlashcards.forEach(flashcard => {
            if (FilteredElements.includes(flashcard)) {
                flashcard.HTMLObject.style.display = 'block';
            }
            else {
                flashcard.HTMLObject.style.display = 'none';
            }
        });

        const $DisplayedElements = $('#CollectionElementsList .full-flashcard').filter(function() {
            var $this = $(this);
            return $this.css("display") == "block"
        });

        if ($DisplayedElements.length == 0) {
            $('.empty-results').css('display', 'flex');
        }
        else {
            $('.empty-results').css('display', 'none');
        }

        AdjustContentHeight();
    });

    $('.progress-tracker-display-option').each(function() {
        const progressClasses = [
            'progress-tracker-display-option_new',
            'progress-tracker-display-option_not-remembered',
            'progress-tracker-display-option_to-be-repeated',
            'progress-tracker-display-option_remembered',
            'progress-tracker-display-option_learnt',
            'progress-tracker-display-option_universal'
        ];

        const progressClassesCircles = [
            'progress-ring__circle_new',
            'progress-ring__circle_not-remembered',
            'progress-ring__circle_to-be-repeated',
            'progress-ring__circle_remembered',
            'progress-ring__circle_learnt',
            'progress-ring__circle_universal'
        ];

        $(this).on('click', function() {
            let currentClass = '';

            $(this).siblings().each(function() {
                $(this).removeClass('selected');
            });
            $(this).addClass('selected');

            for (let i = 0; i < 6; i++)
            {
                if ($(this).hasClass(progressClasses[i])) {
                    currentClass = progressClassesCircles[i];
                    break;
                }
            }

            if (currentClass == 'progress-ring__circle_universal') {
                DataAccessAndRender.listOfFlashcards.forEach(flashcard => {
                    flashcard.HTMLObject.style.display = 'block';
                });
            }
            else {
                DataAccessAndRender.listOfFlashcards.forEach(flashcard => {
                    var jQueryObj = $(flashcard.HTMLObject);
                    const hasClass = jQueryObj.children().children().first().children().children().children().first().children().first()
                        .hasClass(currentClass);
                    if (hasClass) {
                        flashcard.HTMLObject.style.display = 'block';
                    }
                    else {
                        flashcard.HTMLObject.style.display = 'none';
                    }
                });
            }

            const $DisplayedElements = $('#CollectionElementsList .full-flashcard').filter(function() {
                var $this = $(this);
                return $this.css("display") == "block"
            });

            if ($DisplayedElements.length == 0) {
                $('.empty-results').css('display', 'flex');
            }
            else {
                $('.empty-results').css('display', 'none');
            }

            AdjustContentHeight();
        });
    });

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

    $('#AddCollectionElementButton').on('click', function(event) {
        event.preventDefault();
        DataAccessAndRender.RenderNewFlashcard();
    });

    $('#EditWithTextButton').on('click', function(event) {
        event.preventDefault();
        if ($('.user-text-open-with-collection-active').length > 1) {
            RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                'You can select only one text at the time.');
        }
        else if ($('.user-text-open-with-collection-active').length == 0) {
            RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                'You haven\'t selected any text. Select one and proceed.');
        }
        else {
            const title = $('.user-text-open-with-collection-active').children().first().text();
            console.log(title);
            Promise.all([UserDataAccess.LoadText(title), UserDataAccess.LoadCollection(localStorage.getItem('CurrentOpenElementTitle'))])
                .then(function(responses) {
                    let isValid = true;
                    responses.forEach(response => {
                        console.log(response);
                        if (response != "Success") {
                            isValid = false;
                        }
                    });
                    if (isValid) {
                        localStorage.setItem('CollectionTitle', localStorage.getItem('CurrentOpenElementTitle'));
                        window.location.href = "https://localhost:44369/ReadTextWithCollection.aspx";
                    }
                });
        }
    });
});