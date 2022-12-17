class AutoFillWordData {
    word;
    phonetics;
    audio;
    meanings;
    level;
    constructor(word, phonetics, audio, meanings, level)
    {
        this.word = word;
        this.phonetics = phonetics;
        this.audio = audio;
        this.meanings = meanings;
        this.level = level;
    }
}

class MeaningVariant {
    partOfSpeech;
    definition;
    constructor(partOfSpeech, definition) 
    {
        this.definition = definition;
        this.partOfSpeech = partOfSpeech;
    }
}

class DefinitionDetails {
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

class Data {
    static currenctCollectionData = [];
    static collectionCounter = 1;
    static uniqueElementID = 0;
    static currentLanguage = 'English';
    static currentLanguageForDictionary = 'English';

    static LoadWordData(word, language) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/usertextmanagementcontroller/loadwordproperties',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'POST',
                encoding: 'UTF-8',
                dataType: 'json',
                data: JSON.stringify({word: word.toLowerCase(), language: language}),
                success: function (wordProperties) {              
                    let Meanings = [];
                    if(wordProperties['Meanings'] != null)
                    {
                        wordProperties['Meanings'].forEach(variant => {
                            let currentDefinition = new DefinitionDetails();
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
                            Meanings.push(new MeaningVariant(variant['PartOfSpeech'], currentDefinition));
                        });
                    } 

                    let CurrentWordProperties;
                 
                    if (wordProperties['Phonetics'] == null) {
                        CurrentWordProperties = new AutoFillWordData(wordProperties['Word'], 
                            '', '', Meanings, wordProperties['Level']);
                    }
                    else {
                        CurrentWordProperties = new AutoFillWordData(wordProperties['Word'], 
                            wordProperties['Phonetics']['PhoneticText'], wordProperties['Phonetics']['Audio'], 
                            Meanings, wordProperties['Level']);
                    }
                    resolve(CurrentWordProperties);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }

    static TransformData(wordProperties) {
        wordProperties.word = UpperFistLetter(wordProperties.word);

        if (wordProperties.word == '') {
            DisplayError();
            throw 'Word is Empty!';
        }

        if (wordProperties.phonetics == '') {
            wordProperties.phonetics = '\u2014';
        }

        if (wordProperties.level == '') {
            wordProperties.phonetics = '\u2014';
        } 

        wordProperties.meanings.forEach(meaning => {
            if (meaning.partOfSpeech == '') {
                DisplayError();
                throw 'Part Of Speech is Empty!';
            }

            meaning.partOfSpeech = UpperFistLetter(meaning.partOfSpeech);

            if (meaning.definition.definition == '' || meaning.definition.definition == null) {
                meaning.definition.definition = '\u2014';
            }
            else {
                meaning.definition.definition = UpperFistLetter(meaning.definition.definition);
            }

            if (meaning.definition.nativeDefinition == '' || meaning.definition.nativeDefinition == null) {
                meaning.definition.nativeDefinition = '\u2014';
            }

            if (meaning.definition.synonyms.length == 0) {
                meaning.definition.synonyms = '\u2014';
            }
            else {
                let synonymsString = ''; 
                meaning.definition.synonyms.forEach(synonym => {
                    synonymsString = synonymsString + synonym + ', ';
                });
                synonymsString = synonymsString.substring(0, synonymsString.length - 2);
                meaning.definition.synonyms = UpperFistLetter(synonymsString + '.');
            }

            if (meaning.definition.example == '' || meaning.definition.example == null) {
                meaning.definition.example = '\u2014';
            }
            else {
                if (meaning.definition.example.endsWith('.')) {
                    meaning.definition.example = UpperFistLetter(meaning.definition.example);
                }
                else {
                    meaning.definition.example = UpperFistLetter(meaning.definition.example + '.');
                }
            }
        });
    }

