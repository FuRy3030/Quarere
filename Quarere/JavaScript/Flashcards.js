class FlashcardsContentAccess {
    flashcardContent;
    flashcardsAmount;
    currentAmountLeft;
    constructor() {
        this.flashcardContent = [];
        this.flashcardsAmount = 0;
        this.currentAmountLeft = 0;
    }

    GetFlashcardsData() {
        const flashcardsItems = JSON.parse(localStorage.getItem('FlashcardElements'));
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/flashcardscontroller/getflashcardsfields',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify([
                    localStorage.getItem('CollectionTitle'), 
                    flashcardsItems[0], 
                    flashcardsItems[1]
                ]),
                processData: false,
                contentType: false,
                success: function(data) {
                    console.log('a');
                    console.log(data);
                    resolve(data);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }

    UpdateElementProgressLevel(wordOrPhrase, meaning, operationType) {
        $.ajax({
            url: 'https://localhost:44369/api/progresstrackercontroller/changeelementprogresslevel',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                title: localStorage.getItem('CollectionTitle'),
                word: wordOrPhrase, 
                meaning: meaning, 
                actionType: operationType
            }),
            processData: false,
            contentType: false
        });
    }
}

class RenderContent extends FlashcardsContentAccess {
    zIndexPropertyValue;
    toRepeatObjectsList;
    alreadyLearnedObjectsList;
    constructor() {
        super();
        this.toRepeatObjectsList = [];
        this.alreadyLearnedObjectsList = [];
        this.zIndexPropertyValue = 1;
    }

    RenderFlashcards() {
        this.flashcardContent.forEach(flashcardData => {
            const Flashcard = document.createElement('div');
            Flashcard.classList.add('flashcard-learning-mode');
            Flashcard.style.zIndex = this.zIndexPropertyValue.toString();
            Flashcard.style.opacity = '0';
            Flashcard.innerHTML = 
            `<div class="flashcard__content">          
                <div class="flashcard__front">
                    <i class="bi bi-volume-up-fill flashcard__sound-icon"></i>
                    <h3 class="flashcard__text front-text">${flashcardData['FrontField']}</h3>
                    <div class="flashcard__bottom-bar flashcard__front_bottom-bar"> 
                        <div class="swipe-left swipe-left-front">
                            <i class="fas fa-reply"></i>
                            <span>Repeat</span>
                        </div>
                        <div class="swipe-right swipe-right-front">
                            <span>Learned</span>
                            <i class="fas fa-share"></i>
                        </div>
                    </div>
                </div>                            
                <div class="flashcard__back">
                    <i class="bi bi-volume-up-fill flashcard__sound-icon"></i>
                    <h3 class="flashcard__text back-text">${flashcardData['BackField']}</h3>
                    <div class="flashcard__bottom-bar flashcard__back_bottom-bar"> 
                        <div class="swipe-left swipe-left-back">
                            <i class="fas fa-reply"></i>
                            <span>Repeat</span>
                        </div>
                        <div class="swipe-right swipe-right-back">
                            <span>Learned</span>
                            <i class="fas fa-share"></i>
                        </div>
                    </div>
                </div>                             
            </div>`;

            this.zIndexPropertyValue = this.zIndexPropertyValue + 1;
            const FlashcardsPile = document.getElementById('FlashcardsPile');
            FlashcardsPile.append(Flashcard);
        });
        $('#FlashcardsPile').children().last().css('opacity', '1');
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
}

class DynamicEventListeners {
    static UpdateBottomBar(currentFlashcardsAmountLeft) {
        if (currentFlashcardsAmountLeft == 0) {
            $('#HowMuchFlashcardsLeftCounter h3').text('');
            $('#HowMuchFlashcardsLeftCounter div').removeClass('progress-bar-striped');
            $('#HowMuchFlashcardsLeftCounter div').removeClass('progress-bar-animated');
            $('#HowMuchFlashcardsLeftCounter div').addClass('bg-success');
            $('#HowMuchFlashcardsLeftCounter div').text(`No Flashcards Left - Queue Completed!`);
            $('#HowMuchFlashcardsLeftCounter div').css('width', '100%');
        }
        else {
            $('#HowMuchFlashcardsLeftCounter div').text('');
            $('#HowMuchFlashcardsLeftCounter div').addClass('progress-bar-striped');
            $('#HowMuchFlashcardsLeftCounter div').addClass('progress-bar-animated');
            $('#HowMuchFlashcardsLeftCounter div').removeClass('bg-success');
            const barWidth = (currentFlashcardsAmountLeft / FlashcardsManagement.flashcardsAmount) * 100;
            $('#HowMuchFlashcardsLeftCounter div').css('width', barWidth.toString() + '%');
            if (currentFlashcardsAmountLeft == 1) {
                $('#HowMuchFlashcardsLeftCounter h3').text(`${currentFlashcardsAmountLeft} Flashcard Left`);
            }
            else {
                $('#HowMuchFlashcardsLeftCounter h3').text(`${currentFlashcardsAmountLeft} Flashcards Left`);
            }
        }
    }

