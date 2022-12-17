class CompactDictionaryResult {
    word;
    phonetics;
    wordOrigin;
    meanings;
    relatedPhrases;
    level;
    constructor(word, phonetics, wordOrigin, meanings, relatedPhrases, level)
    {
        this.word = word;
        this.phonetics = phonetics;
        this.wordOrigin = wordOrigin;
        this.meanings = meanings;
        this.relatedPhrases = relatedPhrases;
        this.level = level;
    }
}

class PhoneticsDictionary {
    phoneticText;
    audio;
    constructor(phoneticText, audio) {
        this.phoneticText = phoneticText;
        this.audio = audio;
    }
}

class PartOfSpeechVariant {
    partOfSpeech;
    nativeDefinition;
    conjugationForms;
    senses;
}

class Sense {
    shortDefinition;
    definition;
    examples;
    synonyms;
    antonyms;
    subSenses;
}

class SubSense {
    shortDefinition;
    definition;
    examples;
    synonyms;
    antonyms;
}

class DataAccess {
    static currentWord;

    static GetAllSenses(senses, CurrentVariant) {
        const currentSenses = [];
        senses.forEach(sense => {
            let CurrentSense = new Sense();
            for (var property in CurrentSense)
            {
                if (property.toString() == 'subSenses') {
                    DataAccess.GetAllSubsenses(sense[UpperFistLetter(`${property}`)], CurrentSense);
                }
                else {
                    CurrentSense[property] = sense[UpperFistLetter(`${property}`)];
                }
            }
            currentSenses.push(CurrentSense);
        }); 
        CurrentVariant.senses = currentSenses;  
    }

    static GetAllSubsenses(subSenses, CurrentSense) {
        const currentSubSenses = [];
        subSenses.forEach(subSense => {
            let CurrentSubsense = new SubSense();
            for (var property in CurrentSubsense)
            {
                CurrentSubsense[property] = subSense[UpperFistLetter(`${property}`)];
            }
            currentSubSenses.push(CurrentSubsense);
        }); 
        CurrentSense.subSenses = currentSubSenses;            
    }

    static LoadDictionaryPage(word, language) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: '/api/compactdictionarycontroller/loaddictionarydata',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'POST',
                encoding: 'UTF-8',
                dataType: 'json',
                data: JSON.stringify({word: word.toLowerCase(), language: language}),
                success: function (wordProperties) { 
                    console.log(word);  
                    console.log(wordProperties);           
                    let Meanings = [];
                    if (wordProperties['Meanings'] != null)
                    {
                        wordProperties['Meanings'].forEach(variant => {
                            let currentVariant = new PartOfSpeechVariant();
                            for (var item in currentVariant)
                            {
                                if (item.toString() == 'senses') {
                                    DataAccess.GetAllSenses(variant[UpperFistLetter(`${item}`)], currentVariant);
                                }
                                else {
                                    currentVariant[item] = variant[UpperFistLetter(`${item}`)];
                                }
                            }
                            Meanings.push(currentVariant);
                        });
                    } 

                    let CurrentWordProperties;

                    if (wordProperties['Phonetics'] == null) {
                        CurrentWordProperties = new CompactDictionaryResult(wordProperties['Word'], 
                            new PhoneticsDictionary('', ''), wordProperties['WordOrigin'], Meanings, 
                            wordProperties['RelatedPhrases'], wordProperties['Level']);
                    }

                    else {
                        CurrentWordProperties = new CompactDictionaryResult(wordProperties['Word'], 
                            new PhoneticsDictionary(wordProperties['Phonetics']['PhoneticText'], 
                            wordProperties['Phonetics']['Audio']), wordProperties['WordOrigin'], 
                            Meanings, wordProperties['RelatedPhrases'], wordProperties['Level']);
                    }
                 
                    resolve(CurrentWordProperties);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }

    static GetUserSettings() {
        $.ajax({
            url: '/api/compactdictionarycontroller/getsettings',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'POST',
            encoding: 'UTF-8',
            dataType: 'json',
            data: localStorage.getItem('username'),
            success: function(userSettings) {
                $('#ExamplesSettings').val(
                    userSettings['MaxExamples'] >= 99 ? 'Max' : userSettings['MaxExamples']);
                $('#SynonymsSettings').val(
                    userSettings['MaxSynonyms'] >= 99 ? 'Max' : userSettings['MaxSynonyms']);
                $('#SensesSettings').val(
                    userSettings['MaxSenses'] >= 99 ? 'Max' : userSettings['MaxSenses']);

                localStorage.setItem('MaxExamples', userSettings['MaxExamples']);
                localStorage.setItem('MaxSynonyms', userSettings['MaxSynonyms']);
                localStorage.setItem('MaxSenses', userSettings['MaxSenses']);
            }
        });
    }

    static UpdateUsersSettings(maxExamples, maxSynonyms, maxSenses) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: '/api/compactdictionarycontroller/updatesettings',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'PUT',
                encoding: 'UTF-8',
                dataType: 'json',
                data: JSON.stringify({
                    examplesSettings: maxExamples, 
                    synonymsSettings: maxSynonyms,
                    sensesSettings: maxSenses,
                    username: localStorage.getItem('username')
                }),
                success: function(response) {
                    resolve(response);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }
}

class RenderDictionaryContent {
    static GetLevelColor(level) {
        let color = '';
        switch(level) {
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
                break;
        }
        return color;
    }