    static SaveCurrrentCollectionState($CurrentList) {
        Data.currenctCollectionData = [];

        $CurrentList.children().each(function() {
            const currentWord = $(this).find('.flashcard-word').val();
            const currentMeaning = $(this).find('.flashcard-meaning').val();
            const currentSynonyms = $(this).find('.flashcard-synonyms').val();
            const currentForeignMeaning = $(this).find('.flashcard-native').val();
            const currentExamples = $(this).find('.flashcard-example').val();
            const currentInContext = $(this).find('.flashcard-context').val();

            const CollectionElement = {
                word: currentWord,
                meaning: currentMeaning,
                synonyms: currentSynonyms,
                foreignMeaning: currentForeignMeaning,
                examples: currentExamples,
                context: currentInContext
            }

            Data.currenctCollectionData.push(CollectionElement);
        });

        console.log(Data.currenctCollectionData);
    }

    static TransferCurrentCollectionState($CurrentList) {
        let ArrayCounter = 0;

        $CurrentList.children().each(function() {
            $(this).find('.flashcard-word').val(Data.currenctCollectionData[ArrayCounter].word);
            $(this).find('.flashcard-meaning').val(Data.currenctCollectionData[ArrayCounter].meaning);
            $(this).find('.flashcard-synonyms').val(Data.currenctCollectionData[ArrayCounter].synonyms);
            $(this).find('.flashcard-native').val(Data.currenctCollectionData[ArrayCounter].foreignMeaning);
            $(this).find('.flashcard-example').val(Data.currenctCollectionData[ArrayCounter].examples);
            $(this).find('.flashcard-context').val(Data.currenctCollectionData[ArrayCounter].context);

            ArrayCounter = ArrayCounter + 1;
        });
    }
}

class RenderContent {
    static CreateCollectionElement($CurrentList, word = '', meaning = '', synonyms = '', nativeDef = '', example = '', inContext = '') {
        const element = document.createElement('li');
        element.classList.add('flashcard');
        element.classList.add('mx-auto');
        element.innerHTML = `<div class="col-6" style="padding-right: 25px;">
            <div class="header-flashcard flashcard-heading">
                <h4 style="font-size: 1.5vw;">${Data.collectionCounter}</h4>
            </div>
            <div class="top-flashcard-element">
                <input value="${word}" type="text" class="Quarere-universal-input flashcard-word" placeholder="Word/Phrase...">
                <label class="Quarere-universal-label">Term</label>
            </div>
            <div class="input-group">
                <input value="${synonyms}" placeholder="Synonyms..." type="text" class="form-control Quarere-universal-input checkbox-input flashcard-synonyms"/>
            </div>
            <div class="input-group mt-1">
                <div class="form-floating textarea-floating">
                    <textarea class="form-control textarea-flashcard flashcard-example" placeholder="for-label">${example}</textarea>
                    <label class="textarea-label-flashcard">Exemplary Usage</label>
                </div>
            </div>
        </div>
        <div class="col-6" style="padding-left: 25px;">
            <div class="header-flashcard header-icons flashcard-heading"> 
                <i class="fas fa-arrows-alt icon-flashcard move-icon"></i>
                <i class="fas fa-check-square icon-flashcard select" data-bs-toggle="tooltip" 
                data-bs-placement="top" title="Select for Interactive Dictionary"></i>       
                <i class="far fa-clone icon-flashcard clone" data-bs-toggle="tooltip" 
                data-bs-placement="top" title="Duplicate"></i>                           
                <i class="far fa-trash-alt icon-flashcard delete" data-bs-toggle="tooltip" 
                data-bs-placement="top" title="Remove"></i>
            </div>
            <div class="top-flashcard-element">
                <input value="${meaning}" placeholder="Definition..." type="text" class="Quarere-universal-input flashcard-meaning"/>
                <label class="Quarere-universal-label">Meaning</label>
            </div>
            <div class="input-group">                                   
                <input value="${nativeDef}" placeholder="Native Language Definition..." type="text" class="form-control Quarere-universal-input checkbox-input flashcard-native"/>                                    
            </div>
            <div class="input-group mt-1">
                <div class="form-floating textarea-floating">
                    <textarea class="form-control textarea-flashcard flashcard-context" placeholder="for-label">${inContext}</textarea>
                    <label class="textarea-label-flashcard">"InContext" Usage</label>
                </div>
            </div>
        </div>`;

        $CurrentList.append(element);
        Data.collectionCounter = Data.collectionCounter + 1;
        $('#SaveCollection h6 span').text(Data.collectionCounter - 1);
        const $jQueryObj = $(element);

        const firstHeaderHeight = $($CurrentList).find('.header-flashcard').first().height();
        $($CurrentList).find('.header-flashcard').last().css('height', `${firstHeaderHeight}px`);

        $jQueryObj.find('.delete').on('click', function() {
            $jQueryObj.remove();
            UpdateElementsOrder($($CurrentList));
            Data.collectionCounter = Data.collectionCounter - 1;
            CheckIfEmptyBoxDisplayNeeded($($CurrentList));

            $('.tooltip').remove();
            $('#SaveCollection h6 span').text(Data.collectionCounter - 1);
        });

        $jQueryObj.find('.clone').on('click', function() {
            RenderContent.CreateCollectionElement(document.getElementById('CollectionElementsList'), 
                $jQueryObj.find('.flashcard-word').val(), $jQueryObj.find('.flashcard-meaning').val(), 
                $jQueryObj.find('.flashcard-synonyms').val(), $jQueryObj.find('.flashcard-native').val(), 
                $jQueryObj.find('.flashcard-example').val(), $jQueryObj.find('.flashcard-context').val());
            UpdateElementsOrder($($CurrentList));

            $('.tooltip').remove();
        });

        $jQueryObj.find('.select').on('click', function() {
            $($CurrentList).children().each(function() {
                $(this).removeClass('flashcard-dictionary-active');
            });
            $jQueryObj.addClass('flashcard-dictionary-active');
        });

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    }

