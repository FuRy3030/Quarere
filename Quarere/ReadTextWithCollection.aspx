<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="Formularz sieci Web1.aspx.cs" Inherits="Quarere.Formularz_sieci_Web112" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/NavbarStyles.css" rel="stylesheet">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <style>
        body {
            background-color: #f6f7fb;
        } 
        #RightPanel {
            min-height: 490px !important;
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
                <div class="col" style="padding-left: 0px !important; padding-right: 0px !important;">
                    <div class="row height-count row-text">
                        <div id="TitleZone" class="col-12 text-center">
                            <h1 id="Title"></h1>
                        </div>
                    </div>
                    <div class="row height-count row-text">
                        <div class="col-12">
                            <div id="Textarea-WordsWithTooltips"></div>
                            <textarea readonly id="Textarea-SelectMode" type="text">
                            </textarea>
                        </div>
                    </div>
                </div>
                <div id="RightPanel" class="col option-panel-right" style="padding-left: 0px !important; padding-right: 0px !important;">
                    <div class="menu-header">
                        <i class="fa-4x bi bi-textarea-t"></i>
                    </div>
                    <ul id="ListRightPanel" class="list-unstyled">
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
                    </ul>
                </div>
            </div>
            <div id="Flashcards" class="row height-count row-non-text" style="display: flex;">
                <div class="col-12">
                    <ul id="FlashcardList" class="list-unstyled">

                    </ul>
                    <button id="SubmitFlashcards" class="table_button"><span>Save Changes</span><i class="fas fa-check-circle"></i></button>
                </div>
            </div>
        </div>
    </section>
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
    <script src="JavaScript/UserAuth.js"></script>
    <script src="JavaScript/ReadTextWithCollection.js"></script>
</asp:Content>
