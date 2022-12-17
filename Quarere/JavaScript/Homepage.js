$('.EmptyDiv').css('height', '0px');

function scrollTo(selector) {
    document.querySelector(selector).scrollIntoView({ behavior: 'smooth' })
}

$('.button_carousel').each(function() {
    $(this).on('click', function(event) {
        event.preventDefault();
        scrollTo('.wrap');
    });
});

$('.button_carousel_small').each(function() {
    $(this).on('click', function(event) {
        event.preventDefault();
        scrollTo('.wrap');
    });
});

$('#IntroButton').on('click', function(event) {
    event.preventDefault();
    scrollTo('.wrap');
});

$('.start-button').each(function() {
    $(this).on('click', function(event) {
        event.preventDefault();
        window.location.href = 'https://localhost:44369/AddText.aspx';
    });
});