<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="Formularz sieci Web1.aspx.cs" Inherits="Quarere.Formularz_sieci_Web117" %>
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
    <div id="ContentWrapper">
        <div id="CollectionCreator" class="container-fluid padding-container-fluid-bottom" style="padding-top: 34.5px; padding-right: 50px; background-color: #f6f7fb;">
            <input id="TitleInput" value="" type="text" 
                class="Quarere-universal-input" 
                placeholder="Add Collection Title..."
            />
            <textarea id="CollectionDescription" rows="4" placeholder="Add Description..."></textarea>
            <div id="ModeChoose" class="btn-group" role="group">
                <button id="Manual" type="button" class="btn mode-select-button mode-select-button-active">Manual Filling</button>
                <button id="Auto" type="button" class="btn mode-select-button">Auto Filling</button>
            </div>
            <div class="language-options-menu">
                <h4>Languages <i class="fas fa-language"></i>:</h4>
                <li class="nativeLang english-alt nativeLang-active">
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
                <li class="nativeLang italian-alt">
                    <h6 class="nativeLangOption">Italian</h6>
                </li>
                <li class="nativeLang spanish">
                    <h6 class="nativeLangOption">Spanish</h6>
                </li>
            </div>
            <div id="SaveCollection">
                <h6>
                    You have <span style="color: #00fff3;">0</span> elements in your collection
                </h6>
                <button id="SaveCollectionButton" class="two-parts-button">
                    <span id="SaveCollectionButtonFirstPart" class="add-collection-element-text">
                        Save Collection
                    </span>
                    <span class="add-collection-element-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </span>
                </button>
            </div>
            <ul id="CollectionElementsList" class="list-unstyled">
                <!-- <li class="flashcard mx-auto">
                    <div class="col-6" style="padding-right: 25px;">
                        <div class="header-flashcard flashcard-heading">
                            <h4 style="font-size: 1.5vw;">1</h4>
                        </div>
                        <div class="top-flashcard-element">
                            <input value="" type="text" class="Quarere-universal-input" placeholder="Word/Phrase...">
                            <label class="Quarere-universal-label">Term</label>
                        </div>
                        <div class="input-group">
                            <div class="input-group-text flashcard-checkbox">
                                <input class="form-check-input mt-0" type="checkbox" value="">
                            </div>
                            <input placeholder="Synonyms..." type="text" class="form-control Quarere-universal-input checkbox-input"/>
                        </div>
                        <div class="input-group mt-1">
                            <div class="input-group-text flashcard-checkbox">
                                <input class="form-check-input mt-0" type="checkbox" value="">
                            </div>
                            <div class="form-floating textarea-floating">
                                <textarea class="form-control textarea-flashcard" placeholder="for-label"></textarea>
                                <label class="textarea-label-flashcard">Exemplary Usage</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-6" style="padding-left: 25px;">
                        <div class="header-flashcard header-icons flashcard-heading">        
                            <i class="far fa-clone icon-flashcard"></i>                           
                            <i class="far fa-trash-alt icon-flashcard"></i>
                        </div>
                        <div class="top-flashcard-element">
                            <input placeholder="Definition..." type="text" class="Quarere-universal-input"/>
                            <label class="Quarere-universal-label">Meaning</label>
                        </div>
                        <div class="input-group">
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
                            <div class="form-floating textarea-floating">
                                <textarea class="form-control textarea-flashcard" placeholder="for-label"></textarea>
                                <label class="textarea-label-flashcard">"InContext" Usage</label>
                            </div>
                        </div>
                    </div>
                </li> -->
            </ul>
            <div class="empty-search">
                <img class="img-fluid" src="images/empty-folder-quarere.png" />
                <h2>There's nothing here yet...</h2>
            </div>
            <div class="col-12 full-flashcard two-parts-button-area">
                <button class="two-parts-button" id="AddCollectionElementButton">
                    <span class="add-collection-element-text">Add New Term / Phrase</span>
                    <span class="add-collection-element-icon"><i class="fas fa-plus"></i></span>
                </button>
            </div>
            <div class="col-12 full-flashcard two-parts-button-area finding-results-area" style="flex-wrap: wrap;">
                <button class="two-parts-button" id="FindAndAddWordButton" style="display: none; background-color: white;">
                    <input type="text" value="" id="WordSearchBestFit" placeholder="Type the word we have to look for..." />
                    <span class="add-collection-element-icon"><i class="fas fa-search"></i></span>
                </button>
                <div id="SearchResults">
                    <div class="loading-or-error">
                        <div class="loading-screen"></div>
                        <h6>Looking for the results...</h6>
                    </div>
                    <div class="loading-or-error">
                        <i class="fas fa-sad-tear"></i>
                        <h6>
                            We haven't found anything. Please try again later...
                            </br>
                            (Keep in mind that only english words are avaliable in auto filling at this point)
                        </h6>
                    </div>
                    <!-- <div class="single-results-row">
                        <div class="single-result">
                            <h6>Part Of Speech: </h6>
                            <h6>Phonetics: </h6>
                            <h6>Meaning: </h6>
                            <h6>Synonyms: </h6>
                            <h6>Foreign Meaning: </h6>
                            <h6>Example: </h6>
                        </div>
                    </div>
                    <h4>Pick Desired Result <i class="bi bi-arrow-bar-up"></i></h4> -->
                </div>
            </div>
        </div>
        <div id="PocketDictionary" class="container-fluid padding-container-fluid-bottom" 
        style="padding-top: 34.5px; padding-right: 50px; padding-bottom: 0px; background-color: #f6f7fb; display: none; position: relative;">
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
                    <!-- <div class="compact-dictionary-result-header">
                        <h6 class="compact-dictionary-result-header-word">Make</h6>
                        <h6 class="compact-dictionary-result-header-sound">
                            <i class="bi bi-volume-up-fill"></i>
                        </h6>
                        <h6 class="compact-dictionary-result-header-phonetic">/luuk/</h6>
                        <h6 class="compact-dictionary-result-header-level">
                            <i class="fas fa-layer-group"></i> A2
                        </h6>
                    </div>
                    <div class="compact-dictionary-result-origin">
                        <h6>
                            <i class="bi bi-hourglass-split"></i> Old English <i>trēow</i>, <i>trēo</i> : from a Germanic variant of an Indo-European root shared by Greek <i>doru</i> ‘wood, spear’, <i>drus</i> ‘oak’.
                        </h6>
                    </div>
                    <div class="compact-dictionary-result-pos-variant">
                        <div class="compact-dictionary-result-pos-variant-header">
                            <i class="fas fa-language pos-variant-icon"></i>
                            <div class="compact-dictionary-result-pos-variant-header-details">
                                <h6>
                                    <span class="compact-dictionary-bold">Part Of Speech:</span> Verb 
                                </h6>
                                <h6>
                                    <span class="compact-dictionary-bold">Foreign Meaning:</span> robić, tworzyć
                                </h6>
                                <h6>
                                    <span class="compact-dictionary-bold">Conjugation:</span>
                                    <span class="compact-dictionary-italic">Present 3rd Person:</span> 
                                    <span class="compact-dictionary-movable">Makes</span>,
                                    <span class="compact-dictionary-italic">Past Tense:</span>
                                    <span class="compact-dictionary-movable">Made</span>,
                                    <span class="compact-dictionary-italic">Past Participle:</span>
                                    <span class="compact-dictionary-movable">Made</span>,
                                    <span class="compact-dictionary-italic">Gerund:</span>
                                    <span class="compact-dictionary-movable">Making</span>.
                                </h6>
                            </div>
                        </div>
                        <div class="compact-dictionary-result-pos-variant-sense">
                            <span class="pos-variant-icon sense-icon">1.</span>
                            <div class="compact-dictionary-result-pos-variant-sense-details">
                                <h6>
                                    <span class="compact-dictionary-bold">Meaning:</span>
                                    <span class="sense-element-selectable">A woody perennial plant, typically having a single stem or trunk growing to a considerable height and bearing lateral branches at some distance from the ground.</span>
                                </h6>
                                <h6>
                                    <span class="compact-dictionary-bold">
                                        Synonyms:
                                        <span class="sense-element-selectable">sapling</span>,
                                        <span class="sense-element-selectable">conifer</span>,
                                        <span class="sense-element-selectable">evergreen</span>,
                                        <span class="sense-element-selectable">bush</span>,
                                        <span class="sense-element-selectable">shrub</span>.
                                    </span>
                                </h6>
                                <div class="compact-dictionary-sense-examples">
                                    <div>
                                        <i class="fas fa-comment-dots sense-element-img"></i>
                                        <h5 class="sense-element-img-comment">Examples</h5>
                                    </div>
                                    <h6>
                                        <span class="sense-element-selectable">His applications included computing the maximum height a tree can grow.</span></br>
                                        <span class="sense-element-selectable">Branches hang into the village from trees growing outside - trees we used for fresh fruit and safety.</span>
                                    </h6>
                                </div>
                                <div class="subsense-roller">
                                    <i style="padding-right: 1vw;" class="fas fa-sort-alpha-down subsense-roller-icon"></i>
                                    <h4 class="compact-dictionary-sense-subsenses-shower">
                                        <span>Show Subsenses</span>
                                    </h4>
                                    <i style="padding-left: 1vw;" class="fas fa-sort-alpha-down subsense-roller-icon"></i>
                                </div>
                            </div>
                        </div>
                        <div class="compact-dictionary-result-pos-variant-sense">
                            <span class="pos-variant-icon sense-icon">2.</span>
                            <div class="compact-dictionary-result-pos-variant-sense-details">
                                <h6>
                                    <span class="compact-dictionary-bold">Meaning:</span>
                                    <span class="sense-element-selectable">A woody perennial plant, typically having a single stem or trunk growing to a considerable height and bearing lateral branches at some distance from the ground.</span>
                                </h6>
                                <h6>
                                    <span class="compact-dictionary-bold">
                                        Synonyms:
                                        <span class="sense-element-selectable">sapling</span>,
                                        <span class="sense-element-selectable">conifer</span>,
                                        <span class="sense-element-selectable">evergreen</span>,
                                        <span class="sense-element-selectable">bush</span>,
                                        <span class="sense-element-selectable">shrub</span>.
                                    </span>
                                </h6>
                                <div class="compact-dictionary-sense-examples">
                                    <div>
                                        <i class="fas fa-comment-dots sense-element-img"></i>
                                        <h5 class="sense-element-img-comment">Examples</h5>
                                    </div>
                                    <h6>
                                        <span class="sense-element-selectable">His applications included computing the maximum height a tree can grow.</span></br>
                                        <span class="sense-element-selectable">Branches hang into the village from trees growing outside - trees we used for fresh fruit and safety.</span>
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
                <div class="compact-dictionary-related-phrases">
                    <h6 class="compact-dictionary-related-phrases-header">Related Phrases</h6>
                    <div class="compact-dictionary-related-phrases-details">
                        <!-- <div class="compact-dictionary-related-phrases-details-phrase">
                            <span class="compact-dictionary-phrase">
                                <i class="fas fa-chevron-right"></i> Have it made <i class="fas fa-external-link-alt icon-link"></i>
                            </span>
                            <span class="compact-dictionary-phrase-meaning">
                                <i class="far fa-lightbulb"></i> Be very rich.
                            </span>
                            <span class="compact-dictionary-phrase-example">
                                We're not going to pay for it—we're not made of money.
                            </span>
                        </div>
                        <div class="compact-dictionary-related-phrases-details-phrase">
                            <span class="compact-dictionary-phrase">
                                <i class="fas fa-chevron-right"></i> Be made up <i class="fas fa-external-link-alt icon-link"></i>
                            </span>
                            <span class="compact-dictionary-phrase-meaning">
                                <i class="far fa-lightbulb"></i> Be delighted.
                            </span>
                            <span class="compact-dictionary-phrase-example">
                                We're made up about the baby.
                            </span>
                        </div>
                        <div class="compact-dictionary-related-phrases-details-phrase">
                            <span class="compact-dictionary-phrase">
                                <i class="fas fa-chevron-right"></i> Be made of money <i class="fas fa-external-link-alt icon-link"></i>
                            </span>
                        </div> -->
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
                <li class="create-collection-mode-change" style="margin-top: 2vh;">
                    <i class="fas fa-globe-americas"></i>
                    <h6>Interactive</br>Dictionary</h6>
                </li>
                <li class="create-collection-mode-change create-collection-mode-change-active">
                    <i class="fas fa-folder-open"></i>
                    <h6>Collection</br>Creator</h6>
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
    <script src="jQuery/jquery-3.6.0.min.js"></script>
    <script src="jQuery/jquery-ui.js"></script>
    <script src="bootstrap/js/popper.min.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <script src="JavaScript/NavbarHandlerJS.js"></script>
    <script src="JavaScript/UserAuth.js"></script>
    <script src="JavaScript/CreateCollection.js"></script>
    <script src="JavaScript/PocketDictionary-CreateCollection.js"></script>
</asp:Content>
