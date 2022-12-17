<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="Flashcards.aspx.cs" Inherits="Quarere.Formularz_sieci_Web114" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/SharedStyles.css" rel="stylesheet" />
    <link href="css/NavbarStyles.css" rel="stylesheet" />
    <link href="css/Flashcards.css" rel="stylesheet" />
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
    <div class="container-fluid padding-container-fluid-bottom" style="padding-top: 65px; padding-bottom: 65px;">
        <div class="row">
            <div class="col-3 padding-column">
                <div id="FlashcardsToRepeat">
                    <h2 id="FlashcardsToRepeatHeader">Must Repeat</h2>
                    <h4 id="FlashcardsToRepeatCount">0 Elements</h4>
                    <div class="input-group mx-auto">
                        <input id="FlashcardsToRepeatSearch" type="text" class="form-control search-input" placeholder="Flashcard Content..." 
                            aria-label="Find Collection/Text" aria-describedby="FindWordButton">
                        <button class="btn FindWordButton FindCollectionButton" aria-expanded="false" type="button">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <ul class="list-unstyled flashcards-state-management-class list" id="FlashcardsToRepeatList"></ul>
                </div>
            </div>
            <div class="col-6" id="MainPanel">
                <div id="FlashcardsPile">
                    <div id="BottomPile">
                        <h1>Set Completed!</h1>
                        <i class="bi bi-journal-bookmark-fill exit-option" id="BoostrapOption"
                            data-bs-toggle="tooltip" data-bs-placement="left" title="Edit This Collection">
                        </i>
                        <i class="fas fa-user-graduate exit-option" id="FontAwesomeOption"
                            data-bs-toggle="tooltip" data-bs-placement="left" title="Change Mode">
                        </i>
                        <div class="btn-group" role="group" id="BottomPileGroup">
                            <button id="BottomPileFirst">Continue <i class="far fa-clone"></i></button>
                            <button id="BottomPileSecond">Start Again <i class="fas fa-redo-alt"></i></button>
                            <button id="BottomPileThird">Exit <i class="fas fa-external-link-alt"></i></button>
                        </div>
                    </div>
                    <!-- <div class="flashcard-learning-mode">
                        <div class="flashcard__content">          
                            <div class="flashcard__front">
                                <i class="bi bi-volume-up-fill flashcard__sound-icon"></i>
                                <h3 class="flashcard__text front-text">Word / Phrase</h3>
                                <div class="flashcard__bottom-bar"> 
                                    <div class="swipe-left">
                                        <i class="fas fa-reply"></i>
                                        <span>Repeat</span>
                                    </div>
                                    <div class="swipe-right">
                                        <span>Learned</span>
                                        <i class="fas fa-share"></i>
                                    </div>
                                </div>
                            </div>                            
                            <div class="flashcard__back">
                                <i class="bi bi-volume-up-fill flashcard__sound-icon"></i>
                                <h3 class="flashcard__text back-text">Meaning</h3>
                                <div class="flashcard__bottom-bar"> 
                                    <div class="swipe-left">
                                        <i class="fas fa-reply"></i>
                                        <span>Repeat</span>
                                    </div>
                                    <div class="swipe-right">
                                        <span>Learned</span>
                                        <i class="fas fa-share"></i>
                                    </div>
                                </div>
                            </div>                             
                        </div>
                    </div>
                    <div class="flashcard-learning-mode flashcard-learning-mode-animation">
                        <div class="flashcard__content">          
                            <div class="flashcard__front">
                                <h3 class="flashcard__front_text">Top</h3>
                            </div>                            
                            <div class="flashcard__back">
                                Hi
                            </div>                             
                        </div>
                    </div> -->
                </div>
                <div id="FlashcardsUserManagement">
                    <div class="progress" id="HowMuchFlashcardsLeftCounter">
                        <h3>10 Flashcards Left</h3>
                        <div class="progress-bar progress-bar-striped progress-bar-animated" 
                            role="progressbar"  
                            style="width: 100%">
                        </div>
                    </div>
                    <button id="FlashcardsSkip">
                        <span>SKIP REST</span>
                        <i class="fas fa-forward"></i>
                    </button>
                </div>
            </div>
            <div class="col-3 padding-column">
                <div id="LearnedFlashcards">
                    <h2 id="LearnedFlashcardsHeader">Remembered</h2>
                    <h4 id="LearnedFlashcardsCount">0 Elements</h4>
                    <div class="input-group mx-auto">
                        <input id="LearnedFlashcardsSearch" type="text" class="form-control search-input" placeholder="Flashcard Content..." 
                            aria-label="Find Collection/Text" aria-describedby="FindWordButton">
                        <button class="btn FindWordButton FindCollectionButton" aria-expanded="false" type="button">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <ul class="list-unstyled flashcards-state-management-class list" id="LearnedFlashcardsList"></ul>
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
    <script src="jQuery/jquery-ui.js"></script>
    <script src="bootstrap/js/popper.min.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <script src="JavaScript/NavbarHandlerJS.js"></script>
    <script src="JavaScript/UserAuth.js"></script>
    <script src="JavaScript/Flashcards.js"></script>
</asp:Content>
