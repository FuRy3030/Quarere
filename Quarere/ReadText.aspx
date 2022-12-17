<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="ReadText.aspx.cs" Inherits="Quarere.Formularz_sieci_Web18" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/SharedStyles.css" rel="stylesheet" />
    <link href="css/NavbarStyles.css" rel="stylesheet" />
    <link href="css/CreateCollection.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <style>
        body {
            background-color: #f6f7fb;
        } 
    </style>
    <div class="container-fluid" id="DashboardContainerHeader">
        <div class="row">
            <div class="col-12 text-center dashboard-column">
                <div class="dashboard-navbar">
                    <li class="dashboard-navbar-element"><i class="bi bi-journal-text"></i><span>Interactive Text</span></li>
                    <li class="dashboard-navbar-element"><i class="bi bi-search"></i><span>Text Analyzing</span></li>
                    <li class="dashboard-navbar-element"><svg id="cap" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-mortarboard" viewBox="0 0 16 16">
                        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5ZM8 8.46 1.758 5.965 8 3.052l6.242 2.913L8 8.46Z"/>
                        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46l-3.892-1.556Z"/>
                        </svg><span>Learning</span>
                    </li>
                    <li class="dashboard-navbar-element"><i class="bi bi-journal-plus"></i><span>Creating Collections</span></li>
                    <li class="dashboard-navbar-element"><i class="bi bi-journals"></i><span>Collections & Texts</span></li>
                </div>
            </div>
        </div>
    </div>
    <section id="TextAndTile" class="wrapper">
        <div id="Clipboard">
            <div class="clipboard-big">
                <div style="background-color: rgba(16, 47, 127, 0.7);">
                    <div id="SearchBar" class="input-group mx-auto">
                        <input type="text" class="form-control search-input" placeholder="Find Word..." 
                            aria-label="Find Word" aria-describedby="FindWordButton">
                        <button class="btn FindWordButton dropdown-toggle dropdown-toggle-split" 
                            data-bs-toggle="dropdown" aria-expanded="false" type="button" id="FindWordButton">
                            <i id="search-icon" class="fas fa-search"></i>
                        </button>
                        <ul class="dropdown-menu level-selector" aria-labelledby="dropdownMenuButton1">
                            <li class="level-selector-element">All</li>
                            <li class="level-selector-element">A1</li>
                            <li class="level-selector-element">A2</li>
                            <li class="level-selector-element">B1</li>
                            <li class="level-selector-element">B2</li>
                            <li class="level-selector-element">C1</li>
                            <li class="level-selector-element">C2</li>
                        </ul>
                    </div>
                    <button class="btn FindWordButton" id="AddFlashcardButton"><span>Create</span><i class="far fa-clone"></i></button>
                </div>
                <div style="background-color: rgba(18, 54, 145, 0.6); padding: 13px;">
                    <div class="btn-group" role="group" aria-label="Word Filter">
                        <button id="LeftButtonClipboard" type="button" class="table_button">All</button>
                        <button id="MiddleButtonClipboard" type="button" class="table_button">Selected</button>
                        <button id="RightButtonClipboard" type="button" class="table_button">Not Selected</button>
                    </div>
                </div>
                <ul id="ListBig" class="list-unstyled">
                    <!--<li class="word-full-info mx-auto">
                        <div id="TitleInfo">
                            <h6 class="word-full-info-title"><i class="fas fa-volume-up"></i></h6>
                            <h6 class="word-full-info-title">Discussion</h6>
                            <h6 class="word-full-info-title"><i class="fas fa-layer-group"></i> A1</h6>
                        </div>
                        <div id="DoubleInfo">
                            <h6 class="word-full-info-title"><span style="color: #f9ca24;">kill</span> - Noun</h6>
                        </div>
                        <h6 class="word-full-info-element">Word Origin: dhfdjhf</h6>
                        <h6 class="word-full-info-element">Meaning: noun</h6>
                        <h6 class="word-full-info-element">Example: noun</h6>
                        <h6 class="word-full-info-element">Synonyms: make, do, have</h6>
                        <h6 class="word-full-info-element">Antonyms: make, do, have</h6>
                    </li>-->
                </ul>
            </div>
            <div class="clipboard-small">
                <div class="clipboard-small-header">
                    <i id="BarIcon" class="fa-3x fas fa-bars"></i>
                </div>
                <div class="clipboard-small-content">
                    <ul id="ListSmall" class="list-unstyled components">
                        
                    </ul>
                </div>
            </div>
        </div>
        <div id="TextContent" class="container-fluid">
            <div class="row">
                <div id="TextWithTitleArea" class="col" style="padding-left: 0px !important; padding-right: 0px !important;">
                    <div class="mode-change-top-panel">
                        <div class="mode-change-top-panel-heading">
                            <i class="fas fa-stream"></i>
                            <span>
                                Fast Screen</br>
                                Switch
                            </span>
                        </div>
                        <div class="mode-change-top-panel-option mode-change-top-panel-option-active">
                            <i class="fas fa-book-open"></i>
                            <span>
                                Interactive Text
                            </span>
                        </div>
                        <div class="mode-change-top-panel-option">
                            <i class="fas fa-language"></i>
                            <span>
                                Pocket Dictionary
                            </span>
                        </div>
                    </div>
                    <div class="row height-count row-text">
                        <div id="TitleZone" class="col-12 text-center">
                            <h1 id="Title"></h1>
                        </div>
                    </div>
                    <div class="row height-count row-text" style="flex: 2">
                        <div class="col-12">
                            <div id="Textarea-WordsWithTooltips"></div>
                            <textarea readonly id="Textarea-SelectMode" type="text">
                            </textarea>
                        </div>
                    </div>
                    <div class="row height-count row-text" style="margin-top: 2.5vh; margin-bottom: 2.5vh;">
                        <nav aria-label="TextPagination">
                            <ul id="TextPaginationElements" class="pagination justify-content-center pagination-lg">
                                <!-- <li class="page-item">
                                    <a class="page-link" href="" tabindex="-1" aria-disabled="true">Previous</a>
                                </li>
                                <li class="page-item"><a class="page-link" href="">1</a></li>
                                <li class="page-item"><a class="page-link" href="">2</a></li>
                                <li class="page-item"><input id="PageChooseInput" type="text" value="3"/></li>
                                <li class="page-item"><a class="page-link" href="">4</a></li>
                                <li class="page-item"><a class="page-link" href="">5</a></li>
                                <li class="page-item">
                                    <a class="page-link" href="">Next</a>
                                </li> -->
                            </ul>
                        </nav>
                    </div>
                </div>
                <div id="RightPanel" class="col option-panel-right" style="padding-left: 0px !important; padding-right: 0px !important;">
                    <div class="menu-header">
                        <i class="fa-4x bi bi-textarea-t"></i>
                    </div>
                    <ul id="ListRightPanel" class="list-unstyled">
                        <li>
                            <h6 class="RightPanel-header">LANG</h6>
                        </li>
                        <li class="nativeLang english nativeLang-active">
                            <h6 class="nativeLangOption">English</h6>
                        </li>
                        <li class="nativeLang polish">
                            <h6 class="nativeLangOption">Polish</h6>
                        </li>
                        <li class="nativeLang french">
                            <h6 class="nativeLangOption">French</h6>
                        </li>
                        <li class="nativeLang german">
                            <h6 class="nativeLangOption">German</h6>
                        </li>
                        <li class="nativeLang italian">
                            <h6 class="nativeLangOption">Italian</h6>
                        </li>
                        <li class="nativeLang spanish">
                            <h6 class="nativeLangOption">Spanish</h6>
                        </li>
                        <li>
                            <h6 class="RightPanel-header">MODE</h6>
                        </li>
                        <li id="toggle-button-first" class="toggle-button toggle-button-active">
                            <i class="bi bi-journal-richtext"></i>
                            <h6>Dictionary</h6>
                        </li>
                        <li class="toggle-button">
                            <i class="bi bi-journal-plus"></i>
                            <h6>Custom <br />Select</h6>
                        </li>
                        <li>
                            <h6 class="RightPanel-header">TEXT</h6>
                        </li>
                        <li class="option-button" id="SaveTextButton">
                            <i class="bi bi-folder-plus"></i>
                            <h6>Save Text</h6>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="Flashcards" class="row height-count row-non-text">
                <div class="col-12">
                    <input id="SetTitle" type="text" class="form-control search-input" placeholder="Add Title, For Example 'Words - Culture'"/>
                    <textarea id="DescriptionInput" placeholder="Add Description To Your Collection" type="text"></textarea>
                    <ul id="FlashcardList" class="list-unstyled">

                    </ul>
                    <button id="SubmitFlashcards" class="table_button"><span>Create & Save</span><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    </section>
    <div id="ContentWrapper" style="display: none;">
        <div id="PocketDictionary" class="container-fluid padding-container-fluid-bottom" 
            style="padding-top: 34.5px; padding-right: 50px; padding-bottom: 0px; background-color: #f6f7fb; display: block; position: relative;">
            <div class="input-group mx-auto compact-dictionary-search-bar">
                <span class="compact-dictionary-search-bar-graphic">
                    <i class="fas fa-spell-check"></i>
                </span>
                <input type="text" class="form-control search-input compact-dictionary-search-bar-input" 
                placeholder="Write English Word..." aria-label="Find Word" aria-describedby="FindWordButton">
                <button class="btn FindWordButton compact-dictionary-search-bar-button" 
                type="button" id="FindWordButton">
                    <i id="search-icon" class="fas fa-search compact-dictionary-search-bar-icon"></i>
                </button>
            </div>
            <div class="compact-dictionary-result-wrapper">
                <div class="compact-dictionary-result">
                    
                </div>
                <div class="compact-dictionary-related-phrases">
                    <h6 class="compact-dictionary-related-phrases-header">Related Phrases</h6>
                    <div class="compact-dictionary-related-phrases-details">
                        
                    </div>
                    <div class="compact-dictionary-related-phrases-empty">
                        <i class="fas fa-sad-tear"></i>
                        <h6>Sorry, Nothing Found...</h6>
                    </div>
                </div>
            </div>
            <div class="loading-or-error">
                <div class="loading-screen"></div>
                <h6>Looking for the results...</h6>
            </div>
            <div class="loading-or-error">
                <i class="bi bi-search"></i>
                <h6>
                    Type any english, unknown word above and wait!
                    </br>
                    (Create custom materials freely by simply clicking blue segments of the dictionary)
                </h6>
            </div>
            <div class="loading-or-error">
                <i class="fas fa-sad-tear"></i>
                <h6>
                    We haven't found anything. Please try again later...
                    </br>
                    (Keep in mind that only english words are avaliable in dictionary mode at this point)
                </h6>
            </div>
            <div class="compact-dictionary-materials-panel">
                <div class="compact-dictionary-materials-header">
                    <h6>Your Collection Creator</h6>
                    <i class="fas fa-window-minimize" data-bs-toggle="tooltip" 
                        data-bs-placement="top" title="Minimize"></i>
                    <i class="fas fa-window-restore" data-bs-toggle="tooltip" 
                        data-bs-placement="top" title="Dual Screen"></i>
                    <i class="fas fa-expand" data-bs-toggle="tooltip" 
                        data-bs-placement="top" title="Maximize"></i>
                </div>
                <ul id="CollectionElementsListDictionary" class="list-unstyled">

                </ul>
                <div class="empty-search">
                    <img class="img-fluid" src="images/empty-folder-quarere.png" />
                    <h2>There's nothing here yet...</h2>
                </div>
            </div>
        </div>
        <div id="RightWrapper">
            <div id="LeftBar">
                <li class="read-text-mode-change read-text-mode-change-active" style="margin-top: 2vh;">
                    <i class="fas fa-globe-americas"></i>
                    <h6>Pocket</br>Dictionary</h6>
                </li>
                <li class="read-text-mode-change">
                    <i class="fas fa-book-open"></i>
                    <h6>Interactive</br>Text</h6>
                </li>
                <i class="fas fa-language left-bar-icon"></i>
                <li class="nativeLang english nativeLang-active">
                    <h6 class="nativeLangOption">English</h6>
                </li>
                <li class="nativeLang polish">
                    <h6 class="nativeLangOption">Polish</h6>
                </li>
                <li class="nativeLang french">
                    <h6 class="nativeLangOption">French</h6>
                </li>
                <li class="nativeLang german-alt">
                    <h6 class="nativeLangOption">German</h6>
                </li>
                <li class="nativeLang italian">
                    <h6 class="nativeLangOption">Italian</h6>
                </li>
                <li class="nativeLang spanish">
                    <h6 class="nativeLangOption">Spanish</h6>
                </li>
            </div>
            <div id="CompactDictionary">
                <div class="compact-dictionary-div">
                    <h2 class="compact-dictionary-heading">Pocket Dictionary</h2>
                    <h6 class="compact-dictionary-info">
                        <i class="fas fa-info-circle"></i> Designed for creating custom collection materials from chosen dictionary data.
                    </h6>
                    <h6 class="compact-dictionary-info">
                        <i class="fas fa-info-circle"></i> Currently supports only english words that can be translated for languages provided on the left!
                    </h6>
                </div>
                <div class="compact-dictionary-div">
                    <h2 class="compact-dictionary-heading">
                        <i style="padding-right: 0.75vw" class="bi bi-sliders"></i> Settings
                    </h2>
                    <h4 class="compact-dictionary-subheading">
                        Maximum Amount Of:
                    </h4>
                    <div class="input-group compact-dictionary-settings-option">
                        <span class="input-group-text">Examples</span>
                        <input type="text" class="form-control" id="ExamplesSettings" placeholder="1 - Max">
                    </div>
                    <div class="input-group compact-dictionary-settings-option">
                        <span class="input-group-text">Synonyms</span>
                        <input type="text" class="form-control" id="SynonymsSettings" placeholder="1 - Max">
                    </div>
                    <div class="input-group compact-dictionary-settings-option">
                        <span class="input-group-text">Senses</span>
                        <input type="text" class="form-control" id="SensesSettings" placeholder="1 - Max">
                    </div>
                    <button class="btn compact-dictionary-save-button" type="button" id="SettingsSave">
                        Save Changes <i class="fas fa-check-double"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- <section id="Flashcards">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <ul class="list-unstyled">
                        <li class="flashcard mx-auto">
                            <div class="col-6" style="padding-right: 25px;">
                                <div class="header-flashcard">
                                    <h4>1</h4>
                                </div>
                                <div class="top-flashcard-element">
                                    <input value="" type="text" class="Quarere-universal-input" placeholder="Word/Phrase...">
                                    <label class="Quarere-universal-label">Term</label>
                                </div>
                                <div class="input-group mt-3">
                                    <div class="input-group-text flashcard-checkbox">
                                        <input class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input placeholder="Synonyms..." type="text" class="form-control Quarere-universal-input checkbox-input"/>
                                </div>
                                <div class="input-group mt-1">
                                    <div class="input-group-text flashcard-checkbox">
                                        <input class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <div class="form-floating">
                                        <textarea class="form-control textarea-flashcard" placeholder="for-label" style="height: 114px"></textarea>
                                        <label class="textarea-label-flashcard">Add Exemplary Usage</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6" style="padding-left: 25px;">
                                <div class="header-flashcard header-icons">                                   
                                    <i class="fa-lg bi bi-plus-circle-dotted"></i>
                                    <i class="fa-lg bi bi-trash"></i>
                                </div>
                                <div class="top-flashcard-element">
                                    <input placeholder="Definition..." type="text" class="Quarere-universal-input"/>
                                    <label class="Quarere-universal-label">Meaning</label>
                                </div>
                                <div class="input-group mt-3">
                                    <div class="input-group-text flashcard-checkbox">
                                        <input class="form-check-input mt-0" type="checkbox" value="">
                                    </div>                                   
                                    <input placeholder="Native Language Definition..." type="text" class="form-control Quarere-universal-input checkbox-input"/>                                    
                                </div>
                                <div class="input-group mt-1">
                                    <div class="input-group-text flashcard-checkbox">
                                        <input class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <div class="context-chosing">
                                        <h6>When discussing this topic in a training course, a German trainee and a British trainee got into a hot debate about whether it was appropriate for someone with a doctorate to use the corresponding title on their business card.</h6>
                                        <h6>The best thing to do is to listen and observe how your conversation partner addresses you and, if you are still unsure, do not be afraid to ask them how they would like to be addressed.</h6>
                                    </div>
                                    <div class="form-floating">
                                        <textarea class="form-control textarea-flashcard" placeholder="for-label" style="height: 84px"></textarea>
                                        <label class="textarea-label-flashcard">"InContext" Usage</label>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section> -->
    <!-- Modal Error -->
    <div class="modal" id="ModalError" tabindex="-1" aria-labelledby="ModalError" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header modal-header-Quarere">
                    <h5 class="modal-title" id="ModalLabel">Hey User, Watch Out!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="close-modal fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn close-button-modal" data-bs-dismiss="modal">Ok, Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" id="ModalAuth" tabindex="-1" aria-labelledby="ModalAuth" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header modal-header-Quarere">
                    <h5 class="modal-title">Hey User, Watch Out!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="close-modal fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn close-button-modal modal-auth-button" data-bs-dismiss="modal">Login</button>
                </div>
            </div>
        </div>
    </div>
    <script src="jQuery/jquery-3.6.0.min.js"></script>
    <script src="jQuery/jquery-ui.js"></script>
    <script src="bootstrap/js/popper.min.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <script src="JavaScript/UserAuth.js"></script>
    <script src="JavaScript/ReadText.js"></script>
    <script src="JavaScript/CreateCollection.js"></script>
    <script src="JavaScript/PocketDictionary-CreateCollection.js"></script>
</asp:Content>
