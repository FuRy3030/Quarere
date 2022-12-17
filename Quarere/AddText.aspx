<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="AddText.aspx.cs" Inherits="Quarere.Formularz_sieci_Web17" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/AddText.css" rel="stylesheet">
    <link href="css/NavbarStyles.css" rel="stylesheet">
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
    <section id="TextUpload">
        <div class="container">
            <div class="row">
                <div id="importText" class="col-12 card">
                    <h1 class="import-header">Upload Method</h1>
                    <div id="importSelectGroup" class="input-group">
                        <label class="input-group-text label-input" for="importSelect">
                            <span>Upload Via</span><i class="fas fa-file-upload"></i>
                        </label>
                        <select id="importSelect" class="form-select">
                          <option class="option" value="text" selected>Text</option>
                          <option class="option" value="application/pdf doc">PDF Document</option>
                          <option class="option" value="application/pdf scan">PDF Scan</option>
                          <option class="option" value="image/jpg image/png image/jpeg img">Image/Photo</option>
                        </select>
                            <p id="topP" class="text-muted import-comment">
                                Text: Fast upload for every text portion that you can copy & paste. 
                            </p>
                            <p class="text-muted import-comment">
                                PDF Document: Converts PDFs containing computer-written document to text. 
                            </p>
                            <p class="text-muted import-comment">
                                PDF Scan: Converts PDFs containing scanned computer-written document to text. 
                            </p>
                            <p id="bottomP" class="text-muted import-comment">
                                Image/Photo: Extracts text from device taken pictures of documents (for example picture of newspaper article). 
                            </p>
                    </div>
                </div>
            </div>
            <div class="row import-margin-row">
                <div class="col-12 col-lg-4">
                    <div class="input-group width-100">
                        <div class="form-floating">
                          <input type="text" 
                              class="form-control import-borderless-input" 
                              id="floatingInputTitle" 
                              placeholder="Title">
                          <label class="import-borderless-label" for="floatingInputTitle">
                              Title
                          </label>
                          <h3 class="error-message" id="ErrorTitle">Title must not be empty</h3>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-8">
                    <div class="input-group width-100">
                        <div id="formDesc" class="form-floating">
                          <input type="text" 
                              class="form-control import-borderless-input" 
                              id="floatingInputDetails" 
                              placeholder="Title">
                          <label class="import-borderless-label" for="floatingInputDetails">
                              Short Description
                          </label>
                          <h3 class="error-message" id="ErrorDesc">Given description is too long</h3>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div id="textUpload">
                    <div class="form-floating">                      
                      <textarea class="form-control import-textarea" 
                          placeholder="Put your text here"
                          name="floatingImportText"
                          id="floatingImportText" 
                          style="height: 400px">
                      </textarea>
                      <label class="label-import-textarea" for="floatingImportText">
                          Put your text here
                      </label>
                      <h3 class="error-message" id="ErrorText">Text must not be empty</h3>
                    </div>
                    </div>
                </div>
                <div class="col-12">
                    <div id="DragDrop">
                        <h1 class="drag-drop-header">Upload your file</h1>
                        <h6 class="text-warning drag-drop-header-small">
                            Stick to chosen above file type! | File size limit: 10 MB
                        </h6>
                        <div class="drag-area">
                            <img id="dragBigIcon" src="icons/folder-add.png" width="130" height="130" />
                            <h2 class="drag-drop-big">Drag & Drop a File Here</h2>
                            <h2 class="drag-drop-big">or <button>Browse <i class="fas fa-cloud-upload-alt"></i></button></h2>
                            <input type="file" hidden/>
                            <h4 class="text-muted drag-drop-small">Supported: PDF, JPG, PNG, JPEG</h4>
                            <div class="drag-drop-small-icons">
                                <img src="icons/pdf.png" width="80" height="80" />
                                <img src="icons/jpg.png" width="80" height="80" />
                                <img src="icons/png.png" width="80" height="80" />
                                <img src="icons/jpeg.png" width="80" height="80" />
                            </div>
                        </div>
                        <div class="uploaded-file">
                            <div class="uploaded-file-description">
                                <div style="width: 10%; display: flex; justify-content: center">
                                    <i class="fa-5x fas fa-images"></i>
                                </div>
                                <div style="width: 80%; text-align: left; margin-left: 10px; margin-right: 10px">
                                    <h2>File002.pdf</h2>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" aria-valuenow="50" 
                                            aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                                        </div>
                                    </div>
                                </div>
                                <div style="width: 10%; display: flex; justify-content: center">
                                    <i class="fa-3x fas fa-check-circle"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 mb-4">
                    <button id="uploadTextButton" class="table_button">
                        <span>Start Reading</span><i class="fas fa-book"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>
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
    <script src="JavaScript/AddText.js"></script>
</asp:Content>
