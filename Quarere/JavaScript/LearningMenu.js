//Initial Load (Collection Titles)
class DataAccess {
    collectionList;
    flashcardElements;
    gapFillerOption;
    constructor() {
        this.collectionList = [];
        this.flashcardElements = ['Word / Phrase', 'Meaning'];
        this.gapFillerOption = 'Example';
    }

    GetCollections() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/learningMenucontroller/getcollections',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'GET',
                dataType: 'json',
                processData: false,
                contentType: false,
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

class ContentRender {
    static HTMLObjectCollection = [];

    static RenderCollectionShortcut(title) {
        const Collection = document.createElement('div');
        Collection.classList.add('col-4');
        Collection.classList.add('collection-tile-column');
        Collection.innerHTML = 
        `<div class="collection-tile">
            <div class="collection-tile__content">          
                <div class="collection-tile__front">
                    <h3 class="collection-tile__title">${title}</h3>
                </div>                            
                <div class="collection-tile__back">
                    <div class="collection-buttons">
                        <h3 class="button-configure">Configure <i class="bi bi-tools"></i></h3>
                        <h3 class="button-select">Start Mode <i class="bi bi-door-open"></i></h3>
                        <label class="toggle">
                            <span class="onoff">Progress Tracker <i class="bi bi-spellcheck"></i></span>
                            <input type="checkbox" checked/>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="checkboxes">
                        <div class="form-check collection-tile-checkbox">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">Word / Phrase</label>
                        </div>
                        <div class="form-check collection-tile-checkbox">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">Meaning</label>
                        </div>
                        <div class="form-check collection-tile-checkbox">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">Translation</label>
                        </div>
                        <div class="form-check collection-tile-checkbox">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">Synonyms</label>
                        </div>
                        <div class="form-check collection-tile-checkbox">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">Example</label>
                        </div>
                        <div class="form-check collection-tile-checkbox">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">Text Example</label>
                        </div>
                    </div>
                    <div class="flashcards-info">
                        <h6>Flashcards Front</h6>
                        <h6>${UserData.flashcardElements[0]}</h6>
                        <i class="bi bi-arrow-down-up"></i>
                        <h6>${UserData.flashcardElements[1]}</h6>
                        <h6>Flashcards Back</h6>
                        <button>Apply Changes</button>
                    </div>
                </div>                             
            </div>
        </div>`;

        const CollectionsList = document.getElementById('Collections');
        CollectionsList.append(Collection);

        ContentRender.HTMLObjectCollection.push({title: title, HTMLObject: Collection});
    }

