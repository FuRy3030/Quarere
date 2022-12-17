class DashboardDataHandler {
    recentCollections;
    recentTexts;
    recentCollectionsNumberFromAJAX;
    recentTextsNumberFromAJAX;
    constructor(recentCollections, recentTexts, recentTextsNumberFromAJAX, recentCollectionsNumberFromAJAX) {
        this.recentCollections = recentCollections;
        this.recentTexts = recentTexts;
        this.recentTextsNumberFromAJAX = recentTextsNumberFromAJAX;
        this.recentCollectionsNumberFromAJAX = recentCollectionsNumberFromAJAX;
    };

    NumberFromAJAXHandler(dataType) {
        const userDataType = localStorage.getItem('username') + dataType;
        if (localStorage.getItem(userDataType) != null && localStorage.getItem(userDataType) != undefined) {
            const data = JSON.parse(localStorage.getItem(userDataType));
            if (data.length < 3) {
                if (dataType == 'RecentTexts') {
                    this.recentTextsNumberFromAJAX = 3 - data.length;
                }
                else {
                    this.recentCollectionsNumberFromAJAX = 3 - data.length;
                }
            }
            else {
                if (dataType == 'RecentTexts') {
                    this.recentTextsNumberFromAJAX = 0;
                }
                else {
                    this.recentCollectionsNumberFromAJAX = 0;
                }
            }
        }
        else {
            if (dataType == 'RecentTexts') {
                this.recentTextsNumberFromAJAX = 3;
            }
            else {
                this.recentCollectionsNumberFromAJAX = 3;
            }
        }
    }
}

class RecentContentAccess extends DashboardDataHandler {
    constructor() {
        super([], [], 0, 0);
    }
    
    GetDataFromLocalStorage(dataType) {
        const userDataType = localStorage.getItem('username') + dataType;
        if (dataType == 'RecentTexts' && this.recentTextsNumberFromAJAX < 3) {
            const data = JSON.parse(localStorage.getItem(userDataType));
            data.forEach(element => {
                this.recentTexts.push(element);
            });
        }
        else if (dataType == 'RecentCollections' && this.recentCollectionsNumberFromAJAX < 3) {
            const data = JSON.parse(localStorage.getItem(userDataType));
            data.forEach(element => {
                this.recentCollections.push(element);
            });
        }
    }

