class ContentAccess {
    userTexts;
    userCollections;
    userAllSets;
    constructor() {
        this.userTexts = [];
        this.userCollections = [];
        this.userAllSets = [];
    }

    GetAllTexts() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/repositorycontroller/getalltexts',
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

    GetAllCollections() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/repositorycontroller/getallcollections',
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

    static GetAllFavourites() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/repositorycontroller/getallfavourites',
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

    static AddFavouriteTextAJAX(title, creationTime) {
        $.ajax({
            url: 'https://localhost:44369/api/repositorycontroller/addfavouritetext',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({title: title, creationTime: creationTime}),
            processData: false,
            contentType: false,
            success: function(response) {
                alert('success');
            },
            error: function(err) {
                alert(err);
            }
        });
    }

    static AddFavouriteCollectionAJAX(title, creationTime, termsCount) {
        $.ajax({
            url: 'https://localhost:44369/api/repositorycontroller/addfavouritecollection',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({title: title, creationTime: creationTime, termsCount: termsCount}),
            processData: false,
            contentType: false,
            success: function(response) {
                alert('success');
            },
            error: function(err) {
                alert(err);
            }
        });
    }

    static DeleteFavouriteItemAJAX(title, elementType) {
        $.ajax({
            url: 'https://localhost:44369/api/repositorycontroller/deletefavouriteitem',
            headers: {
                'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
            },
            type: 'DELETE',
            dataType: 'json',
            data: JSON.stringify({title: title, elementType: elementType}),
            processData: false,
            contentType: false,
            success: function(response) {
                alert('success');
            },
            error: function(err) {
                alert(err);
            }
        });
    }

    static DeleteNormalItem(title, elementType) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://localhost:44369/api/repositorycontroller/deleteitem',
                headers: {
                    'Authorization' : 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('id'))
                },
                type: 'DELETE',
                dataType: 'json',
                data: JSON.stringify({title: title, elementType: elementType}),
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('success');
                    if (elementType == 'text') {
                        ContentAccess.UpdateLocalStorageText(title);
                    }
                    else {
                        ContentAccess.UpdateLocalStorageCollection(title);
                    }
                    resolve(response);
                },
                error: function(err) {
                    alert(err);
                    reject(response);
                }
            });
        });
    }

    static UpdateLocalStorageCollection(collectionTitle) {
        let recentCollections = JSON.parse(localStorage.getItem(`${localStorage.getItem('username')}RecentCollections`));
        console.log(recentCollections);
        const fixedElementIndex = recentCollections.findIndex(element => {
            return element.title == collectionTitle;
        });
        console.log(fixedElementIndex);
        if (fixedElementIndex >= 0) {
            recentCollections.splice(fixedElementIndex, 1);
            recentCollections = JSON.stringify(recentCollections);
            localStorage.setItem(`${localStorage.getItem('username')}RecentCollections`, recentCollections);
        }
    }

    static UpdateLocalStorageText(textTitle) {
        let recentTexts = JSON.parse(localStorage.getItem(`${localStorage.getItem('username')}RecentTexts`));
        console.log(recentTexts);
        const fixedElementIndex = recentTexts.findIndex(element => {
            return element.title == textTitle;
        });
        console.log(fixedElementIndex);
        if (fixedElementIndex >= 0) {
            recentTexts.splice(fixedElementIndex, 1);
            recentTexts = JSON.stringify(recentTexts);
            localStorage.setItem(`${localStorage.getItem('username')}RecentTexts`, recentTexts);
        }
    }
}

class RenderContent extends ContentAccess {
    listOfSets;
    constructor() {
        super()
        this.listOfSets = [];
    }

    static RenderFavouriteCollection(title, additionalInfo) {
        const FavouriteElement = document.createElement('div');
        FavouriteElement.classList.add('col-3');
        FavouriteElement.classList.add('padding-column');
        FavouriteElement.classList.add('favourite-column');
        FavouriteElement.innerHTML = 
        `<div class="favorite-element">
            <i class="delete-favourite fas fa-times"></i>
            <h6 class="favorite-title">${title}</h6>
            <h1 class="favorite-icon"><i class="bi bi-journals"></i></h1>
            <h6 class="favorite-additional-info">${additionalInfo}</h6>
        </div>`;

        const Favourites = document.getElementById('RowFavourites');
        Favourites.append(FavouriteElement);
        var jQueryObj = $(FavouriteElement);
        jQueryObj.on('click', function(event) {
            DynamicEventListener.OpenElementHandler.bind(null, title, 'collection');
        });
    }

