$(window).scroll(function(){
    let scrolledPx = $(window).scrollTop();
    if (scrolledPx < $('.navbar').outerHeight()) {
        const result = $('.navbar').outerHeight() - scrolledPx;
        $('#DashboardContainerHeader').css('top', (result).toString() + 'px');
        $('#DashboardContainerHeader').css('background-color', '#050d2491');
    }
    else {
        $('#DashboardContainerHeader').css('top', '0px');
        $('#DashboardContainerHeader').css('background-color', '#050D24');
    }
});

$('.dashboard-navbar-element').first().on('click', function(event) {
    event.preventDefault();
    window.location.href = "https://localhost:44369/AddText.aspx";
});

$('.dashboard-navbar-element').first().next().on('click', function(event) {
    event.preventDefault();
    window.location.href = "https://localhost:44369/TextAnalyzer.aspx";
});

$('.dashboard-navbar-element').first().next().next().on('click', function(event) {
    event.preventDefault();
    window.location.href = "https://localhost:44369/LearningMenu.aspx";
});

$('.dashboard-navbar-element').last().prev().on('click', function(event) {
    event.preventDefault();
    window.location.href = "/CreateCollection.aspx";
});

$('.dashboard-navbar-element').last().on('click', function(event) {
    event.preventDefault();
    window.location.href = "https://localhost:44369/Repository.aspx";
});

const navBarHeight = $('#DashboardContainerHeader').outerHeight();
$('#DashboardContainerHeader').css('top', $('.navbar').outerHeight().toString() + 'px');
$('.EmptyDiv').css('height', navBarHeight.toString() + 'px');