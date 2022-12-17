<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="LearningMenu.aspx.cs" Inherits="Quarere.Formularz_sieci_Web113" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/SharedStyles.css" rel="stylesheet" />
    <link href="css/NavbarStyles.css" rel="stylesheet" />
    <link href="css/LearningMenu.css" rel="stylesheet" />
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
    <div class="container-fluid padding-container-fluid-bottom" style="padding-top: 34.5px;">
        <div class="row">
            <div class="col-3 padding-column">
                <div id="LearningModeSelector">
                    <h3 id="LearningModeSelectorHeading"><i class="fas fa-graduation-cap"></i> Mode</h3>
                    <ul class="list-unstyled" style="margin-bottom: 0px !important;">
                        <li class="learning-mode-menu-element learning-mode-menu-element-selected">
                            <i class="bi bi-collection"></i>
                            <span>Flashcards</span>
                        </li>
                        <li class="learning-mode-menu-element">
                            <i class="bi bi-card-checklist"></i>
                            <span>Gap Filler</span>
                        </li>
                        <li class="learning-mode-menu-element">
                            <i class="bi bi-puzzle"></i>
                            <span>Matcher</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-9 padding-column" id="RightSideLearningMenu">
                <div class="flex-header">
                    <div class="col-8 padding-column">
                        <div class="input-group mx-auto">
                            <input id="SetsSearch" type="text" class="form-control search-input" placeholder="Collection Name..." 
                                aria-label="Find Collection/Text" aria-describedby="FindWordButton">
                            <button class="btn FindWordButton FindCollectionButton" aria-expanded="false" type="button">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-4 padding-column">
                        <select class="form-select dark-select" id="LearningSelect" aria-label="Sorting Method">
                            <option value="1">Newest</option>
                            <option value="2" selected>Oldest</option>
                            <option value="3">Terms Ascending</option>
                            <option value="4">Terms Descending</option>
                        </select>
                    </div>
                </div>
                <div class="row padding-column" id="Collections">
                    <div class="empty-search">
                        <img src="images/cat-quarere.png" />
                        <h2>Ups, There's nothing here...</h2>
                    </div>
                    <!-- <div class="col-4 collection-tile-column">
                        <div class="collection-tile">
                            <div class="collection-tile__content">          
                              <div class="collection-tile__front">
                                <h3 class="collection-tile__title">The Fair</h3>
                              </div>                            
                              <div class="collection-tile__back">
                                <p class="card__body">Hello</p>
                              </div>                             
                            </div>
                          </div>
                    </div>
                    <div class="col-4 collection-tile-column">
                        <div class="collection-tile">
                            <div class="collection-tile__content">          
                                <div class="collection-tile__front">
                                    <h3 class="collection-tile__title">The Fair</h3>
                                </div>                            
                                <div class="collection-tile__back">
                                    <div class="collection-buttons">
                                        <h3 class="button-configure">Configure <i class="bi bi-tools"></i></h3>
                                        <div class="flashcards-info">
                                            <h6>Flashcards Front: Word / Phrase</h6>
                                            <i class="bi bi-arrow-down-up"></i>
                                            <h6>Flashcards Back: Meaning</h6>
                                        </div>
                                        <h3 class="button-select">Select <i class="bi bi-cursor-fill"></i></h3>
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
                                            <label class="form-check-label">
                                                Example
                                            </label>
                                        </div>
                                        <div class="form-check collection-tile-checkbox">
                                            <input class="form-check-input" type="checkbox" value="">
                                            <label class="form-check-label">
                                                Text Example
                                            </label>
                                        </div>
                                    </div>
                                </div>                             
                            </div>
                          </div>
                    </div> -->
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
    <script src="JavaScript/LearningMenu.js"></script>
</asp:Content>
