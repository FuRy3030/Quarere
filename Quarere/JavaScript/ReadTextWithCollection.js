//Initial Data Setup
class UserData {
    title;
    description;
    words;
    originalText;
    constructor(title, description, words, originalText)
    {
        this.title = title;
        this.description = description;
        this.words = words;
        this.originalText = originalText;
    }
}

class WordProperties {
    word;
    phonetics;
    wordOrigin;
    meanings;
    level;
    constructor(word, phonetics, wordOrigin, meanings, level)
    {
        this.word = word;
        this.phonetics = phonetics;
        this.meanings = meanings;
        this.wordOrigin = wordOrigin;
        this.level = level;
    }
}

class Phonetics {
    phoneticText;
    audio;
    constructor(phoneticText, audio)
    {
        this.phoneticText = phoneticText;
        this.audio = audio;
    }
}

class WordVariant {
    partOfSpeech;
    definition;
    constructor(partOfSpeech, definition) 
    {
        this.definition = definition;
        this.partOfSpeech = partOfSpeech;
    }
}

class Definition {
    definition;
    nativeDefinition;
    example;
    synonyms;
    antonyms;
    constructor(definition, example, synonyms, antonyms, nativeDefinition)
    {
        this.nativeDefinition = nativeDefinition;
        this.definition = definition;
        this.example = example;
        this.synonyms = synonyms;
        this.antonyms = antonyms;
    }
}

