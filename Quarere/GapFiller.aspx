﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="GapFiller.aspx.cs" Inherits="Quarere.Formularz_sieci_Web115" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/SharedStyles.css" rel="stylesheet" />
    <link href="css/NavbarStyles.css" rel="stylesheet" />
    <link href="css/GapFiller.css" rel="stylesheet" />
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
            <div class="col-12" id="WordToFillList">
                <div id="WordToFillListHeader">
                    <span id="WordToFillListHeader-Left" class="option-active mode-toggler">Dragging Mode <i class="bi bi-arrows-move"></i></span>
                    <span>Available Words</span>
                    <i id="RestartIcon" class="bi bi-arrow-clockwise" data-bs-toggle="tooltip" data-bs-placement="top" title="Restart"></i>
                    <span id="WordToFillListHeader-Right" class="mode-toggler">Writing Mode <i class="bi bi-pen"></i></span>
                </div>
                <div id="WordsList">
                    <div class="empty-indicator">All words has been used!</div>
                </div>
            </div>
            <div class="col-12" id="Sentences">
                <ul class="list-unstyled">
                    <!-- <li class="sentence">
                        <span>1. He</span>
                        <div class="draggable-word-droppable"></div>
                        <span>my office.</span>
                    </li> -->
                </ul>
            </div>
            <div  class="col-12" id="Buttons">
                <button class="button-gaps-left">Edit Collection <i class="bi bi-pencil"></i></button>
                <button class="button-gaps-right">Check Answers <i class="bi bi-check2-circle"></i></button>
            </div>
        </div>
    </div>
    <script src="jQuery/jquery-3.6.0.min.js"></script>
    <script src="jQuery/jquery-ui.js"></script>
    <script src="bootstrap/js/popper.min.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <script src="JavaScript/NavbarHandlerJS.js"></script>
    <script src="JavaScript/UserAuth.js"></script>
    <script src="JavaScript/GapFiller.js"></script>
</asp:Content>