    static CreateAutoFillShortcuts(currentElementPropertiesList) {
        const SearchResults = document.getElementById('SearchResults');
        const UniversalData = document.getElementsByClassName('word-basic-data');
        
        let color = '';
        switch(currentElementPropertiesList.level) {
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
                currentElementPropertiesList.level = '\u2014';
                break;
        }

        UniversalData[0].innerHTML = `<h6 class="basic-data-term"><i class="bi bi-volume-up-fill"></i> ${currentElementPropertiesList.word}</h6>
        <h6 class="basic-data-phonetics">/${currentElementPropertiesList.phonetics}/</h6>
        <h6 class="basic-data-level" style="color: ${color}"><i class="fas fa-layer-group"></i> ${currentElementPropertiesList.level}</h6>`;
        let VariantsRow;

        $(UniversalData[0]).find('.basic-data-term i').on('click', function(event) {
            var audio = new Audio(currentElementPropertiesList.audio);
            audio.play();
            event.stopPropagation();
        });

        for (let i = 0; i < currentElementPropertiesList.meanings.length; i++) {
            VariantsRow = document.createElement('div');
            VariantsRow.classList.add('single-results-row');
            SearchResults.append(VariantsRow);

            const Icon = document.createElement('div');
            Icon.classList.add('variant-icon');
            Icon.innerHTML = `<i class="fas fa-spell-check"></i>`;
            VariantsRow.append(Icon);

            const Variant = document.createElement('div');
            Variant.classList.add('single-result');
            Variant.innerHTML = `<h6><span class="property-highlight">Part Of Speech:</span> ${currentElementPropertiesList.meanings[i].partOfSpeech}</h6>           
            <h6><span class="property-highlight">Meaning:</span> ${currentElementPropertiesList.meanings[i].definition.definition}</h6>
            <h6><span class="property-highlight">Synonyms:</span> ${currentElementPropertiesList.meanings[i].definition.synonyms}</h6>
            <h6><span class="property-highlight">Foreign Meaning:</span> ${currentElementPropertiesList.meanings[i].definition.nativeDefinition}</h6>
            <h6><span class="property-highlight">Example:</span> ${currentElementPropertiesList.meanings[i].definition.example}</h6>`;
            VariantsRow.append(Variant);

            Variant.addEventListener('click', function() {
                RenderContent.CreateCollectionElement(document.getElementById('CollectionElementsList'),
                    currentElementPropertiesList.word, 
                    currentElementPropertiesList.meanings[i].definition.definition,
                    currentElementPropertiesList.meanings[i].definition.synonyms,
                    currentElementPropertiesList.meanings[i].definition.nativeDefinition,
                    currentElementPropertiesList.meanings[i].definition.example)
                CheckIfEmptyBoxDisplayNotNeeded($('#CollectionElementsList'));
            });
        }

        const AdditionalMessage = document.createElement('h4');
        AdditionalMessage.innerHTML = `Pick Desired Result <i class="bi bi-arrow-bar-up"></i>`;
        SearchResults.append(AdditionalMessage);
    }