    static RenderDictionaryPage(DictionaryPageData) {
        if (DictionaryPageData.word == '') {
            DisplayDictionaryError();
            throw 'Word is Empty!';
        }

        if (DictionaryPageData.level == 'Not Defined') {
            DictionaryPageData.level = '\u2014';
        }

        const DictionaryResult = document.getElementsByClassName('compact-dictionary-result')[0];

        const Header = document.createElement('div');
        Header.classList.add('compact-dictionary-result-header');
        Header.innerHTML = `<h6 class="compact-dictionary-result-header-word sense-element-selectable">
            ${UpperFistLetter(DictionaryPageData.word)}
        </h6>
        <h6 class="compact-dictionary-result-header-sound">
            <i class="bi bi-volume-up-fill"></i>
        </h6>
        <h6 class="compact-dictionary-result-header-phonetic">${DictionaryPageData.phonetics.phoneticText}</h6>
        <h6 class="compact-dictionary-result-header-level" 
            style="color: ${RenderDictionaryContent.GetLevelColor(DictionaryPageData.level)}">
            <i class="fas fa-layer-group"></i> ${DictionaryPageData.level}
        </h6>
        <button class="btn show-related-phrases-panel-button">
            <span class="related-phrases-button-first">
                Phrases OFF
            </span>
            <span class="related-phrases-button-last show-related-phrases-panel-button-active">
                Phrases ON
            </span>
        </button>`;

        DictionaryResult.append(Header);

        if (localStorage.getItem('DictionaryPhrases') == 'OFF') {
            $('.show-related-phrases-panel-button span').last()
                .removeClass('show-related-phrases-panel-button-active');
            $('.show-related-phrases-panel-button span').first()
                .addClass('show-related-phrases-panel-button-active');

            $('.compact-dictionary-related-phrases')
                .addClass('compact-dictionary-related-phrases-unactive');
            $('.compact-dictionary-result')
                .addClass('compact-dictionary-result-full-screen-mode');
        }

        if (DictionaryPageData.wordOrigin != '' && DictionaryPageData.wordOrigin != undefined) {
            const WordOrigin = document.createElement('div');
            WordOrigin.classList.add('compact-dictionary-result-origin');
            WordOrigin.innerHTML = `<h6>
                <i class="bi bi-hourglass-split"></i> ${DictionaryPageData.wordOrigin}
            </h6>`;

            DictionaryResult.append(WordOrigin);
        }

        DictionaryPageData.meanings.forEach(meaning => {
            const Meaning = document.createElement('div');
            Meaning.classList.add('compact-dictionary-result-pos-variant');

            DictionaryResult.append(Meaning);

            const MeaningHeader = document.createElement('div');
            MeaningHeader.classList.add('compact-dictionary-result-pos-variant-header');
            MeaningHeader.innerHTML = `<i class="fas fa-language pos-variant-icon"></i>`;

            Meaning.append(MeaningHeader);

            const MeaningHeaderDetails = document.createElement('div');
            MeaningHeaderDetails.classList.add('compact-dictionary-result-pos-variant-header-details');
            MeaningHeaderDetails.innerHTML = `<h6>
                <span class="compact-dictionary-bold">Part Of Speech:</span> ${UpperFistLetter(meaning.partOfSpeech)}
            </h6>`;

            MeaningHeader.append(MeaningHeaderDetails);

            const ForeignMeaning = document.createElement('h6');
            ForeignMeaning.classList.add('foreign-meaning');
            let ForeignMeaningInnerHTML = '';
            if (meaning.nativeDefinition.length == 0) {
                ForeignMeaningInnerHTML = `<span class="compact-dictionary-bold">Foreign Meaning:</span> \u2014.`;
            }
            else {
                ForeignMeaningInnerHTML = `<span class="compact-dictionary-bold">Foreign Meaning:</span> `;
                meaning.nativeDefinition.forEach(singleNativeDef => {
                    ForeignMeaningInnerHTML = ForeignMeaningInnerHTML + 
                        `<span class="sense-element-selectable">${singleNativeDef}</span>, `;
                });
                ForeignMeaningInnerHTML = ForeignMeaningInnerHTML.slice(0, -2) + '.';
            }
            ForeignMeaning.innerHTML = ForeignMeaningInnerHTML;

            MeaningHeaderDetails.append(ForeignMeaning);

            const Conjugation = document.createElement('h6');
            if (meaning.partOfSpeech == 'verb' && meaning.conjugationForms.length > 3) {
                Conjugation.innerHTML = `<span class="compact-dictionary-bold">Conjugation:</span>
                <span class="compact-dictionary-italic">Present 3rd Person:</span> 
                <span class="compact-dictionary-movable">${meaning.conjugationForms[0]}</span>,
                <span class="compact-dictionary-italic">Past Tense:</span>
                <span class="compact-dictionary-movable">${meaning.conjugationForms[1]}</span>,
                <span class="compact-dictionary-italic">Past Participle:</span>
                <span class="compact-dictionary-movable">${meaning.conjugationForms[2]}</span>,
                <span class="compact-dictionary-italic">Gerund:</span>
                <span class="compact-dictionary-movable">${meaning.conjugationForms[3]}</span>.`;
            }
            else if (meaning.partOfSpeech == 'noun' && meaning.conjugationForms.length > 1) {
                Conjugation.innerHTML = `<span class="compact-dictionary-bold">Conjugation:</span>
                <span class="compact-dictionary-italic">Plural Form:</span> 
                <span class="compact-dictionary-movable">${meaning.conjugationForms[1]}</span>.`;
            }
            else if (meaning.partOfSpeech == 'adjective' && meaning.conjugationForms.length > 2) {
                Conjugation.innerHTML = `<span class="compact-dictionary-bold">Conjugation:</span>
                <span class="compact-dictionary-italic">Comparative:</span> 
                <span class="compact-dictionary-movable">${meaning.conjugationForms[1]}</span>,
                <span class="compact-dictionary-italic">Superlative:</span>
                <span class="compact-dictionary-movable">${meaning.conjugationForms[2]}</span>.`;
            }
            else {
                Conjugation.innerHTML = `<span class="compact-dictionary-bold">Conjugation:</span> \u2014.`
            }

            MeaningHeaderDetails.append(Conjugation);
            let senseNumber = 1;

            meaning.senses.every(sense => {
                const Sense = document.createElement('div');
                Sense.classList.add('compact-dictionary-result-pos-variant-sense');
                Sense.innerHTML = `<div class="compact-dictionary-sense-icons">
                    <span class="pos-variant-icon sense-icon">${senseNumber}.</span>
                    <span class="pos-variant-icon sense-icon-new-flashcard">
                            <i class="fas fa-fill" data-bs-toggle="tooltip" data-bs-placement="top" title="Fill new flashcard with this sense"></i>
                    </span>
                </div>`;

                Meaning.append(Sense);

                const SenseDetails = document.createElement('div');
                SenseDetails.classList.add('compact-dictionary-result-pos-variant-sense-details');
                SenseDetails.innerHTML = `<h6>
                    <span class="compact-dictionary-bold">Short Meaning:</span>
                    <span class="sense-element-selectable selectable-meaning-short">
                        ${UpperFistLetter(sense.shortDefinition)}.
                    </span>
                </h6>
                <h6>
                    <span class="compact-dictionary-bold">Meaning:</span>
                    <span class="sense-element-selectable selectable-meaning">
                        ${UpperFistLetter(sense.definition)}
                    </span>
                </h6>`;

                Sense.append(SenseDetails);

                if (sense.synonyms.length > 0) {
                    const configMaxSynonyms = parseInt(localStorage.getItem('MaxSynonyms'));
                    const maxSynonyms = sense.synonyms.length > configMaxSynonyms ? 
                        configMaxSynonyms : sense.synonyms.length;

                    const SenseSynonyms = document.createElement('h6');
                    let synonymsInnerHtml = `<span class="compact-dictionary-bold">
                    Synonyms: `;
                    for (let i = 0; i < maxSynonyms; i++) {
                        synonymsInnerHtml = synonymsInnerHtml + 
                            `<span class="sense-element-selectable selectable-synonyms">${sense.synonyms[i]}</span>, `;
                    };
                    synonymsInnerHtml = synonymsInnerHtml.slice(0, -2) + '.';
                    synonymsInnerHtml = synonymsInnerHtml + `</span>`;
                    SenseSynonyms.innerHTML = synonymsInnerHtml;

                    SenseDetails.append(SenseSynonyms);
                }

                if (sense.antonyms.length > 0) {
                    let antonymsString = ``;
                    sense.antonyms.forEach(antonym => {
                        antonymsString = antonymsString + antonym + ', ';
                    });
                    antonymsString = antonymsString.slice(0, -2) + '.';

                    const SenseAntonyms = document.createElement('h6');
                    SenseAntonyms.innerHTML = `<span class="compact-dictionary-bold">Antonyms:</span>
                    ${antonymsString}`;

                    SenseDetails.append(SenseAntonyms);
                }

                if (sense.examples.length > 0) {
                    const SenseExamples = document.createElement('div');
                    SenseExamples.classList.add('compact-dictionary-sense-examples');
                    SenseExamples.innerHTML = `<div>
                        <i class="fas fa-comment-dots sense-element-img"></i>
                        <h5 class="sense-element-img-comment">Examples</h5>
                    </div>`;

                    SenseDetails.append(SenseExamples);

                    const configMaxExamples = parseInt(localStorage.getItem('MaxExamples'));
                    const maxExamples = sense.examples.length > configMaxExamples ? 
                        configMaxExamples : sense.examples.length;

                    const SenseExamplesList = document.createElement('h6');
                    let examplesString = ``;
                    for (let i = 0; i < maxExamples; i++) {
                        examplesString = examplesString + 
                        `<span class="sense-element-selectable selectable-examples">
                            ${sense.examples[i]}
                        </span></br>`;
                    };
                    SenseExamplesList.innerHTML = examplesString;

                    SenseExamples.append(SenseExamplesList);
                }

                if (sense.subSenses.length > 0) {
                    const SubSenseRoller = document.createElement('div');
                    SubSenseRoller.classList.add('subsense-roller');
                    SubSenseRoller.innerHTML = `<i style="padding-right: 1vw;" class="fas fa-sort-alpha-down subsense-roller-icon"></i>
                    <h4 class="compact-dictionary-sense-subsenses-shower">
                        <span>Show Subsenses</span>
                    </h4>
                    <i style="padding-left: 1vw;" class="fas fa-sort-alpha-down subsense-roller-icon"></i>`;

                    SenseDetails.append(SubSenseRoller);

                    const SubSensesList = document.createElement('div');
                    SubSensesList.classList.add('compact-dictionary-sense-subsenses-list');
                    SenseDetails.append(SubSensesList);

                    sense.subSenses.forEach(subSense => {
                        const SubSense = document.createElement('div');
                        SubSense.classList.add('compact-dictionary-subsense');
                        SubSense.innerHTML = `<span class="pos-variant-icon subsense-icon">
                            <i class="fas fa-fill" data-bs-toggle="tooltip" data-bs-placement="top" title="Fill new flashcard with this subsense"></i>
                        </span>`;

                        const SubSenseDetails = document.createElement('div');
                        SubSenseDetails.classList.add('compact-dictionary-subsense-details');
                        SubSenseDetails.innerHTML = `<h6 class="subsense-font-edit">
                            <span class="compact-dictionary-bold">Short Meaning:</span>
                            <span class="sense-element-selectable selectable-meaning-short">
                                ${UpperFistLetter(subSense.shortDefinition)}.
                            </span>
                        </h6>
                        <h6 class="subsense-font-edit">
                            <span class="compact-dictionary-bold">Meaning:</span>
                            <span class="sense-element-selectable selectable-meaning">
                                ${UpperFistLetter(subSense.definition)}
                            </span>
                        </h6>`;

                        SubSensesList.append(SubSense);
                        SubSense.append(SubSenseDetails);

                        if (subSense.synonyms.length > 0) {
                            const configMaxSynonyms = parseInt(localStorage.getItem('MaxSynonyms'));
                            const maxSynonyms = subSense.synonyms.length > configMaxSynonyms ? 
                                configMaxSynonyms : subSense.synonyms.length;
        
                            const SubSenseSynonyms = document.createElement('h6');
                            SubSenseSynonyms.classList.add('subsense-font-edit');
                            let synonymsInnerHtml = `<span class="compact-dictionary-bold">
                            Synonyms: `;
                            for (let i = 0; i < maxSynonyms; i++) {
                                synonymsInnerHtml = synonymsInnerHtml + 
                                    `<span class="sense-element-selectable selectable-synonyms">${subSense.synonyms[i]}</span>, `;
                            };
                            synonymsInnerHtml = synonymsInnerHtml.slice(0, -2) + '.';
                            synonymsInnerHtml = synonymsInnerHtml + `</span>`;
                            SubSenseSynonyms.innerHTML = synonymsInnerHtml;
        
                            SubSenseDetails.append(SubSenseSynonyms);
                        }

                        if (subSense.examples.length > 0) {
                            const SubSenseExamples = document.createElement('div');
                            SubSenseExamples.classList.add('compact-dictionary-sense-examples');
                            SubSenseExamples.innerHTML = `<div>
                                <i class="fas fa-comment-dots sense-element-img"></i>
                                <h5 class="sense-element-img-comment">Examples</h5>
                            </div>`;
        
                            SubSenseDetails.append(SubSenseExamples);
        
                            const configMaxExamples = parseInt(localStorage.getItem('MaxExamples'));
                            const maxExamples = subSense.examples.length > configMaxExamples ? 
                                configMaxExamples : subSense.examples.length;
        
                            const SubSenseExamplesList = document.createElement('h6');
                            SubSenseExamplesList.classList.add('subsense-font-edit');
                            let examplesString = ``;
                            for (let i = 0; i < maxExamples; i++) {
                                examplesString = examplesString + 
                                `<span class="sense-element-selectable selectable-examples">
                                    ${subSense.examples[i]}
                                </span></br>`;
                            };
                            SubSenseExamplesList.innerHTML = examplesString;
        
                            SubSenseExamples.append(SubSenseExamplesList);
                        }

                        if (subSense.antonyms.length > 0) {
                            let antonymsString = ``;
                            subSense.antonyms.forEach(antonym => {
                                antonymsString = antonymsString + antonym + ', ';
                            });
                            antonymsString = antonymsString.slice(0, -2) + '.';
        
                            const SubSenseAntonyms = document.createElement('h6');
                            SubSenseAntonyms.classList.add('subsense-font-edit');
                            SubSenseAntonyms.innerHTML = `<span class="compact-dictionary-bold">Antonyms:</span>
                            ${antonymsString}`;
        
                            SubSenseDetails.append(SubSenseAntonyms);
                        }

                        $(SubSense).find('.subsense-icon').on('click', function() {
                            let synonymsString = '';
                            let examplesString = '';
                            for (let i = 0; i < (subSense.synonyms.length > 5 ? 5 : subSense.synonyms.length); i++) {
                                synonymsString = synonymsString + subSense.synonyms[i] + ', ';
                            }
                            synonymsString = synonymsString.slice(0, -2);

                            if (subSense.examples[0] != undefined) {
                                examplesString = subSense.examples[0];
                            }

                            let foreignMeaning = '';
                            $(this).closest('.compact-dictionary-result-pos-variant')
                                .find('.foreign-meaning .sense-element-selectable').each(function() {
                                    foreignMeaning = foreignMeaning + $(this).text() + ', ';
                                });
                            foreignMeaning = foreignMeaning.slice(0, -2);
                            
                            RenderContent.CreateCollectionElement(
                                document.getElementById('CollectionElementsListDictionary'),
                                DataAccess.currentWord, subSense.definition, synonymsString,
                                foreignMeaning, examplesString, ''
                            );

                            CheckIfEmptyBoxDisplayNotNeeded($('#CollectionElementsListDictionary'));
                            $('.tooltip').remove();
                        });
                    });

                    SubSenseRoller.addEventListener('click', function() {
                        $(SubSensesList).toggle("slow");
                        SubSensesList.classList.toggle('subsenses-list-active');
                    });
                }

                $(Sense).find('.sense-icon-new-flashcard').on('click', function() {
                    let synonymsString = '';
                    let examplesString = '';
                    for (let i = 0; i < (sense.synonyms.length > 5 ? 5 : sense.synonyms.length); i++) {
                        synonymsString = synonymsString + sense.synonyms[i] + ', ';
                    }
                    synonymsString = synonymsString.slice(0, -2);

                    if (sense.examples[0] != undefined) {
                        examplesString = sense.examples[0];
                    }

                    let foreignMeaning = '';
                    $(this).closest('.compact-dictionary-result-pos-variant')
                        .find('.foreign-meaning .sense-element-selectable').each(function() {
                            foreignMeaning = foreignMeaning + $(this).text() + ', ';
                        });
                    foreignMeaning = foreignMeaning.slice(0, -2);
                    
                    RenderContent.CreateCollectionElement(
                        document.getElementById('CollectionElementsListDictionary'),
                        DataAccess.currentWord, sense.definition, synonymsString,
                        foreignMeaning, examplesString, ''
                    );

                    CheckIfEmptyBoxDisplayNotNeeded($('#CollectionElementsListDictionary'));
                    $('.tooltip').remove();
                });

                const NumberIcon = $(Sense).children().first();
                let NumberIconHeight = 0;

                if ($(Sense).children().last().children().last()
                    .hasClass('compact-dictionary-sense-subsenses-list')) 
                {
                    $(Sense).children().last().children().each(function() {
                        NumberIconHeight = NumberIconHeight + $(this).outerHeight();
                    });
                    NumberIconHeight = NumberIconHeight - 
                        $(Sense).children().last().children().last().outerHeight();
                }
                else {
                    $(Sense).children().last().children().each(function() {
                        NumberIconHeight = NumberIconHeight + $(this).outerHeight();
                    });
                }

                NumberIcon.css('height', `${NumberIconHeight}px`);
                NumberIcon.css('max-height', `${NumberIconHeight}px`);
                NumberIcon.css('min-height', `${NumberIconHeight}px`);

                senseNumber = senseNumber + 1;

                if (senseNumber > parseInt(localStorage.getItem('MaxSenses'))) {
                    return false;
                }

                return true;
            });
        });

        $('.compact-dictionary-result-header-sound').on('click', function() {
            if (DictionaryPageData.phonetics.audio != '' && 
                DictionaryPageData.phonetics.audio != undefined)
            {
                var audio = new Audio(DictionaryPageData.phonetics.audio);
                audio.play();
            }
            else {
                if ('speechSynthesis' in window) {
                    var speechSynthesisWord = new SpeechSynthesisUtterance();
                    speechSynthesisWord.text = $('.compact-dictionary-result-header-word').text();
                    speechSynthesisWord.lang = 'en';
                    window.speechSynthesis.speak(speechSynthesisWord); 
                }
                else { 
                    RenderDictionaryContent.ShowModal
                        (`Sorry, your browser doesn't support text to speech transformation!`);
                }
            }
        });

        EventListeners.CreateDynamicEventListeners();
    }

