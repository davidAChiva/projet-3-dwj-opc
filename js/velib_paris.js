/*******************************************************************
                    Création du prototype Map
*******************************************************************/
var MapVelib = {
    map : "",
    apiOpenData :"",
    markersStations : "",

    // Initialisation des données de l'objet
    init : function () {
        
        // Récupération de la latitude pour centrer la map
        if (sessionStorage.getItem("bikeReservation") === "1") {
            var stationLat = parseFloat(sessionStorage.getItem("positionLatReservation"));
        }
        else if (sessionStorage.getItem("positionLat") !== null) {
            stationLat = parseFloat(sessionStorage.getItem("positionLat"));
        }
        else {
            stationLat = 48.866667;
        }
        
        // Récupération de la longitude pour centrer la map
        if (sessionStorage.getItem("bikeReservation") === "1") {
            var stationLng = parseFloat(sessionStorage.getItem("positionLngReservation"));
        }
        else if (sessionStorage.getItem("positionLng") !== null) {
            stationLng = parseFloat(sessionStorage.getItem("positionLng"));
        }
        else {
            stationLng = 2.333333;
        }
        
        var zoomDefault = 16;
        var zoomReservation = 20;
        this.map = new google.maps.Map(document.getElementById("map"), {
            center : {
                lat : stationLat,
                lng : stationLng
            },
            zoom : zoomDefault,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        
        // Changement de zoom lors d'une réservation
        if (sessionStorage.getItem("bikeReservation") === "1") {
            MapVelib.map.zoom = zoomReservation;
        }
            this.apiOpenData = "https://opendata.paris.fr/api/records/1.0/search/?dataset=stations-velib-disponibilites-en-temps-reel&rows=9999&facet=banking&facet=bonus&facet=status&facet=contract_name";
            this.markersStations();
            this.storageDataFooter();
            
    },
    
    markersStations : function () {
        $.getJSON(this.apiOpenData, function (data) {
            var stations = data.records;
            var markers = [];
            for (var i = 0; i < stations.length; i++) {         
                var coords = stations[i].fields.position;
                var latLng = new google.maps.LatLng (coords[0],coords[1]);
                
                 // Insertion des marqueurs
                MapVelib.marker = new google.maps.Marker ({
                    position: latLng,
                    map : MapVelib.map,
                    icon : "",
                    id : stations[i].fields.number,
                    stationName : stations[i].fields.name,
                    stationAddress : stations[i].fields.address,
                    stationStatus : stations[i].fields.status,
                    stationCapacity : stations[i].fields.bike_stands,
                    stationPlace : stations[i].fields.available_bike_stands,
                    stationNbVelos : stations[i].fields.available_bikes,
                    bikeReservation : sessionStorage.getItem("bikeReservation"),
                });
                
                // Intègration des différents marqueurs
                // ! Important : L'ordre des conditions a été prévu pour optimiser les performances
                if ((MapVelib.marker.stationStatus === "OPEN") & (MapVelib.marker.stationNbVelos !== 0) & ( sessionStorage.getItem("name") !== MapVelib.marker.stationName)) {
                    MapVelib.marker.icon = "images/green-bike.png";
                }
                else if ((MapVelib.marker.stationStatus === "OPEN") & (MapVelib.marker.stationNbVelos === 0) & ( sessionStorage.getItem("name") !== MapVelib.marker.stationName)) {
                    MapVelib.marker.icon = "images/orange-bike.png";        
                }
                
                else if ((MapVelib.marker.stationStatus === "CLOSED") & ( sessionStorage.getItem("name") !== MapVelib.marker.stationName)) {       
                    MapVelib.marker.icon = "images/red-bike.png";    
                }
                else if ( sessionStorage.getItem("name") === MapVelib.marker.stationName) {
                    MapVelib.marker.icon = "images/blue-bike.png";    
                }
                
                // insertion des marqueurs pour utiliser MarkerCluster
                markers.push(MapVelib.marker);
                
                MapVelib.marker.addListener("click", function () {
                    
                    // Enregistrement dans le navigateur la position du marqueur
                    sessionStorage.setItem("positionLat",this.position.lat());
                    sessionStorage.setItem("positionLng",this.position.lng());
                    
                    // Suppression des anciennes données de la station
                    $("#data").empty();
                    MapVelib.dataStation(this);
            
                    if ((this.stationStatus === "OPEN") & (this.stationNbVelos > 0) & (sessionStorage.getItem("bikeReservation") === null)) {
                        $("#data").append("<button id = 'reserver'>Réserver</button>");
                        MapVelib.reservation(this);
                    }
                    
                    if ((sessionStorage.getItem("bikeReservation") !== null) & (this.icon !== "images/blue-bike.png")){
                        $("#data").append("<p id = 'alertReservation'></p>");
                        $("#alertReservation").css("font-size","2em");
                        $("#alertReservation").css("background-color","red");
                        $("#alertReservation").css("color", "white");
                        $("#alertReservation").text("Vous avez déjà une réservation en cours !");
                    }
        
                    else if (this.stationNbVelos === 0) {
                        $("#data").append("<p id = 'stationClosed'></p>");
                        $("#stationClosed").css("font-size","2em");
                        $("#stationClosed").css("background-color","red");
                        $("#stationClosed").css("color", "white");
                        $("#stationClosed").text("Aucun vélo disponible à la station " + this.stationName);    
                    }
                    
                    else if (this.stationStatus === "CLOSED") {
                        $("#data").append("<p id = 'stationClosed'></p>");
                        $("#stationClosed").css("font-size","2em");
                        $("#stationClosed").css("background-color","red");
                        $("#stationClosed").css("color", "white");
                        $("#stationClosed").text("la station " + this.stationName + " est fermée");
                    }
                });
            }
            var markerCluster = new MarkerClusterer (MapVelib.map, markers, {imagePath : 'images-cluster/m'});
           
        });
    },
    
    dataStation : function (station) {
        
        // Création du div pour les informations de la station
        $("#data").append("<div id = 'stationData'></div>");
        $("#stationData").css("background-color","white");
        $("#stationData").css("height","400px");
        $("#stationData").css("font-size", "1.3em");
        $("#stationData").css("padding","5px");
        $("#stationData").css("margin-bottom", "10px");
        
        // Titre principal 
        $("#stationData").append("<h3 id = 'statusReservation'></h3>");
        $("#statusReservation").css("background-color","#0A4770");
        $("#statusReservation").css("color","white");
        $("#statusReservation").css("text-align","center");
        $("#statusReservation").text("STATION SELECTIONNEE");
        
        // Nom de la station
        $("#stationData").append("<p id = 'nameStation'></p>");
        $("#nameStation").text("Nom de la station : ");     
        $("#nameStation").append("<span></span>")
        $("#nameStation span").text(station.stationName);
        
        // Adresse de la station
        $("#stationData").append("<p id = 'addressStation'></p>");
        $("#addressStation").text("Adresse : ");
        $("#addressStation").append("<span></span>");
        $("#addressStation span").text(station.stationAddress);
        
        // Status de la station
        $("#stationData").append("<p id = 'statusStation'></p>");
        $("#statusStation").text("Status : ");
        $("#statusStation").append("<span></span>");
        
        if (station.stationStatus === "OPEN") {
            $("#statusStation span").css("background-color","#22e846");
            $("#statusStation span").css("padding","5px");
        }
        else if (station.stationStatus === "CLOSED") {
            $("#statusStation span").css("background-color","#ff0000");
            $("#statusStation span").css("padding","5px");    
        }
        
        $("#statusStation span").text(station.stationStatus);
        
        // Capacité de la station
        $("#stationData").append("<p id = 'capacityStation'></p>");
        $("#capacityStation").text("Capacité : ");
        $("#capacityStation").append("<span></span>");
        $("#capacityStation span").text(station.stationCapacity);
        
        MapVelib.storageDataStation(station);
        
        // Nombre de stand disponible
        $("#stationData").append("<p id = 'placeStation'></p>");
        $("#placeStation").text("Nombre de stand disponible : ");
        $("#placeStation").append("<span></span>");
        
        if (station.stationPlace === 0) {
            $("#placeStation span").css("background-color","#ff0000");
            $("#placeStation span").css("padding","5px");     
        }
        else if ((station.stationPlace >= 0) & (station.stationPlace <= 5)) {
            $("#placeStation span").css("background-color","#fc7c14");
            $("#placeStation span").css("padding","5px");          
        }
        else if (station.stationPlace > 5) {
            $("#placeStation span").css("background-color","#22e846");
            $("#placeStation span").css("padding","5px");          
        }    
        $("#placeStation span").text(station.stationPlace);
        
        // Nombre de vélos disponible
        $("#stationData").append("<p id = 'velosStation'></p>");
        $("#velosStation").text("Nombre de vélos disponible : ");
        $("#velosStation").append("<span></span>");
        
         if (station.stationNbVelos === 0) {
            $("#velosStation span").css("background-color","#ff0000");
            $("#velosStation span").css("padding","5px");     
        }
        else if ((station.stationNbVelos >= 0) & (station.stationNbVelos <= 5)) {
            $("#velosStation span").css("background-color","#fc7c14");
            $("#velosStation span").css("padding","5px");          
        }
        else if (station.stationNbVelos > 5) {
            $("#velosStation span").css("background-color","#22e846");
            $("#velosStation span").css("padding","5px");          
        }    
        $("#velosStation span").text(station.stationNbVelos);
        
        
    },
    
    reservation : function (station) {
        
        $("#reserver").click( function () {
            $("#statusReservation").text("RESERVATION");
            $("#data").append("<div id ='blockSign'></div>");
            $("#blockSign").append("<canvas id ='sign'></canvas>");
            $("#sign").before("<p>Signature :</p>");
            
            //  Insertion des bouton confirmer et reset pour la signature
            $("#reserver").replaceWith("<button id='confirm'>Confirmer</button>");
            $("#blockSign").before("<button id='reset'>Reset</button>");
            canvasSign.create();
            
            $("#confirm").click( function () {
                
                if (canvasSign.clickX.length > 30) {
                    
                    sessionStorage.clear();
                    station.bikeReservation = 1;

                    // Suppression des boutons "confirmer" et "reset" et du block signature
                    $("#data").empty();
                    MapVelib.dataStation(station);

                    // Changement de donnée suite à la confirmation de la réservation 
                    $("#statusReservation").text("RESERVATION EN COURS");
                    $("#velosStation span").text(station.stationNbVelos -= 1);
                    $("#placeStation span").text(station.stationPlace +=1);
                    sessionStorage.setItem("dateReservation",Date.now());
                    timeReserve.init();
                    timeReserve.time;
                    $("footer").append("<button id = 'buttonAnnule'>Annuler</button>");

                    // Enregistrement des éléments important de la réservation dans le navigateur
                    sessionStorage.setItem("positionLatReservation",station.position.lat());
                    sessionStorage.setItem("positionLngReservation",station.position.lng());
                    sessionStorage.setItem("name",station.stationName);
                    sessionStorage.setItem("nbVelos",station.stationNbVelos);
                    sessionStorage.setItem("nbPlaceStand",station.stationPlace);
                    sessionStorage.setItem("message","Vous avez réservé un vélib pour la station : ");
                    sessionStorage.setItem("buttonCancel","<button id = 'buttonAnnule'>Annuler</button>");
                    sessionStorage.setItem("bikeReservation",station.bikeReservation);
                    station.setOptions({'icon' : 'images/blue-bike.png'});

                    $("#reservation").replaceWith("<p id ='reservation'>Vous avez réservé un vélib pour la station : " + station.stationName + "</p>");
                    $("#blockSign").empty();
                    MapVelib.annulation();
                }
                
                else {
                    alert("La signature est obligatoire !");
                }
            });
        });
    },

    storageDataFooter : function () {
        if (sessionStorage.getItem("name") != null) {
            var nameStation = sessionStorage.getItem("name");
            $("#reservation").replaceWith("<p id ='reservation'>Vous avez réservé un vélib pour la station : " + nameStation + "</p>");
            timeReserve.init();
            timeReserve.time;
            $("footer").append(sessionStorage.getItem("buttonCancel"));
            MapVelib.annulation();
        }
    },
    
    storageDataStation : function (station) {
        var nbVelos = parseFloat(sessionStorage.getItem("nbVelos"));
        var nbPlace = parseFloat(sessionStorage.getItem("nbPlaceStand"));
        if (station.icon === "images/blue-bike.png") {
            station.stationPlace = nbPlace;
            station.stationNbVelos = nbVelos;
            $("#statusReservation").text("RESERVATION EN COURS");
        }
    },
    
    endReservation : function () {
        $("footer").empty();
        $("footer").append("<p id = 'reservation'>Le temps de réservation de votre Velib a expiré.</p>");
        $("#blockSign").append("<canvas id ='sign'></canvas>");
        $("#statusReservation").text("STATION SELECTIONNEE");

        // Rajout dans le tableau d'information de la station le vélo
        var veloStopReservation = parseFloat(sessionStorage.getItem("nbVelos"));
        $("#velosStation span").text(veloStopReservation +=1);

        // Retrait d'une place dans la station
        var placeStopReservation = parseFloat(sessionStorage.getItem("nbPlaceStand"));
        $("#placeStation span").text(placeStopReservation -=1);
        sessionStorage.clear();

        // Rafraîchissement de la Map
        MapVelib.init();    
    },
    
    annulation : function (){
        $("#buttonAnnule").click( function (){
            // Message d'annulation de la réservation
            $("#data").append("<p id = 'alertReservation'></p>");
            $("#alertReservation").css("font-size","2em");
            $("#alertReservation").css("background-color","red");
            $("#alertReservation").css("color", "white");
            $("#alertReservation").text("Votre réservation a bien été annulé");
            clearInterval(timeReserve.time);
            MapVelib.endReservation();   
        });
    }
}
MapVelib.init();