    static RenderCollectionShortcutGapFiller(title) {
        const Collection = document.createElement('div');
        Collection.classList.add('col-4');
        Collection.classList.add('collection-tile-column');
        Collection.innerHTML = 
        `<div class="collection-tile">
            <div class="collection-tile__content">          
                <div class="collection-tile__front">
                    <h3 class="collection-tile__title">${title}</h3>
                </div>                            
                <div class="collection-tile__back">
                    <div class="collection-buttons">
                        <h3 class="button-configure">Configure <i class="bi bi-tools"></i></h3>
                        <h3 class="button-select">Start Mode <i class="bi bi-door-open"></i></h3>
                        <label class="toggle">
                            <span class="onoff">Progress Tracker <i class="bi bi-spellcheck"></i></span>
                            <input type="checkbox" checked/>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="checkboxes">
                        <div class="form-check collection-tile-checkbox">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">Example</label>
                        </div>
                        <div class="form-check collection-tile-checkbox">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">Text Example</label>
                        </div>
                    </div>
                </div>                             
            </div>
        </div>`;

        const CollectionsList = document.getElementById('Collections');
        CollectionsList.append(Collection);

        ContentRender.HTMLObjectCollection.push({title: title, HTMLObject: Collection});
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
    static ConfigureEvent() {
        $('.button-configure').each(function() {
            $(this).on('click', function() {
                $(this).parent().css('display', 'none');
                $(this).parent().next().css('display', 'contents');
            });
        });
    }

    static CheckboxesDataGetter() {
        $('.form-check-input').each(function() {
            $(this).on('change', function() {
                const elementsToFlashcards = [];
                let checkedBoxes = 0;
                console.log(checkedBoxes);
                if ($(this).is(":checked")) {
                    checkedBoxes = checkedBoxes + 1;
                    elementsToFlashcards.push($(this).next().text());
                }
                console.log(checkedBoxes);
                $(this).parent().siblings().each(function() {
                    if ($(this).children().first().is(":checked")) {
                        checkedBoxes = checkedBoxes + 1;
                        elementsToFlashcards.push($(this).children().last().text());
                    }
                });
                console.log(checkedBoxes);
                if (checkedBoxes == 2) {
                    $(this).closest('.checkboxes').next().css('display', 'flex');
                    $(this).closest('.checkboxes').css('display', 'none');
                    $(this).prop("checked", false);
                    $(this).parent().siblings().each(function() {
                        $(this).children().first().prop("checked", false);
                    });
                    $(this).closest('.checkboxes').next().children().eq(1).text(elementsToFlashcards[1]);
                    $(this).closest('.checkboxes').next().children().eq(3).text(elementsToFlashcards[0]);
                    UserData.flashcardElements = [...elementsToFlashcards].reverse();
                    console.log(UserData.flashcardElements);
                    console.log(checkedBoxes);
                }
            });
        });
    }

    static CheckboxesDataGetterGapFiller() {
        $('.form-check-input').each(function() {
            $(this).on('change', function() {
                if ($(this).is(":checked")) {
                    UserData.gapFillerOption = $(this).next().text();
                    $(this).closest('.checkboxes').prev().css('display', 'flex');
                    $(this).closest('.checkboxes').css('display', 'none');
                    $(this).prop("checked", false);
                }
            });
        });
    }

    static ExitFlashcardSwitchMode() {
        $('.flashcards-info button').each(function() {
            $(this).on('click', function(event) {
                event.preventDefault();
                $(this).parent().css('display', 'none');
                $(this).parent().prev().prev().css('display', 'flex');
            });
        });
    }

    static SwitchFlashcardElements() {
        $('.flashcards-info i').each(function() {
            $(this).on('click', function() {
                const temp = $(this).prev().text();
                $(this).prev().text($(this).next().text());
                $(this).next().text(temp);
                UserData.flashcardElements = [UserData.flashcardElements[1], UserData.flashcardElements[0]];
            });
        });
    }

    static StartFlashcards() {
        $('.button-select').each(function() {
            $(this).on('click', function() {
                if ((UserData.flashcardElements[0] == 'Word / Phrase' && $('.toggle input').is(":checked")) ||
                    (UserData.flashcardElements[1] == 'Word / Phrase' && $('.toggle input').is(":checked")) ||
                    !$('.toggle input').is(":checked")) 
                {
                    const title = $(this).closest('.collection-tile__back').prev().children().first().text();
                    localStorage.setItem('CollectionTitle', title);
                    localStorage.setItem('CurrentOpenElementTitle', title);
                    localStorage.setItem('FlashcardElements', JSON.stringify(UserData.flashcardElements));
                    localStorage.setItem('TypeOfElement', 'collection');

                    if ($(this).next().children('input').is(":checked")) {
                        localStorage.setItem('IsProgressTrackerEnabled', 'true');
                    }
                    else {
                        localStorage.setItem('IsProgressTrackerEnabled', 'false');
                    }

                    window.location.href = "https://localhost:44369/Flashcards.aspx";
                }
                else {
                    ContentRender.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                        `Your flashcards must contain 'Word / Phrase' field in order to activate Progress Tracker!`);
                }
            });
        });
    }

