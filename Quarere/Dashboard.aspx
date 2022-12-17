<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="Quarere.Formularz_sieci_Web16" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/Dashboard.css" rel="stylesheet" />
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
    <div class="container-fluid" id="DashboardContainerMiddle">
        <div class="row">
            <div class="col-12 dashboard-column dashboard-header">
                <h1 class="dashboard-heading">Welcome Back, FuRy</h1>
                <h1 class="dashboard-heading">03-01-2022, Sunday</h1>
            </div>
        </div>
    </div>
    <div class="container-fluid" id="DashboardContainer">
        <div class="row">
            <div class="col-12 dashboard-column">
                <h1 class="dashboard-section-heading" id="DashboardSectionHeadingFirst">Recently used collections</h1>
            </div>
        </div>
        <div class="row" id="FlashcardsSets">
            <!-- <div class="col-4 dashboard-column">
                <div class="dashboard-element-flashcards">
                    <div class="black-background-handler">
                        <div class="dashboard-element-short-content">
                            <h2 class="dashboard-element-title">My awesome flashcards</h2>
                            <p class="dashboard-element-additional-info">10 Terms, Created 10-12-2021</p>
                        </div>
                        <div class="dashboard-element-content">
                            <p class="dashboard-element-body">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s put forward and which usually ends with a vote a</p>
                            <button class="btn dashboard-element-button">Learn & Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 dashboard-column" id="FlashcardsSecond">
                <div class="dashboard-element-flashcards">
                    <div class="black-background-handler">
                        <div class="dashboard-element-short-content">
                            <h2 class="dashboard-element-title">My awesome flashcards</h2>
                            <p class="dashboard-element-additional-info">10 Terms, Created 10-12-2021</p>
                        </div>
                        <div class="dashboard-element-content">
                            <p class="dashboard-element-body">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                            <button class="btn dashboard-element-button">Learn & Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 dashboard-column" id="FlashcardsThird">
                <div class="dashboard-element-flashcards">
                    <div class="black-background-handler">
                        <div class="dashboard-element-short-content">
                            <h2 class="dashboard-element-title">My awesome flashcards</h2>
                            <p class="dashboard-element-additional-info">10 Terms, Created 10-12-2021</p>
                        </div>
                        <div class="dashboard-element-content">
                            <p class="dashboard-element-body">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                            <button class="btn dashboard-element-button">Learn & Edit</button>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
        <div class="row">
            <div class="col-12 dashboard-column">
                <h1 class="dashboard-section-heading">Recently read texts</h1>
            </div>
        </div>
        <div class="row" id="Texts">
            <!-- <div class="col-4 dashboard-column">
                <div class="dashboard-element-flashcards dashboard-element-texts">
                    <div class="black-background-handler">
                        <div class="dashboard-element-short-content">
                            <h2 class="dashboard-element-title">English Book Text Practice</h2>
                            <p class="dashboard-element-additional-info">10 Terms, Created 10-12-2021</p>
                        </div>
                        <div class="dashboard-element-content">
                            <p class="dashboard-element-body">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                            <button class="btn dashboard-element-button">Continue Reading</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 dashboard-column" id="TextsSecond">
                <div class="dashboard-element-flashcards dashboard-element-texts">
                    <div class="black-background-handler">
                        <div class="dashboard-element-short-content">
                            <h2 class="dashboard-element-title">English Book Text Practice</h2>
                            <p class="dashboard-element-additional-info">10 Terms, Created 10-12-2021</p>
                        </div>
                        <div class="dashboard-element-content">
                            <p class="dashboard-element-body">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                            <button class="btn dashboard-element-button">Continue Reading</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 dashboard-column" id="TextsThird">
                <div class="dashboard-element-flashcards dashboard-element-texts">
                    <div class="black-background-handler">
                        <div class="dashboard-element-short-content">
                            <h2 class="dashboard-element-title">English Book Text Practice</h2>
                            <p class="dashboard-element-additional-info">10 Terms, Created 10-12-2021</p>
                        </div>
                        <div class="dashboard-element-content">
                            <p class="dashboard-element-body">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                            <button class="btn dashboard-element-button">Continue Reading</button>
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- <div class="col-4 dashboard-column">
                <div class="dashboard-element-empty">
                    <div class="dashboard-element-empty-content">
                        <h2>Ups, Nothing Here</h2>
                        <button class="add-dashboard-button add-collection-button">Add Text</button>
                    </div>
                </div>
            </div> -->
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
    <script src="JavaScript/UserAuth.js"></script>
    <script src="JavaScript/Dashboard.js"></script>
</asp:Content>
