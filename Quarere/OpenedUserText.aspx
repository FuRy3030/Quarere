<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="OpenedUserText.aspx.cs" Inherits="Quarere.Formularz_sieci_Web111" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/SharedStyles.css" rel="stylesheet" />
    <link href="css/NavbarStyles.css" rel="stylesheet" />
    <link href="css/UserCollectionEdit.css" rel="stylesheet" />
    <link href="css/UserTextEdit.css" rel="stylesheet" />
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
            <div class="col-9 padding-column" id="TextData">
                <div class="input-group w-100" id="TitleGroup">
                    <div class="flex-input-box">
                        <input readonly id="TitleInput" value="" type="text" class="Quarere-universal-input Quarere-dark-input" placeholder="Text Title...">
                        <button class="btn btn-outline-secondary edit-button" type="button" id="EditButtonTitle"><i class="bi bi-pencil-fill"></i></button>
                    </div>
                </div>
                <div class="col-12" style="padding: 1vh 2vw 1vh 2vw !important; margin-bottom: 2.2vh;">
                    <div class="flex-input-box" style="padding: 0px !important;">
                        <textarea readonly id="CollectionDescription" rows="3" placeholder="Description"></textarea>
                        <button class="btn btn-outline-secondary edit-button" type="button" id="DescriptionEdit"><i class="bi bi-pencil-fill"></i></button>
                    </div>
                </div>
                <div class="divider" style="margin-bottom: 2.75vh;"></div>
                <div class="col-12"  style="padding: 1vh 2vw 1vh 2vw">
                    <textarea id="Text" placeholder="Your Text..." rows="22"></textarea>
                </div>
            </div>
            <div class="col-3 padding-column" id="UserTexts">
                <h1 id="TextsListHeader">Collections</h1>
                <div style="overflow-y: auto; overflow-x: hidden;" id="TextList">
                    
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
    <script src="JavaScript/UserTextEdit.js"></script>
</asp:Content>
