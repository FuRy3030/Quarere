<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="Repository.aspx.cs" Inherits="Quarere.Formularz_sieci_Web19" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/SharedStyles.css" rel="stylesheet" />
    <link href="css/NavbarStyles.css" rel="stylesheet" />
    <link href="css/Repository.css" rel="stylesheet" />
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
    <div class="container-fluid padding-container-fluid-middle">
        <div class="row">
            <div class="col-12 padding-column">
                <h1 id="RepositoryHeader">My Repository</h1>
            </div>
        </div>
    </div>
    <div class="container-fluid padding-container-fluid-middle" id="Favourites">
        <div class="row" id="RowFavourites">
            <div id="RowFavouritesHeading" class="col-12 padding-column">
                <h1 id="Favourites-Text">Favourites</h1>
            </div>
            <!-- <div class="col-12 padding-column empty-favorite">
                <img src="images/empty-folder-quarere.png" class="image-fluid"/>
                <h6>There's Nothing Here Yet</h6>
                <button>Add Favorites <i class="bi bi-arrow-down"></i></button>
            </div> -->
            <!-- <div class="col-3 padding-column">
                <div class="favorite-element">
                    <i class="delete-favourite fas fa-times"></i>
                    <h6 class="favorite-title">My Collection</h6>
                    <h1 class="favorite-icon"><i class="bi bi-journals"></i></h1>
                    <h6 class="favorite-additional-info">Created 10-11-2022</h6>
                </div>
            </div>
            <div class="col-3 padding-column">
                <div class="favorite-element">
                    <i class="delete-favourite fas fa-times"></i>
                    <h6 class="favorite-title">My Collection</h6>
                    <h1 class="favorite-icon"><i class="bi bi-journals"></i></h1>
                    <h6 class="favorite-additional-info">Created 10-11-2022</h6>
                </div>
            </div>
            <div class="col-3 padding-column">
                <div class="favorite-element">
                    <i class="delete-favourite fas fa-times"></i>
                    <h6 class="favorite-title">My Collection</h6>
                    <h1 class="favorite-icon"><i class="bi bi-journal-text"></i></h1>
                    <h6 class="favorite-additional-info">Created 10-11-2022</h6>
                </div>
            </div> -->
        </div>
    </div>
    <div class="container-fluid padding-container-fluid-bottom" id="MainSearchCollections">
        <div class="row">
            <div class="col-5 text-center padding-column">
                <div class="btn-group" role="group" aria-label="">
                    <button id="AllSets" type="button" class="btn badge-repository"><i class="bi bi-grid-3x3-gap"></i> All</button>
                    <button id="AllTexts" type="button" class="btn badge-repository"><i class="bi bi-journal-text"></i> Texts</button>
                    <button id="AllCollections" type="button" class="btn badge-repository"><i class="bi bi-journals"></i> Collections</button>
                </div>
            </div>
            <div class="col-4 padding-column">
                <div class="input-group mx-auto">
                    <input id="SetsSearch" type="text" class="form-control search-input" placeholder="Collection/Text Name..." 
                        aria-label="Find Collection/Text" aria-describedby="FindWordButton">
                    <button class="btn FindWordButton FindCollectionButton" aria-expanded="false" type="button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <div class="col-3 padding-column">
                <select class="form-select dark-select" id="RepositorySelect" aria-label="Sorting Method">
                    <option value="1" selected>Newest</option>
                    <option value="2">Oldest</option>
                    <option value="3">Terms Ascending</option>
                    <option value="4">Terms Descending</option>
                </select>
            </div>
        </div>
        <div class="row" id="SetsOutput">
            <!-- <div class="col-12 padding-column collection-set">
                <div class="col-12 repository-set-body">
                    <div class="repository-set-body-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-journals" viewBox="0 0 16 16">
                            <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
                            <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"/>
                        </svg>
                    </div>
                    <div class="repository-set-body-data">
                        <h5>Title</h5>
                        <h6>10 Terms, Created 10-12-2022</h6>
                    </div>
                    <div class="repository-set-options">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="col-12 padding-column text-set">
                <div class="col-12 repository-set-body">
                    <div class="repository-set-body-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-journal-text" viewBox="0 0 16 16">
                            <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                        </svg>
                    </div>
                    <div class="repository-set-body-data">
                        <h5>Title</h5>
                        <h6>10 Terms, Created 10-12-2022</h6>
                    </div>
                    <div class="repository-set-options">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
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
    <script src="JavaScript/NavbarHandlerJS.js"></script>
    <script src="JavaScript/UserAuth.js"></script>
    <script src="JavaScript/Repository.js"></script>
</asp:Content>