    static RenderFavouriteText(title, additionalInfo) {
        const FavouriteElement = document.createElement('div');
        FavouriteElement.classList.add('col-3');
        FavouriteElement.classList.add('padding-column');
        FavouriteElement.classList.add('favourite-column');
        FavouriteElement.innerHTML = 
        `<div class="favorite-element">
            <i class="delete-favourite fas fa-times"></i>
            <h6 class="favorite-title">${title}</h6>
            <h1 class="favorite-icon"><i class="bi bi-journal-text"></i></h1>
            <h6 class="favorite-additional-info">${additionalInfo}</h6>
        </div>`;

        const Favourites = document.getElementById('RowFavourites');
        Favourites.append(FavouriteElement);
        var jQueryObj = $(FavouriteElement);
        jQueryObj.on('click', function(event) {
            DynamicEventListener.OpenElementHandler.bind(null, title, 'text');
        });
    }

    static RenderEmptyFavourite() {
        const FavouriteEmpty = document.createElement('div');
        FavouriteEmpty.classList.add('col-12');
        FavouriteEmpty.classList.add('padding-column');
        FavouriteEmpty.classList.add('empty-favorite');
        FavouriteEmpty.innerHTML = 
        `<img src="images/empty-folder-quarere.png" class="image-fluid"/>
        <h6>There's Nothing Here Yet</h6>
        <button>Add Favorites <i class="bi bi-arrow-down"></i></button>`;

        $('#RowFavouritesHeading').css('display', 'none');
        const Favourites = document.getElementById('RowFavourites');
        Favourites.append(FavouriteEmpty);
        FavouriteEmpty.style.display = 'flex';
        $('#Favourites').css('background-color', 'transparent');

        DynamicEventListener.ScrollToData();
    }

