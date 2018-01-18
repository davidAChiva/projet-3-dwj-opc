/*****************************************************************
                CREATION DE L'OBJET Diaporama POUR SLIDER
*****************************************************************/

var Diaporama = {
    
    init : function (id, title, image, description) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.description = description;
    },
    
    initHtmlCss : function () {
        this.blockTitle();
        this.blockImgDesc();
        this.blockImage();
        this.blockDesc();
        this.iconNextPrevious();
        this.iconPrevious();
        this.iconNext();
    },
    
    blockTitle : function () {
        
        $("#diaporama").append("<h3 id = 'diapoTitle'></h3>");
        $("#diapoTitle").text(this.title);    
    },
    
    blockImgDesc : function () {
        $("#diaporama").append("<div id ='blockImgDesc'></div>");
    },
    
    blockImage : function () {
        $("#blockImgDesc").append("<div id = 'diapoImage'></div>");
        $("#diapoImage").append("<p>" + this.image + "</p>");    
    },
    
    blockDesc : function () {
        $("#blockImgDesc").append("<div id = 'diapoDesc'></div>");
        $("#diapoDesc").append("<p>" + this.description + "</p>");    
    },
    
    iconNextPrevious : function () {
        $("#diaporama").append("<div id = 'iconNextPrevious'></div>");
    },
    
    iconPrevious : function () {
        $("#iconNextPrevious").append("<button id = 'iconPrevious' class ='fa fa-reply' aria-hidden='true'></button>");
        this.previousHover();
    },
    
    iconNext : function () {
        $("#iconNextPrevious").append("<button id = 'iconNext'class ='fa fa-share' aria-hidden ='true'></button>");
        this.nextHover();
    },
    
    previousHover : function () {
        $("#iconPrevious").hover (
            function () {
                $(this).css("background-color","#c9123c");
                $(this).css("cursor","pointer");
            },
            function () {
                $(this).css("background-color","white");
            }
        );
    },
    
   nextHover : function () {
        $("#iconNext").hover (
            function () {
                $(this).css("background-color","#c9123c");
                $(this).css("cursor","pointer");
            },
            function () {
                $(this).css("background-color","white");
            }
        );
   }
}

// Création de l'objet pour faire défiler les diaporamas

var displayDiapo = {
    id : 1,
    animate : function () {
        if (diapo1.id === displayDiapo.id) {
            diapo1.initHtmlCss();
            diapo1.blockDesc2();
            diapo1.blockDesc3();
            diapo1.blockDesc4();
        }
        
        else if (diapo2.id === displayDiapo.id) {
            diapo2.initHtmlCss();
            diapo2.blockDesc2();
        }
        
        else if (diapo3.id === displayDiapo.id) {
            diapo3.initHtmlCss();
            diapo3.blockDesc2();
        }
        
        else if (diapo4.id === displayDiapo.id) {
            diapo4.initHtmlCss();
            diapo4.blockDesc2();
        }
        
        this.clickPrevious();
        this.clickNext();
    },
    clickPrevious : function () {
        $("#iconPrevious").click( function () {
            $("#diaporama").empty();
            if (displayDiapo.id !== 1) {
                displayDiapo.id -= 1;
            }
            displayDiapo.animate();
        });
    },
    clickNext : function () {
        $("#iconNext").click( function () {
            $("#diaporama").empty();
            if (displayDiapo.id !== 4) {
                displayDiapo.id += 1;
            }
            displayDiapo.animate();
        });
    },
    keyUpNext : function () {
        $("body").keyup( function (e) {
            if (e.keyCode === 39) {
                $("#diaporama").empty();
                if (displayDiapo.id !== 4) {
                displayDiapo.id += 1;
            }
                displayDiapo.animate();
            }
        });    
    },
    keyUpPrevious : function () {
        $("body").keyup( function (e) {
            if (e.keyCode === 37){
                $("#diaporama").empty();
                if (displayDiapo.id !== 1) {
                displayDiapo.id -= 1;
            }
                displayDiapo.animate();
            }
        });        
    }
}

// Création de la première diapo

var diapo1 = Object.create(Diaporama);

diapo1.init(1,"ETAPE 1 : SELECTIONNER UNE STATION VELIB", "<img src =' images/map-exemple.jpg' alt ='exemple d'une map pour l'explication de la première étape/>", "Veuillez selectionner une station.");
diapo1.blockDesc2 = function () {
    $("#diapoDesc").append("<p>Les marqueurs <img src = 'images/green-bike.png' alt ='marqueur vert'/> sont les stations disponibles.</p>");
}

diapo1.blockDesc3 = function () {
    $("#diapoDesc").append("<p>Les marqueurs <img src = 'images/red-bike.png' alt ='marqueur rouge'/> sont les stations fermées temporairement.</p>");
}

diapo1.blockDesc4 = function () {
    $("#diapoDesc").append("<p>Les marqueurs <img src = 'images/orange-bike.png' alt ='marqueur jaune'/> sont les stations qui n'ont pas de vélos disponibles.</p>");
}



// Création de la deuxième diapo

var diapo2 = Object.create(Diaporama);

diapo2.init(2,"ETAPE 2 : INFORMATION DE LA STATION ET RESERVATION","<img src = 'images/data-station-exemple.jpg' alt = 'information de la station sélectionnée' />","Dès la selection d'une station sur la map Google, une fenêtre vous indique les informations de celle-ci.");

diapo2.blockDesc2 = function () {
    $("#diapoDesc").append("<p>Pour valider votre choix cliquer sur le bouton Réserver.</p>");
}


// Création de la troisième diapo

var diapo3 = Object.create(Diaporama);

diapo3.init(3, "ETAPE 3 : SIGNATURE POUR VALIDER LA RESERVATION","<img src = 'images/sign-exemple.jpg' alt = 'Exemple de signature pour la validation de la réservation' />","Signer dans le cadre afin de valider la réservation du vélib et cliquer sur 'confirmer'.")

diapo3.blockDesc2 = function () {
    $("#diapoDesc").append("<p>Vous pouvez à tout moment effacer votre signature en cliquant sur 'Reset'.");
}

// Création de la quatriéme diapo

var diapo4 = Object.create(Diaporama);

diapo4.init(4, "ETAPE 4 : INFORMATION SUR LE TEMPS RESTANT DE LA RESERVATION", "<img src = 'images/delai-reservation-station.jpg' alt = 'exemple d'affichage du temps restant de la réservation'/>","Des informations s'affichent sur le temps restant de votre réservation.")

diapo4.blockDesc2 = function () {
    $("#diapoDesc").append("<p>Vous pouvez annuler la réservation à tout moment.</p>")
}


displayDiapo.animate();
displayDiapo.clickPrevious();
displayDiapo.clickNext();
displayDiapo.keyUpNext();
displayDiapo.keyUpPrevious();