    static RenderRelatedPhrases(DictionaryPageData) {
        if (DictionaryPageData.relatedPhrases.length > 0) {
            $('.compact-dictionary-related-phrases-empty').css('display', 'none');
            const RelatedPhrasesList = document.getElementsByClassName
                ('compact-dictionary-related-phrases-details')[0];
            
            DictionaryPageData.relatedPhrases.forEach(phraseDetails => {
                const PhraseDetails = document.createElement('div');
                PhraseDetails.classList.add('compact-dictionary-related-phrases-details-phrase');
                PhraseDetails.innerHTML = `<span class="compact-dictionary-phrase">
                    <i class="fas fa-chevron-right"></i> ${phraseDetails["Phrase"]} <i class="fas fa-external-link-alt icon-link"></i>
                </span>`;

                if (phraseDetails["Meaning"] != '') {
                    const PhraseMeaning = document.createElement('span');
                    PhraseMeaning.classList.add('compact-dictionary-phrase-meaning');
                    PhraseMeaning.innerHTML = `<i class="far fa-lightbulb"></i> ${UpperFistLetter(phraseDetails["Meaning"])}`;

                    PhraseDetails.append(PhraseMeaning);
                }

                if (phraseDetails["Example"] != '') {
                    const PhraseExample = document.createElement('span');
                    PhraseExample.classList.add('compact-dictionary-phrase-example');
                    PhraseExample.innerHTML = `${UpperFistLetter(phraseDetails["Example"])}.`;

                    PhraseDetails.append(PhraseExample);
                }

                RelatedPhrasesList.append(PhraseDetails);
            });

            $('.compact-dictionary-phrase').each(function() {
                $(this).on('click', function() {
                    const phraseToSearch = $(this).text().trim().toLowerCase();
                    $('.compact-dictionary-search-bar-input').val(phraseToSearch);
                    $('.compact-dictionary-search-bar-button').trigger('click');
                });
            });
        }
        else {
            $('.compact-dictionary-related-phrases-empty').css('display', 'flex');
        }
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
}

class EventListeners {
    static CreateDynamicEventListeners() {
        $('.show-related-phrases-panel-button span').on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if(!$(this).hasClass('show-related-phrases-panel-button-active')) {
                $('.show-related-phrases-panel-button span').each(function() {
                    $(this).removeClass('show-related-phrases-panel-button-active');
                });
                $(this).addClass('show-related-phrases-panel-button-active');

                if ($(this).text().trim() == 'Phrases OFF') {
                    localStorage.setItem('DictionaryPhrases', 'OFF');
                    $('.compact-dictionary-related-phrases')
                        .addClass('compact-dictionary-related-phrases-unactive');
                    $('.compact-dictionary-result')
                        .addClass('compact-dictionary-result-full-screen-mode');
                }
                else {
                    localStorage.setItem('DictionaryPhrases', 'ON');
                    $('.compact-dictionary-related-phrases')
                        .removeClass('compact-dictionary-related-phrases-unactive');
                    $('.compact-dictionary-result')
                        .removeClass('compact-dictionary-result-full-screen-mode');
                }
            }
        });

