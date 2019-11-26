//Menu icon = to x styling //
        $(document).ready(function(){
            $('.head-col').click(function() {
                $(this).toggleClass("openedmenu");
            });
        });
        
        
//Accordion arrow styling//
        $(document).ready(function(){
            $('.custom-accordion').click(function() {
                $(this).toggleClass("arrowUp");
            });
        });
        
//Header sticky //
$(window).scroll(function() {    
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
        $("#header").addClass("sticky");
    } else {
        $("#header").removeClass("sticky");
    }
});

//Toggle Class for Menu bar//

$(document).ready(function(){
    $(".header-icon").click(function(){
        $("#myNav").toggleClass("wzh");
    });
});

//Adding class for menu body scrollbar hiding//
        
$(document).ready(function(){
    $(".header-icon").click(function(){
        $("body").toggleClass("overflow-body-hidden");
    });
});


//Menu Slide Effect from left to Right //

$(document).ready(function(){
    $(".header-icon").click(function(){
        $("#myNav").animate({left: '0%'});
    });
});



//Toggle Slide Up and Down//
$(document).ready(function(){
$(".custom-accordion").click(function(){
    $(".c-a-panel").slideToggle("slow");
});
});


