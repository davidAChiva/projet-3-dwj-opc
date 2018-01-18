/***********************************************************************
                       Création du Prototype Canvas
***********************************************************************/
var Canvas = {
    css : "",
    drawing : "",
    clear : "",
    init : function (objNumber,name,id,height,width) {
        this.objNumber = objNumber;
        this.name = name;
        this.id = id;
        this.height = height;
        this.width = width;
    },
    create : function () {
        var canvasHtml = document.getElementById(this.id);
        canvasHtml.setAttribute("height",this.height);
        canvasHtml.setAttribute("width",this.width);
        var context = canvasHtml.getContext("2d");
        this.css();
        this.drawing(context);
        this.clear(context);
    } 
} 

// Création de l'objet basé sur Canvas
var canvasSign = Object.create(Canvas);

canvasSign.init(1,"signature","sign","200px","300px");

canvasSign.css = function () {
    $("#" + this.id).css("border","2px #0A4770 solid");
    $("#" + this.id).css("background-color","white");
}

// Création des tableaux pour les coordonnées
canvasSign.clickX = [];
canvasSign.clickY = [];
canvasSign.clickDrag = [];

canvasSign.drawing = function (context) {
    
    var paint;
    
// enregistrement des clicks dans les tableaux
    function addClick(x, y, dragging) {

      canvasSign.clickX.push(x);
      canvasSign.clickY.push(y);
      canvasSign.clickDrag.push(dragging);
    }
    
    function redraw() {
  
  
      context.strokeStyle = "black";
      context.lineWidth = 1;
			
      for(var i=0; i < canvasSign.clickX.length; i++) {
          
        context.beginPath();
          
        if(canvasSign.clickDrag[i] && i) {
            context.moveTo(canvasSign.clickX[i-1], canvasSign.clickY[i-1]);
        }
          
        else {
            context.moveTo(canvasSign.clickX[i]-1, canvasSign.clickY[i]);
        }
        context.lineTo(canvasSign.clickX[i], canvasSign.clickY[i]);
        context.closePath();
        context.stroke();
        }
    }
    
    $("#" + this.id).on("vmousedown",function(e) {
      // Pour stopper le scroll vertical lors de la signature
      e.preventDefault();
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;

      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      redraw();
    });
    
    $("#" + this.id).on("vmousemove",function(e) {
        if(paint){
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });
    
    $("#" + this.id).on("vmouseup",function(e) {
        paint = false;
    });
    
    $("#" + this.id).on ("vmouseout",function(e) {
        paint = false;
    });
}

canvasSign.clear =  function (context) {
    
    $("#reset").click( function (){
        context.clearRect(0 , 0, 300, 200);
        canvasSign.clickX = [];
        canvasSign.clickY = [];
        canvasSign.clickDrag = [];
    });
    
     $("#confirm").click( function () {
        // !! Important setTimeout pour laisser un délai pour l'événement click de la réservation
        setTimeout( function () {
        context.clearRect(0 , 0, 300, 200);
        canvasSign.clickX = [];
        canvasSign.clickY = [];
        canvasSign.clickDrag = [];
        },1000);
    });
}