    static UpdateLeftPanelCount() {
        const elementCount = $('#FlashcardsToRepeatList').children().length;
        if (elementCount == 0) {
            $('#FlashcardsToRepeatCount').text('0 Elements');
        }
        else if (elementCount == 1) {
            $('#FlashcardsToRepeatCount').text(`${elementCount} Element`)
        }
        else {
            $('#FlashcardsToRepeatCount').text(`${elementCount} Elements`);
        }
    }

    static UpdateRightPanelCount() {
        const elementCount = $('#LearnedFlashcardsList').children().length;
        if (elementCount == 0) {
            $('#LearnedFlashcardsCount').text('0 Elements');
        }
        else if (elementCount == 1) {
            $('#LearnedFlashcardsCount').text(`${elementCount} Element`)
        }
        else {
            $('#LearnedFlashcardsCount').text(`${elementCount} Elements`);
        }
    }

    static FlashcardsFlip() {
        $('.flashcard-learning-mode').each(function() {
            $(this).on('click', function() {
                $(this).toggleClass('flashcard-learning-mode-flipped');
            });
        });
    }

    static SoudIconEvent() {
        $('.flashcard__sound-icon').each(function() {
            $(this).on('click', function(event) {
                event.preventDefault();
                if ('speechSynthesis' in window) {
                    var speechSynthesisField = new SpeechSynthesisUtterance();
                    speechSynthesisField.text = $(this).next().text();
                    speechSynthesisField.lang = 'en';
                    window.speechSynthesis.speak(speechSynthesisField); 
                }
                else { 
                    RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    `Sorry, your browser doesn't support text to speech transformation!`);
                }
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        });
    }

    static SwipeLeftEvent() {
        $('.swipe-left').each(function() {
            $(this).on('click', function(event) {
                let frontText, backText;
                $(this).closest('.flashcard-learning-mode').prev().css('opacity', '1');
                $(this).closest('.flashcard-learning-mode').addClass('flashcard-learning-mode-animation-left');
                if ($(this).parent().prev().hasClass('back-text')) {
                    backText = $(this).parent().prev().text();
                    frontText = $(this).closest('.flashcard__back').prev().children().eq(1).text();
                }
                else {
                    frontText = $(this).parent().prev().text();
                    backText = $(this).closest('.flashcard__front').next().children().eq(1).text();
                }

                const SideListElement = document.createElement('li');
                SideListElement.classList.add('flashcard-element');
                SideListElement.style.backgroundColor = '#f9ca24';
                SideListElement.innerHTML = 
                `<h6 class="flashcard-element-up">${frontText}</h6>
                <div class="flashcard-element-divider"></div>
                <h6 class="flashcard-element-down">${backText}</h6>`;

                const LeftList = document.getElementById('FlashcardsToRepeatList');
                LeftList.append(SideListElement);
                FlashcardsManagement.toRepeatObjectsList.push({
                    frontField: frontText, 
                    backField: backText, 
                    HTMLObject: SideListElement
                });
                FlashcardsManagement.currentAmountLeft = FlashcardsManagement.currentAmountLeft - 1;
                DynamicEventListeners.UpdateBottomBar(FlashcardsManagement.currentAmountLeft);
                DynamicEventListeners.UpdateLeftPanelCount();

                if (localStorage.getItem('IsProgressTrackerEnabled') == 'true') {
                    const flashcardsItems = JSON.parse(localStorage.getItem('FlashcardElements'));
                    if (flashcardsItems[0] == 'Word / Phrase') {
                        FlashcardsManagement.UpdateElementProgressLevel(frontText, backText, 'Decrease');
                    }
                    else {
                        FlashcardsManagement.UpdateElementProgressLevel(backText, frontText, 'Decrease');
                    }
                }

                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        });
    }

    static SwipeRightEvent() {
        $('.swipe-right').each(function() {
            $(this).on('click', function(event) {
                let frontText, backText;
                $(this).closest('.flashcard-learning-mode').prev().css('opacity', '1');
                $(this).closest('.flashcard-learning-mode').addClass('flashcard-learning-mode-animation-right');
                if ($(this).parent().prev().hasClass('back-text')) {
                    backText = $(this).parent().prev().text();
                    frontText = $(this).closest('.flashcard__back').prev().children().eq(1).text();
                }
                else {
                    frontText = $(this).parent().prev().text();
                    backText = $(this).closest('.flashcard__front').next().children().eq(1).text();
                }

                const SideListElement = document.createElement('li');
                SideListElement.classList.add('flashcard-element');
                SideListElement.style.backgroundColor = '#33FF00';
                SideListElement.innerHTML = 
                `<h6 class="flashcard-element-up">${frontText}</h6>
                <div class="flashcard-element-divider"></div>
                <h6 class="flashcard-element-down">${backText}</h6>`;

                const RightList = document.getElementById('LearnedFlashcardsList');
                RightList.append(SideListElement);
                FlashcardsManagement.alreadyLearnedObjectsList.push({
                    frontField: frontText, 
                    backField: backText, 
                    HTMLObject: SideListElement
                });
                FlashcardsManagement.currentAmountLeft = FlashcardsManagement.currentAmountLeft - 1;
                DynamicEventListeners.UpdateBottomBar(FlashcardsManagement.currentAmountLeft);
                DynamicEventListeners.UpdateRightPanelCount();

                if (localStorage.getItem('IsProgressTrackerEnabled') == 'true') {
                    const flashcardsItems = JSON.parse(localStorage.getItem('FlashcardElements'));
                    if (flashcardsItems[0] == 'Word / Phrase') {
                        FlashcardsManagement.UpdateElementProgressLevel(frontText, backText, 'Increase');
                    }
                    else {
                        FlashcardsManagement.UpdateElementProgressLevel(backText, frontText, 'Increase');
                    }
                }

                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        });
    }

    static ContinueLearning() {
        $('#BottomPileFirst').on('click', function(event) {
            event.preventDefault();
            if ($('#FlashcardsToRepeatList').html() == '') {
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    `Your repeat list is empty! Drag some stuff from the right list.`);
                return;
            }

            const newContent = [];
            $('#FlashcardsToRepeatList li').each(function() {
                const currentFront = $(this).children().first().text();
                const currentBack = $(this).children().last().text();
                newContent.push({FrontField: currentFront, BackField: currentBack});
            });
            newContent.reverse();
            FlashcardsManagement.flashcardContent = newContent;
            $('.flashcard-learning-mode').each(function() {
                $(this).remove();
            });
            FlashcardsManagement.zIndexPropertyValue = 1;
            FlashcardsManagement.flashcardsAmount = FlashcardsManagement.flashcardContent.length;
            FlashcardsManagement.currentAmountLeft = FlashcardsManagement.flashcardContent.length;

            FlashcardsManagement.RenderFlashcards();
            DynamicEventListeners.FlashcardsFlip();
            DynamicEventListeners.SoudIconEvent();
            DynamicEventListeners.SwipeRightEvent();
            DynamicEventListeners.SwipeLeftEvent();
            DynamicEventListeners.UpdateBottomBar(FlashcardsManagement.currentAmountLeft);

            $('#FlashcardsToRepeatList').html('');
            $('#LearnedFlashcardsList').html('');
            $('#BottomPile').css('opacity', '0');

            DynamicEventListeners.UpdateRightPanelCount();
            DynamicEventListeners.UpdateLeftPanelCount();
        });
    }

    static StartOver() {
        $('#BottomPileSecond').on('click', function(event) {
            event.preventDefault();
            $('.flashcard-learning-mode').each(function() {
                $(this).remove();
            });
            FlashcardsManagement.zIndexPropertyValue = 1;
            FlashcardsManagement.currentAmountLeft = FlashcardsManagement.flashcardContent.length;

            FlashcardsManagement.RenderFlashcards();
            DynamicEventListeners.FlashcardsFlip();
            DynamicEventListeners.SoudIconEvent();
            DynamicEventListeners.SwipeRightEvent();
            DynamicEventListeners.SwipeLeftEvent();
            DynamicEventListeners.UpdateBottomBar(FlashcardsManagement.currentAmountLeft);

            $('#FlashcardsToRepeatList').html('');
            $('#LearnedFlashcardsList').html('');
            $('#BottomPile').css('opacity', '0');

            DynamicEventListeners.UpdateRightPanelCount();
            DynamicEventListeners.UpdateLeftPanelCount();
        });
    }

    static ExitOptionsClick() {
        $('#BottomPileThird').on('click', function(event) {
            event.preventDefault();
            window.location.href = "https://localhost:44369/LearningMenu.aspx";
        });
    }

    static SkipRestButton() {
        $('#FlashcardsSkip').on('click', function(event) {
            event.preventDefault();
            const swipedFlashcardsAmount = $('.flashcard-learning-mode-animation-right').length + 
                $('.flashcard-learning-mode-animation-left').length;

            if (swipedFlashcardsAmount == FlashcardsManagement.flashcardsAmount) {
                RenderContent.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                    `You can't skip empty flashcard queue! Start again or continue to create a new one.`);
                return;
            }
            else {
                $('#BottomPile').css('opacity', '1');
                $('.flashcard-learning-mode').each(function() {
                    $(this).remove();
                });
                FlashcardsManagement.currentAmountLeft = 0;
                DynamicEventListeners.UpdateBottomBar(FlashcardsManagement.currentAmountLeft);
            }
        });
    }

    static EditCollectionBubble() {
        $('#BoostrapOption').on('click', function() {
            window.location.href = "https://localhost:44369/OpenedUserCollection.aspx";
        });
    }
}

function SetPanelHeight() {
    const mainPanelHeight = $('#MainPanel').outerHeight();
    $('.flashcards-state-management-class').each(function() {
        $(this).parent().css('max-height', mainPanelHeight.toString() + 'px');
    });
}

async function InitialDataLoad() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    try {
        FlashcardsManagement.flashcardContent = await FlashcardsManagement.GetFlashcardsData();
        FlashcardsManagement.flashcardsAmount = FlashcardsManagement.flashcardContent.length;
        FlashcardsManagement.currentAmountLeft = FlashcardsManagement.flashcardContent.length;
        console.log(FlashcardsManagement.flashcardContent);
        FlashcardsManagement.RenderFlashcards();
        DynamicEventListeners.FlashcardsFlip();
        DynamicEventListeners.SoudIconEvent();
        DynamicEventListeners.SwipeRightEvent();
        DynamicEventListeners.SwipeLeftEvent();
        DynamicEventListeners.ContinueLearning();
        DynamicEventListeners.StartOver();
        DynamicEventListeners.ExitOptionsClick();
        DynamicEventListeners.SkipRestButton();
        DynamicEventListeners.UpdateBottomBar(FlashcardsManagement.currentAmountLeft);
        DynamicEventListeners.EditCollectionBubble();
        SetPanelHeight();
    }
    catch {
        ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
    }
}

const FlashcardsManagement = new RenderContent();
InitialDataLoad();

$(document).ready(function() {
    $(function() {
        $("#FlashcardsToRepeatList, #LearnedFlashcardsList").sortable({
            connectWith: ".flashcards-state-management-class",
            update: function(event, ui) {
                if (ui.item.closest('ul').attr('id') == 'FlashcardsToRepeatList') {
                    ui.item.css('background-color', '#f9ca24');
                    DynamicEventListeners.UpdateLeftPanelCount();

                    if (localStorage.getItem('IsProgressTrackerEnabled') == 'true') {
                        const flashcardsItems = JSON.parse(localStorage.getItem('FlashcardElements'));
                        if (flashcardsItems[0] == 'Word / Phrase') {
                            FlashcardsManagement.UpdateElementProgressLevel(
                                ui.item.children().first().text(), 
                                ui.item.children().last().text(), 
                                'Decrease'
                            );
                        }
                        else {
                            FlashcardsManagement.UpdateElementProgressLevel(
                                ui.item.children().last().text(), 
                                ui.item.children().first().text(), 
                                'Decrease'
                            );
                        }
                    }
                }
                else {
                    ui.item.css('background-color', '#33FF00');
                    DynamicEventListeners.UpdateRightPanelCount();

                    if (localStorage.getItem('IsProgressTrackerEnabled') == 'true') {
                        const flashcardsItems = JSON.parse(localStorage.getItem('FlashcardElements'));
                        if (flashcardsItems[0] == 'Word / Phrase') {
                            FlashcardsManagement.UpdateElementProgressLevel(
                                ui.item.children().first().text(), 
                                ui.item.children().last().text(), 
                                'Increase'
                            );
                        }
                        else {
                            FlashcardsManagement.UpdateElementProgressLevel(
                                ui.item.children().last().text(), 
                                ui.item.children().first().text(), 
                                'Increase'
                            );
                        }
                    }
                }
            }
        }).disableSelection();
    });

    $('#LearnedFlashcardsSearch').on('keyup', function() {
        const SearchValue = $(this).val().toLowerCase();
        const FilteredElements = FlashcardsManagement.alreadyLearnedObjectsList.filter(element => {
            return (element.frontField.toLowerCase().includes(SearchValue) || element.backField.toLowerCase().includes(SearchValue));
        });

        FlashcardsManagement.alreadyLearnedObjectsList.forEach(element => {
            if (FilteredElements.includes(element)) {
                element.HTMLObject.style.display = 'flex';
            }
            else {
                element.HTMLObject.style.display = 'none';
            }
        });
    });

    $('#FlashcardsToRepeatSearch').on('keyup', function() {
        const SearchValue = $(this).val().toLowerCase();
        const FilteredElements = FlashcardsManagement.toRepeatObjectsList.filter(element => {
            return (element.frontField.toLowerCase().includes(SearchValue) || element.backField.toLowerCase().includes(SearchValue));
        });

        FlashcardsManagement.toRepeatObjectsList.forEach(element => {
            if (FilteredElements.includes(element)) {
                element.HTMLObject.style.display = 'flex';
            }
            else {
                element.HTMLObject.style.display = 'none';
            }
        });
    });
});