    static StartGapFiller() {
        $('.button-select').each(function() {
            $(this).on('click', function() {
                if ((UserData.flashcardElements[0] == 'Word / Phrase' && $('.toggle input').is(":checked")) ||
                    (UserData.flashcardElements[1] == 'Word / Phrase' && $('.toggle input').is(":checked")) ||
                    !$('.toggle input').is(":checked")) 
                {
                    const title = $(this).closest('.collection-tile__back').prev().children().first().text();
                    localStorage.setItem('CollectionTitle', title);
                    localStorage.setItem('CurrentOpenElementTitle', title);
                    localStorage.setItem('GapFillerOption', UserData.gapFillerOption);
                    localStorage.setItem('TypeOfElement', 'collection');

                    if ($(this).next().children('input').is(":checked")) {
                        localStorage.setItem('IsProgressTrackerEnabled', 'true');
                    }
                    else {
                        localStorage.setItem('IsProgressTrackerEnabled', 'false');
                    }

                    window.location.href = "https://localhost:44369/GapFiller.aspx";
                }
                else {
                    ContentRender.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                        `Your flashcards must contain 'Word / Phrase' field in order to activate Progress Tracker!`);
                }
            });
        });
    }

    static StartMatcher() {
        $('.button-select').each(function() {
            $(this).on('click', function() {
                if ((UserData.flashcardElements[0] == 'Word / Phrase' && $('.toggle input').is(":checked")) ||
                    (UserData.flashcardElements[1] == 'Word / Phrase' && $('.toggle input').is(":checked")) ||
                    !$('.toggle input').is(":checked")) 
                {
                    const title = $(this).closest('.collection-tile__back').prev().children().first().text();
                    localStorage.setItem('CollectionTitle', title);
                    localStorage.setItem('CurrentOpenElementTitle', title);
                    localStorage.setItem('FlashcardElements', JSON.stringify(UserData.flashcardElements));
                    localStorage.setItem('TypeOfElement', 'collection');

                    if ($(this).next().children('input').is(":checked")) {
                        localStorage.setItem('IsProgressTrackerEnabled', 'true');
                    }
                    else {
                        localStorage.setItem('IsProgressTrackerEnabled', 'false');
                    }

                    window.location.href = "https://localhost:44369/Matcher.aspx";
                }
                else {
                    ContentRender.ShowModal(`Hey ${localStorage.getItem('username')}, Watch Out!`,
                        `Your flashcards must contain 'Word / Phrase' field in order to activate Progress Tracker!`);
                }
            });
        });
    }
}

class QuickSortAlgorythm {

    static QuickSort(items, left, right, order, propertyName) {
        let index;

        if (items.length > 1) {
            if (order == 'asc') {
                index = this.PartitionArrayAscending(items, left, right, propertyName);
            }
            else {
                index = this.PartitionArrayDescending(items, left, right, propertyName);
            }

            if (left < index - 1) {
                this.QuickSort(items, left, index - 1, order, propertyName);
            }

            if (index + 1 < right) {
                this.QuickSort(items, index + 1, right, order, propertyName);
            }
        }

        return items;
    }