        $('.compact-dictionary-result-header-word').each(function() {
            $(this).on('click', function() {
                const $ActiveElement = $('#CollectionElementsListDictionary .flashcard-dictionary-active');
                $ActiveElement.find('.flashcard-word').val($(this).text().trim());
            });
        });

        $('.compact-dictionary-movable').each(function() {
            $(this).on('click', function() {
                const $ActiveElement = $('#CollectionElementsListDictionary .flashcard-dictionary-active');
                const $CurrentInput = $ActiveElement.find('.flashcard-word');
                let inputVal = $CurrentInput.val();
                if (inputVal.trim() == '') {
                    $CurrentInput.val($(this).text().trim());
                }
                else {
                    $CurrentInput.val(inputVal + ' / ' + $(this).text().trim());
                }
            });
        });

        $('.selectable-meaning-short').each(function() {
            $(this).on('click', function() {
                const $ActiveElement = $('#CollectionElementsListDictionary .flashcard-dictionary-active');
                $ActiveElement.find('.flashcard-meaning').val($(this).text().trim());
            });
        });

        $('.selectable-meaning').each(function() {
            $(this).on('click', function() {
                const $ActiveElement = $('#CollectionElementsListDictionary .flashcard-dictionary-active');
                $ActiveElement.find('.flashcard-meaning').val($(this).text().trim());
            });
        });