    static CreateEventListenersForCollection($CurrentList) {
        $CurrentList.children().each(function() {
            const $CurrentElement = $(this);

            $(this).find('.clone').on('click', function() {
                RenderContent.CreateCollectionElement($CurrentList[0], 
                    $CurrentElement.find('.flashcard-word').val(), $CurrentElement.find('.flashcard-meaning').val(), 
                    $CurrentElement.find('.flashcard-synonyms').val(), $CurrentElement.find('.flashcard-native').val(), 
                    $CurrentElement.find('.flashcard-example').val(), $CurrentElement.find('.flashcard-context').val());
                UpdateElementsOrder($CurrentList);

                $('.tooltip').remove();
            });

            $(this).find('.delete').on('click', function() {
                $CurrentElement.remove();
                UpdateElementsOrder($CurrentList);
                Data.collectionCounter = Data.collectionCounter - 1;
                CheckIfEmptyBoxDisplayNeeded($CurrentList);

                $('.tooltip').remove();
                $('#SaveCollection h6 span').text(Data.collectionCounter - 1);
            });

            $(this).find('.select').on('click', function() {
                $CurrentList.children().each(function() {
                    $(this).removeClass('flashcard-dictionary-active');
                });
                $CurrentElement.addClass('flashcard-dictionary-active');
            });
        });
    }

