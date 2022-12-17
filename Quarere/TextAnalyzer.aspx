<%@ Page Title="Quarere | Text Analyzer" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TextAnalyzer.aspx.cs" Inherits="Quarere.Formularz_sieci_Web11" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/NavbarStyles.css" rel="stylesheet" />
    <title>Quarere | Text Analyzer</title>
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
        <!-- <section id="Introduction">
            <div class="container-fluid shadow-lg">
                <div class="row">
                    <div class="col-12 text-center">
                        <h1>Check Your Text</h1>
                    </div>
                </div>
            </div>
        </section> -->
        <section id="TextAnalyzer">
            <div class="container tool">
                <!-- <div class="row headline_row">
                    <div class="col-4">
                        <img src="Logo/Logo-cobalt2.png" width="200px" />
                    </div>
                    <div class="col-8 d-flex justify-content-end align-items-start">
                        <h2 class="headline">Find What You Want</h2>
                    </div>
                </div>
                <div class="row scrollrow" style="height: 550px; overflow-y: scroll">
                    <div class="col-xs-12" id="Quarere_describ">
                        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-offset="0" class="scrollspy-example" tabindex="0">
                            <div class="card mb-3 mt-3">
                              <div class="row g-0">
                                <div class="col-md-4">
                                  <img src="images/BookFragments.jpg" class="img-fluid rounded-start" alt="...">
                                </div>
                                <div class="col-md-8">
                                  <div class="card-body">
                                    <h5 class="card-title card_headline">Freedom and Versatility</h5>
                                    <p class="card-text">
                                        Don't be limited to any set of texts already prepared by someone. Choose
                                        whichever fragment you want and measure its difficulty. Interesting
                                        articles, absorbing stories and moving books are awaiting you.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="card mb-3">
                              <div class="row g-0">
                                <div class="col-md-4">
                                  <img src="images/Progress.jpg" class="img-fluid rounded-start" alt="...">
                                </div>
                                <div class="col-md-8">
                                  <div class="card-body">
                                    <h5 class="card-title card_headline">Monitor Your Progress</h5>
                                    <p class="card-text">
                                        Check your language proficiency based on known vocabulary.
                                        Discover how difficulty of texts that you understand changes over time. Get 
                                        access to data that shows how much you improve. Control all of this only by
                                        reading various texts.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="card mb-3">
                              <div class="row g-0">
                                <div class="col-md-4">
                                  <img src="images/standardized.jpg" class="img-fluid rounded-start" alt="...">
                                </div>
                                <div class="col-md-8">
                                  <div class="card-body">
                                    <h5 class="card-title card_headline">Standardized Tests</h5>
                                    <p class="card-text">
                                        If you have ever done any standardized test you propably know how tedious and
                                        boring is rereading. But that's no longer the case. You can paste any text from
                                        reading section and find words that you were missing instantly. Creating flashcards
                                        and other learning materials from them is now much quicker.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="card mb-3">
                              <div class="row g-0">
                                <div class="col-md-4">
                                  <img src="images/flash-card.png" class="img-fluid rounded-start" alt="...">
                                </div>
                                <div class="col-md-8">
                                  <div class="card-body">
                                    <h5 class="card-title card_headline">Swift Flashcards</h5>
                                    <p class="card-text">
                                        Create sets of flashcards and foldables much faster than before. Just pick any
                                        text, select which words you need for flashcards from organised panel and 
                                        download document. It will consist all of them separately - each one in a new line.
                                        Only add your own custom translations and you've got your flashcards ready to use.
                                        Most of the sites accept that kind of documents.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div class="row" id="TextBoxIntro">
                        <div class="col-xs-12 text-center">
                            <h1>Don't Wait, Just Try<i class="fas fa-hand-point-down hand_icon"></i></h1>
                        </div>
                    </div> -->
                    <div class="row">
                        <div class="col-xl-11 col-10" style="padding: 0px 55.5px;">
                            <h3 id="TextBoxDesc">
                                Quickly Measure Text Difficulty
                                <!--<img src="icons/down-right-arrow.png" class="img-fluid icon_analyzer"/>-->
                            </h3>
                        </div>
                        <div class="col-xl-1 col-2 d-flex justify-content-center align-items-center">
                            <button ID="Refresh" class="refresh" runat="server" type="button" 
                                onserverclick="refresh_button_Click"><i class="fa-2x fas fa-sync-alt"></i></button> 
                        </div>
                        <div style="position: relative; margin-top: 30px;"> 
                            <button class="invisible-button" onserverclick="Close_Guide_Click" runat="server" ID="TextAnalyzerGuideClose">
                                <i class="far fa-times-circle TextAnalyzerGuideClose"></i>
                            </button>
                            <div class="col-12 TextAnalyzerGuide" ID="TextAnalyzerGuide" runat="server">
                                <div>
                                    <img src="images/book.png" class="img-guide" />
                                    <h6>Choose any text you want</h6>
                                </div>
                                <img src="images/right-arrow.png" class="arrow" />
                                <div>
                                    <img src="images/click.png" class="img-guide" />
                                    <h6>Paste it below and click the button</h6>
                                </div>
                                <img src="images/right-arrow.png" class="arrow" />
                                <div>
                                    <img src="images/research.png" class="img-guide" />
                                    <h6>Check difficulty of whole text and specific words</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 d-flex justify-content-center">
                            <asp:TextBox 
                                ID="Analyzer" runat="server" TextMode="MultiLine" CssClass="responsive-textbox"
                                Rows="20" ToolTip="Paste your text" placeholder="Paste Your Text">
                            </asp:TextBox>
                        </div>
                        <div>
                            <div class="col-xs-12 d-none d-md-block d-flex justify-content-end">
                                <asp:LinkButton runat="server" CssClass="button_analyzer"
                                    ID="button_analyzer" OnClick="button_analyzer_Click">
                                    Measure Difficulty <i class="fas fa-check button_icon"></i>
                                </asp:LinkButton>
                            </div>
                            <div class="col-xs-12 d-block d-md-none d-flex justify-content-center">
                                <asp:LinkButton runat="server" CssClass="button_analyzer"
                                    ID="button_analyzer_small" OnClick="button_analyzer_Click">
                                    Measure Difficulty <i class="fas fa-check button_icon"></i>
                                </asp:LinkButton>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
        <section id="Difficulty">
            <div class="container">
                <div class="row">
                    <div class="col-1 text-center">
                        <h3>A1</h3>
                        <h3>A2</h3>
                        <h3>B1</h3>
                        <h3>B2</h3>
                        <h3>C1</h3>
                        <h3>C2</h3>
                        <h3>—</h3>
                    </div>
                    <div class="col-11">
                        <div class="progress analyzer_bar" style="height: 30px">
                          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
                              style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress analyzer_bar" style="height: 30px">
                          <div class="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar" 
                              style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress analyzer_bar" style="height: 30px">
                          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
                              style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress analyzer_bar" style="height: 30px">
                          <div class="progress-bar progress-bar-striped bg-warning progress-bar-animated" role="progressbar" 
                              style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress analyzer_bar" style="height: 30px">
                          <div class="progress-bar progress-bar-striped bg-danger progress-bar-animated" role="progressbar" 
                              style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress analyzer_bar" style="height: 30px">
                          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
                              style="width: 100%; background-color: seagreen !important;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress analyzer_bar" style="height: 30px">
                          <div class="progress-bar progress-bar-striped bg-dark progress-bar-animated" role="progressbar" 
                              style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="row">
                <div class="col-12">
                    <div class="accordion-item" id="AccorditionAnalyzer">
                        <h2 class="accordion-header" id="HeadingAnalyzer">
                          <button id="CollapseButtonAnalyzer" class="accordion-button custom_accordion-button" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Additional Details 
                          </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse" 
                         aria-labelledby="HeadingAnalyzer" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table id="CountTable" class="table table-primary table-bordered
                                table-hover table-striped" style="width:100%">
                                    <thead>
                                        <tr>
                                            <th>Level</th>
                                            <th>Words/Phrases Amount</th>
                                            <th>%</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
        <section>
            <div class="container">
                <table id="AnalyzerTable" class="table table-primary table-bordered
                    table-hover table-striped" style="width:100%">
                    <thead>
                        <tr> 
                            <th></th>
                            <th>Position (Index)</th>
                            <th>Word</th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th>Position (Index)</th>
                            <th>Word</th>
                            <th>Level</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
        <section id="bottomImg">
            <div class="container-fluid">
                <div class="row">
                    <img src="background/analyzerbackground4.png" class="bottomImg"/>
                </div>
            </div>
        </section>
    <!-- <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.1/js/bootstrap.bundle.min.js"></script> -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/v/bs5/jq-3.6.0/jszip-2.5.0/dt-1.11.3/af-2.3.7/b-2.0.1/b-colvis-2.0.1/b-html5-2.0.1/b-print-2.0.1/cr-1.5.5/date-1.1.1/fc-4.0.1/fh-3.2.0/kt-2.6.4/r-2.2.9/rg-1.1.4/rr-1.2.8/sc-2.0.5/sb-1.3.0/sp-1.4.0/sl-1.3.3/sr-1.0.0/datatables.min.js"></script>
    <script type="text/javascript" src="JavaScript/TextAnalyzer.js"></script>
</asp:Content>
