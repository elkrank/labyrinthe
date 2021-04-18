
class point{
    cout;
    h;
    g;
    f;
 
    constructor(CoordX,CoordY,IsStart,IsEnd,id,IsObstacle){
        this.CoordX     = CoordX;
        this.CoordY     = CoordY;
        this.IsStart    = IsStart;
        this.IsEnd      = IsEnd;
        this.id         = id;
        this.IsObstacle = IsObstacle;
    }
        
    
}



var uneCase = document.getElementsByClassName("uneCase");
var Tabelements;
var labyrinthe=[];
var objectif;

function distance(Xa,Xb,Ya,Yb){
    var distance = Math.sqrt(Math.pow(Xb-Xa,2)+Math.pow(Yb-Ya,2));
    return distance;
}
let nbcolonne;
let nbligne ;
    function grille(){
        nbligne = document.getElementById("nbligne").value;
         nbcolonne = document.getElementById("nbcolonne").value;
        let grille = document.getElementById("grille");
        let k=1;
   
        for( let i =1; i<=nbcolonne ; i++){

            let col = document.createElement("div");
            col.className="col";
            grille.appendChild(col);

            for(let j = 1 ;j<=nbligne  ;j++,k++){
            
                let  uneCase=document.createElement("div");
                uneCase.className ="uneCase";

                if(i==1 && j==1){

                    uneCase.id =1;
                    uneCase.style.background="Red";
                    labyrinthe.push( new point(i,j,true,false,1,false));
                    labyrinthe[0].f = 0 ;
                    col.appendChild(uneCase);

                }
                else if(i==nbcolonne && j==nbligne){

                    uneCase.id="arrive";
                    labyrinthe.push( new point(i,j,false,true,"arrive",false));
                    objectif = [i,j]
                    col.appendChild(uneCase);

                }
                else{

                    uneCase.id=  k;
                    col.appendChild(uneCase);
                    labyrinthe.push(new point(i,j,false,false,k,false));
                    
                }
                
        
            
            }
        }
        console.log(labyrinthe);
        var obstacle = function() {
            this.dataset.isObstacle=1;
            this.style.background= "grey";
            labyrinthe[this.id-1].IsObstacle = true;
            labyrinthe[this.id-1].g=10000;
            labyrinthe[this.id-1].h=10000;
            labyrinthe[this.id-1].f=10000;

           console.log(labyrinthe[this.id-1]);
        };
        var elements = document.getElementsByClassName("uneCase");
        Tabelements= Array.from(elements);
    
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', obstacle, false);
        }
        console.log("distance : "+distance(labyrinthe[98].CoordX,labyrinthe[0].CoordX,labyrinthe[98].CoordY,labyrinthe[0].CoordY));
    }
    class voisin{
    constructor(point,labyrinthe){
        this.point = point
        this.labyrinthe = labyrinthe
        this.colSize = Number(nbcolonne);
        this.rowSize = Number(nbligne);
        this.haut = labyrinthe[Number(this.point.id -1)] ;
        this.droiteHaut = labyrinthe[Number(Number(this.point.id) +Number(this.rowSize-1))] ;
        this.droite = labyrinthe[Number(Number(this.point.id)+Number(this.rowSize-1)) ];
        this.droiteBas =labyrinthe[Number(Number(this.point.id) + Number(this.rowSize+1)-1)] ;
        this.bas = labyrinthe[Number(this.point.id+1-1 )];
        this.gaucheBas =labyrinthe[Number(Number(this.point.id) - Number(this.rowSize+ 1)-1)]  ;
        this.gauche = labyrinthe[Number(Number(this.point.id) -Number(this.rowSize)-1)] ;
        this.gaucheHaut = labyrinthe[Number(Number(this.point.id) - Number(this.rowSize-1) )];

        if(this.point.isObstacle==true){
            console.log("OBSTACLE");
            this.point.g = 10000;
            this.point.h = 10000;
            this.point.f = 10000;
        }
        if(this.point.id== 1){
            this.haut = null;
        }
        if(this.point.CoordY ==1){
            this.gauche = null;
        }
        if(this.point.CoordX ==1){
            this.gauche = null;
            this.gaucheBas=null;
            this.gaucheHaut = null;
        }
        if(this.point.CoordX ==1 && this.point.CoordY == 1){
            this.haut = null;
            this.gauche = null;
            this.gaucheHaut=null;
            this.droiteHaut=null;
        }
        if(this.point.CoordX == this.rowSize){
            this.bas = null;
        }
        if(this.point.CoordY == this.colSize){
            this.droite = null;
        }
        if(this.point.CoordX == this.rowSize &&this.point.CoordY == this.colSize){
            this.droiteBas = null;
        }
        this.listVoisin = [this.haut,this.droiteHaut,this.droite,this.droiteBas,this.bas,this.gaucheBas,this.gauche,this.gaucheHaut]
        }
    }
   // TODO : GERER LES CAS OU LES CASE NE SONT PAS POSSIBLE
  
    
  

function A_star(){
   
    var current = labyrinthe[0];
    var end = labyrinthe[labyrinthe.length-1];
    // tant que le point courant est different de du point de fin on continue
    var lowestWeight;
    while(current.id!=end.id){
        var CurrentVoisin =  new voisin(current,labyrinthe);
        var min=100 ;
        // je boucle sur la liste des voisin pour trouver celui de poid le plus faible 
        for(var i = 0 ; i<CurrentVoisin.listVoisin.length-1; i++){

            if(CurrentVoisin.listVoisin[i]!=null && CurrentVoisin.listVoisin[i].IsObstacle==true ){
                CurrentVoisin.listVoisin[i].h = 10000;
                CurrentVoisin.listVoisin[i].g = 10000;
                CurrentVoisin.listVoisin[i].f = 10000;
            }

            if(CurrentVoisin.listVoisin[i]!=null  && CurrentVoisin.listVoisin[i].IsObstacle==false)/*&&CurrentVoisin.listVoisin[i].IsStart!=true*/{                
                // on recupere les coordonees du point voisin  
                var XcurrentVoisin = CurrentVoisin.listVoisin[i].CoordX;
                var YcurrentVoisin = CurrentVoisin.listVoisin[i].CoordY;
                // on calcule les distance euclidienne et le poid
                // f(n) = g(n) + h(n)
                CurrentVoisin.listVoisin[i].h = distance(XcurrentVoisin,nbligne,YcurrentVoisin,nbcolonne);        
                CurrentVoisin.listVoisin[i].g = distance(XcurrentVoisin,current.CoordX,YcurrentVoisin,current.CoordY);
                CurrentVoisin.listVoisin[i].f = Number(Number(CurrentVoisin.listVoisin[i].g)+Number(CurrentVoisin.listVoisin[i].h));
                // je compare les poids
                if(CurrentVoisin.listVoisin[i-1]!=null){
                    if(CurrentVoisin.listVoisin[i].f < min){
                        //je stock le plus faible
                        //console.log(CurrentVoisin.listVoisin[i].f);
                        min = CurrentVoisin.listVoisin[i].f;
                        lowestWeight = CurrentVoisin.listVoisin[i];
                    }
                }  else{
                        //console.log(CurrentVoisin.listVoisin[i].f);
                        lowestWeight = CurrentVoisin.listVoisin[i];
                }
            }

        }
        current = labyrinthe[Number(lowestWeight.id-1)];
        document.getElementById(current.id).style.backgroundColor = "Red";
    }
}