    static ShowModal(modalBody) {
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

    static ShowModalSuccess(modalBody) {
        var ModalError = $('#ModalError');
        ModalError.addClass('modalShow');
        $('.modal-title').text(`Congrats ${localStorage.getItem('username')}!`);
        $('.modal-body').text(modalBody);
        $('#ModalError .close-modal').on('click', function() {
            ModalError.removeClass('modalShow');
        });
        $('.close-button-modal').on('click', function() {
            ModalError.removeClass('modalShow');
        });
    }
}

function UpperFistLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

function UpdateElementsOrder($CurrentList) {
    let currentOrder = 1;
    $CurrentList.children().each(function() {
        $(this).children().first().children().first().children().text(currentOrder.toString());
        currentOrder = currentOrder + 1;
    });
}

function CheckIfEmptyBoxDisplayNeeded($CurrentList) {
    if ($CurrentList.children().length == 0) {
        $('.empty-search').css('display', 'flex');
    }
}

function CheckIfEmptyBoxDisplayNotNeeded($CurrentList) {
    if ($CurrentList.children().length > 0 && $CurrentList.next().css('display') == 'flex') {
        $('.empty-search').css('display', 'none');
    }
}

function DisplayError() {
    $('#SearchResults').html(`<div class="loading-or-error">
        <div class="loading-screen"></div>
        <h6>Looking for the results...</h6>
    </div>
    <div class="loading-or-error">
        <i class="fas fa-sad-tear"></i>
        <h6>We haven't found anything. Please try again later...</br>
        (Keep in mind that only english words are avaliable in auto filling at this point)</h6>
    </div>`);

    $('.loading-or-error').first().css('display', 'none');
    $('.loading-or-error').last().css('display', 'flex');
}

function localStorageUpdate(collectionData) {
    const collectionKey = localStorage.getItem('username') + 'RecentCollections';

    if (localStorage.getItem(collectionKey) == null || localStorage.getItem(collectionKey) == undefined) {
        const CollectionsList = [];
        CollectionsList.push(collectionData);
        localStorage.setItem(collectionKey, JSON.stringify(CollectionsList));
    }
    else {
        const currentCollectionList = JSON.parse(localStorage.getItem(collectionKey));
        if (currentCollectionList.length < 3) {
            currentCollectionList.push(collectionData);
            localStorage.setItem(collectionKey, JSON.stringify(currentCollectionList));
        }
        else {
            currentCollectionList.shift();
            currentCollectionList.push(collectionData);
            localStorage.setItem(collectionKey, JSON.stringify(currentCollectionList));
        }
    }
}

function AdjustCompactDictionary() {
    const subNavbarHeight = $('#DashboardContainerHeader').outerHeight();
    const dictionaryHeight = window.innerHeight - subNavbarHeight;
    $('#CompactDictionary').css('top', `${subNavbarHeight}px`);
    $('#CompactDictionary').css('height', `${dictionaryHeight}px`);
    $('#CompactDictionary').css('max-height', `${dictionaryHeight}px`);
    $('#CompactDictionary').css('min-height', `${dictionaryHeight}px`);

    $('#LeftBar').css('top', `${subNavbarHeight}px`);
    $('#LeftBar').css('height', `${dictionaryHeight}px`);
    $('#LeftBar').css('max-height', `${dictionaryHeight}px`);
    $('#LeftBar').css('min-height', `${dictionaryHeight}px`);
}

AdjustCompactDictionary();

jQuery(function() {
    // Dom Elements
    const $ModeButtons = $('.mode-select-button');
    const $AddElementButton = $('#AddCollectionElementButton');
    const $LookForAutoFillVariantsButton = $('#FindAndAddWordButton');
    const $LookUpResultBox = $('#SearchResults');
    const $LanguageChoiceButtons = $('.language-options-menu .nativeLang');
    const $LanguageChoiceButtonsFastDictionary = $('#LeftBar .nativeLang');
    const $LeftSideSwitchButtons = $('.create-collection-mode-change');
    const $SaveCollectionButton = $('#SaveCollection');

    const userNavbarHeight = $('#DashboardContainerHeader').outerHeight(true);
    $SaveCollectionButton.css('top', `${userNavbarHeight + 0.5}px`);

    $SaveCollectionButton.children().last().on('click', function(event) {
        event.preventDefault();

        const CollectionList = [];
        let termsCount = 0;
        let isInputValid = true;

        if ($('#TitleInput').val().trim() == '' || $('#TitleInput').val().trim().length > 100) {
            RenderContent.ShowModal(`Either title is empty or it has exceeded character limit! Keep in mind that your title can contain at most 100 characters.`);
            return;
        }

        if ($('#CollectionDescription').val().trim().length > 200) {
            RenderContent.ShowModal(`Your description has exceeded character limit! Keep in mind that your title can contain at most 200 characters.`);
            return;
        }

        if ($('#CollectionElementsList').children().length < 3) {
            RenderContent.ShowModal(`Your collection doesn't contain enough elements! Keep in mind that it must contain at least three components.`);
            return;
        }

        $('.flashcard').each(function() {
            const currentWord = $(this).find('.flashcard-word').val();
            const currentMeaning = $(this).find('.flashcard-meaning').val();
            const currentSynonyms = $(this).find('.flashcard-synonyms').val();
            const currentForeignMeaning = $(this).find('.flashcard-native').val();
            const currentExamples = $(this).find('.flashcard-example').val();
            const currentInContext = $(this).find('.flashcard-context').val();

            if (currentWord.trim() == '' || currentWord.trim().length > 250) {
                RenderContent.ShowModal('Either term field is empty or it has exceeded character limit! Keep in mind that "term" can contain at most 250 characters.');
                isInputValid = false;
                return false;
            }
            else if (currentMeaning.trim() == '' || currentMeaning.trim().length > 500) {
                RenderContent.ShowModal('Either meaning field is empty or it has exceeded character limit! Keep in mind that "meaning" can contain at most 500 characters.');
                isInputValid = false;
                return false;
            }
            else if (currentSynonyms.trim().length > 250) {
                RenderContent.ShowModal('Synonyms have exceeded thier character limit! Keep in mind that synonyms can contain at most 250 characters.');
                isInputValid = false;
                return false;
            }
            else if (currentForeignMeaning.trim().length > 250) {
                RenderContent.ShowModal('Foreign Meaning has exceeded its character limit! Keep in mind that it can contain at most 250 characters.');
                isInputValid = false;
                return false;
            }
            else if (currentExamples.trim().length > 500) {
                RenderContent.ShowModal('Example word usage has exceeded its character limit! Keep in mind that it can contain at most 500 characters.');
                isInputValid = false;
                return false;
            }
            else if (currentInContext.trim().length > 750) {
                RenderContent.ShowModal('Example from given text has exceeded its character limit! Keep in mind that it can contain at most 750 characters.');
                isInputValid = false;
                return false;
            }
            else {
                const CollectionElement = {
                    word: currentWord.trim(),
                    meaning: currentMeaning.trim(),
                    synonyms: currentSynonyms.trim() == '' ? null : currentSynonyms.trim(),
                    nativeDef: currentForeignMeaning.trim() == '' ? null : currentForeignMeaning.trim(),
                    example: currentExamples.trim() == '' ? null : currentExamples.trim(),
                    inContext: currentInContext.trim() == '' ? null : currentInContext.trim()
                }

                CollectionList.push(CollectionElement);
                termsCount = termsCount + 1;
            }
        });

        if (isInputValid == false) {
            return;
        }
    
        var currentDate = getCurrentDate();
    
        const collectionData = {
            title: $('#TitleInput').val().trim(),
            description: $('#CollectionDescription').val().trim(),
            termsCount: termsCount,
            creationTime: currentDate
        }

        $.ajax({
            url: '/api/usertextmanagementcontroller/uploadflashcards',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                title: $('#TitleInput').val().trim(),
                description: $('#CollectionDescription').val().trim(),
                creationTime: new Date(),
                flashcards: CollectionList,
                uploadText: false
            }),
            processData: false,
            contentType: false,
            success: function(response) {
                alert('success');
                if(response == 'User Text Limit Exceeded') {
                    RenderContent.ShowModal('You have reached maximum amount of texts that you can store on the website. Delete one in order to perform this action.');
                }
                if(response == 'Title Already Exists') {
                    RenderContent.ShowModal('You have already created set with this title. Type a new one and proceed.');
                }
                else {
                    RenderContent.ShowModalSuccess('Your collection has been saved successfully! Now you can use it for learing and revising or edit it in desired way.');
                    localStorageUpdate(collectionData);
                }
                //window.location.href = "https://localhost:44369/ReadText.aspx";
            }
        });
    }); 

