class UserDataAccess {
    userCollectionElements;
    constructor() {
        this.userCollectionElements = [];
    }

    GetAllCollectionElements() {
        const matcherItems = JSON.parse(localStorage.getItem('FlashcardElements'));
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
                    matcherItems[0], 
                    matcherItems[1]
                ]),
                processData: false,
                contentType: false,
                success: function(data) {
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

class RenderContent extends UserDataAccess {
    correctCounter;
    incorrectCounter;
    isModeStarted;
    constructor() {
        super();
        this.correctCounter = 0;
        this.incorrectCounter = 0;
        this.isModeStarted = false;
    }

    RenderMatcherElements() {
        this.userCollectionElements.forEach(element => {
            const LeftSideCard = document.createElement('div');
            LeftSideCard.classList.add('matcher-element');
            LeftSideCard.innerHTML = `<span>${element['FrontField']}</span>`;

            const LeftSideArea = document.getElementById('LeftSideItems');
            LeftSideArea.append(LeftSideCard);

            const RightSideCard = document.createElement('div');
            RightSideCard.classList.add('matcher-element');
            RightSideCard.innerHTML = `<span>${element['BackField']}</span>`;

            const RightSideArea = document.getElementById('RightSideItems');
            RightSideArea.append(RightSideCard);
        });
    }

    RenderAreasTitles() {
        const matcherTitles = JSON.parse(localStorage.getItem('FlashcardElements'));
        $('.matcher-heading').first().text(matcherTitles[0]);
        $('.matcher-heading').last().text(matcherTitles[1]);
    }

    RenderTopPanel() {
        $('.correct-display').html('<i class="bi bi-check-circle"></i> Correct: 0');
        $('.incorrect-display').html('<i class="bi bi-x-circle"></i> Incorrect: 0');
        $('.timer').html('<i class="bi bi-alarm"></i> Time: 0.00s');
    }
}

class DynamicEventListeners {
    static timerHandler;

    static MatcherElementClick() {
        $('.matcher-element').on('click', function() {
            if (ModeManagement.isModeStarted == false) {
                DynamicEventListeners.StartTimer();
                ModeManagement.isModeStarted = true;
            }

            $(this).toggleClass('matcher-element-active');
            $(this).siblings().each(function() {
                $(this).removeClass('matcher-element-active');
            });
            
            if ($(this).parent().siblings().children('.matcher-element-active').length > 0 && 
                $(this).hasClass('matcher-element-active')) 
            {
                const $FirstChosenCard = $(this).parent().siblings().children('.matcher-element-active');
                const $SecondChosenCard = $(this);

                const firstCardText = $SecondChosenCard.children().first().text();
                const secondCardText = $FirstChosenCard.text();

                const targetElementFromList = ModeManagement.userCollectionElements.find(element => {
                    return element['FrontField'] == firstCardText || element['BackField'] == firstCardText;
                });

                if (targetElementFromList['FrontField'] == secondCardText || 
                    targetElementFromList['BackField'] == secondCardText) 
                {
                    $FirstChosenCard.addClass('matcher-element-dissapear');
                    $SecondChosenCard.addClass('matcher-element-dissapear');
                    $FirstChosenCard.removeClass('matcher-element-active');
                    $SecondChosenCard.removeClass('matcher-element-active');
                    $FirstChosenCard.html('<i class="bi bi-patch-check-fill" style="font-size: 3.25vw"></i>');
                    $SecondChosenCard.html('<i class="bi bi-patch-check-fill" style="font-size: 3.25vw"></i>');

                    if (localStorage.getItem('IsProgressTrackerEnabled') == 'true') {
                        const matcherItems = JSON.parse(localStorage.getItem('FlashcardElements'));
                        if (matcherItems[0] == 'Word / Phrase') {
                            ModeManagement.UpdateElementProgressLevel (
                                targetElementFromList['FrontField'], 
                                targetElementFromList['BackField'], 
                                'Increase'
                            );
                        }
                        else {
                            ModeManagement.UpdateElementProgressLevel (
                                targetElementFromList['BackField'], 
                                targetElementFromList['FrontField'], 
                                'Increase'
                            );
                        }
                    }

                    DynamicEventListeners.UpdateCorrectCounter();
                    setTimeout(function() {
                        $FirstChosenCard.remove();
                        $SecondChosenCard.remove();

                        if ($('.matcher-area').first().children().length == 0) {
                            $('#SuccessScreen').css('display', 'flex');
                            $('.matcher-area').each(function() {
                                $(this).css('display', 'none');
                            });

                            $('.matcher-heading').each(function() {
                                $(this).css('display', 'none');
                            });
                            DynamicEventListeners.StopTimer();
                        }
                    }, 1000);
                }
                else 
                {
                    $SecondChosenCard.addClass('matcher-element-wrong');
                    $SecondChosenCard.removeClass('matcher-element-active');

                    if (localStorage.getItem('IsProgressTrackerEnabled') == 'true') {
                        const matcherItems = JSON.parse(localStorage.getItem('FlashcardElements'));
                        if (matcherItems[0] == 'Word / Phrase') {
                            ModeManagement.UpdateElementProgressLevel (
                                targetElementFromList['FrontField'], 
                                targetElementFromList['BackField'], 
                                'Decrease'
                            );
                        }
                        else {
                            ModeManagement.UpdateElementProgressLevel (
                                targetElementFromList['BackField'], 
                                targetElementFromList['FrontField'], 
                                'Decrease'
                            );
                        }
                    }

                    DynamicEventListeners.UpdateIncorrectCounter();
                    setTimeout(function() {
                        $SecondChosenCard.removeClass('matcher-element-wrong');
                    }, 1000);
                }
            }
        });
    }

    static UpdateCorrectCounter() {
        ModeManagement.correctCounter = ModeManagement.correctCounter + 1;
        $('.correct-display').html(`<i class="bi bi-check-circle"></i> Correct: ${ModeManagement.correctCounter}`);
    }

    static UpdateIncorrectCounter() {
        ModeManagement.incorrectCounter = ModeManagement.incorrectCounter + 1;
        $('.incorrect-display').html(`<i class="bi bi-x-circle"></i> Incorrect: ${ModeManagement.incorrectCounter}`);
    }

    static StartTimer() {
        var startTime = Date.now();
        DynamicEventListeners.timerHandler = setInterval(function() {
            var deltaTime = Date.now() - startTime;
            const outputTime = (deltaTime / 1000).toFixed(2)
            $('.timer').html(`<i class="bi bi-alarm"></i> Time: ${outputTime}s`); 
        }, 50);
    }

    static StopTimer() {
        clearInterval(DynamicEventListeners.timerHandler);
    }

    static StartAgain() {
        $('.restart-mode').on('click', function() {
            $('#SuccessScreen').css('display', 'none');
            $('.matcher-area').each(function() {
                $(this).css('display', 'flex');
            });

            $('.matcher-heading').each(function() {
                $(this).css('display', 'block');
            });

            ModeManagement.isModeStarted = false;
            ModeManagement.correctCounter = 0;
            ModeManagement.incorrectCounter = 0;

            ModeManagement.RenderMatcherElements();
            ModeManagement.RenderTopPanel();
            DynamicEventListeners.MatcherElementClick();
        });
    }

    static EditCollectionButton() {
        $('.edit-collection').on('click', function() {
            window.location.href = "https://localhost:44369/OpenedUserCollection.aspx";
        });
    }
}

async function InitialLoad() {
    ModeManagement.userCollectionElements = await ModeManagement.GetAllCollectionElements();
    ModeManagement.RenderMatcherElements();
    ModeManagement.RenderAreasTitles();
    ModeManagement.RenderTopPanel();

    DynamicEventListeners.MatcherElementClick();
    DynamicEventListeners.StartAgain();
    DynamicEventListeners.EditCollectionButton();
}

const ModeManagement = new RenderContent();
InitialLoad();

