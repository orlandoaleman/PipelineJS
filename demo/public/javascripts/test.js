//--- COMPRUEBA CUANTAS PETICIONES ASINCRONAS ESTAN SIENDO SIMULTANEADAS

var change = 0;
var simultanius = 0;
var timeoutMax = 400;
var numberOfTests = 20;
var remaining = numberOfTests;
var rutaDeConsulta = "/test500";


Array(numberOfTests).join(0).split(0).forEach(function(a,i){
//    var timeout = Math.floor(timeoutMax * Math.random());

//    setTimeout(function() {
        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 2) { // Recibida en el server
                change++;
                simultanius = Math.max(simultanius, change);
            }
            if (xhr.readyState == 4) { // Finalizada
                console.log("Conexion #" + i + " finalizada (time: " + Date.now() + ")");
                change--;
                remaining--;
                if (!remaining) {
                    console.log(simultanius);
                }
            }
        };

        xhr.open("GET", rutaDeConsulta); // cacheBust
        xhr.send();

//    }, timeout);

});
