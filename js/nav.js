/************************************************
               ANCRE DES LIENS
************************************************/
// Note : adaptabilité jquery mobile
// Permet de récupérer la position 
var Scrolling = 
    {
        init : function (id) {
            var position = $(id).offset().top;
            $.mobile.silentScroll(position);   
        },
    }

var menu1 = Object.create(Scrolling);
var menu2 = Object.create(Scrolling);
var menu3 = Object.create(Scrolling);

