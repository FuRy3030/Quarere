<%@ Page Title="Quarere • Best tool for learning new words throughout reading" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="Homepage.aspx.cs" Inherits="Quarere.Formularz_sieci_Web1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Quarere • Best tool for learning new words throughout reading</title>
    <link href="css/Homepage.css" rel="stylesheet" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">   
    
    <section>
      <div class="container-fluid">
        <div id="HomePageCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#HomePageCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#HomePageCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <!-- <button type="button" data-bs-target="#HomePageCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button> -->
          </div>
          <div class="carousel-inner" id="carousel">
            <!-- <div class="carousel-item active">
              <img class="img-carousel" src="images/carousel-books-slide1.jpg" width="1920px" class="d-block w-100" alt="...">
              <div class="carousel-caption d-none d-lg-block lg_plus">
                <h1>Improve All Your English Skills</h1>
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <a href="TextAnalyzer.aspx"><button id="CarouselButton" runat="server" onserverclick="CarouselButton_ServerClick" class="button_carousel">Check Out</button></a><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-4x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-none d-md-block d-lg-none medium">
                <h1>We Want You To Learn Much Faster</h1>
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <a href="TextAnalyzer.aspx"><button id="CarouselButton2" runat="server" onserverclick="CarouselButton_ServerClick" class="button_carousel">Check Out</button></a><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-4x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-none d-sm-block d-md-none small">
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <a href="TextAnalyzer.aspx"><button id="CarouselButton3" runat="server" onserverclick="CarouselButton_ServerClick" class="button_carousel_small">Check Out</button></a><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-3x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-block d-sm-none ultrasmall">
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <a href="TextAnalyzer.aspx"><button id="CarouselButton4" runat="server" onserverclick="CarouselButton_ServerClick" class="button_carousel_small">Check Out</button></a><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-3x icon_carousel"></i></a>
              </div>
            </div> -->
            <div class="carousel-item active">
              <img class="img-carousel" src="images/carousel-books-slide2.jpg" width="1920px" class="d-block w-100" alt="...">
              <div class="carousel-caption d-none d-lg-block lg_plus">
                <h1>Improve All Your English Skills</h1>
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <button id="CarouselButton5" class="button_carousel">Check Out</button><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-4x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-none d-md-block d-lg-none medium">
                <h1>Improve All Your English Skills</h1>
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <button id="CarouselButton6" class="button_carousel">Check Out</button><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-4x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-none d-sm-block d-md-none small">
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <button id="CarouselButton7" class="button_carousel_small">Check Out</button><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-3x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-block d-sm-none ultrasmall">
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <button id="CarouselButton8" class="button_carousel_small">Check Out</button><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-3x icon_carousel"></i></a>
              </div>
            </div>
            <div class="carousel-item">
              <img class="img-carousel" src="images/carousel-books-slide3.jpg" class="d-block w-100" width="1920px" alt="...">
              <div class="carousel-caption d-none d-lg-block lg_plus">
                <h1>Learn New Words And Phrases</h1>
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <button id="CarouselButton9" class="button_carousel">Check Out</button><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-4x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-none d-md-block d-lg-none medium">
                <h1>Learn New Words And Phrases</h1>
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <button id="CarouselButton10" class="button_carousel">Check Out</button><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-4x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-none d-sm-block d-md-none small">
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <button id="CarouselButton11" class="button_carousel_small">Check Out</button><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-3x icon_carousel"></i></a>
              </div>
              <div class="carousel-caption d-block d-sm-none ultrasmall">
                <h2>Free To Discover</h2>
                <h4>World's Most Innovative Tool For Learning English</h4>
                <button id="CarouselButton12" class="button_carousel_small">Check Out</button><br>
                <a href="#Intro"><i class="fas fa-angle-double-down fa-3x icon_carousel"></i></a>
              </div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#HomePageCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#HomePageCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
    <!--CAROUSEL-->
    <!--INTRODUCTION-->
    <section id="Intro">
      <div class="container">
        <div class="row">
          <div class="col-md-7">
            <h1>Best Place For English Readers & Learners</h1>
            <h6>
              Quarere is a simple tool that let you improve all your english skills through reading.
              Discover new words and phrases, create and manage your own learning materials from them and study effectively using different modes - everything in one place.
            </h6>
            <button id="IntroButton" class="button d-none d-md-block"><span>Get Started</span></button>
          </div>
          <div class="col-md-5 text-center">
            <img src="images/IntroDescImg.png" alt="" class="img-fluid intro_img">
          </div>
        </div>
      </div>
    </section>
    <!--INTRODUCTION-->
    <!--QUALITIES-->
    <section id="Qualities">
      <div class="container">
        <div class="row">
          <div class="col-md-4 text-center">
            <img src="icons/TextHomeIcon1.png" alt="" class="img-fluid" width="150px" style="padding-bottom: 15px; margin-left: 30px;">
            <h3>Interactive Text</h3>
            <p>Discover new words and phrases with ease while reading the text by using our advanced tools specifically designed for exploring new language through reading.</p>
          </div>
          <div class="col-md-4 text-center">
            <img src="icons/EditHomeIcon5.png" alt="" class="img-fluid" width="150px" style="padding-bottom: 15px; margin-left: 15px;">
            <h3>Manage & Edit Materials</h3>
            <p>Create custom materials within a blink of an eye due to automatic filling and sugestions. Organise and edit them in desired way within seconds using own repository.</p>
          </div>
          <div class="col-md-4 text-center">
            <img src="icons/LearnHomeIcon3.png" alt="" class="img-fluid" width="150px" style="padding-bottom: 15px;">
            <h3>Learn Effectively</h3>
            <p>Use created collections in different learning modes so as to consolidate gained knowledge and improve proficiency and all language skills.</p>
          </div>
        </div>
      </div>
    </section>
    <!--QUALITIES-->
    <!--HOW WORKS-->
    <section class="wrap" id="How_works_1">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <h1 class="standard" id="HomePage">How Does It Work?</h1>
            <hr>
          </div>
        </div>
      </div>
      <div class="container fast-instructions">
        <div class="row">
          <div class="col-12 d-flex">
            <div class="col-6 fast-instructions-text" style="padding-bottom: 45px;">
              <i class="bi fa-3x bi-file-earmark-richtext-fill"></i>
              Add & Read Text
            </div>
            <div class="col-6 fast-instructions-text" style="padding-bottom: 45px;">
              <i class="bi fa-3x bi-pencil-square"></i>
              Create & Edit Materials
            </div>
          </div>
          <div class="col-12 d-flex">
            <div class="col-6 fast-instructions-text">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-mortarboard-fill" viewBox="0 0 16 16" style="padding-bottom: 12.5px;">
                <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
                <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
              </svg>
              Revise New Material
            </div>
            <div class="col-6 fast-instructions-text">
              <i class="fas fa-3x fa-cogs" style="padding-bottom: 12.5px;"></i>
              Observe Improvement
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row padding_row">
          <div class="col-12 d-flex justify-content-center">
            <video class="img-fluid" width="70%" alt="" controls autoplay muted>
              <source src="Videos/VideoTextboxAdd.mp4" type="video/mp4" />  
            </video>
          </div>
          <div class="col-6" style="padding: 50px 25px">
            <h2 class="video-description-header">Choose any piece of text</h2>
            <p class="video-description-body">
              Come across compelling story or have some text prepared for learning? 
              In both scenarios you can make learning from reading easier by just pasting desired piece of text into designated place.
              Give it a title too and you are ready to go.
            </p>
          </div>
          <div class="col-6" style="padding: 50px 25px">
            <h2 class="video-description-header">Image or PDF containing text?</h2>
            <p class="video-description-body">
              Have you just taken a photo of the text from the piece of paper? Or maybe you have a PDF containing your desired text.
              Don't worry. You can easily transform these files into readable text on our website within a few clicks.
            </p>
          </div>
          <div class="col-12 d-flex justify-content-center">
            <video class="img-fluid" width="70%" alt="" controls autoplay muted>
              <source src="Videos/VideoReading.mp4" type="video/mp4" />  
            </video>
          </div>
          <div class="col-6" style="padding: 50px 25px">
            <h2 class="video-description-header">Everything at your fingertips</h2>
            <p class="video-description-body">
              Our interface provide you with all necessary help regarding understanding the meaning of every word or phrase occuring in the text.
              It is specifically designed for learning and doesn't work like normal, standard translator. 
              The content, which includes meanings, phonetics, examples, synonyms and more, is easily accessible within mouse hover and/or click. 
            </p>
          </div>
          <div class="col-6" style="padding: 50px 25px">
            <h2 class="video-description-header">Instantly generated materials</h2>
            <p class="video-description-body">
              Create automatically filled learning materials called collections within one click from chosen words and phrases encountered in reading text.
              If you need to select whole sentences or unsupported phrases use 'Custom Select' and add these custom elements to collection.
              Edit your materials freely with text opened above before saving them.
            </p>
          </div>
          <div class="col-12 d-flex justify-content-center">
            <video class="img-fluid" width="70%" alt="" controls autoplay muted>
              <source src="Videos/VideoDataEdit.mp4" type="video/mp4" />  
            </video>
          </div>
          <div class="col-6" style="padding: 50px 25px">
            <h2 class="video-description-header">Manage your repository</h2>
            <p class="video-description-body">
              Organise your own repository in convenient way. 
              Add and remove texts as well as collections from favourites, delete them from your storage, search and sort the list of your materials.
              Access your recently created materials from dashboard.
            </p>
          </div>
          <div class="col-6" style="padding: 50px 25px">
            <h2 class="video-description-header">Edit your texts & collections</h2>
            <p class="video-description-body">
              Edit at any time all components of your collections and texts including titles as well as descriptions.
              Add, change and remove elements from them. Combine saved text and collection to run interactive text on already created learning materials.
            </p>
          </div>
          <div class="col-12 d-flex justify-content-center">
            <video class="img-fluid" width="70%" alt="" controls autoplay muted>
              <source src="Videos/VideoFlashcards.mp4" type="video/mp4" />  
            </video>
          </div>
          <div class="col-6" style="padding: 50px 25px">
            <h2 class="video-description-header">Different learning modes</h2>
            <p class="video-description-body">
              Every learning mode is specifically suited for your created collections.
              You can easily configure every mode content based on your materials and choose what you want to revise today.
            </p>
          </div>
          <div class="col-6" style="padding: 50px 25px">
            <h2 class="video-description-header">Effective studying</h2>
            <p class="video-description-body">
              Every mode lets you learn in desired pace in order to maximise your progress. 
              You can repeat different sections, mark elements as things that 'have to be repeated' and decide when you want to keep going.
            </p>
          </div>
          <button class="start-button">Start learning <i class="bi bi-arrow-up-right-circle-fill"></i></button>
            <!-- <div class="col-md-6 text-center d-flex justify-content-center align-items-center">
              <video class="img-fluid" width="400px" alt="" autoplay>
                <source src="Videos/VideoTextboxAdd.mp4" type="video/mp4" />  
              </video>
            </div>
            <div class="col-md-6">
              <h2 class="with_padding">Choose any Article or Book Fragment That You Want<img class="img-fluid icon_text" src="icons/open-book.png" width="60px" alt=""></h2>
              <p>
                Every one of us read different maganizes or books every day.
                Even though most of us don't have time to learn for a longer period, we always come across some english articles and read, because they consists interesting information.
                With Quarere you can still learn new words by simply copying those text fragments.
              </p>
            </div>
            <div class="col-md-6">
              <h2 class="with_padding">Paste Them Into Our Tool<img class="img-fluid icon_text" width="60px" src="icons/slideshow.png" alt=""></h2>
              <p>
                After pasting chosen text fragment text analyzer checks it in terms of words' difficulty.
                Subsequently you get full word list from it grouped in accordance with CEFR rules.
              </p>
            </div>
            <div class="col-md-6 d-flex justify-content-center align-items-center">
              <img class="img-fluid" src="images/searching.png" width="400px" alt="">
            </div>
            <div class="col-md-6 d-flex justify-content-center align-items-center">
              <img class="img-fluid" src="images/results.png" width="400px" alt="">
            </div>
            <div class="col-md-6 text-center">
              <h2 class="with_padding">Enjoy Analyses That Boost Your Learning Pace<img class="img-fluid icon_text" width="60px" src="icons/idea.png" alt=""></h2>
              <p>
                Instant results give you general text overview as well as difficulty level. 
                Creating flashcards with words from your favorites articles is possible in the blink of an eye.
                Simply look for words from proficiency level that you want to acquire and and copy them into any learning tool.
                Make increasing your vocabulary range more effective and faster.
              </p>
              <a href="TextAnalyzer.aspx"><button id="HowWorksButton" runat="server" onserverclick="CarouselButton_ServerClick" class="button_round"><span>Try Out</span></button></a>
            </div> -->
        </div>
      </div>
    </section>
    <section class="wrap" id="How_works_2">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <h1 class="standard" id="HomePage">How Does It Work?</h1>
            <hr>
          </div>
        </div>
      </div>
      <div class="container fast-instructions">
        <div class="row">
          <div class="col-12 d-flex">
            <div class="col-12 fast-instructions-text" style="padding-bottom: 0px;">
              <i class="bi fa-3x bi-file-earmark-richtext-fill"></i>
              Add & Read Text
            </div>
          </div>
          <div class="col-12 d-flex">
            <div class="col-12 fast-instructions-text" style="padding-bottom: 35px;">
              <i class="bi fa-3x bi-pencil-square"></i>
              Create & Edit Materials
            </div>
          </div>
          <div class="col-12 d-flex">
            <div class="col-12 fast-instructions-text" style="padding-bottom: 45px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-mortarboard-fill" viewBox="0 0 16 16" style="padding-bottom: 12.5px;">
                <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
                <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
              </svg>
              Revise New Material
            </div>
          </div>
          <div class="col-12 d-flex">
            <div class="col-12 fast-instructions-text">
              <i class="fas fa-3x fa-cogs" style="padding-bottom: 12.5px;"></i>
              Observe Improvement
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row padding_row">
          <div class="col-12 d-flex justify-content-center">
            <video class="img-fluid" width="100%" alt="" controls autoplay muted>
              <source src="Videos/VideoTextboxAdd.mp4" type="video/mp4" />  
            </video>
          </div>
          <div class="col-12" style="padding: 50px 13px 25px 13px">
            <h2 class="video-description-header">Choose any piece of text</h2>
            <p class="video-description-body">
              Come across compelling story or have some text prepared for learning? 
              In both scenarios you can make learning from reading easier by just pasting desired piece of text into designated place.
              Give it a title too and you are ready to go.
            </p>
          </div>
          <div class="col-12" style="padding: 25px 13px 50px 13px">
            <h2 class="video-description-header">Image or PDF containing text?</h2>
            <p class="video-description-body">
              Have you just taken a photo of the text from the piece of paper? Or maybe you have a PDF containing your desired text.
              Don't worry. You can easily transform these files into readable text on our website within a few clicks.
            </p>
          </div>
          <div class="col-12 d-flex justify-content-center">
            <video class="img-fluid" width="100%" alt="" controls autoplay muted>
              <source src="Videos/VideoReading.mp4" type="video/mp4" />  
            </video>
          </div>
          <div class="col-12" style="padding: 50px 13px 25px 13px">
            <h2 class="video-description-header">Everything at your fingertips</h2>
            <p class="video-description-body">
              Our interface provide you with all necessary help regarding understanding the meaning of every word or phrase occuring in the text.
              It is specifically designed for learning and doesn't work like normal, standard translator. 
              The content, which includes meanings, phonetics, examples, synonyms and more, is easily accessible within mouse hover and/or click. 
            </p>
          </div>
          <div class="col-12" style="padding: 25px 13px 50px 13px">
            <h2 class="video-description-header">Instantly generated materials</h2>
            <p class="video-description-body">
              Create automatically filled learning materials called collections within one click from chosen words and phrases encountered in reading text.
              If you need to select whole sentences or unsupported phrases use 'Custom Select' and add these custom elements to collection.
              Edit your materials freely with text opened above before saving them.
            </p>
          </div>
          <div class="col-12 d-flex justify-content-center">
            <video class="img-fluid" width="100%" alt="" controls autoplay muted>
              <source src="Videos/VideoDataEdit.mp4" type="video/mp4" />  
            </video>
          </div>
          <div class="col-12" style="padding: 50px 13px 25px 13px">
            <h2 class="video-description-header">Manage your repository</h2>
            <p class="video-description-body">
              Organise your own repository in convenient way. 
              Add and remove texts as well as collections from favourites, delete them from your storage, search and sort the list of your materials.
              Access your recently created materials from dashboard.
            </p>
          </div>
          <div class="col-12" style="padding: 25px 13px 50px 13px">
            <h2 class="video-description-header">Edit your texts & collections</h2>
            <p class="video-description-body">
              Edit at any time all components of your collections and texts including titles as well as descriptions.
              Add, change and remove elements from them. Combine saved text and collection to run interactive text on already created learning materials.
            </p>
          </div>
          <div class="col-12 d-flex justify-content-center">
            <video class="img-fluid" width="100%" alt="" controls autoplay muted>
              <source src="Videos/VideoFlashcards.mp4" type="video/mp4" />  
            </video>
          </div>
          <div class="col-12" style="padding: 50px 13px 25px 13px">
            <h2 class="video-description-header">Different learning modes</h2>
            <p class="video-description-body">
              Every learning mode is specifically suited for your created collections.
              You can easily configure every mode content based on your materials and choose what you want to revise today.
            </p>
          </div>
          <div class="col-12" style="padding: 25px 13px 50px 13px">
            <h2 class="video-description-header">Effective studying</h2>
            <p class="video-description-body">
              Every mode lets you learn in desired pace in order to maximise your progress. 
              You can repeat different sections, mark elements as things that 'have to be repeated' and decide when you want to keep going.
            </p>
          </div>
          <button class="start-button start-button-small">Start learning <i class="bi bi-arrow-up-right-circle-fill"></i></button>
        </div>
      </div>
    </section>
      <!-- <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <h1 class="standard" id="HomePage">How Does It Work?</h1>
            <hr>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row padding_row">
            <div class="col-md-6 text-center d-flex justify-content-center align-items-center">
              <video class="img-fluid" width="400px" alt="" autoplay muted>
                <source src="Videos/VideoTextboxAdd.mp4" type="video/mp4" />  
              </video>
            </div>
            <div class="col-md-6">
              <h2 class="with_padding">Choose any Article or Book Fragment That You Want<img class="img-fluid icon_text" src="icons/open-book.png" width="60px" alt=""></h2>
              <p>
                Every one of us read different maganizes or books every day.
                Even though most of us don't have time to learn for a longer period, we always come across some english articles and read, because they consists interesting information.
                With Quarere you can still learn new words by simply copying those text fragments.
              </p>
            </div>
            <div class="col-md-6 d-flex justify-content-center align-items-center">
              <img class="img-fluid" src="images/searching.png" width="400px" alt="">
            </div>
            <div class="col-md-6">
              <h2 class="with_padding">Paste Them Into Our Tool<img class="img-fluid icon_text" width="60px" src="icons/slideshow.png" alt=""></h2>
              <p>
                After pasting chosen text fragment text analyzer checks it in terms of words' difficulty.
                Subsequently you get full word list from it grouped in accordance with CEFR rules.
              </p>
            </div>
            <div class="col-md-6 d-flex justify-content-center align-items-center">
              <img class="img-fluid" src="images/results.png" width="400px" alt="">
            </div>
            <div class="col-md-6 text-center">
              <h2 class="with_padding">Enjoy Analyses That Boost Your Learning Pace<img class="img-fluid icon_text" width="60px" src="icons/idea.png" alt=""></h2>
              <p>
                Instant results give you general text overview as well as difficulty level. 
                Creating flashcards with words from your favorites articles is possible in the blink of an eye.
                Simply look for words from proficiency level that you want to acquire and and copy them into any learning tool.
                Make increasing your vocabulary range more effective and faster.
              </p>
              <a href="TextAnalyzer.aspx"><button id="HowWorksButton2" runat="server" onserverclick="CarouselButton_ServerClick" class="button_round"><span>Try Out</span></button></a>
            </div>
        </div>
      </div>
    </section> -->
    <!--HOW WORKS-->
    <!--Qualities2-->
    <section id="Qualities2">
      <div class="container">
        <div class="row">
          <div class="col-md-4 text-center">
            <img src="icons/elastic.png" alt="" class="img-fluid" width="150px" style="padding-bottom: 15px;">
            <h3>Flexibility</h3>
            <p>Don't limit yourself to already prepared texts. You get full freedom in terms of finding an interesting piece of text. It doesn't matter whether it's story, article or document.</p>
          </div>
          <div class="col-md-4 text-center">
            <img src="icons/fast.png" alt="" class="img-fluid" width="150px" style="padding-bottom: 15px;">
            <h3>Automatization & Speed</h3>
            <p>Discover and learn new words plus phrases as fast as possible thanks to instant materials creation. Organise your storage within a few clicks by modyfing it in desired way.</p>
          </div>
          <div class="col-md-4 text-center">
            <img src="icons/richWordsDatabase.png" alt="" class="img-fluid" width="150px" style="padding-bottom: 15px;">
            <h3>Vast Words Support</h3>
            <p>Our tools support many different words and phrases in terms of meaning, examples, synonyms, CEFR levels and much more. You can even get help with more specialised texts.</p>
          </div>
        </div>
      </div>
    </section>
    <!--Qualities2-->
    <!--CONTRIBUTION-->
    <section id="Contribution">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 text-center">
            <img src="icons/contribution.png" alt="" class="img-fluid" width="200px">
            <h1>Make a Contribution</h1>
            <h6 class="centered-h6">
              Quarere like any other tool has its own flaws.
              English is packed with different exceptions that our tool can't handle properly.
              Every user like you can improve it while benefiting from the webiste.
              Adding word suggestions or reporting errors helps anyone who uses Quarere including yourself.
            </h6>
          </div>
        </div>
      </div>
      <div class="container-fluid contribution-container">
        <div class="row">
          <div class="col-md-6 text-center col-padding">
            <img src="icons/adding.png" alt="" class="img-fluid" width="150px">
            <h3>Adding Words</h3>
            <p>
              It is very important to us to cultivate a sense of community throughout the project. 
              Therefore we highly encourage users to contribute to the tool by enriching vocabulary range.
              We are open to every new word suggestion, so feel free to send any of them.
              It also helps us in refining the website and hastening users' language progress.
            </p>
            <a href="AddingWords.aspx"><button id="HomeAddWordsButton" runat="server" onserverclick="RedirectToAddingWords" class="button_add"><span>Add Words</span></button></a>
          </div>
          <div class="col-md-6 text-center">
            <img src="icons/error.png" alt="" class="img-fluid" width="150px">
            <h3>Reporting Errors</h3>
            <p>
              We perceive the fact that Quarere works properly on all devices and browser types as our main goal.
              This section also incorporates errors connected with words, so we are pleased to review any reports concerning them.
              We are open to every kind of report, so feel free to send any of them.
            </p>
            <a href="ReportingErrors.aspx"><button id="HomeErrorButton" runat="server" onserverclick="RedirectToErrors" class="button_error"><span>Report Errors</span></button></a>
          </div>
        </div>
      </div>
    </section>
    <!--CONTRIBUTION-->
    <!--BOTTOM BACKGROUND-->
    <section>
        <div class="container-fluid">
            <div class="row">
                <img src="background/HomepageBackground2.jpg" class="bottomImg"/>
            </div>
        </div>
    </section>
    <script>
        if (window.history.replaceState) {
          window.history.replaceState( null, null, window.location.href );
        }
    </script>
    <script src="jQuery/jquery-3.6.0.min.js"></script>
    <script src="JavaScript/Homepage.js"></script>
</asp:Content>
