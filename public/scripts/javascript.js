$('#navlogin').on('click', function() {
    $('#availability').toggle();
    $('#login').toggle();
});

$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});

$('main').on('click', function(){
   $('.navbar-collapse').collapse('hide');
});
