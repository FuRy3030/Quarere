<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="OpenedUserCollection.aspx.cs" Inherits="Quarere.Formularz_sieci_Web2" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/SharedStyles.css" rel="stylesheet" />
    <link href="css/NavbarStyles.css" rel="stylesheet" />
    <link href="css/UserCollectionEdit.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <style>
        body {
            background-color: #071436fa;
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
    <div class="container-fluid padding-container-fluid-bottom" style="padding-top: 38px;">
        <div class="row">
            <div class="col-9 padding-column" id="CollectionData">
                <div class="input-group w-100" id="TitleGroup">
                    <div class="flex-input-box">
                        <input readonly id="TitleInput" value="" type="text" class="Quarere-universal-input Quarere-dark-input" placeholder="Collection Title...">
                        <button class="btn btn-outline-secondary edit-button" type="button" id="EditButtonTitle"><i class="bi bi-pencil-fill"></i></button>
                        <!-- <label class="Quarere-universal-label Quarere-dark-label">Title</label> -->
                    </div>
                </div>
                <div class="col-12" style="padding: 1vh 2vw 1vh 2vw !important; margin-bottom: 2.2vh;">
                    <div class="flex-input-box" style="padding: 0px !important;">
                        <textarea readonly id="CollectionDescription" rows="3" placeholder="Description"></textarea>
                        <button class="btn btn-outline-secondary edit-button" type="button" id="DescriptionEdit"><i class="bi bi-pencil-fill"></i></button>
                    </div>
                </div>
                <div class="col-12" id="AdditionalInfoContainer" style="padding: 0vh 2vw 0vh 2vw">
                    <div>
                        <h5 class="additional-info-collection" style="padding-right: 0.55vw">10 Terms,</h5>
                        <h5 class="additional-info-collection">15th of August 2022 15:32:20</h5>
                    </div>
                    <div class="input-group mx-auto" id="FlashcardSearch">
                        <input type="text" class="form-control search-input" placeholder="Word/Phrase..." 
                            aria-label="Find Collection/Text" aria-describedby="FindWordButton" id="FlashcardSearchInput">
                        <button class="btn FindWordButton FindCollectionButton" aria-expanded="false" type="button">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <div>
                        <select class="form-select dark-select" id="UserCollectionSelect" aria-label="Filter Method">
                            <option value="1" selected>All</option>
                            <option value="2">Favourite</option>
                            <option value="3">Not Favourite</option>
                        </select>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="col-12" id="ProgressTrackerMenu">
                    <div id="ProgressTrackerMenuTop">
                        <span id="ProgressTrackerMenuTitle">ProgressTracker <i class="bi bi-spellcheck"></i>:</span>
                        <div class="progress-tracker-display-option progress-tracker-display-option_universal selected">
                            <svg class="progress-ring">
                                <circle
                                class="progress-ring__circle_universal"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                                />
                            </svg>
                            <span>All</span>
                        </div>
                        <div class="progress-tracker-display-option progress-tracker-display-option_new">
                            <svg class="progress-ring">
                                <circle
                                class="progress-ring__circle_new"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                                />
                            </svg>
                            <span>New</span>
                        </div>
                        <div class="progress-tracker-display-option progress-tracker-display-option_not-remembered">
                            <svg class="progress-ring">
                                <circle
                                class="progress-ring__circle_not-remembered"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                                />
                            </svg>
                            <span>Unfamiliar</span>
                        </div>
                        <div class="progress-tracker-display-option progress-tracker-display-option_to-be-repeated">
                            <svg class="progress-ring">
                                <circle
                                class="progress-ring__circle_to-be-repeated"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                                />
                            </svg>
                            <span>+/- Remembered</span>
                        </div>
                        <div class="progress-tracker-display-option progress-tracker-display-option_remembered">
                            <svg class="progress-ring">
                                <circle
                                class="progress-ring__circle_remembered"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                                />
                            </svg>
                            <span>Understood</span>
                        </div>
                        <div class="progress-tracker-display-option progress-tracker-display-option_learnt">
                            <svg class="progress-ring">
                                <circle
                                class="progress-ring__circle_learnt"
                                stroke="blue"
                                stroke-width="3"
                                fill="transparent"
                                r="0.5vw"
                                cx="0.65vw"
                                cy="0.65vw"
                                />
                            </svg>
                            <span>Mastered</span>
                        </div>
                    </div>
                </div>
                <div id="CollectionElementsList" style="position: relative;">
                    <div class="col-12 padding-column empty-results" style="margin-bottom: 2vh; display: none;">
                        <img src="images/empty-folder-quarere.png" class="image-fluid"/>
                        <h6>There's Nothing Here</h6>
                    </div>
                    <!-- <div class="col-12 full-flashcard">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <div class="collection-item-word-meaning">
                                        <span id="left">Word</span>
                                        <span id="right">Meaning</span>
                                        <svg class="progress-ring">
                                            <circle
                                              class="progress-ring__circle"
                                              stroke="blue"
                                              stroke-width="4"
                                              fill="transparent"
                                              r="2.25vw"
                                              cx="2.5vw"
                                              cy="2.5vw"
                                            />
                                        </svg>
                                        <i class="bi bi-star-fill left-icon"></i>
                                        <i class="bi bi-trash2 right-icon"></i>
                                    </div>
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <li class="flashcard mx-auto">
                                        <div class="col-6" style="padding-right: 25px;">
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
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
                <div class="col-12 full-flashcard two-parts-button-area">
                    <button class="two-parts-button" id="AddCollectionElementButton">
                        <span class="add-collection-element-text">Add New Term / Phrase</span>
                        <span class="add-collection-element-icon"><i class="fas fa-plus"></i></span>
                    </button>
                </div>
            </div>
            <div class="col-3 padding-column" id="UserTexts">
                <h1 id="TextsListHeader">Your Texts</h1>
                <div style="overflow-y: auto; overflow-x: hidden;" id="TextList">
                    <!-- <div class="user-text-open-with-collection">
                        <h3>Text Title</h3>
                        <h2><i class="bi bi-journal-richtext"></i></h2>
                    </div>
                    <div class="user-text-open-with-collection">
                        <h3>Text Title</h3>
                        <h2><i class="bi bi-journal-richtext"></i></h2>
                    </div>
                    <div class="user-text-open-with-collection">
                        <h3>Text Title</h3>
                        <h2><i class="bi bi-journal-richtext"></i></h2>
                    </div> -->
                </div>
                <div class="full-flashcard two-parts-button-area" style="padding: 0px !important;">
                    <button class="two-parts-button" id="EditWithTextButton">
                        <span class="add-collection-element-text" id="EditWithText-Text">Edit With Text</span>
                        <span class="add-collection-element-icon" id="EditWithText-Icon"><i class="bi bi-pencil-square"></i></span>
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
    <script src="JavaScript/NavbarHandlerJS.js"></script>
    <script src="JavaScript/UserAuth.js"></script>
    <script src="JavaScript/UserCollectionEdit.js"></script>
</asp:Content>