        $('.selectable-synonyms').each(function() {
            $(this).on('click', function() {
                const $ActiveElement = $('#CollectionElementsListDictionary .flashcard-dictionary-active');
                const $CurrentInput = $ActiveElement.find('.flashcard-synonyms');
                let inputVal = $CurrentInput.val();
                if (inputVal.trim() == '') {
                    $CurrentInput.val($(this).text().trim());
                }
                else {
                    $CurrentInput.val(inputVal + ', ' + $(this).text().trim());
                }
            });
        });

        $('.selectable-examples').each(function() {
            $(this).on('click', function() {
                const $ActiveElement = $('#CollectionElementsListDictionary .flashcard-dictionary-active');
                const $CurrentInput = $ActiveElement.find('.flashcard-example');
                let inputVal = $CurrentInput.val();
                if (inputVal.trim() == '') {
                    $CurrentInput.val($(this).text().trim());
                }
                else {
                    $CurrentInput.val(inputVal + ' / ' + $(this).text().trim());
                }
            });
        });

        $('.foreign-meaning .sense-element-selectable').each(function() {
            $(this).on('click', function() {
                const $ActiveElement = $('#CollectionElementsListDictionary .flashcard-dictionary-active');
                const $CurrentInput = $ActiveElement.find('.flashcard-native');
                let inputVal = $CurrentInput.val();
                if (inputVal.trim() == '') {
                    $CurrentInput.val($(this).text().trim());
                }
                else {
                    $CurrentInput.val(inputVal + '; ' + $(this).text().trim());
                }
            });
        });
    }
}

function UpperFistLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function inViewport($el) {
    const elH = $el.outerHeight();
    const H = $(window).height();
    const position = $el[0].getBoundingClientRect(); 
    const top = position.top; 
    const bottom = position.bottom;
    return Math.max(0, top > 0 ? Math.min(elH, H - top) : Math.min(bottom, H));
}

function DisplayDictionaryError() {
    $('#PocketDictionary .loading-or-error').first().css('display', 'none');
    $('#PocketDictionary .loading-or-error').first().next().css('display', 'none');
    $('#PocketDictionary .loading-or-error').last().css('display', 'flex');
    $('.compact-dictionary-related-phrases').css('display', 'none');
}

function InitialLoad() {
    DataAccess.GetUserSettings();
    $('#PocketDictionary .loading-or-error').first().next().css('display', 'flex');

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

InitialLoad();

jQuery(function() {
    //Get Objects
    const $DictionaryInput = $('.compact-dictionary-search-bar-input');
    const $DictionarySearchButton = $('.compact-dictionary-search-bar-button');
    const $DictionaryResult = $('.compact-dictionary-result');
    const $RelatedPhrasesResult = $('.compact-dictionary-related-phrases-details');

    const $SettingsExamples = $('#ExamplesSettings');
    const $SettingsSynonyms = $('#SynonymsSettings');
    const $SettingsSenses = $('#SensesSettings');
    const $SettingsSaveButton = $('#SettingsSave');

    const $LeftSidePanel = $('#PocketDictionary');
    const $MaterialsPanel = $('.compact-dictionary-materials-panel');
    const $MaterialsPanelHeader = $('.compact-dictionary-materials-header');
    const $Footer = $('.full-footer');

    const $MaterialsPanelMinimizeIcon = $('.compact-dictionary-materials-header i').first();
    const $MaterialsPanelDualScreenIcon = $('.compact-dictionary-materials-header i').first().next();
    const $MaterialsPanelMaximizeIcon = $('.compact-dictionary-materials-header i').last();

    let materialsPanelMode = 'minimize';

    $MaterialsPanelMinimizeIcon.on('click', function() {
        const headerHeight = $MaterialsPanelHeader.outerHeight(true);
        $MaterialsPanel.css('height', `${headerHeight}px`);

        $MaterialsPanel.children().last().css('margin-top', '3.5vh');
        $MaterialsPanel.css('overflow-y', 'hidden');
        materialsPanelMode = 'minimize';
    });

    $MaterialsPanelDualScreenIcon.on('click', function() {
        if (inViewport($('#bottomHeader')) <= 0 && inViewport($('.EmptyDiv')) <= 0) {
            const fullHeight = inViewport($LeftSidePanel);
            const subHeaderHeight = $('#DashboardContainerHeader').outerHeight();
            $MaterialsPanel.css('height', `${(fullHeight - subHeaderHeight) / 2}px`);
        }
        else if (inViewport($('.EmptyDiv')) >= 0 && inViewport($('#bottomHeader')) <= 0) {
            const fullHeight = inViewport($LeftSidePanel);
            const subHeaderHeight = $('#DashboardContainerHeader').outerHeight();
            const visibleEmptyDivHeight = inViewport($('.EmptyDiv'));
            const differenceHeight = subHeaderHeight - visibleEmptyDivHeight;
            $MaterialsPanel.css('height', `${(fullHeight - differenceHeight) / 2}px`);
        }
        else {
            const halfHeight = inViewport($LeftSidePanel) / 2;
            $MaterialsPanel.css('height', `${halfHeight}px`);
        }

        $MaterialsPanel.children().last().css('margin-top', '3.5vh');
        $MaterialsPanel.css('overflow-y', 'auto');
        materialsPanelMode = 'dual';
    });

    $MaterialsPanelMaximizeIcon.on('click', function() {
        if (inViewport($('#bottomHeader')) <= 0 && inViewport($('.EmptyDiv')) <= 0) {
            const fullHeight = inViewport($LeftSidePanel);
            const subHeaderHeight = $('#DashboardContainerHeader').outerHeight();
            $MaterialsPanel.css('height', `${fullHeight - subHeaderHeight}px`);
        }
        else if (inViewport($('.EmptyDiv')) >= 0 && inViewport($('#bottomHeader')) <= 0) {
            const fullHeight = inViewport($LeftSidePanel);
            const subHeaderHeight = $('#DashboardContainerHeader').outerHeight();
            const visibleEmptyDivHeight = inViewport($('.EmptyDiv'));
            const differenceHeight = subHeaderHeight - visibleEmptyDivHeight;
            $MaterialsPanel.css('height', `${fullHeight - differenceHeight}px`);
        }
        else {
            const fullHeight = inViewport($LeftSidePanel);
            $MaterialsPanel.css('height', `${fullHeight}px`);
        }

        $MaterialsPanel.children().last().css('margin-top', '15vh');
        $MaterialsPanel.css('overflow-y', 'auto');
        materialsPanelMode = 'maximize';
    });

    $(window).on('scroll resize', function() {
        const visiblePart = inViewport($Footer);
        $MaterialsPanel.css('bottom', `${visiblePart}px`);

        const targetWidth = $LeftSidePanel.outerWidth();
        $MaterialsPanel.css('width', `${targetWidth}px`);

        if (inViewport($('#bottomHeader')) <= 0 && inViewport($('.EmptyDiv')) <= 0 && 
            materialsPanelMode == 'maximize') {
            const fullHeight = inViewport($LeftSidePanel);
            const subHeaderHeight = $('#DashboardContainerHeader').outerHeight();
            $MaterialsPanel.css('height', `${fullHeight - subHeaderHeight}px`);
        }
        else if (inViewport($('.EmptyDiv')) >= 0 && inViewport($('#bottomHeader')) <= 0 && 
            materialsPanelMode == 'maximize')
        {
            const fullHeight = inViewport($LeftSidePanel);
            const subHeaderHeight = $('#DashboardContainerHeader').outerHeight();
            const visibleEmptyDivHeight = inViewport($('.EmptyDiv'));
            const differenceHeight = subHeaderHeight - visibleEmptyDivHeight;
            $MaterialsPanel.css('height', `${fullHeight - differenceHeight}px`);
        }
        else if (materialsPanelMode == 'maximize') 
        {
            const fullHeight = inViewport($LeftSidePanel);
            $MaterialsPanel.css('height', `${fullHeight}px`);
        }

        if (inViewport($('#bottomHeader')) <= 0 && inViewport($('.EmptyDiv')) <= 0 && 
            materialsPanelMode == 'dual') {
            const fullHeight = inViewport($LeftSidePanel);
            const subHeaderHeight = $('#DashboardContainerHeader').outerHeight();
            $MaterialsPanel.css('height', `${(fullHeight - subHeaderHeight) / 2}px`);
        }
        else if (inViewport($('.EmptyDiv')) >= 0 && inViewport($('#bottomHeader')) <= 0 && 
            materialsPanelMode == 'dual')
        {
            const fullHeight = inViewport($LeftSidePanel);
            const subHeaderHeight = $('#DashboardContainerHeader').outerHeight();
            const visibleEmptyDivHeight = inViewport($('.EmptyDiv'));
            const differenceHeight = subHeaderHeight - visibleEmptyDivHeight;
            $MaterialsPanel.css('height', `${(fullHeight - differenceHeight) / 2}px`);
        }
        else if (materialsPanelMode == 'dual') 
        {
            const halfHeight = inViewport($LeftSidePanel) / 2;
            $MaterialsPanel.css('height', `${halfHeight}px`);
        }

        if (materialsPanelMode == 'minimize') {
            const headerHeight = $MaterialsPanelHeader.outerHeight(true);
            $MaterialsPanel.css('height', `${headerHeight}px`);
        }

        if ($LeftSidePanel.css('padding-bottom') == '0px') {
            const headerHeight = $('.compact-dictionary-materials-header').outerHeight(true);
            $('#PocketDictionary').css('padding-bottom', `${headerHeight}px`);
        }
    });

    $DictionarySearchButton.on('click', function(event) {
        event.preventDefault();
        $DictionaryResult.html('');
        $RelatedPhrasesResult.html('');
        $RelatedPhrasesResult.parent().css('height', `auto`);

        $RelatedPhrasesResult.parent().css('display', 'none');
        $('#PocketDictionary .loading-or-error').first().css('display', 'flex');
        $('#PocketDictionary .loading-or-error').first().next().css('display', 'none');
        $('#PocketDictionary .loading-or-error').last().css('display', 'none');

        try {
            const Result = DataAccess.LoadDictionaryPage($DictionaryInput.val().trim(), 
                Data.currentLanguageForDictionary);
            Result.then(DictionaryPage => {
                $('#PocketDictionary .loading-or-error').first().css('display', 'none');
                $('#PocketDictionary .loading-or-error').first().next().css('display', 'none');
                $('#PocketDictionary .loading-or-error').last().css('display', 'none');
                $RelatedPhrasesResult.parent().css('display', 'flex');

                RenderDictionaryContent.RenderDictionaryPage(DictionaryPage);
                const resultHeight = $DictionaryResult.height();
                $RelatedPhrasesResult.parent().css('height', `${resultHeight}px`);
                RenderDictionaryContent.RenderRelatedPhrases(DictionaryPage);

                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl)
                });
                DataAccess.currentWord = $DictionaryInput.val().trim();
            });
        }
        catch {
            $('#PocketDictionary .loading-or-error').first().css('display', 'none');
            $('#PocketDictionary .loading-or-error').first().next().css('display', 'none');
            $('#PocketDictionary .loading-or-error').last().css('display', 'flex');
            $RelatedPhrasesResult.parent().css('display', 'none');
        }
    });

    $SettingsSaveButton.on('click', function(event) {
        event.preventDefault();
        if ($SettingsExamples.val().trim().toLowerCase() != 'max' &&
            !(parseInt($SettingsExamples.val().trim()) > 0)) 
        {
            RenderDictionaryContent.ShowModal(`Entered value for maximum amount of displayed examples is invalid! Please keep in mind that it can hold only numbers greater than 0 or phrase 'max' for showing all occurrences. Please enter valid value and try again.`);
        }
        else if ($SettingsSynonyms.val().trim().toLowerCase() != 'max' &&
            !(parseInt($SettingsSynonyms.val().trim()) > 0))
        {
            RenderDictionaryContent.ShowModal(`Entered value for maximum amount of displayed synonyms is invalid! Please keep in mind that it can hold only numbers greater than 0 or phrase 'max' for showing all occurrences. Please enter valid value and try again.`);
        }
        else if ($SettingsSenses.val().trim().toLowerCase() != 'max' &&
            !(parseInt($SettingsSenses.val().trim()) > 0))
        {
            RenderDictionaryContent.ShowModal(`Entered value for maximum amount of displayed senses is invalid! Please keep in mind that it can hold only numbers greater than 0 or phrase 'max' for showing all occurrences. Please enter valid value and try again.`);
        }
        else {
            let maximumExamples, maxiumSynonyms, maximumSenses;

            maximumExamples = $SettingsExamples.val().trim().toLowerCase() == 'max' ? 
                99 : parseInt($SettingsExamples.val().trim());

            maxiumSynonyms = $SettingsSynonyms.val().trim().toLowerCase() == 'max' ? 
            99 : parseInt($SettingsSynonyms.val().trim());

            maximumSenses = $SettingsSenses.val().trim().toLowerCase() == 'max' ? 
            99 : parseInt($SettingsSenses.val().trim());

            const updateStatus = DataAccess.UpdateUsersSettings
                (maximumExamples, maxiumSynonyms, maximumSenses);
            updateStatus.then(response => {
                if (response == 'Success') {
                    RenderDictionaryContent.ShowModal('Your settings have been updated successfully!');
                    localStorage.setItem('MaxExamples', maximumExamples);
                    localStorage.setItem('MaxSynonyms', maxiumSynonyms);
                    localStorage.setItem('MaxSenses', maximumSenses);
                }
                else {
                    RenderDictionaryContent.ShowModal('Your settings have not been updated! Please try again.');
                }
            });
        }
    });

    $(function() {
        $('#CollectionElementsListDictionary').sortable({
            update: function(event, ui) {
                UpdateElementsOrder($('#CollectionElementsListDictionary'));
            }
        });
    });
});
