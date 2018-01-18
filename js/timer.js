/*****************************************************************************
                    DUREE DE VALIDITE DE LA RESERVATION
*****************************************************************************/

var timeReserve = {
    minutes : null,
    secondes : null,
    beginReserve : null,
    endReserve : null,
    timer : null,
    time : "",
    
    init : function () {
        $("footer").append("<p><span id = 'min'></span> minutes " + "<span id = 'sec'></span> secondes</p>");
        this.beginReserve = parseFloat(sessionStorage.getItem("dateReservation"));
        this.endReserve = this.beginReserve + (1000 * 5 );
        this.timer = this.endReserve - Date.now();
        var timeRemainingSec = Math.trunc(this.timer / 1000);
        this.secondes = timeRemainingSec % 60;
        this.minutes = Math.trunc(timeRemainingSec / 60);
        $("#min").text(timeReserve.minutes);
        $("#sec").text(timeReserve.secondes);
        
        this.time = setInterval( function () {
            if (timeReserve.secondes >= 0 ) {
            timeReserve.secondes--;
            }
            
            if (timeReserve.secondes < 0){
                timeReserve.secondes = 59;
            }
            
            if ( timeReserve.secondes === 59) {
                timeReserve.minutes--;
            }
            
            if ((timeReserve.secondes === 0) && (timeReserve.minutes === 0)){
                clearInterval(timeReserve.time);
                MapVelib.endReservation();    
            }
            
        $("#min").text(timeReserve.minutes);
        $("#sec").text(timeReserve.secondes);    
        },1000);
    }

}