    $LeftSideSwitchButtons.each(function() {
        $(this).on('click', function() {
            if (!$(this).hasClass('create-collection-mode-change-active')) {
                $LeftSideSwitchButtons.removeClass('create-collection-mode-change-active');
                $(this).addClass('create-collection-mode-change-active');

                if ($(this).children().last().text() == 'InteractiveDictionary') {
                    $('#PocketDictionary').css('display', 'block');
                    $('#CollectionCreator').css('display', 'none');

                    $('#CollectionElementsListDictionary').html($('#CollectionElementsList').html());
                    Data.SaveCurrrentCollectionState($('#CollectionElementsList'));
                    Data.TransferCurrentCollectionState($('#CollectionElementsListDictionary'));
                    RenderContent.CreateEventListenersForCollection($('#CollectionElementsListDictionary'));

                    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                        return new bootstrap.Tooltip(tooltipTriggerEl)
                    });

                    $(window).scrollTop($(window).scrollTop() + 1);
                }
                else {
                    $('#PocketDictionary').css('display', 'none');
                    $('#CollectionCreator').css('display', 'block');

                    $('#CollectionElementsList').html($('#CollectionElementsListDictionary').html());
                    Data.SaveCurrrentCollectionState($('#CollectionElementsListDictionary'));
                    Data.TransferCurrentCollectionState($('#CollectionElementsList'));
                    RenderContent.CreateEventListenersForCollection($('#CollectionElementsList'));

                    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                        return new bootstrap.Tooltip(tooltipTriggerEl)
                    });
                }
            }
        });
    });

    $LanguageChoiceButtons.each(function() {
        $(this).on('click', function() {
            if (!$(this).hasClass('nativeLang-active')) {
                $LanguageChoiceButtons.removeClass('nativeLang-active');
                $(this).addClass('nativeLang-active');
                Data.currentLanguage = $(this).children().first().text();
            }
        });
    });

    $LanguageChoiceButtonsFastDictionary.each(function() {
        $(this).on('click', function() {
            if (!$(this).hasClass('nativeLang-active')) {
                $LanguageChoiceButtonsFastDictionary.removeClass('nativeLang-active');
                $(this).addClass('nativeLang-active');
                Data.currentLanguageForDictionary = $(this).children().first().text();
            }
        });
    });
    
    $ModeButtons.on('click', function() {
        if (!$(this).hasClass('mode-select-button-active')) {
            $ModeButtons.removeClass('mode-select-button-active');
            $(this).addClass('mode-select-button-active');
            if ($(this).text() == 'Manual Filling') {
                $AddElementButton.css('display', 'flex');
                $LookForAutoFillVariantsButton.css('display', 'none');
                $LookUpResultBox.css('display', 'none');
                $('#FindAndAddWordButton span').css('border-bottom-right-radius', '6px');
            }
            else {
                $AddElementButton.css('display', 'none');
                $LookForAutoFillVariantsButton.css('display', 'flex');
            }
        }
    });

    $AddElementButton.on('click', function(event) {
        event.preventDefault();
        RenderContent.CreateCollectionElement(document.getElementById('CollectionElementsList'));
        CheckIfEmptyBoxDisplayNotNeeded($('#CollectionElementsList'));
    });

    $LookForAutoFillVariantsButton.on('click', function(event) {
        event.preventDefault();
        if (event.target.nodeName == 'SPAN' || event.target.nodeName == 'I') {
            $LookUpResultBox.html(`<div class="loading-or-error">
                <div class="loading-screen"></div>
                <h6>Looking for the results...</h6>
            </div>
            <div class="loading-or-error">
                <i class="fas fa-sad-tear"></i>
                <h6>We haven't found anything. Please try again later...</br>
                (Keep in mind that only english words are avaliable in auto filling at this point)</h6>
            </div>`);

            $('#FindAndAddWordButton span').css('border-bottom-right-radius', '0px');
            $('#SearchResults .loading-or-error').first().css('display', 'flex');
            $('#SearchResults .loading-or-error').last().css('display', 'none');
            $LookUpResultBox.css('display', 'block');

            try {
                const LoadDataAJAXRequest = Data.LoadWordData($('#WordSearchBestFit').val().trim(), Data.currentLanguage)
                LoadDataAJAXRequest.then(wordProperties => {
                    Data.TransformData(wordProperties);
                    $('#SearchResults .loading-or-error').first().css('display', 'none');
                    $('#SearchResults .loading-or-error').last().css('display', 'none');
                    $('#SearchResults').html('<div class="word-basic-data"></div>');
                    RenderContent.CreateAutoFillShortcuts(wordProperties);
                    $('#WordSearchBestFit').val('');
                });
            }
            catch {
                DisplayError();
            }
        }
    });

    $(function() {
        $('#CollectionElementsList').sortable({
            update: function(event, ui) {
                UpdateElementsOrder($('#CollectionElementsList'));
            }
        });
    });
});