    GetAjaxData(dataType) {
        const itemType = new FormData();
        itemType.append('dataType', dataType);
        if (dataType == 'RecentTexts') {
            const titleArrayToCheck = [];
            itemType.append('elementsCount', this.recentTextsNumberFromAJAX);
            this.recentTexts.forEach(recentText => {
                titleArrayToCheck.push(recentText['title']);
            });
            const JSONTitles = JSON.stringify(titleArrayToCheck);
            itemType.append('titles', JSONTitles);
        }
        else {
            const titleArrayToCheck = [];
            itemType.append('elementsCount', this.recentCollectionsNumberFromAJAX);
            this.recentCollections.forEach(recentCollection => {
                titleArrayToCheck.push(recentCollection['title']);
            });
            const JSONTitles = JSON.stringify(titleArrayToCheck);
            itemType.append('titles', JSONTitles);
        }
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/dashboardcontroller/recentlyuseditems',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'POST',
                dataType: 'json',
                data: itemType,
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

class RecentContentRender {
    static CreateRecentCollectionShortcut(title, termsAmount, creationTime, description, number) {
        const RecentlyUsedCollection = document.createElement('div');
        RecentlyUsedCollection.classList.add('col-4');
        RecentlyUsedCollection.classList.add('dashboard-column');
        RecentlyUsedCollection.innerHTML = 
        `<div class="dashboard-element-flashcards">
            <div class="black-background-handler">
                <div class="dashboard-element-short-content">
                    <h2 class="dashboard-element-title">${title}</h2>
                    <p class="dashboard-element-additional-info">${termsAmount} Terms, Created ${creationTime}</p>
                </div>
                <div class="dashboard-element-content">
                    <p class="dashboard-element-body">${description}</p>
                    <button class="btn dashboard-element-button collection-access-button">Learn & Edit</button>
                </div>
            </div>
        </div>`;

        switch(number) {
            case 1: 
                RecentlyUsedCollection.setAttribute('id', 'FlashcardsFirst');
                break;
            case 2:
                RecentlyUsedCollection.setAttribute('id', 'FlashcardsSecond');
                break;
            case 3:
                RecentlyUsedCollection.setAttribute('id', 'FlashcardsThird');
                break;
            default:
                break;
        }

        const CollectionsRow = document.getElementById('FlashcardsSets');
        CollectionsRow.append(RecentlyUsedCollection);
    }

    static CreateRecentTextShortcut(title, creationTime, description, number) {
        const RecentlyUsedText = document.createElement('div');
        RecentlyUsedText.classList.add('col-4');
        RecentlyUsedText.classList.add('dashboard-column');
        RecentlyUsedText.innerHTML = 
        `<div class="dashboard-element-flashcards dashboard-element-texts">
            <div class="black-background-handler">
                <div class="dashboard-element-short-content">
                    <h2 class="dashboard-element-title">${title}</h2>
                    <p class="dashboard-element-additional-info">Created ${creationTime}</p>
                </div>
                <div class="dashboard-element-content">
                    <p class="dashboard-element-body">${description}</p>
                    <button class="btn dashboard-element-button text-read-button">Continue Reading</button>
                </div>
            </div>
        </div>`;

        switch(number) {
            case 1: 
                RecentlyUsedText.setAttribute('id', 'TextsFirst');
                break;
            case 2:
                RecentlyUsedText.setAttribute('id', 'TextsSecond');
                break;
            case 3:
                RecentlyUsedText.setAttribute('id', 'TextsThird');
                break;
            default:
                break;
        }

        const TextsRow = document.getElementById('Texts');
        TextsRow.append(RecentlyUsedText);
    }

    static CreateEmptyCollectionField() {
        const RecentlyUsedText = document.createElement('div');
        RecentlyUsedText.classList.add('col-4');
        RecentlyUsedText.classList.add('dashboard-column');
        RecentlyUsedText.innerHTML = 
        `<div class="dashboard-element-empty">
            <div class="dashboard-element-empty-content">
                <h2>Ups, Nothing Here</h2>
                <button class="add-dashboard-button add-collection-button">Add Collection</button>
            </div>
        </div>`;

        const TextsRow = document.getElementById('FlashcardsSets');
        TextsRow.append(RecentlyUsedText);
    }

    static CreateEmptyTextField() {
        const RecentlyUsedText = document.createElement('div');
        RecentlyUsedText.classList.add('col-4');
        RecentlyUsedText.classList.add('dashboard-column');
        RecentlyUsedText.innerHTML = 
        `<div class="dashboard-element-empty">
            <div class="dashboard-element-empty-content">
                <h2>Ups, Nothing Here</h2>
                <button class="add-dashboard-button add-text-button">Add Text</button>
            </div>
        </div>`;

        const TextsRow = document.getElementById('Texts');
        TextsRow.append(RecentlyUsedText);
    }
}

class OnClickHandler {
    static LoadText(event) {
        event.preventDefault();
        $.ajax({
            url: 'https://localhost:44369/api/usertextmanagementcontroller/loadfromexternalsource',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'POST',
            dataType: 'json',
            data: event.data.value,
            processData: false,
            contentType: false,
            success: function() {
                alert('loaded');
                window.location.href = "https://localhost:44369/ReadText.aspx";
            },
            error: function(err) {
                alert('error');
            }
        });
    }

    static LoadCollection(event) {
        event.preventDefault();
        localStorage.setItem('CurrentOpenElementTitle', event.data.value);
        localStorage.setItem('TypeOfElement', 'collection');
        window.location.href = "https://localhost:44369/OpenedUserCollection.aspx";
    }

    static AddText(event) {
        event.preventDefault();
        window.location.href = "https://localhost:44369/AddText.aspx";
    }
}

let currentUserContent = new RecentContentAccess();
const dataTypes = ['RecentTexts', 'RecentCollections'];
dataTypes.forEach(dataType => {
    currentUserContent.NumberFromAJAXHandler(dataType);
    currentUserContent.GetDataFromLocalStorage(dataType);
    console.log(currentUserContent.recentCollectionsNumberFromAJAX);
    console.log(currentUserContent.recentTextsNumberFromAJAX);

    if ((dataType == 'RecentTexts' && currentUserContent.recentTextsNumberFromAJAX > 0) || 
       (dataType == 'RecentCollections' && currentUserContent.recentCollectionsNumberFromAJAX > 0)) {
        
        try {
            currentUserContent.GetAjaxData(dataType).then(function(response) {
                const data = JSON.parse(response);
                console.log(data);

                if (data['DataType'] == 'RecentTexts') {
                    data['Items'].forEach(item => {
                        const Card = {
                            title: item['Title'],
                            description: item['description'],
                            creationTime: item['CreationTime']
                        }
                        currentUserContent.recentTexts.push(Card);
                    });

                    let orderNumber = 1;
                    currentUserContent.recentTexts.forEach(text => {
                        const properDateFormat = text['creationTime'].replace(' @ ', ' ').replace('T', ' ');
                        if (text['description'] == undefined) { text['description'] = ''; }
                        RecentContentRender.CreateRecentTextShortcut(text['title'], properDateFormat, text['description'], orderNumber);
                        orderNumber = orderNumber + 1;
                    });

                    $('.text-read-button').each(function() {
                        const title = $(this).parent().prev().children().first().text();
                        console.log(title);
                        $(this).on('click', { value: title }, OnClickHandler.LoadText);
                    });

                    if ($('#Texts').children().length < 3) {
                        const count = 3 - $('#Texts').children().length;
                        for (let i = 0; i < count; i++) {
                            RecentContentRender.CreateEmptyTextField();
                        }
                    }

                    $('.add-text-button').each(function() {
                        $(this).on('click', OnClickHandler.AddText);
                    });
                }
                else {
                    try {
                        data['Items'].forEach(item => {
                            const Card = {
                                title: item['Title'],
                                description: item['description'],
                                creationTime: item['CreationTime'],
                                termsCount: item['TermsCount']
                            }
                            currentUserContent.recentCollections.push(Card);
                        });
                    }
                    catch {
                        //Empty Storage
                    }

                    let orderNumber = 1;
                    currentUserContent.recentCollections.forEach(collection => {
                        const properDateFormat = collection['creationTime'].replace(' @ ', ' ').replace('T', ' ');
                        if (collection['description'] == undefined) { collection['description'] = ''; }
                        RecentContentRender.CreateRecentCollectionShortcut(collection['title'], collection['termsCount'], properDateFormat, 
                            collection['description'], orderNumber);
                        orderNumber = orderNumber + 1;
                    });

                    $('.collection-access-button').each(function() {
                        const title = $(this).parent().prev().children().first().text();
                        console.log(title);
                        $(this).on('click', { value: title }, OnClickHandler.LoadCollection);
                    });

                    if ($('#FlashcardsSets').children().length < 3) {
                        const count = 3 - $('#FlashcardsSets').children().length;
                        for (let i = 0; i < count; i++) {
                            RecentContentRender.CreateEmptyCollectionField();
                        }
                    }
                }
            });
        }
        catch {
            ShowModalPageAccess(`Watch Out!`, 
                `You must log in first to access this content! If you don't have an account, you can create one.`);
        }
    }

    else {
        if (dataType == 'RecentTexts' && currentUserContent.recentTextsNumberFromAJAX == 0) {
            let orderNumber = 1;
            currentUserContent.recentTexts.forEach(text => {
                const properDateFormat = text['creationTime'].replace(' @ ', ' ').replace('T', ' ');
                if (text['description'] == undefined) { text['description'] = ''; }
                RecentContentRender.CreateRecentTextShortcut(text['title'], properDateFormat, text['description'], orderNumber);
                orderNumber = orderNumber + 1;
            });

            $('.text-read-button').each(function() {
                const title = $(this).parent().prev().children().first().text();
                console.log(title);
                $(this).on('click', { value: title }, OnClickHandler.LoadText);
            });

            if ($('#Texts').children().length < 3) {
                const count = 3 - $('#Texts').children().length;
                for (let i = 0; i < count; i++) {
                    RecentContentRender.CreateEmptyTextField();
                }
            }

            $('.add-text-button').each(function() {
                $(this).on('click', OnClickHandler.AddText);
            });
        }
        
        if (dataType == 'RecentCollections' && currentUserContent.recentCollectionsNumberFromAJAX == 0) {
            let orderNumber = 1;
            currentUserContent.recentCollections.forEach(collection => {
                const properDateFormat = collection['creationTime'].replace(' @ ', ' ').replace('T', ' ');
                if (collection['description'] == undefined) { collection['description'] = ''; }
                RecentContentRender.CreateRecentCollectionShortcut(collection['title'], collection['termsCount'], properDateFormat, 
                    collection['description'], orderNumber);
                orderNumber = orderNumber + 1;
            });

            $('.collection-access-button').each(function() {
                const title = $(this).parent().prev().children().first().text();
                console.log(title);
                $(this).on('click', { value: title }, OnClickHandler.LoadCollection);
            });

            if ($('#FlashcardsSets').children().length < 3) {
                const count = 3 - $('#FlashcardsSets').children().length;
                for (let i = 0; i < count; i++) {
                    RecentContentRender.CreateEmptyCollectionField();
                }
            }
        }
    }
});

$(document).ready(function() {
    $(window).scroll(function(){
        let scrolledPx = $(window).scrollTop();
        if (scrolledPx < $('.navbar').outerHeight()) {
            const result = $('.navbar').outerHeight() - scrolledPx;
            $('#DashboardContainerHeader').css('top', (result).toString() + 'px');
            $('#DashboardContainerHeader').css('background-color', '#050d2491');
        }
        else {
            $('#DashboardContainerHeader').css('top', '0px');
            $('#DashboardContainerHeader').css('background-color', '#050D24');
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

    $('.dashboard-heading').first().text(`Welcome Back, ${localStorage.getItem('username')}`);
    const today = new Date();
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    $('.dashboard-heading').last().text(`${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-` +
        `${today.getFullYear()}, ${days[today.getDay()]}`);
});