function RequestSingleWordProperties(word) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'https://localhost:44369/api/usertextmanagementcontroller/loadwordproperties',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'POST',
            encoding: 'UTF-8',
            dataType: 'json',
            data: word,
            success: function (wordProperties) {              
                let Meanings = [];
                if(wordProperties['Meanings'] != null)
                {
                    wordProperties['Meanings'].forEach(variant => {
                        let currentDefinition = new Definition();
                        for (var item in currentDefinition)
                        {
                            if(Array.isArray(variant['Definition'][UpperFistLetter(`${item}`)])) {
                                currentDefinition[item] = [];
                                variant['Definition'][UpperFistLetter(`${item}`)].forEach(element => {
                                    currentDefinition[item].push(element);
                                });
                            }
                            else {
                                currentDefinition[item] = variant['Definition'][UpperFistLetter(`${item}`)];
                            }
                        }
                        Meanings.push(new WordVariant(variant['PartOfSpeech'], currentDefinition));
                    });
                }
                let currentPhonetics = new Phonetics();
                if(wordProperties['Phonetics'] != null)
                {
                    for(var item in currentPhonetics)
                    {
                        currentPhonetics[item] = wordProperties['Phonetics'][UpperFistLetter(`${item}`)];
                    }
                }
                let CurrentWordProperties = new WordProperties(wordProperties['Word'], currentPhonetics,
                    wordProperties['WordOrigin'], Meanings, wordProperties['Level']);
                resolve(CurrentWordProperties);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function LoadNewPageWordsList(pageNumber) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'https://localhost:44369/api/usertextmanagementcontroller/loadnewpage',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'POST',
            dataType: 'json',
            data: pageNumber,
            processData: false,
            contentType: false,
            success: function(data) {
                let Words = [];
                data.forEach(wordWithLevel => {
                    Words.push({word: wordWithLevel['Word'], level: wordWithLevel['Level']});
                });
                resolve(Words);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

let FlashcardCounter = 1;
let id = 'F0';

function CreateFlashcard(word, meaning, synonyms, example, nativeDef, inContextExample) {
    const newListItemBig = document.createElement('li');
    newListItemBig.classList.add("flashcard");
    newListItemBig.classList.add("mx-auto");
    newListItemBig.classList.add(`${id}`);

    newListItemBig.innerHTML = `<div class="col-6" style="padding-right: 25px;">` +
        `<div class="header-flashcard">` +
            `<h4>${FlashcardCounter}</h4>` +
        `</div>` +
        `<div class="top-flashcard-element">` +
            `<input type="text" value="${word}" class="Quarere-universal-input" placeholder="Word/Phrase...">` +
            `<label class="Quarere-universal-label">Term</label>` +
        `</div>` +
        `<div class="input-group mt-3">` +
            `<div class="input-group-text flashcard-checkbox">` +
                `<input class="form-check-input mt-0" type="checkbox" value="">` +
            `</div>` +
            `<input value="${synonyms}" placeholder="Synonyms..." type="text" class="form-control Quarere-universal-input checkbox-input"/>` +
        `</div>` +
        `<div class="input-group mt-1">` +
            `<div class="input-group-text flashcard-checkbox">` +
                `<input class="form-check-input mt-0" type="checkbox" value="">` +
            `</div>` +
            `<div class="form-floating">` +
                `<textarea class="form-control textarea-flashcard textarea-flashcard-${id}" placeholder="for-label" style="height: 114px">${example}</textarea>` +
                `<label class="textarea-label-flashcard">Exemplary Usage</label>` +
            `</div>` +
        `</div>` +
    `</div>` +
    `<div class="col-6" style="padding-left: 25px;">` +
        `<div class="header-flashcard header-icons">` +                              
            `<i id="icon-trash-${id}" class="fa-lg bi bi-trash"></i>` +
        `</div>` +
        `<div class="top-flashcard-element">` +
            `<input value="${meaning}" placeholder="Definition..." type="text" class="Quarere-universal-input"/>` +
            `<label class="Quarere-universal-label">Meaning</label>` +
        `</div>` +
        `<div class="input-group mt-3">` +
            `<div class="input-group-text flashcard-checkbox">` +
                `<input class="form-check-input mt-0" type="checkbox" value="">` +
            `</div>` +                               
            `<input value="${nativeDef}" placeholder="Native Language Definition..." type="text" class="form-control Quarere-universal-input checkbox-input"/>` +                                   
        `</div>` +
        `<div class="input-group mt-1">` +
            `<div class="input-group-text flashcard-checkbox">` +
                `<input class="form-check-input mt-0 textarea-flashcard-checkbox-${id}" type="checkbox" value="">` +
            `</div>` + 
            `<div class="form-floating floating-${id}">` +
                `<textarea value="${inContextExample}" class="form-control textarea-flashcard textarea-flashcard-context-${id}" placeholder="for-label" style="height: 114px"></textarea>` +
                `<label class="textarea-label-flashcard" id="label-flashcard-context-${id}">"InContext" Usage</label>` +
            `</div>` +
        `</div>` +
    `</div>` 

    FlashcardCounter = FlashcardCounter + 1;
    const FlashcardList = document.getElementById('FlashcardList');
    FlashcardList.append(newListItemBig);
    const inputLength = document.querySelector('.checkbox-input').offsetWidth;
    shortTextboxWidth = inputLength;
    $(`.textarea-flashcard-${id}`).css('width', `${inputLength}px`);
    $(`.textarea-flashcard-context-${id}`).css('width', `${inputLength}px`);
    $(`.floating-${id}`).next().css('width', `${inputLength}px`);

    $(`.textarea-flashcard-context-${id}`).on('scroll', function() {
        if ($(this).scrollTop() >=0 && $(this).scrollTop() < 10)
        {
            $(`#label-flashcard-context-${id}`).css('opacity', `${0.65 - $(this).scrollTop() / 15}`);
        }
        else {
            $(`#label-flashcard-context-${id}`).css('opacity', '0');
        }
    });

    $(`#icon-trash-${id}`).on('click', function(event) {
        event.preventDefault();
        const jQueryElement = $(newListItemBig);
        jQueryElement.nextAll().each(function() {
            const currentOrder = parseInt($(this).children().first().children().first().children().text());
            const finalOutput = currentOrder - 1;
            $(this).children().first().children().first().children().text(finalOutput.toString());
        });
        if(FlashcardCounter != 1)
        {
            FlashcardCounter = FlashcardCounter - 1;
        }
        $(this).parent().parent().parent().remove();
        if ( $('#FlashcardList').children().length == 0 )
        {
            $('#Flashcards').css('display', 'none');
        }
        AdjustPanelHeight();
    });

    AdjustPanelHeight();
    const number = parseInt(id.substring(1)) + 1;
    id = id.substring(0, 1) + `${number}`;
}

function UpperFistLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let CurrentUserData = new UserData();
let CurrentElementsInClipboard = [];

//Get Initial Data (Words Properties)
function LoadInitialData() {


    $.ajax({
        url: 'https://localhost:44369/api/usertextmanagementcontroller/gettext',
        headers: {
            'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
        },
        type: 'GET',
        encoding: 'UTF-8',
        dataType: 'json',
        success: function (data) {
            let Words = [];
            data['Words'].forEach(wordWithLevel => {
                Words.push({word: wordWithLevel['Word'], level: wordWithLevel['Level']});
            });

            CurrentUserData.title = data['Title'];
            CurrentUserData.description = data['Description'];
            CurrentUserData.words = Words;
            CurrentUserData.originalText = data['Text'];
            CurrentUserData.currentPage = 1;

            $('#Title').html(CurrentUserData.title);
            let DictionaryInnerHTML;
            console.log(data['PageCount']);
            if (data['PageCount'] > 1) {
                DictionaryInnerHTML = "'" + CurrentUserData.originalText.match(/([^ ]* ){300}/gi)[0] + "'";
                console.log(DictionaryInnerHTML);
                $('#Textarea-SelectMode').val(CurrentUserData.originalText.match(/([^ ]* ){300}/gi)[0]);
            }
            else {
                DictionaryInnerHTML = "'" + CurrentUserData.originalText + "'";
                $('#Textarea-SelectMode').val(CurrentUserData.originalText);
            }
            GenerateData(DictionaryInnerHTML);

            if (data['PageCount'] > 1 && data['PageCount'] < 6) {
                const elementsParent = document.getElementById('TextPaginationElements');
                let currentNode = document.createElement('li');
                currentNode.classList.add('page-item');
                currentNode.innerHTML = `<a class="page-link" href="" tabindex="-1" aria-disabled="true">Previous</a>`;
                elementsParent.append(currentNode);
                $('#TextPaginationElements').children().eq(0).addClass('disabled');

                currentNode.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    event.stopPropagation();


                    if (data['PageCount'] == 2 && CurrentUserData.currentPage == data['PageCount']) {
                        $('#TextPaginationElements').children().eq(0).addClass('disabled');
                        $('#TextPaginationElements').children().eq(data['PageCount'] + 1).removeClass('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage - 1;
                        $('.page-item').removeClass('active');
                        $('#TextPaginationElements').children().eq(CurrentUserData.currentPage).addClass('active');
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage == data['PageCount']) {
                        $('#TextPaginationElements').children().eq(data['PageCount'] + 1).removeClass('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage - 1;
                        $('.page-item').removeClass('active');
                        $('#TextPaginationElements').children().eq(CurrentUserData.currentPage).addClass('active');
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage == 2) {
                        event.currentTarget.classList.add('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage - 1;
                        $('.page-item').removeClass('active');
                        $('#TextPaginationElements').children().eq(CurrentUserData.currentPage).addClass('active');
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage != 1) {
                        CurrentUserData.currentPage = CurrentUserData.currentPage - 1;
                        $('.page-item').removeClass('active');
                        $('#TextPaginationElements').children().eq(CurrentUserData.currentPage).addClass('active');
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                });

                for (let i = 1; i < data['PageCount'] + 1; i = i + 1) {
                    const currentNode = document.createElement('li');
                    currentNode.classList.add('page-item');
                    if (i == 1) {
                        currentNode.classList.add('active');
                        currentNode.innerHTML = `<a class="page-link" href="">${i}</a>`;
                    }
                    else {
                        currentNode.innerHTML = `<a class="page-link" href="">${i}</a>`;
                    }
                    elementsParent.append(currentNode);

                    currentNode.addEventListener('click', function(event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        if (event.currentTarget.classList.contains('active') == false) {
                            CurrentUserData.currentPage = i;
                            $('.page-item').removeClass('active');
                            event.currentTarget.classList.add('active');
                            if (i != 1) {
                                $('#TextPaginationElements').children().eq(0).removeClass('disabled');
                            }
                            else {
                                $('#TextPaginationElements').children().eq(0).addClass('disabled');
                            }

                            if (i != data['PageCount'] ) {
                                $('#TextPaginationElements').children().eq(data['PageCount'] + 1).removeClass('disabled');
                            }
                            else {
                                $('#TextPaginationElements').children().eq(data['PageCount'] + 1).addClass('disabled');
                            }
                            LoadNewPage(i);
                        }
                    });
                }

                currentNode = document.createElement('li');
                currentNode.classList.add('page-item');
                currentNode.innerHTML = `<a class="page-link" href="">Next</a>`;
                elementsParent.append(currentNode);

                currentNode.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    event.stopPropagation();

                    if (data['PageCount'] == 2 && CurrentUserData.currentPage == 1) {
                        $('#TextPaginationElements').children().eq(0).removeClass('disabled');
                        $('#TextPaginationElements').children().eq(data['PageCount'] + 1).addClass('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage + 1;
                        $('.page-item').removeClass('active');
                        $('#TextPaginationElements').children().eq(CurrentUserData.currentPage).addClass('active');
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage == 1) {
                        $('#TextPaginationElements').children().eq(0).removeClass('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage + 1;
                        $('.page-item').removeClass('active');
                        $('#TextPaginationElements').children().eq(CurrentUserData.currentPage).addClass('active');
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage == data['PageCount'] - 1) {
                        event.currentTarget.classList.add('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage + 1;
                        $('.page-item').removeClass('active');
                        $('#TextPaginationElements').children().eq(CurrentUserData.currentPage).addClass('active');
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage != data['PageCount']) {
                        CurrentUserData.currentPage = CurrentUserData.currentPage + 1;
                        $('.page-item').removeClass('active');
                        $('#TextPaginationElements').children().eq(CurrentUserData.currentPage).addClass('active');
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                });
            }

            else if (data['PageCount'] >= 6) {
                const elementsParent = document.getElementById('TextPaginationElements');
                let currentNode = document.createElement('li');
                currentNode.classList.add('page-item');
                currentNode.innerHTML = `<a class="page-link" href="" tabindex="-1" aria-disabled="true">Previous</a>`;
                elementsParent.append(currentNode);
                $('#TextPaginationElements').children().eq(0).addClass('disabled');

                currentNode.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    event.stopPropagation();

                    if (CurrentUserData.currentPage == data['PageCount']) {
                        $('#TextPaginationElements').children().eq(data['PageCount'] + 1).removeClass('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage - 1;
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage == 2) {
                        event.currentTarget.classList.add('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage - 1;
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage != 1) {
                        CurrentUserData.currentPage = CurrentUserData.currentPage - 1;
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                });

                currentNode = document.createElement('li');
                currentNode.classList.add('page-item');
                currentNode.innerHTML = `<input id="PageChooseInput" type="text" value="1"/>`;
                elementsParent.append(currentNode);

                currentNode.children[0].addEventListener('change', function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    if (parseInt(event.currentTarget.value) > 0 && parseInt(event.currentTarget.value) < data['PageCount'] + 1) {
                        CurrentUserData.currentPage = parseInt(event.currentTarget.value);
                        if (CurrentUserData.currentPage == 1) {
                            $('#TextPaginationElements').children().eq(0).addClass('disabled');
                        }
                        else if (CurrentUserData.currentPage == data['PageCount']) {
                            $('#TextPaginationElements').children().eq(2).addClass('disabled');
                        }
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                });

                currentNode = document.createElement('li');
                currentNode.classList.add('page-item');
                currentNode.innerHTML = `<a class="page-link" href="">Next</a>`;
                elementsParent.append(currentNode);

                currentNode.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    event.stopPropagation();

                    if (CurrentUserData.currentPage == 1) {
                        $('#TextPaginationElements').children().eq(0).removeClass('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage + 1;
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage == data['PageCount'] - 1) {
                        event.currentTarget.classList.add('disabled');
                        CurrentUserData.currentPage = CurrentUserData.currentPage + 1;
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                    else if (CurrentUserData.currentPage != data['PageCount']) {
                        CurrentUserData.currentPage = CurrentUserData.currentPage + 1;
                        LoadNewPage(CurrentUserData.currentPage);
                    }
                });
            }

            AdjustPanelHeight();
        }
    });

    $.ajax({
        url: 'https://localhost:44369/api/textwithcollectioncontroller/getusercollection',
        headers: {
            'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
        },
        type: 'GET',
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(response) {
            const flashcards = response;
            console.log(flashcards);
            flashcards.forEach(flashcard => {
                CreateFlashcard(flashcard['Word'], flashcard['Meaning'], flashcard['Synonyms'], flashcard['Example'], 
                    flashcard['NativeDef'], flashcard['InContext']);
            });                 
        },
    });
};

function LoadNewPageWordsList(pageNumber) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'https://localhost:44369/api/usertextmanagementcontroller/loadnewpage',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'POST',
            dataType: 'json',
            data: pageNumber,
            processData: false,
            contentType: false,
            success: function(data) {
                let Words = [];
                data.forEach(wordWithLevel => {
                    Words.push({word: wordWithLevel['Word'], level: wordWithLevel['Level']});
                });
                resolve(Words);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function GenerateData(DictionaryInnerHTML) {
    const TextArea = document.getElementById('Textarea-SelectMode');
    const SelectorButton = $('.toggle-button').last();
    TextArea.style.height = (TextArea.scrollHeight - 34).toString() + 'px';

    if (SelectorButton.hasClass('toggle-button-active')) {
        TextArea.style.display = 'block';
        $('#Textarea-WordsWithTooltips').css('display', 'none');
    }
    else {
        $('#Textarea-WordsWithTooltips').css('display', 'block');
        TextArea.style.display = 'none';
    }

    ReplaceHelper = {};
    CurrentUserData.words.forEach(element => {
        console.log(element.word);
        let color;
        switch(element.level) {
            case 'C2':
                color = '#bb0076'; 
                break;
            case 'C1':
                color = '#cc005d'; 
                break;
            case 'B2':
                color = '#de6c4c'; 
                break;
            case 'B1':
                color = '#e6a538'; 
                break;
            case 'A2':
                color = '#bece00';
                break;
            case 'A1':
                color = '#87d02d';
                break;
            default:
                color = '#23293b';
                element.level = '\u2014';
                break;
        }

        ReplaceHelper[element.word] = `<span id="${element.word}" class="word" style="color: ${color}">${element.word}</span><div 
            id="${element.word}-tooltip" class="tooltip-textarea"><h6 class="${element.word}-PHON">Phonetics: </h6> `+
            `<h6 class="level"><i class="fas fa-layer-group"></i> ${element.level}</h6><h5 class="${element.word}-POS"></h5>
            <h5 class="${element.word}-DEF"></h5><h5 class="${element.word}-EXP"></h5></div>`;
    });

    const regExpMiddle = Object.keys(ReplaceHelper).join('|');

    const initialRegexAfter = "(?=([ -/]|[]|[:-@]))";    
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) 
        { return p.toString() === "[object SafariRemoteNotification]"; })
        (!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
    
    if (isSafari) {
        console.log('safari');
        const initialRegexBeforeSpace = "[ ]";
        const completeRegex = initialRegexBeforeSpace + '(' + regExpMiddle + ')' + initialRegexAfter;
        var regex = new RegExp(completeRegex, "g");
        document.getElementById('Textarea-WordsWithTooltips').innerHTML = DictionaryInnerHTML.replace(regex, function(matched) {
            return ReplaceHelper[matched];
        });
    }

    else {
        const initialRegexBefore = "(?<=([ -/]|[]|[:-@]))";
        const completeRegex = initialRegexBefore + '(' + regExpMiddle + ')' + initialRegexAfter;
        var regex = new RegExp(completeRegex, "g");
        document.getElementById('Textarea-WordsWithTooltips').innerHTML = DictionaryInnerHTML.replace(regex, function(matched) {
            return ReplaceHelper[matched];
        });
    }

    let counter = 0;
    $('.word').each(function() {               
        var coordinates = $(this).offset();
        var top = parseInt(coordinates.top);
        var width = parseInt($(this).width());
        let finalLeft;
        if(200 > width)
        {
            finalLeft = parseInt(coordinates.left) - ((250 - width) / 2);
        }
        $(this).next().css('top', top.toString() + 'px').css('left', finalLeft + 'px');

        var height = parseInt($(this).next().height());
        var topElement = parseInt($(this).next().offset().top);
        var finalTop = top - height - 20;
        if((topElement + height) > coordinates.top)
        {
            finalTop = finalTop - 3;
        }
        $(this).next().css('top', finalTop.toString() + 'px');

        let words = [];
        let WordWithProperties = new WordProperties();

        $(this).hover(async function() {
            if ($(this).next().children().first().text() == 'Phonetics: ') {
                // $(this).next().children().first().text('Phonetics:');
                const toolTip = $(this).next();
                if (await WaitForLongerHover($(this)) == false) {
                    return;
                }
                RequestSingleWordProperties($(this).text()).then(function(word) {
                    WordWithProperties = word;
                    console.log(WordWithProperties.word);

                    if (WordWithProperties.meanings[0] == null || WordWithProperties.meanings[0] == undefined)
                    {
                        WordWithProperties.meanings.push(new WordVariant("Sorry, Can't Reach", new Definition()));
                    }
                    if (WordWithProperties.meanings[0].definition.definition == null || 
                        WordWithProperties.meanings[0].definition.definition == undefined)
                    {
                        WordWithProperties.meanings[0].definition.definition = "\u2014";
                    }
                    if (WordWithProperties.meanings[0].definition.example == null || 
                        WordWithProperties.meanings[0].definition.example == undefined)
                    {
                        WordWithProperties.meanings[0].definition.example = "\u2014";
                    }
                    if (WordWithProperties.phonetics.phoneticText == null || WordWithProperties.phonetics.phoneticText == undefined)
                    {
                        WordWithProperties.phonetics.phoneticText = '\u2014';
                    }

                    let nodes, arrayNodes;
                    let helper = false;

                    nodes = document.getElementsByClassName(`${WordWithProperties.word}-PHON`);
                    arrayNodes = [].slice.call(nodes);
                    arrayNodes.forEach(node => {
                        node.innerHTML = 'Phonetics: ' + WordWithProperties.phonetics.phoneticText;
                    });

                    nodes = document.getElementsByClassName(`${WordWithProperties.word}-POS`);
                    arrayNodes = [].slice.call(nodes);
                    arrayNodes.forEach(node => {
                        if (WordWithProperties.meanings[1] != null && 
                            WordWithProperties.meanings[1] != undefined &&
                            WordWithProperties.meanings[0].partOfSpeech != WordWithProperties.meanings[1].partOfSpeech)
                        {
                            node.innerHTML = 'Part Of Speech: ' + WordWithProperties.meanings[0].partOfSpeech + ' or ' + 
                            WordWithProperties.meanings[1].partOfSpeech + '.';
                            helper = true;
                        }
                        else { node.innerHTML = 'Part Of Speech: ' + WordWithProperties.meanings[0].partOfSpeech + '.'; }
                    });

                    nodes = document.getElementsByClassName(`${WordWithProperties.word}-DEF`);
                    arrayNodes = [].slice.call(nodes);
                    arrayNodes.forEach(node => {
                        if(helper)
                        {
                            if (WordWithProperties.meanings[1].definition.definition != null && 
                                WordWithProperties.meanings[1].definition.definition != undefined)
                            {
                                node.innerHTML = 'Definition: 1. ' + WordWithProperties.meanings[0].definition.definition + ' 2. ' + 
                                WordWithProperties.meanings[1].definition.definition;
                            }
                        }
                        else { node.innerHTML = 'Definition: ' + WordWithProperties.meanings[0].definition.definition; }
                    });

                    nodes = document.getElementsByClassName(`${WordWithProperties.word}-EXP`);
                    arrayNodes = [].slice.call(nodes);
                    arrayNodes.forEach(node => {
                        if (WordWithProperties.meanings[0].definition.example.slice(-1) != "?" || 
                            WordWithProperties.meanings[0].definition.example.slice(-1) != "!")
                        {
                            node.innerHTML = 'Example: ' + WordWithProperties.meanings[0].definition.example + '.';
                        }
                        else { node.innerHTML = 'Example: ' + WordWithProperties.meanings[0].definition.example; }
                    });

                    PositionTooltipAsync().then(function() {
                        setTimeout(function() {
                            if (toolTip.prev().filter(':hover').length > 0) {
                                toolTip.css('visibility', 'visible');
                                toolTip.css('opacity', '1');
                            }
                        }, 100);
                    });
                    words.push(WordWithProperties);
                });
            }

            else {
                $(this).next().css('visibility', 'visible');
                $(this).next().css('opacity', '1');
            }

        }, function() {
            $(this).next().css('visibility', 'hidden');
            $(this).next().css('opacity', '0');
        });

        AdjustPanelHeight();

        $(this).on('click', function(e) {
            var word = $(this).text();
            const currentWord = words.filter(function(element) {
                return element.word == word;
            });
            console.log(currentWord);

            if (CheckIfElementAlreadyExistsOnSmallPanel(word) == false && currentWord[0] != null && currentWord[0] != undefined)
            {
                const newListItem = document.createElement('li');
                newListItem.classList.add("small-list-element");
                if(counter%2 == 1)
                {
                    newListItem.classList.add("small-list-element-odd");
                }
                newListItem.innerHTML = `<div><i class="fa-2x bi bi-volume-up"></i><h6>${word}</h6></div>`;
                const list = document.getElementById('ListSmall');
                list.append(newListItem);
                counter = counter + 1;

                newListItem.addEventListener('click', function(event) {
                    event.preventDefault();
                    $(newListItem).remove();
                });

                newListItem.lastChild.firstChild.addEventListener('click', function(event) {
                    var audio = new Audio(currentWord[0].phonetics.audio);
                    audio.play();
                    event.stopPropagation();
                });
            }               

            var wordUpperCase = UpperFistLetter(word);
            currentWord[0].meanings.forEach(variant => {
                let currentWordSynonyms = '\u2014', currentWordAntonyms = '\u2014';
                if (variant.definition.synonyms[0] != null || variant.definition.synonyms[0] != undefined)
                {
                    currentWordSynonyms = variant.definition.synonyms.reduce(function(prevValue, currValue) {
                        return prevValue + ', ' + currValue;
                    }, '');
                    currentWordSynonyms = currentWordSynonyms.substring(1, currentWordSynonyms.length);
                }
                if (variant.definition.antonyms[0] != null || variant.definition.antonyms[0] != undefined)
                {
                    currentWordAntonyms = variant.definition.antonyms.reduce(function(prevValue, currValue) {
                        return prevValue + ', ' + currValue;
                    }, '');
                    currentWordAntonyms = currentWordAntonyms.substring(1, currentWordAntonyms.length);
                }
                if (currentWord[0].wordOrigin == '') {
                    currentWord[0].wordOrigin = '\u2014';
                }
                if (variant.definition.example == null) {
                    variant.definition.example = '\u2014';
                }
                if (variant.definition.nativeDefinition == null || variant.definition.nativeDefinition == '') {
                    variant.definition.nativeDefinition = '\u2014';
                }

                const newListItemBig = document.createElement('li');
                newListItemBig.classList.add("word-full-info");
                newListItemBig.classList.add("mx-auto");
                var partofspeechUpper =  UpperFistLetter(variant.partOfSpeech);
                newListItemBig.innerHTML = `<div id="TitleInfo">` +
                `<h6 class="word-full-info-title"><i id="delete-icon-${word}-${variant.partOfSpeech}" class="fas fa-trash-alt delete-clipboard"></i></h6>` +
                `<h6 class="word-full-info-title">${wordUpperCase}</h6>` +
                `<h6 class="word-full-info-title"><i class="fas fa-layer-group"></i> ${currentWord[0].level}</h6>` +
                `</div>` +
                `<div id="DoubleInfo">` +
                `<h6 class="word-full-info-title">` +
                `<span id="Phonetics-${word}-${variant.partOfSpeech}" style="color: #f9ca24;">${currentWord[0].phonetics.phoneticText}</span> - ${partofspeechUpper}</h6>` +
                `</div>` +
                `<h6 class="word-full-info-element"><span style="font-weight: 600;">Word Origin:</span> ${currentWord[0].wordOrigin}</h6>` +
                `<h6 class="word-full-info-element"><span style="font-weight: 600;">Meaning:</span> ${variant.definition.definition}</h6>` +
                `<h6 class="word-full-info-element"><span style="font-weight: 600;">Polish Meaning:</span> ${variant.definition.nativeDefinition}</h6>` +
                `<h6 class="word-full-info-element"><span style="font-weight: 600;">Example:</span> ${variant.definition.example}</h6>` +
                `<h6 class="word-full-info-element"><span style="font-weight: 600;">Synonyms:</span> ${currentWordSynonyms}.</h6>` +
                `<h6 class="word-full-info-element"><span style="font-weight: 600;">Antonyms:</span> ${currentWordAntonyms}.</h6>`;
                const listBig = document.getElementById('ListBig');
                listBig.append(newListItemBig);

                newListItemBig.addEventListener('click', function(event) {
                    event.currentTarget.classList.toggle('word-full-info-selected');
                    $(`#Phonetics-${word}-${variant.partOfSpeech}`).toggleClass('phonetics-selected');
                    $(`#delete-icon-${word}-${variant.partOfSpeech}`).toggleClass('delete-clipboard-selected');
                });

                $(`#delete-icon-${word}-${variant.partOfSpeech}`).on('click', function(event) {
                    event.preventDefault();
                    $(newListItemBig).remove();
                    event.stopPropagation();
                });

                CurrentElementsInClipboard.push({word: word.toLowerCase(), HTMLObject: newListItemBig, level: currentWord[0].level});                       
            });
        });
    });
}

async function WaitForLongerHover(wordSpan) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (wordSpan.filter(':hover').length > 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }, 350)
    });
}

function AdjustPanelHeight() {
    const rightPanelHeight = $('#RightPanel').first().height();
    const totalHeight = $('#TextWithTitleArea').height();

    let appropriateHeight = Math.max(rightPanelHeight, totalHeight);
    $('#RightPanel').css('max-height', appropriateHeight.toString() + "px");
    $('#RightPanel').css('height', appropriateHeight.toString() + "px");

    if(document.getElementById('Flashcards').style.display == 'flex') {
        appropriateHeight = appropriateHeight + $('.height-count').last().height();
    }
    $('#Clipboard').css('max-height', appropriateHeight.toString() + "px");
    $('#Clipboard').css('height', appropriateHeight.toString() + "px");
    $('#Clipboard').css('min-height', appropriateHeight.toString() + "px");
}

function AdjustFlashcardsTextboxsWidths(targetWidth) {
    if (targetWidth == 0) {
        targetWidth = document.querySelector('.checkbox-input').offsetWidth;
    }
    $('.textarea-flashcard').each(function() {
        $(this).css('width', `${targetWidth}px`);
    });
}

function CheckIfElementAlreadyExistsOnSmallPanel(word) {
    let returnValue = false;
    $('#ListSmall').children().each(function() {
        elementWord = $(this).children().first().children().last().text().toString();
        console.log(word.toString());
        if (elementWord == word.toString())
        {
            returnValue = true;
            return false;
        }
    });
    return returnValue;
}

async function PositionTooltipAsync() {
    $('.word').each(function() {
        var coordinates = $(this).offset();
        var top = parseInt(coordinates.top);
        var width = parseInt($(this).width());
        var deviation = ($(this).next().width() - width) / 2;
        var finalLeft = coordinates.left - deviation - 10;

        $(this).next().css('top', top.toString() + 'px').css('left', finalLeft + 'px');
        var height = parseInt($(this).next().height());
        var topElement = parseInt($(this).next().offset().top);
        var finalTop = top - height - 20;
        if((topElement + height) > coordinates.top)
        {
            finalTop = finalTop - 3;
        }
        $(this).next().css('top', finalTop.toString() + 'px');
    });
}

function PositionTooltips() {
    $('.word').each(function() {               
        var coordinates = $(this).offset();
        var top = parseInt(coordinates.top);
        var width = parseInt($(this).width());
        var deviation = ($(this).next().width() - width) / 2;
        var finalLeft = coordinates.left - deviation - 10;

        $(this).next().css('top', top.toString() + 'px').css('left', finalLeft + 'px');
        var height = parseInt($(this).next().height());
        var topElement = parseInt($(this).next().offset().top);
        var finalTop = top - height - 20;
        if((topElement + height) > coordinates.top)
        {
            finalTop = finalTop - 3;
        }
        $(this).next().css('top', finalTop.toString() + 'px');

        try {
            const TextArea = document.getElementById('Textarea-SelectMode');
            TextArea.style.height = "1px";
            TextArea.style.height = (TextArea.scrollHeight).toString() + 'px';
        }
        catch {
            //do nothing
        }
        AdjustPanelHeight();
    });
}

function StyleErrorWithLabel(element) {
    element.css('border-bottom', '3px solid');
    element.css('border-color', 'red');
    element.next().css('color', 'red');
    element.addClass('Input-Error');
    element.on('keyup', function() {
        element.css('border-bottom', '2px solid');
        element.css('border-color', 'black');
        element.next().css('color', '#939bb4');
        element.removeClass('Input-Error');
    });
}

function StyleErrorWithoutLabel(element) {
    element.css('border-bottom', '3px solid');
    element.css('border-color', 'red');
    element.addClass('Input-Error');
    element.on('keyup', function() {
        element.css('border-bottom', '2px solid');
        element.css('border-color', 'black');
        element.removeClass('Input-Error');
    });
}

function StyleErrorTextarea(element) {
    element.css('border', '2px solid red');
    element.on('keyup', function() {
        element.css('border', '2px solid #fbfbff');
    });
}

function AJAXShowErrorModal(modalBody) {
    var ModalError = $('#ModalError');
    ModalError.addClass('modalShow');
    $('.modal-title').text(`Wait a minute ${localStorage.getItem('username')}!`);
    $('.modal-body').text(modalBody);
    $('#ModalError .close-modal').on('click', function() {
        ModalError.removeClass('modalShow');
    });
    $('.close-button-modal').on('click', function() {
        ModalError.removeClass('modalShow');
    });
}

function UploadData(event) {
    event.preventDefault();
    const FlashcardList = [];
    let isInputValid = true;

    if ($('#FlashcardList').children().length < 3) {
        var ModalError = $('#ModalError');
        ModalError.addClass('modalShow');
        $('.modal-title').text(`Hey ${localStorage.getItem('username')}, Watch Out!`);
        $('.modal-body').text(`Your collection doesn't contain enough elements! Keep in mind that it must contain at least three components.`);
        $('#ModalError .close-modal').on('click', function() {
            ModalError.removeClass('modalShow');
        });
        $('.close-button-modal').on('click', function() {
            ModalError.removeClass('modalShow');
        });
        return;
    }

    $('.flashcard').each(function() {
        const Word = $(this).children().first().children().first().next().children().first();
        const Meaning = $(this).children().last().children().first().next().children().first();
        const CheckboxesLeft = $(this).children().first().find('.form-check-input');
        const Synonyms = $(this).children().first().find('.form-check-input').first().parent().next();
        const ExampleUsage = $(this).children().first().find('.textarea-flashcard');
        const CheckboxesRight = $(this).children().last().find('.form-check-input');
        const NativeLanguageDefinition = $(this).children().last().find('.form-check-input').first().parent().next();
        const InContextUsage = $(this).children().last().find('.textarea-flashcard');

        console.log(ExampleUsage.val().trim());

        if (Word.val().trim() == '' || Word.val().trim().length > 250) {
            StyleErrorWithLabel(Word);
            var ModalError = $('#ModalError');
            ModalError.addClass('modalShow');
            $('.modal-title').text(`Hey ${localStorage.getItem('username')}, Watch Out!`);
            $('.modal-body').text('Either term field is empty or it has exceeded character limit! Keep in mind that "term" can contain at most 250 characters.');
            $('#ModalError .close-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            $('.close-button-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            isInputValid = false;
            return false;
        }
        else if (Meaning.val().trim() == '' || Meaning.val().trim().length > 500) {
            StyleErrorWithLabel(Meaning);
            var ModalError = $('#ModalError');
            ModalError.addClass('modalShow');
            $('.modal-title').text(`Hey ${localStorage.getItem('username')}, Watch Out!`);
            $('.modal-body').text('Either meaning field is empty or it has exceeded character limit! Keep in mind that "meaning" can contain at most 500 characters.');
            $('#ModalError .close-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            $('.close-button-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            isInputValid = false;
            return false;
        }
        else if (Synonyms.val().trim().length > 250) {
            StyleErrorWithoutLabel(Synonyms);
            var ModalError = $('#ModalError');
            ModalError.addClass('modalShow');
            $('.modal-title').text(`Hey ${localStorage.getItem('username')}, Watch Out!`);
            $('.modal-body').text('Synonyms have exceeded thier character limit! Keep in mind that synonyms can contain at most 250 characters.');
            $('#ModalError .close-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            $('.close-button-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            isInputValid = false;
            return false;
        }
        else if (NativeLanguageDefinition.val().trim().length > 250) {
            StyleErrorWithoutLabel(Synonyms);
            var ModalError = $('#ModalError');
            ModalError.addClass('modalShow');
            $('.modal-title').text(`Hey ${localStorage.getItem('username')}, Watch Out!`);
            $('.modal-body').text('Native Language Definition has exceeded its character limit! Keep in mind that it can contain at most 250 characters.');
            $('#ModalError .close-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            $('.close-button-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            isInputValid = false;
            return false;
        }
        else if (ExampleUsage.val().trim().length > 500) {
            StyleErrorTextarea(ExampleUsage);
            var ModalError = $('#ModalError');
            ModalError.addClass('modalShow');
            $('.modal-title').text(`Hey ${localStorage.getItem('username')}, Watch Out!`);
            $('.modal-body').text('Example word usage has exceeded its character limit! Keep in mind that it can contain at most 500 characters.');
            $('#ModalError .close-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            $('.close-button-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            isInputValid = false;
            return false;
        }
        else if (InContextUsage.val().trim().length > 750) {
            StyleErrorTextarea(InContextUsage);
            var ModalError = $('#ModalError');
            ModalError.addClass('modalShow');
            $('.modal-title').text(`Hey ${localStorage.getItem('username')}, Watch Out!`);
            $('.modal-body').text('Example from given text has exceeded its character limit! Keep in mind that it can contain at most 750 characters.');
            $('#ModalError .close-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            $('.close-button-modal').on('click', function() {
                ModalError.removeClass('modalShow');
            });
            isInputValid = false;
            return false;
        }
        else {
            let Flashcard = {
                word: '',
                meaning: '',
                synonyms: '',
                example: '',
                nativeDef: '',
                inContext: '',
                isFavourite: '0'
            }

            Flashcard.word = Word.val().trim();
            Flashcard.meaning = Meaning.val().trim();
            if (CheckboxesLeft.first().is(':checked')) {
                if (Synonyms.val().trim() == '') {
                    Flashcard.synonyms = null;
                }
                else {
                    Flashcard.synonyms = Synonyms.val().trim();
                }
            }
            else {
                Flashcard.synonyms = null;
            }
            if (CheckboxesLeft.last().is(':checked')) {
                if (ExampleUsage.val().trim() == '') {
                    Flashcard.example = null;
                }
                else {
                    Flashcard.example = ExampleUsage.val().trim();
                }
            }
            else {
                Flashcard.example = null;
            }

            if (CheckboxesRight.first().is(':checked')) {
                if (NativeLanguageDefinition.val().trim() == '') {
                    Flashcard.nativeDef = null;
                }
                else {
                    Flashcard.nativeDef = NativeLanguageDefinition.val().trim();
                }
            }
            else {
                Flashcard.nativeDef = null;
            }
            if (CheckboxesRight.last().is(':checked')) {
                if (InContextUsage.val().trim() == '') {
                    Flashcard.inContext = null;
                }
                else {
                    Flashcard.inContext = InContextUsage.val().trim();
                }
            }
            else {
                Flashcard.inContext = null;
            }

            FlashcardList.push(Flashcard);
        }
    });

    if(isInputValid == false) {
        return;
    }

    $.ajax({
        url: 'https://localhost:44369/api/textwithcollectioncontroller/updateusercollection',
        headers: {
            'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
        },
        type: 'PUT',
        dataType: 'json',
        data: JSON.stringify({flashcards: FlashcardList, collectionTitle: localStorage.getItem('CollectionTitle')}),
        processData: false,
        contentType: false,
        success: function(response) {
            alert('success');
            localStorage.setItem('CurrentOpenElementTitle', localStorage.getItem('CollectionTitle'));
            localStorage.setItem('TypeOfElement', 'collection');
            window.location.href = "https://localhost:44369/OpenedUserCollection.aspx";                     
        },
        error: function(err) {
            alert(err);
        }
    });
}

try {
    LoadInitialData();
}
catch {
    ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
}

$(document).ready(function () {
    //Navbar Event Listeners
    const SelectorButton = $('.toggle-button').last();
    const DictionaryButton = $('#toggle-button-first');
    const BarToggler = $('#BarIcon');
    const Search = $('.search-input').first();
    const LevelFilters = $('.level-selector-element');
    const AllButton = $('#LeftButtonClipboard');
    const SelectedButton = $('#MiddleButtonClipboard');
    const NotSelectedButton = $('#RightButtonClipboard');
    const CreateFlashcardsButton = $('#AddFlashcardButton');
    const FlashcardSection = document.getElementById('Flashcards');
    let shortTextboxWidth;

    const RightPanelOptions = {
        threshold: 0
    }

    const toggleRightPanel = new IntersectionObserver(function(entries, toggleRightPanel) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                $('#RightPanel').addClass('option-panel-right-scrolled');
            }
            else {
                $('#RightPanel').removeClass('option-panel-right-scrolled');
            }
        });
    }, RightPanelOptions);
    toggleRightPanel.observe(FlashcardSection);

    $('#SubmitFlashcards').on('click', UploadData);
    
    SelectorButton.on('click', function(){
        $(this).addClass('toggle-button-active');
        DictionaryButton.removeClass('toggle-button-active');
        $('#Textarea-SelectMode').css('display', 'block');
        $('#Textarea-WordsWithTooltips').css('display', 'none');

        const TextArea = document.getElementById('Textarea-SelectMode');
        TextArea.style.height = "1px";
        TextArea.style.height = (TextArea.scrollHeight - 1).toString() + 'px';
        TextArea.style.height = (parseInt(TextArea.style.height) + 1).toString() + 'px';
        AdjustPanelHeight();
    });

    $('#Textarea-SelectMode').on('select', function(event) {
        $('#Flashcards').css('display', 'flex');         

        let phrase = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd);
        const newListItemBig = document.createElement('li');
        newListItemBig.classList.add("flashcard");
        newListItemBig.classList.add("mx-auto");
        const customIdentifier = Math.round(Math.random() * 1000);

        const initialRegexBefore = "([^.]*?)[ ,;:()]";
        const initialRegexAfter = "[. ;:,()](.*?)(?=[.!?;])";
        var completeRegex = initialRegexBefore + phrase + initialRegexAfter;
        var regex = new RegExp(completeRegex, "gim");
        const userText = '.' + $('#Textarea-SelectMode').val() + '.';
        let inContextDefenitions = userText.match(regex);
        const phraseVal = phrase;
        phrase = phrase.replace(/[^a-zA-Z]+/g, '');

        newListItemBig.classList.add(`${phrase}-${customIdentifier}`);

        newListItemBig.innerHTML = `<div class="col-6" style="padding-right: 25px;">` +
            `<div class="header-flashcard">` +
                `<h4>${FlashcardCounter}</h4>` +
            `</div>` +
            `<div class="top-flashcard-element">` +
                `<input type="text" value="${phraseVal}" class="Quarere-universal-input" placeholder="Word/Phrase...">` +
                `<label class="Quarere-universal-label">Term</label>` +
            `</div>` +
            `<div class="input-group mt-3">` +
                `<div class="input-group-text flashcard-checkbox">` +
                    `<input class="form-check-input mt-0" type="checkbox" value="">` +
                `</div>` +
                `<input value="" placeholder="Synonyms..." type="text" class="form-control Quarere-universal-input checkbox-input"/>` +
            `</div>` +
            `<div class="input-group mt-1">` +
                `<div class="input-group-text flashcard-checkbox">` +
                    `<input class="form-check-input mt-0" type="checkbox" value="">` +
                `</div>` +
                `<div class="form-floating">` +
                    `<textarea class="form-control textarea-flashcard textarea-flashcard-${phrase}" placeholder="for-label" style="height: 114px"></textarea>` +
                    `<label class="textarea-label-flashcard">Exemplary Usage</label>` +
                `</div>` +
            `</div>` +
        `</div>` +
        `<div class="col-6" style="padding-left: 25px;">` +
            `<div class="header-flashcard header-icons">` +                              
                `<i id="icon-trash-${phrase}-${customIdentifier}" class="fa-lg bi bi-trash"></i>` +
            `</div>` +
            `<div class="top-flashcard-element">` +
                `<input value="" placeholder="Definition..." type="text" class="Quarere-universal-input"/>` +
                `<label class="Quarere-universal-label">Meaning</label>` +
            `</div>` +
            `<div class="input-group mt-3">` +
                `<div class="input-group-text flashcard-checkbox">` +
                    `<input class="form-check-input mt-0" type="checkbox" value="">` +
                `</div>` +                               
                `<input placeholder="Native Language Definition..." type="text" class="form-control Quarere-universal-input checkbox-input"/>` +                                   
            `</div>` +
            `<div class="input-group mt-1">` +
                `<div class="input-group-text flashcard-checkbox">` +
                    `<input class="form-check-input mt-0 textarea-flashcard-checkbox-${phrase}-${customIdentifier}" type="checkbox" value="">` +
                `</div>` + 
                `<div class="form-floating floating-${phrase}-${customIdentifier}">` +
                    `<textarea class="form-control textarea-flashcard textarea-flashcard-context-${phrase}-${customIdentifier}" placeholder="for-label" style="height: 114px"></textarea>` +
                    `<label class="textarea-label-flashcard" id="label-flashcard-context-${phrase}-${customIdentifier}">"InContext" Usage</label>` +
                `</div>` +
                `<div class="context-chosing">` +
                `</div>` +
            `</div>` +
        `</div>`
        
        FlashcardCounter = FlashcardCounter + 1;
        const FlashcardList = document.getElementById('FlashcardList');
        FlashcardList.append(newListItemBig);
        const inputLength = document.querySelector('.checkbox-input').offsetWidth;
        shortTextboxWidth = inputLength;
        $(`.textarea-flashcard-${phrase}`).css('width', `${inputLength}px`);
        $(`.textarea-flashcard-context-${phrase}-${customIdentifier}`).css('width', `${inputLength}px`);
        $(`.floating-${phrase}-${customIdentifier}`).next().css('width', `${inputLength}px`);

        try {
            const option = document.createElement('h6');
            option.innerHTML = 'Empty';
            $(`.floating-${phrase}-${customIdentifier}`).next().append(option);
            option.addEventListener('click', function() {
                $(`.floating-${phrase}-${customIdentifier}`).css('display', 'block');
                $(`.floating-${phrase}-${customIdentifier}`).next().css('display', 'none');
                $(`.textarea-flashcard-context-${phrase}-${customIdentifier}`).val(''); 
            });

            inContextDefenitions.forEach(inContextDefenition => {
                if(inContextDefenition.charAt(0) == ' ')
                {
                    inContextDefenition = inContextDefenition.substring(1);
                }
                const option = document.createElement('h6');
                option.innerHTML = inContextDefenition;
                $(`.floating-${phrase}-${customIdentifier}`).next().append(option);
                option.addEventListener('click', function() {
                    $(`.floating-${phrase}-${customIdentifier}`).css('display', 'block');
                    $(`.floating-${phrase}-${customIdentifier}`).next().css('display', 'none');
                    $(`.textarea-flashcard-context-${phrase}-${customIdentifier}`).val(inContextDefenition); 
                });
            });
        }
        catch {
            const option = document.createElement('h6');
            option.innerHTML = 'Empty';
            $(`.floating-${phrase}-${customIdentifier}`).next().append(option);
            option.addEventListener('click', function() {
                $(`.floating-${phrase}-${customIdentifier}`).css('display', 'block');
                $(`.floating-${phrase}-${customIdentifier}`).next().css('display', 'none');
                $(`.textarea-flashcard-context-${phrase}-${customIdentifier}`).val(''); 
            });
        }

        $(`.textarea-flashcard-checkbox-${phrase}-${customIdentifier}`).on('change', function() {
            if (this.checked) {
                $(`.floating-${phrase}-${customIdentifier}`).css('display', 'none');
                $(`.floating-${phrase}-${customIdentifier}`).next().css('display', 'block');
            }
            else {
                $(`.floating-${phrase}-${customIdentifier}`).css('display', 'block');
                $(`.floating-${phrase}-${customIdentifier}`).next().css('display', 'none');
            }
        });

        $(`.textarea-flashcard-context-${phrase}-${customIdentifier}`).on('scroll', function() {
            if ($(this).scrollTop() >=0 && $(this).scrollTop() < 10)
            {
                $(`#label-flashcard-context-${phrase}-${customIdentifier}`).css('opacity', `${0.65 - $(this).scrollTop() / 15}`);
            }
            else {
                $(`#label-flashcard-context-${phrase}-${customIdentifier}`).css('opacity', '0');
            }
        });

        $(`#icon-trash-${phrase}-${customIdentifier}`).on('click', function() {
            event.preventDefault();
            const jQueryElement = $(newListItemBig);
            jQueryElement.nextAll().each(function() {
                const currentOrder = parseInt($(this).children().first().children().first().children().text());
                const finalOutput = currentOrder - 1;
                $(this).children().first().children().first().children().text(finalOutput.toString());
            });
            if(FlashcardCounter != 1)
            {
                FlashcardCounter = FlashcardCounter - 1;
            }
            $(`.${phrase}-${customIdentifier}`).remove();
            if ( $('#FlashcardList').children().length == 0 )
            {
                $('#Flashcards').css('display', 'none');
            }
            AdjustPanelHeight();
        });

        AdjustPanelHeight();
    });

    DictionaryButton.on('click', function(){
        $(this).addClass('toggle-button-active');
        SelectorButton.removeClass('toggle-button-active');
        $('#Textarea-SelectMode').css('display', 'none');
        $('#Textarea-WordsWithTooltips').css('display', 'block');
        AdjustPanelHeight();
    });

    BarToggler.on('click', function() {
        if ($('#Clipboard').hasClass("unActive") && $('#FlashcardList').children().length > 0) {
            AdjustFlashcardsTextboxsWidths(shortTextboxWidth);
        }
        else if ($('#FlashcardList').children().length > 0) {
            setTimeout(AdjustFlashcardsTextboxsWidths.bind(null, 0), 510);
        }

        $('#Clipboard').toggleClass('unActive');
        $('#BarIcon').addClass('AnimateClick');
        setTimeout(PositionTooltips, 550);
        setTimeout(function() {
            $('#BarIcon').removeClass('AnimateClick');
        }, 360);
    });

    Search.on('keyup', function() {
        const SearchValue = $(this).val().toLowerCase();
        const FilteredElements = CurrentElementsInClipboard.filter(element => {
            return element.word.includes(SearchValue);
        });
        CurrentElementsInClipboard.forEach(element => {
            if(FilteredElements.includes(element)) {
                element.HTMLObject.style.display = 'block';
            }
            else {
                element.HTMLObject.style.display = 'none';
            }
        });
    });

    LevelFilters.each(function() {
        $(this).on('click', function() {
            if($(this).text() == 'All')
            {
                CurrentElementsInClipboard.forEach(element => {
                    element.HTMLObject.style.display = 'block';
                });
            }
            else
            {
                const SelectedLevel = $(this).text();
                const FilteredElements = CurrentElementsInClipboard.filter(element => {
                    return element.level.includes(SelectedLevel);
                });
                CurrentElementsInClipboard.forEach(element => {
                    if(FilteredElements.includes(element)) {
                        element.HTMLObject.style.display = 'block';
                    }
                    else {
                        element.HTMLObject.style.display = 'none';
                    }
                });
            }
        });
    });

    AllButton.on('click', function() {
        CurrentElementsInClipboard.forEach(element => {
            element.HTMLObject.style.display = 'block';
        });
    });

    SelectedButton.on('click', function() {
        $('.word-full-info-selected').each(function() {
            $(this).css('display', 'block');
        });
        $('#ListBig li:not(.word-full-info-selected)').each(function() {
            $(this).css('display', 'none');
        });
    });

    NotSelectedButton.on('click', function() {
        $('.word-full-info-selected').each(function() {
            $(this).css('display', 'none')
        });
        $('#ListBig li:not(.word-full-info-selected)').each(function() {
            $(this).css('display', 'block');
        });
    });

    CreateFlashcardsButton.on('click', function(event) {
        event.preventDefault();
        $('#Flashcards').css('display', 'flex'); 

        $('.word-full-info-selected').each(function() {
            const newListItemBig = document.createElement('li');
            newListItemBig.classList.add("flashcard");
            newListItemBig.classList.add("mx-auto");
            const partOfSpeech = $(this).children().first().next().children().text().substring($(this).children().first().next().children().text().length - 4);
            const word = $(this).children().first().children().first().next().text();
            let synonyms = $(this).children().last().prev().text().substring(11, $(this).children().last().prev().text().length - 1);
            synonyms = UpperFistLetter(synonyms);
            let example = $(this).children().last().prev().prev().text().substring(9);
            example = UpperFistLetter(example);
            let nativeMeaning = $(this).children().last().prev().prev().prev().text().substring(16);
            let meaning = $(this).children().last().prev().prev().prev().prev().text()
                .substring(9, $(this).children().last().prev().prev().prev().prev().text().length - 1);
            meaning = UpperFistLetter(meaning);

            newListItemBig.classList.add(`${word}-${partOfSpeech}`);

            if (example == '\u2014')
            {
                example = '';
            }
            else if (example.slice(-1) != "?" || example.slice(-1) != "!")
            {
                example = example + '.';
            }

            const initialRegexBefore = "([^.]*?)[ ,;:()]";
            const initialRegexAfter = "[. ;:,()](.*?)(?=[.!?;])";
            var completeRegex = initialRegexBefore + word + initialRegexAfter;
            var regex = new RegExp(completeRegex, "gim");
            const userText = '.' + $('#Textarea-SelectMode').val() + '.';
            let inContextDefenitions = userText.match(regex);

            newListItemBig.innerHTML = `<div class="col-6" style="padding-right: 25px;">` +
                `<div class="header-flashcard">` +
                    `<h4>${FlashcardCounter}</h4>` +
                `</div>` +
                `<div class="top-flashcard-element">` +
                    `<input type="text" value="${word}" class="Quarere-universal-input" placeholder="Word/Phrase...">` +
                    `<label class="Quarere-universal-label">Term</label>` +
                `</div>` +
                `<div class="input-group mt-3">` +
                    `<div class="input-group-text flashcard-checkbox">` +
                        `<input class="form-check-input mt-0" type="checkbox" value="">` +
                    `</div>` +
                    `<input value="${synonyms}" placeholder="Synonyms..." type="text" class="form-control Quarere-universal-input checkbox-input"/>` +
                `</div>` +
                `<div class="input-group mt-1">` +
                    `<div class="input-group-text flashcard-checkbox">` +
                        `<input class="form-check-input mt-0" type="checkbox" value="">` +
                    `</div>` +
                    `<div class="form-floating">` +
                        `<textarea class="form-control textarea-flashcard textarea-flashcard-${word}" placeholder="for-label" style="height: 114px">${example}</textarea>` +
                        `<label class="textarea-label-flashcard">Exemplary Usage</label>` +
                    `</div>` +
                `</div>` +
            `</div>` +
            `<div class="col-6" style="padding-left: 25px;">` +
                `<div class="header-flashcard header-icons">` +                              
                    `<i id="icon-trash-${word}-${partOfSpeech}" class="fa-lg bi bi-trash"></i>` +
                `</div>` +
                `<div class="top-flashcard-element">` +
                    `<input value="${meaning}" placeholder="Definition..." type="text" class="Quarere-universal-input"/>` +
                    `<label class="Quarere-universal-label">Meaning</label>` +
                `</div>` +
                `<div class="input-group mt-3">` +
                    `<div class="input-group-text flashcard-checkbox">` +
                        `<input class="form-check-input mt-0" type="checkbox" value="">` +
                    `</div>` +                               
                    `<input value="${nativeMeaning}" placeholder="Native Language Definition..." type="text" class="form-control Quarere-universal-input checkbox-input"/>` +                                   
                `</div>` +
                `<div class="input-group mt-1">` +
                    `<div class="input-group-text flashcard-checkbox">` +
                        `<input class="form-check-input mt-0 textarea-flashcard-checkbox-${word}-${partOfSpeech}" type="checkbox" value="">` +
                    `</div>` + 
                    `<div class="form-floating floating-${word}-${partOfSpeech}">` +
                        `<textarea class="form-control textarea-flashcard textarea-flashcard-context-${word}-${partOfSpeech}" placeholder="for-label" style="height: 114px"></textarea>` +
                        `<label class="textarea-label-flashcard" id="label-flashcard-context-${word}-${partOfSpeech}">"InContext" Usage</label>` +
                    `</div>` +
                    `<div class="context-chosing">` +
                    `</div>` +
                `</div>` +
            `</div>` 
            FlashcardCounter = FlashcardCounter + 1;
            const FlashcardList = document.getElementById('FlashcardList');
            FlashcardList.append(newListItemBig);
            const inputLength = document.querySelector('.checkbox-input').offsetWidth;
            shortTextboxWidth = inputLength;
            $(`.textarea-flashcard-${word}`).css('width', `${inputLength}px`);
            $(`.textarea-flashcard-context-${word}-${partOfSpeech}`).css('width', `${inputLength}px`);
            $(`.floating-${word}-${partOfSpeech}`).next().css('width', `${inputLength}px`);

            if (inContextDefenitions != null && inContextDefenitions != undefined && inContextDefenitions.length > 0) {
                inContextDefenitions.forEach(inContextDefenition => {
                    if(inContextDefenition.charAt(0) == ' ')
                    {
                        inContextDefenition = inContextDefenition.substring(1);
                    }
                    const option = document.createElement('h6');
                    option.innerHTML = inContextDefenition;
                    $(`.floating-${word}-${partOfSpeech}`).next().append(option);
                    option.addEventListener('click', function() {
                        $(`.floating-${word}-${partOfSpeech}`).css('display', 'block');
                        $(`.floating-${word}-${partOfSpeech}`).next().css('display', 'none');
                        $(`.textarea-flashcard-context-${word}-${partOfSpeech}`).val(inContextDefenition); 
                    });
                });

                $(`.textarea-flashcard-checkbox-${word}-${partOfSpeech}`).on('change', function() {
                    if (this.checked) {
                        $(`.floating-${word}-${partOfSpeech}`).css('display', 'none');
                        $(`.floating-${word}-${partOfSpeech}`).next().css('display', 'block');
                    }
                    else {
                        $(`.floating-${word}-${partOfSpeech}`).css('display', 'block');
                        $(`.floating-${word}-${partOfSpeech}`).next().css('display', 'none');
                    }
                });
            }

            $(`.textarea-flashcard-context-${word}-${partOfSpeech}`).on('scroll', function() {
                if ($(this).scrollTop() >=0 && $(this).scrollTop() < 10)
                {
                    $(`#label-flashcard-context-${word}-${partOfSpeech}`).css('opacity', `${0.65 - $(this).scrollTop() / 15}`);
                }
                else {
                    $(`#label-flashcard-context-${word}-${partOfSpeech}`).css('opacity', '0');
                }
            });

            $(`#icon-trash-${word}-${partOfSpeech}`).on('click', function(event) {
                event.preventDefault();
                const jQueryElement = $(newListItemBig);
                jQueryElement.nextAll().each(function() {
                    const currentOrder = parseInt($(this).children().first().children().first().children().text());
                    const finalOutput = currentOrder - 1;
                    $(this).children().first().children().first().children().text(finalOutput.toString());
                });
                if(FlashcardCounter != 1)
                {
                    FlashcardCounter = FlashcardCounter - 1;
                }
                $(`.${word}-${partOfSpeech}`).remove();
                if ( $('#FlashcardList').children().length == 0 )
                {
                    $('#Flashcards').css('display', 'none');
                }
                AdjustPanelHeight();
            });

            AdjustPanelHeight();
            $(this).removeClass('word-full-info-selected');
            $(this).children().first().children().first().children().first().toggleClass('delete-clipboard-selected');
            $(this).children().first().next().children().children('span').removeClass('phonetics-selected');
        });
    });

    $(function() {
        $('#FlashcardList').sortable({
            update: function(event, ui) {
                let prevItemOrder;
                if (isNaN(parseInt(ui.item.prev().children().first().children().first().children().text()))) {
                    prevItemOrder = 0;
                }
                else {
                    prevItemOrder = parseInt(ui.item.prev().children().first().children().first().children().text());
                }
                console.log(prevItemOrder);
                const itemOrder = prevItemOrder + 1;
                ui.item.children().first().children().first().children().text(itemOrder.toString());
                let currentOrder = itemOrder + 1;
                console.log(currentOrder);
                ui.item.nextAll().each(function() {
                    $(this).children().first().children().first().children().text(currentOrder.toString());
                    currentOrder = currentOrder + 1;
                });
            }
        });
    });

    $(window).scroll(function(){
        let scrolledPx = $(window).scrollTop();
        if (scrolledPx < $('.navbar').outerHeight()) {
            const result = $('.navbar').outerHeight() - scrolledPx;
            $('#DashboardContainerHeader').css('top', (result).toString() + 'px');
            $('#DashboardContainerHeader').css('background-color', '#0B225B');
        }
        else {
            $('#DashboardContainerHeader').css('top', '0px');
            $('#DashboardContainerHeader').css('background-color', '#0B225B');
        }
    });

    $('.dashboard-navbar-element').first().on('click', function(event) {
        event.preventDefault();
        window.location.href = "https://localhost:44369/AddText.aspx";
    });
    
    $('.dashboard-navbar-element').first().next().on('click', function(event) {
        event.preventDefault();
        window.location.href = "https://localhost:44369/TextAnalyzer.aspx";
    });
    
    $('.dashboard-navbar-element').first().next().next().on('click', function(event) {
        event.preventDefault();
        window.location.href = "https://localhost:44369/LearningMenu.aspx";
    });
    
    $('.dashboard-navbar-element').last().on('click', function(event) {
        event.preventDefault();
        window.location.href = "https://localhost:44369/Repository.aspx";
    });
    
    const navBarHeight = $('#DashboardContainerHeader').outerHeight();
    $('#DashboardContainerHeader').css('top', $('.navbar').outerHeight().toString() + 'px');
    $('.EmptyDiv').css('height', navBarHeight.toString() + 'px');
});