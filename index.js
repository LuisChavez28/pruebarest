const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbo;

///////////////////////////////////////////////////////
//raiz
app.post('/', function (req, res){
  res.status(404);
});
///////////////////////////////////////////////////////
app.post('/mutation', function (req, res) {
 var dna = {
   adn : req.body.dna
 } 
 /////////////////////////////////////////////////////
 /////////////////////////se obiene el numero de filas
 /////////////////////////////////////////////////////
 var filas = dna.adn.length;


/////////////////////////////////////////////////////
////////////////validamos que sea una matriz cuadrada
/////////////////////////////////////////////////////
 for (var i=0; i<filas; i++) { 
   //console.log(" valor "+ i + " " + dna.adn[i] + " "+ dna.adn[i].length);
   var columnas = dna.adn[i].length;
   if( filas == columnas){
     var cuadrada = true;
   }else{
     var cuadrada = false;
     break;
   }
  }
/////////////////////////////////////////////////////
///////////////////////////verificacion de mutaciones
/////////////////////////////////////////////////////
 if(cuadrada == true){

  var a = 0;
  var t = 0;
  var c = 0;
  var g = 0;
/////////////////////////////////////////////////////
///////////////////////////verificacion de horizontal
/////////////////////////////////////////////////////
   for(i = 0; i < filas; i++){
      for(var j = 0; j < columnas; j++){
         if(dna.adn[i][j] == "A"){
           a++;
         }

         if(dna.adn[i][j] == "T"){
          t++;
        }

        if(dna.adn[i][j] == "C"){
          c++;
        }

        if(dna.adn[i][j] == "G"){
          g++;
        }

        if(a > 3 || t > 3 || c > 3 || g > 3){
          var mo = true;
        }else{
          var mo = false;
        }
      }
      //console.log("++****+++***");
      //console.log("Fila "+ i);
      //console.log("A : " + a);
      //console.log("T : " + t);
      //console.log("C : " + c);
      //console.log("G : " + g);
      
      a = 0;
      t = 0;
      c = 0;
      g = 0;
   }

/////////////////////////////////////////////////////
/////////////////////////////verificacion de vertical
/////////////////////////////////////////////////////
for(j = 0; j < filas; j++){
  for(i = 0; i < columnas; i++){
     if(dna.adn[i][j] == "A"){
       a++;
     }

     if(dna.adn[i][j] == "T"){
      t++;
    }

    if(dna.adn[i][j] == "C"){
      c++;
    }

    if(dna.adn[i][j] == "G"){
      g++;
    }

    if(a > 3 || t > 3 || c > 3 || g > 3){
      var mv = true;
    }else{
      var mv = false;
    }
  }
  //console.log("++****+++***");
  //console.log("Colimna "+ j);
  //console.log("A : " + a);
  //console.log("T : " + t);
  //console.log("C : " + c);
  //console.log("G : " + g);
  
  a = 0;
  t = 0;
  c = 0;
  g = 0;
}

  /////////////////////////////////////////////////////
  ///////////////////verificacion de diagonal principal
  /////////////////////////////////////////////////////

  for(i = 0; i < filas; i++){
    for(var j = 0; j < columnas; j++){
      if(dna.adn[i][j] == "A" && i == j){
        a++;
      }

      if(dna.adn[i][j] == "T" && i == j){
        t++;
      }

      if(dna.adn[i][j] == "C" && i == j){
        c++;
      }

      if(dna.adn[i][j] == "G" && i == j){
        g++;
      }

      if(a > 3 || t > 3 || c > 3 || g > 3){
        var mdp = true;
      }else{
        var mdp = false;
      }
    }

  }
    //console.log("++****+++***");
    //console.log("dp");
    //console.log("A : " + a);
    //console.log("T : " + t);
    //console.log("C : " + c);
    //console.log("G : " + g);
    
    a = 0;
    t = 0;
    c = 0;
    g = 0;


  /////////////////////////////////////////////////////
  ////////////////////verificacion de diagonal inversa
  /////////////////////////////////////////////////////

  for(i = 0; i < filas; i++){
    for(var j = 0; j < columnas; j++){
      if(dna.adn[i][j] == "A" && i+j == filas-1){
        a++;
      }

      if(dna.adn[i][j] == "T" && i+j == filas-1){
        t++;
      }

      if(dna.adn[i][j] == "C" && i+j == filas-1){
        c++;
      }

      if(dna.adn[i][j] == "G" && i+j == filas-1){
        g++;
      }

      if(a > 3 || t > 3 || c > 3 || g > 3){
        var mdi = true;
      }else{
        var mdi = false;
      }
    }

  }
    //console.log("++****+++***");
    //console.log("dpi");
    //console.log("A : " + a);
    //console.log("T : " + t);
    //console.log("C : " + c);
    //console.log("G : " + g);
    
    a = 0;
    t = 0;
    c = 0;
    g = 0;



if(mo || mv || mdp || mdi){
 console.log("cadena con mutacion");
 res.send("200-OK");
/////////////////////////////////////////////////////
//////////////////////////guardado en db con mutacion
/////////////////////////////////////////////////////
 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("dna");

  var myobj = { dna: dna.adn, mutacion : 1 };
  dbo.collection("dnaverificados").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("insertado");
    db.close();
  })
  
})

 res.status(404);
}else{
console.log("cadena sin mutacion");
res.send("403-Forbidden");

/////////////////////////////////////////////////////
//////////////////////////guardado en db sin mutacion
/////////////////////////////////////////////////////
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("dna");

  var myobj = { dna: dna.adn, mutacion : 0 };
  dbo.collection("dnaverificados").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("insertado");
    db.close();
  })
  
})
}


 }else{
  res.send("CADENA SIN FORMATO NxN, VERIFICA");
 }
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
 
});
//////////////////////////////////////////////////////
//**************************************************************************//
/////////////////////////////////////////////////////
//////////////////////////////consulta de informacion
/////////////////////////////////////////////////////

app.get('/stats', function (req, res){

  var mutatio = 0;
  var no_mutation = 0;

  

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("dna");
    dbo.collection("dnaverificados").find({mutacion : 0}).count(function(err, result) {
      if (err) throw err;
      console.log("en funcion"+result);
      no_mutatio = result;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dna");
        dbo.collection("dnaverificados").find({mutacion : 1}).count(function(err, result) {
          if (err) throw err;
          console.log("en funcion"+result);
          mutatio = result;
          console.log("fuera, mutacion : "+mutatio+"sin mutacion : "+no_mutatio);
          if(mutatio > no_mutatio){
            var ratio = no_mutatio /mutatio;
          }else if(mutatio < no_mutatio){
            var ratio = mutatio/no_mutatio;
          }
          var ADN = {
                       count_mutations:mutatio, 
                       count_no_mutation:no_mutatio,
                       ratio:ratio
                    }
            console.log(ADN);
            res.send(ADN);
        })
      })
    })
  })
});
//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});