    static PartitionArrayAscending(items, left, right, propertyName) {
        const pivot = items[Math.floor((left + right) / 2)][propertyName];
        let i = left;
        let j = right;

        while (i <= j) {
            while (items[i][propertyName] < pivot) 
            {
                i++;
            }
            while (items[j][propertyName] > pivot) 
            {
                j--;
            }
            if (i <= j) {
                this.swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    static PartitionArrayDescending(items, left, right, propertyName) {
        const pivot = items[Math.floor((left + right) / 2)][propertyName];
        let i = left;
        let j = right;

        while (i <= j) {
            while (items[i][propertyName] > pivot) 
            {
                i++;
            }
            while (items[j][propertyName] < pivot) 
            {
                j--;
            }
            if (i <= j) {
                this.swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    static swap(items, i, j) {
        const temp = items[i];
        items[i] = items[j];
        items[j] = temp;
        console.log(items);
    }
}

class GenerateDifferentModes {
    static GenerateFlashcards() {
        ContentRender.HTMLObjectCollection = [];

        UserData.collectionList.forEach(collection => {
            collection.JSDate = GenerateJSDateFormatObject(collection);
            ContentRender.RenderCollectionShortcut(collection['Title']);
        });

        DynamicEventListeners.ConfigureEvent();
        DynamicEventListeners.CheckboxesDataGetter();
        DynamicEventListeners.ExitFlashcardSwitchMode();
        DynamicEventListeners.SwitchFlashcardElements();
        DynamicEventListeners.StartFlashcards();
        AdjustPanelHeight();
    }

    static GenerateGapFiller() {
        ContentRender.HTMLObjectCollection = [];

        UserData.collectionList.forEach(collection => {
            collection.JSDate = GenerateJSDateFormatObject(collection);
            ContentRender.RenderCollectionShortcutGapFiller(collection['Title']);
        });

        DynamicEventListeners.ConfigureEvent();
        DynamicEventListeners.CheckboxesDataGetterGapFiller();
        DynamicEventListeners.StartGapFiller();
        AdjustPanelHeight();
    }

    static GenerateMatcher() {
        ContentRender.HTMLObjectCollection = [];

        UserData.collectionList.forEach(collection => {
            collection.JSDate = GenerateJSDateFormatObject(collection);
            ContentRender.RenderCollectionShortcut(collection['Title']);
        });

        DynamicEventListeners.ConfigureEvent();
        DynamicEventListeners.CheckboxesDataGetter();
        DynamicEventListeners.ExitFlashcardSwitchMode();
        DynamicEventListeners.SwitchFlashcardElements();
        DynamicEventListeners.StartMatcher();
        AdjustPanelHeight();
    }
}

function AdjustPanelHeight() {
    const currentStaticHeight = $('#LearningModeSelector').outerHeight();
    const currentDynamicHeight = $('.flex-header').outerHeight() + $('#Collections').outerHeight();
    const maxHeight = Math.max(currentStaticHeight, currentDynamicHeight);
    $('#LearningModeSelector').css('min-height', maxHeight + 'px');
    $('#LearningModeSelector').css('height', maxHeight + 'px');
}

function GenerateJSDateFormatObject(collection) {
    const dateString = collection.CreationTime;
    const yyyy = parseInt(dateString.substring(0, 4));
    const mm = parseInt(dateString.substring(5, 7));
    const dd = parseInt(dateString.substring(8, 10));
    const hh = parseInt(dateString.substring(11, 13));
    const min = parseInt(dateString.substring(14, 16));
    const ss = parseInt(dateString.substring(17, 19));
    const dateObj = new Date(yyyy, mm-1, dd, hh, min, ss);
    return dateObj;
}

async function InitialLoad() {
    try {
        const collections = await UserData.GetCollections();
        console.log(collections);
        UserData.collectionList = collections;
        UserData.collectionList.forEach(collection => {
            collection.JSDate = GenerateJSDateFormatObject(collection);
            ContentRender.RenderCollectionShortcut(collection['Title']);
        });
        DynamicEventListeners.ConfigureEvent();
        DynamicEventListeners.CheckboxesDataGetter();
        DynamicEventListeners.ExitFlashcardSwitchMode();
        DynamicEventListeners.SwitchFlashcardElements();
        DynamicEventListeners.StartFlashcards();
        AdjustPanelHeight();
    }
    catch {
        ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
    }
}

const UserData = new DataAccess();
InitialLoad();

$(document).ready(function() {
    $('.learning-mode-menu-element').each(function() {
        $(this).on('click', function() {
            $('.learning-mode-menu-element').each(function() {
                $(this).removeClass('learning-mode-menu-element-selected');
            });
            $(this).addClass('learning-mode-menu-element-selected');

            switch ($(this).text().trim()) {
                case 'Flashcards':
                    $('.collection-tile-column').each(function() {
                        $(this).remove();
                    });
                    GenerateDifferentModes.GenerateFlashcards();
                    break;
                case 'Gap Filler':
                    $('.collection-tile-column').each(function() {
                        $(this).remove();
                    });
                    GenerateDifferentModes.GenerateGapFiller();
                    break;
                case 'Matcher':
                    $('.collection-tile-column').each(function() {
                        $(this).remove();
                    });
                    GenerateDifferentModes.GenerateMatcher();
                    break;
            }
        });
    });

    $('#LearningSelect').on('change', function(event) {
        const sortingMethodValue = event.target.value;
        switch(sortingMethodValue) {
            case '1':
                $('#Collections').html('');
                UserData.collectionList = QuickSortAlgorythm.QuickSort
                    (UserData.collectionList, 0, UserData.collectionList.length - 1, 'desc', 'JSDate');
                
                switch($('.learning-mode-menu-element-selected').text().trim()) 
                {
                    case 'Flashcards':
                        GenerateDifferentModes.GenerateFlashcards();
                        break;
                    case 'Gap Filler':
                        GenerateDifferentModes.GenerateGapFiller();
                        break;
                    case 'Matcher':
                        GenerateDifferentModes.GenerateMatcher();
                        break;
                }
                break;

            case '2':
                $('#Collections').html('');
                UserData.collectionList = QuickSortAlgorythm.QuickSort
                    (UserData.collectionList, 0, UserData.collectionList.length - 1, 'asc', 'JSDate');
                    
                switch($('.learning-mode-menu-element-selected').text().trim()) 
                {
                    case 'Flashcards':
                        GenerateDifferentModes.GenerateFlashcards();
                        break;
                    case 'Gap Filler':
                        GenerateDifferentModes.GenerateGapFiller();
                        break;
                    case 'Matcher':
                        GenerateDifferentModes.GenerateMatcher();
                        break;
                }
                break;

            case '3':
                $('#Collections').html('');
                UserData.collectionList = QuickSortAlgorythm.QuickSort
                    (UserData.collectionList, 0, UserData.collectionList.length - 1, 'asc', 'TermsCount');

                switch($('.learning-mode-menu-element-selected').text().trim()) 
                {
                    case 'Flashcards':
                        GenerateDifferentModes.GenerateFlashcards();
                        break;
                    case 'Gap Filler':
                        GenerateDifferentModes.GenerateGapFiller();
                        break;
                    case 'Matcher':
                        GenerateDifferentModes.GenerateMatcher();
                        break;
                }
                break;

            case '4':
                $('#Collections').html('');
                UserData.collectionList = QuickSortAlgorythm.QuickSort
                    (UserData.collectionList, 0, UserData.collectionList.length - 1, 'desc', 'TermsCount');
                    
                switch($('.learning-mode-menu-element-selected').text().trim()) 
                {
                    case 'Flashcards':
                        GenerateDifferentModes.GenerateFlashcards();
                        break;
                    case 'Gap Filler':
                        GenerateDifferentModes.GenerateGapFiller();
                        break;
                    case 'Matcher':
                        GenerateDifferentModes.GenerateMatcher();
                        break;
                }
                break;

            default:
                $('#Collections').html('');
                UserData.collectionList = QuickSortAlgorythm.QuickSort
                    (UserData.collectionList, 0, UserData.collectionList.length - 1, 'desc', 'JSDate');
                ContentRender.HTMLObjectCollection = [];
                UserData.collectionList.forEach(collection => {
                    ContentRender.RenderCollectionShortcut(collection['Title']);
                });

                DynamicEventListeners.ConfigureEvent();
                DynamicEventListeners.CheckboxesDataGetter();
                DynamicEventListeners.ExitFlashcardSwitchMode();
                DynamicEventListeners.SwitchFlashcardElements();
                DynamicEventListeners.StartFlashcards();
                break;
        }
    });

    $('#SetsSearch').on('keyup', function() {
        const SearchValue = $(this).val().toLowerCase();
        const FilteredElements = ContentRender.HTMLObjectCollection.filter(element => {
            return element.title.toLowerCase().includes(SearchValue);
        });
        $('.empty-search').css('display', 'none');
        $('#Collections').css('flex', '0');
        ContentRender.HTMLObjectCollection.forEach(element => {
            if (FilteredElements.includes(element)) {
                element.HTMLObject.style.display = 'block';
            }
            else {
                element.HTMLObject.style.display = 'none';
            }
        });
        if ($('#Collections').height() == 0) {
            $('.empty-search').css('display', 'flex');
            $('#Collections').css('flex', '2');
        }
    });
});