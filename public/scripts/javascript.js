// Check if coming from a(nother) page login link and show login
$(document).ready(function() {
    if( window.location.hash === '#loginredir') {
        window.location.hash = '#'
        $('#navlogin').attr('href', '/#')
        $('#availability').toggle();
        $('#login').toggle();
    }
});

// Toggle login form with availability form
$('#navlogin').on('click', function() {
    $('#availability').toggle();
    $('#login').toggle();
});

// Collapse nav on link click
$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});

// Collapse nav on click away from nav
$('main').on('click', function(){
   $('.navbar-collapse').collapse('hide');
});
