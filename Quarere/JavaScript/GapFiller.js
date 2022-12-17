class DataAccess {
    gapFillers;
    constructor() {
        this.gapFillers = [];
    }

    GetUserData() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/gapfillercontroller/getuserdata',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    title: localStorage.getItem('CollectionTitle'), 
                    fillerOption: localStorage.getItem('GapFillerOption')
                }),
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('success');
                    resolve(response);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }
}

class RenderContent extends DataAccess {
    sentencesCounter;
    constructor() {
        super();
        this.sentencesCounter = 1;
    }

    RenderMissingWords() {
        this.gapFillers.forEach(gapFiller => {
            const MissingWord = document.createElement('div');
            MissingWord.classList.add('draggable-word');
            MissingWord.innerHTML = gapFiller['MissingWord'];

            const MissingWordsPanel = document.getElementById('WordsList');
            MissingWordsPanel.append(MissingWord);
        });
    }

    RenderSentencesDraggable() {
        this.gapFillers.forEach(gapFiller => {
            const Sentence = document.createElement('li');
            Sentence.classList.add('sentence');
            Sentence.innerHTML = 
            `<span>${this.sentencesCounter}. ${gapFiller['LeftSide']}</span>
            <div class="draggable-word-droppable"></div>
            <span>${gapFiller['RightSide']}</span>`;

            const SentencesList = document.getElementById('Sentences').querySelector('ul');
            SentencesList.append(Sentence);

            this.sentencesCounter = this.sentencesCounter + 1;
        });
    }

    RenderSentencesWriting() {
        this.gapFillers.forEach(gapFiller => {
            const Sentence = document.createElement('li');
            Sentence.classList.add('sentence');
            Sentence.innerHTML = 
            `<span>${this.sentencesCounter}. ${gapFiller['LeftSide']}</span>
            <input class="missing-box-input"/>
            <span>${gapFiller['RightSide']}</span>`;

            const SentencesList = document.getElementById('Sentences').querySelector('ul');
            SentencesList.append(Sentence);

            this.sentencesCounter = this.sentencesCounter + 1;
        });
    }
}

function DroppableAndDraggableHandler() {
    $(function() {
        $("#WordsList div").draggable({
            revert: "invalid"
        });

        $("#Sentences li div").each(function() {
            const $MissingSpace = $(this);
            $(this).droppable({
                drop: function(event, ui) {
                    if ($MissingSpace.children().length === 0) {
                        $MissingSpace.html("");
                        const width = ui.draggable.outerWidth();
                        const height = ui.draggable.outerHeight();
                        $MissingSpace.css('width', width.toString() + 'px');
                        $MissingSpace.css('height', height.toString() + 'px');
                    } 
                    else {
                        $MissingSpace.children().first().hide(600, function() {
                            $(this).removeClass("dropped");
                            $(this).css('top', '0px');
                            $(this).css('left', '0px');
                            $('.empty-indicator').css('display', 'none');
                            $('#WordsList').append($(this));
                            const width = ui.draggable.outerWidth();
                            const height = ui.draggable.outerHeight();
                            $MissingSpace.css('width', width.toString() + 'px');
                            $MissingSpace.css('height', height.toString() + 'px');
                        }).show(600);
                    }
                    ui.draggable.addClass("dropped");
                    $MissingSpace.append(ui.draggable);

                    if ($('#WordsList').children().length == 1) {
                        $('.empty-indicator').css('display', 'block');
                    }
                },
            });

            $(this).on('click', function() {
                $MissingSpace.children().first().hide(600, function() {
                    $(this).removeClass("dropped");
                    $(this).css('top', '0px');
                    $(this).css('left', '0px');
                    $('.empty-indicator').css('display', 'none');
                    $('#WordsList').append($(this));
                    const width = $(window).width() / 8;
                    $MissingSpace.css('width', width.toString() + 'px');
                }).show(600);
            });
        });
    });
}

async function InitialLoad() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    UserData.gapFillers = await UserData.GetUserData();
    UserData.RenderMissingWords();
    UserData.RenderSentencesDraggable();
    DroppableAndDraggableHandler();
}

const UserData = new RenderContent();
InitialLoad();

$(document).ready(function() {
    $('.button-gaps-right').on('click', function(event) {
        event.preventDefault();
        let index = 0;
        if ($('.option-active').text().trim() == 'Dragging Mode') {
            $('#Sentences .draggable-word-droppable').each(function() {
                if ($(this).children().first().text() == UserData.gapFillers[index]['MissingWord']) {
                    $(this).children().first().addClass('draggable-word-success');
                }
                else {
                    $(this).children().first().addClass('draggable-word-wrong');
                }
                index = index + 1;
            });
        }

        else {
            $('#Sentences .missing-box-input').each(function() {
                if ($(this).val().trim() == UserData.gapFillers[index]['MissingWord']) {
                    $(this).addClass('missing-box-input-success');
                }
                else {
                    $(this).addClass('missing-box-input-wrong');
                }
                index = index + 1;
            });
        }
    });

    $('#RestartIcon').on('click', function() {
        if ($('.option-active').text().trim() == 'Dragging Mode') {
            $('#Sentences .draggable-word-droppable').each(function() {
                $('.draggable-word').each(function() {
                    $(this).remove();
                });
                UserData.RenderMissingWords();
                $('.empty-indicator').css('display', 'none');
            });
        }

        else {
            $('#Sentences .missing-box-input').each(function() {
                $(this).removeClass('missing-box-input-success');
                $(this).removeClass('missing-box-input-wrong');
                $(this).val('');
            });
        }
    });

    $('.mode-toggler').each(function() {
        $(this).on('click', function() {
            if (!$(this).hasClass('option-active')) {
                $(this).addClass('option-active');
                $(this).siblings().removeClass('option-active');

                $('#Sentences ul').html('');
                $('.draggable-word').each(function() {
                    $(this).remove();
                });
                UserData.sentencesCounter = 1;

                switch($(this).text().trim()) {
                    case 'Dragging Mode':
                        UserData.RenderMissingWords();
                        UserData.RenderSentencesDraggable();
                        DroppableAndDraggableHandler();
                        break;
                    case 'Writing Mode':
                        UserData.RenderMissingWords();
                        UserData.RenderSentencesWriting();
                        $('.empty-indicator').css('display', 'none');
                        break;
                }
            }
        });
    });
});