    RenderFullUserData() {
        this.listOfSets = [];
        this.userAllSets.forEach(element => {
            const UserElement = document.createElement('div');
            if (element.Id == 'text') 
            {
                UserElement.classList.add('col-12');
                UserElement.classList.add('padding-column');
                UserElement.classList.add('text-set');
                UserElement.innerHTML = 
                `<div class="col-12 repository-set-body">
                    <div class="repository-set-body-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-journal-text" viewBox="0 0 16 16">
                            <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                        </svg>
                    </div>
                    <div class="repository-set-body-data">
                        <h5>${element.Title}</h5>
                        <h6>Created ${(element.CreationTime).replace('T', ' ')}</h6>
                    </div>
                    <div class="repository-set-options">                       
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                    </div>
                </div>`; 
            }
            else 
            {
                UserElement.classList.add('col-12');
                UserElement.classList.add('padding-column');
                UserElement.classList.add('collection-set');
                UserElement.innerHTML = 
                `<div class="col-12 repository-set-body">
                    <div class="repository-set-body-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-journals" viewBox="0 0 16 16">
                            <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
                            <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"/>
                        </svg>
                    </div>
                    <div class="repository-set-body-data">
                        <h5>${element.Title}</h5>
                        <h6>${element.TermsCount} Terms, Created ${(element.CreationTime).replace('T', ' ')}</h6>
                    </div>
                    <div class="repository-set-options">                       
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                    </div>
                </div>`;
            }

            this.listOfSets.push({title: element.Title, HTMLObject: UserElement});
            const DataRow = document.getElementById('SetsOutput');
            DataRow.append(UserElement);
            var jQueryObj = $(UserElement);
            jQueryObj.on('click', DynamicEventListener.OpenElementHandler.bind(null, element.Title, element.Id));
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

class DynamicEventListener {
    static StarHandler() {
        $('.repository-set-options .bi-star-fill').on('click', function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            let doesElementExists = false;
            if ($(this).parent().parent().parent().hasClass('text-set')) {
                const title = $(this).parent().prev().children().first().text();
                const additionalInfo = $(this).parent().prev().children().last().text();
                $('#Favourites .col-3 .bi-journal-text').each(function() {
                    if ($(this).parent().prev().text() == title) {
                        doesElementExists = true;
                    }
                });
                if (doesElementExists) { return; }
                ContentAccess.AddFavouriteTextAJAX(title, additionalInfo.replace('Created ', ''));
                $(this).addClass('active-star');
                if ($('.empty-favorite').length) {
                    $('.empty-favorite').remove();
                    $('#RowFavouritesHeading').css('display', 'block');
                    $('#Favourites').css('background-color', '#0652dd');
                }
                RenderContent.RenderFavouriteText(title, additionalInfo);
                DynamicEventListener.DeleteHanlderSingleElement();
            }
            else {
                const title = $(this).parent().prev().children().first().text();
                const additionalInfo = $(this).parent().prev().children().last().text();
                $('#Favourites .col-3 .bi-journals').each(function() {
                    if ($(this).parent().prev().text() == title) {
                        doesElementExists = true;
                    }
                });
                if (doesElementExists) { return; }
                const data = (additionalInfo.replace(' Created ', '').replace(' Terms', '')).split(',');
                ContentAccess.AddFavouriteCollectionAJAX(title, data[1], data[0]);
                $(this).addClass('active-star');
                if ($('.empty-favorite').length) {
                    $('.empty-favorite').remove();
                    $('#RowFavouritesHeading').css('display', 'block');
                    $('#Favourites').css('background-color', '#0652dd');
                }
                RenderContent.RenderFavouriteCollection(title, additionalInfo.replace('Created ', ''));
                DynamicEventListener.DeleteHanlderSingleElement();
            }
        });
    }

    static TrashHandler() {
        $('.repository-set-options .bi-trash-fill').each(function() {
            $(this).on('click', function(event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
                if ($(this).parent().parent().parent().hasClass('text-set')) {
                    const title = $(this).parent().prev().children().first().text();
                    $(this).parent().parent().parent('.text-set').remove();
                    ContentAccess.DeleteNormalItem(title, 'text').then(function(response) {
                        $('#RowFavourites .favorite-title').each(function() {
                            if ($(this).text() == title) {
                                $(this).parent().parent().remove();
                            }
                        });
                        if ($('#RowFavourites').children().length < 2) {
                            RenderContent.RenderEmptyFavourite();
                        }
                    });
                }
                else {
                    const title = $(this).parent().prev().children().first().text();
                    $(this).parent().parent().parent('.collection-set').remove();
                    ContentAccess.DeleteNormalItem(title, 'collection').then(function(response) {
                        $('#RowFavourites .favorite-title').each(function() {
                            if ($(this).text() == title) {
                                $(this).parent().parent().remove();
                            }
                        });
                        if ($('#RowFavourites').children().length < 2) {
                            RenderContent.RenderEmptyFavourite();
                        }
                    });
                }
            });
        });
    }

    static DeleteHandler() {
        $('.delete-favourite').each(function() {
            $(this).on('click', function() {
                const title = $(this).next().text();
                if ($(this).next().next().children().hasClass('bi-journal-text')) {
                    ContentAccess.DeleteFavouriteItemAJAX(title, 'text');
                }
                else {
                    ContentAccess.DeleteFavouriteItemAJAX(title, 'collection');
                }
                $(`#SetsOutput h5:contains("${title}")`).parent().next().children().first().removeClass('active-star');
                $(this).parent().parent().remove();
                if ($('#RowFavourites').children().length < 2) {
                    RenderContent.RenderEmptyFavourite();
                }
            });
        });
    }

    static DeleteHanlderSingleElement() {
        $('#RowFavourites').children().last().children().children().first().on('click', function() {
            const title = $(this).next().text();
            if ($(this).next().next().children().hasClass('bi-journal-text')) {
                ContentAccess.DeleteFavouriteItemAJAX(title, 'text');
            }
            else {
                ContentAccess.DeleteFavouriteItemAJAX(title, 'collection');
            }
            $(`#SetsOutput h5:contains("${title}")`).parent().next().children().first().removeClass('active-star');
            $(this).parent().parent().remove();
            if ($('#RowFavourites').children().length < 2) {
                RenderContent.RenderEmptyFavourite();
            }
        });
    }

    static OpenElementHandler(title, elementType) {
        localStorage.setItem('CurrentOpenElementTitle', title);
        localStorage.setItem('TypeOfElement', elementType);
        if (elementType == 'text') {
            window.location.href = "https://localhost:44369/OpenedUserText.aspx";
        }
        else {
            window.location.href = "https://localhost:44369/OpenedUserCollection.aspx";
        }
    }

    static ScrollToData() {
        $('.empty-favorite button').on('click', function(event) {
            event.preventDefault();
            document.getElementById('SetsOutput').scrollIntoView();
        });
    }
}

function GenerateJSDateFormatObject(set) {
    const dateString = set.CreationTime;
    const yyyy = parseInt(dateString.substring(0, 4));
    const mm = parseInt(dateString.substring(5, 7));
    const dd = parseInt(dateString.substring(8, 10));
    const hh = parseInt(dateString.substring(11, 13));
    const min = parseInt(dateString.substring(14, 16));
    const ss = parseInt(dateString.substring(17, 19));
    const dateObj = new Date(yyyy, mm-1, dd, hh, min, ss);
    return dateObj;
}

async function InitialLoadData(UserContent) {
    try {
        var responseTexts = await UserContent.GetAllTexts();
        var responseCollections = await UserContent.GetAllCollections();
        UserContent.userAllSets = responseTexts.concat(responseCollections);
        UserContent.userAllSets.forEach(function(set) {
            set.JSDate = GenerateJSDateFormatObject(set);
            if (set.TermsCount == undefined || set.TermsCount == null) {
                set.TermsCount = 0;
            }
        });
        console.log(UserContent.userAllSets);
        UserContent.userAllSets = QuickSortAlgorythm.QuickSort(UserContent.userAllSets, 0, UserContent.userAllSets.length - 1, 'desc', 'JSDate');
        UserContent.RenderFullUserData();
        ContentAccess.GetAllFavourites().then(function(response) {
            console.log(response);
            const elementsAlreadyFavourite = [];
            response.forEach(element => {
                if(element['TermsCount'] == 0) {
                    RenderContent.RenderFavouriteText(element['Title'], ('Created ' + element['CreationTime'].replace('T', ' ')));
                }
                else {
                    const additionalInfo = (element['TermsCount'].toString() + ' Terms, ') + element['CreationTime'].replace('T', ' ');
                    RenderContent.RenderFavouriteCollection(element['Title'], additionalInfo);
                }
                const filtered = UserContent.listOfSets.filter(function(set) {
                    return set.title == element['Title'];
                });
                elementsAlreadyFavourite.push(filtered);
            });
            console.log(elementsAlreadyFavourite);
            elementsAlreadyFavourite.forEach(element => {
                try {
                    var jQueryElement = $(element[0].HTMLObject);
                    jQueryElement.children().children().last().children().first().addClass('active-star');
                }
                catch {
                    //No elements favourite
                }
            });
            //Event Listeners On Dynamic Content
            DynamicEventListener.StarHandler();
            DynamicEventListener.DeleteHandler();
            DynamicEventListener.TrashHandler();
            if ($('#RowFavourites').children().length < 2) {
                RenderContent.RenderEmptyFavourite();
            }
        });
    }
    catch {
        ShowModalPageAccess(`Watch Out!`, `You must log in first to access this content! If you don't have an account, you can create one.`);
    }
}

let UserContent = new RenderContent();
InitialLoadData(UserContent);

$(document).ready(function() {
    //Event Listeners
    $('#RepositorySelect').on('change', function(event) {
        const sortingMethodValue = event.target.value;
        let elementsAlreadyFavourite = [];
        let favoriteElements = [];
        switch(sortingMethodValue) {
            case '1':
                favoriteElements = [];
                $('#SetsOutput .col-12').each(function() {
                    const title = $(this).children().children().first().next().children().first().text();
                    const hasClass = $(this).children().children().last().children().first().hasClass('active-star');
                    if (hasClass == true) {
                        favoriteElements.push(title);
                    }
                });

                $('#SetsOutput').html('');
                UserContent.userAllSets = QuickSortAlgorythm.QuickSort
                    (UserContent.userAllSets, 0, UserContent.userAllSets.length - 1, 'desc', 'JSDate');
                UserContent.RenderFullUserData();

                elementsAlreadyFavourite = [];
                favoriteElements.forEach(function(element) {
                    const filtered = UserContent.listOfSets.filter(function(set) {
                        return set.title == element;
                    });
                    elementsAlreadyFavourite.push(filtered);
                });
                elementsAlreadyFavourite.forEach(element => {
                    var jQueryElement = $(element[0].HTMLObject);
                    jQueryElement.children().children().last().children().first().addClass('active-star');
                });

                DynamicEventListener.StarHandler();
                DynamicEventListener.TrashHandler();
                break;

            case '2':
                favoriteElements = [];
                $('#SetsOutput .col-12').each(function() {
                    const title = $(this).children().children().first().next().children().first().text();
                    const hasClass = $(this).children().children().last().children().first().hasClass('active-star');
                    if (hasClass == true) {
                        favoriteElements.push(title);
                    }
                });

                $('#SetsOutput').html('');
                UserContent.userAllSets = QuickSortAlgorythm.QuickSort
                    (UserContent.userAllSets, 0, UserContent.userAllSets.length - 1, 'asc', 'JSDate');
                UserContent.RenderFullUserData();

                elementsAlreadyFavourite = [];
                favoriteElements.forEach(function(element) {
                    const filtered = UserContent.listOfSets.filter(function(set) {
                        return set.title == element;
                    });
                    elementsAlreadyFavourite.push(filtered);
                });
                elementsAlreadyFavourite.forEach(element => {
                    var jQueryElement = $(element[0].HTMLObject);
                    jQueryElement.children().children().last().children().first().addClass('active-star');
                });

                DynamicEventListener.StarHandler();
                DynamicEventListener.TrashHandler();
                break;

            case '3':
                favoriteElements = [];
                $('#SetsOutput .col-12').each(function() {
                    const title = $(this).children().children().first().next().children().first().text();
                    const hasClass = $(this).children().children().last().children().first().hasClass('active-star');
                    if (hasClass == true) {
                        favoriteElements.push(title);
                    }
                });

                $('#SetsOutput').html('');
                UserContent.userAllSets = QuickSortAlgorythm.QuickSort
                    (UserContent.userAllSets, 0, UserContent.userAllSets.length - 1, 'asc', 'TermsCount');
                UserContent.RenderFullUserData();

                elementsAlreadyFavourite = [];
                favoriteElements.forEach(function(element) {
                    const filtered = UserContent.listOfSets.filter(function(set) {
                        return set.title == element;
                    });
                    elementsAlreadyFavourite.push(filtered);
                });
                elementsAlreadyFavourite.forEach(element => {
                    var jQueryElement = $(element[0].HTMLObject);
                    jQueryElement.children().children().last().children().first().addClass('active-star');
                });

                DynamicEventListener.StarHandler();
                DynamicEventListener.TrashHandler();
                break;

            case '4':
                favoriteElements = [];
                $('#SetsOutput .col-12').each(function() {
                    const title = $(this).children().children().first().next().children().first().text();
                    const hasClass = $(this).children().children().last().children().first().hasClass('active-star');
                    if (hasClass == true) {
                        favoriteElements.push(title);
                    }
                });

                $('#SetsOutput').html('');
                UserContent.userAllSets = QuickSortAlgorythm.QuickSort
                    (UserContent.userAllSets, 0, UserContent.userAllSets.length - 1, 'desc', 'TermsCount');
                UserContent.RenderFullUserData();

                elementsAlreadyFavourite = [];
                favoriteElements.forEach(function(element) {
                    const filtered = UserContent.listOfSets.filter(function(set) {
                        return set.title == element;
                    });
                    elementsAlreadyFavourite.push(filtered);
                });
                elementsAlreadyFavourite.forEach(element => {
                    var jQueryElement = $(element[0].HTMLObject);
                    jQueryElement.children().children().last().children().first().addClass('active-star');
                });

                DynamicEventListener.StarHandler();
                DynamicEventListener.TrashHandler();
                break;

            default:
                $('#SetsOutput').html('');
                UserContent.userAllSets = QuickSortAlgorythm.QuickSort
                    (UserContent.userAllSets, 0, UserContent.userAllSets.length - 1, 'desc', 'JSDate');
                UserContent.RenderFullUserData();
                break;
        }
    });

    $('#SetsSearch').on('keyup', function() {
        const SearchValue = $(this).val().toLowerCase();
        const FilteredElements = UserContent.listOfSets.filter(element => {
            return element.title.toLowerCase().includes(SearchValue);
        });
        UserContent.listOfSets.forEach(element => {
            if (FilteredElements.includes(element)) {
                element.HTMLObject.style.display = 'block';
            }
            else {
                element.HTMLObject.style.display = 'none';
            }
        });
    });

    $('#AllSets').on('click', function() {
        UserContent.listOfSets.forEach(element => {
            element.HTMLObject.style.display = 'block';
        });
    });

    $('#AllTexts').on('click', function() {
        $('.text-set').each(function() {
            $(this).css('display', 'block');
        });
        $('.collection-set').each(function() {
            $(this).css('display', 'none');
        });
    });

    $('#AllCollections').on('click', function() {
        $('.text-set').each(function() {
            $(this).css('display', 'none');
        });
        $('.collection-set').each(function() {
            $(this).css('display', 'block');
        });
    });

    $('.empty-favorite button').on('click', function(event) {
        event.preventDefault();
        $(this).scrollTo('#SetsOutput');
    });
});


