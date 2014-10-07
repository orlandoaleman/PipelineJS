var change = 0;
var simultanius = 0;
var que = 20; // number of tests

Array(que).join(0).split(0).forEach(function(a,i){
    var xhr = new XMLHttpRequest;
    xhr.open("GET", "/?"+i); // cacheBust
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 2){
            change++;
            simultanius = Math.max(simultanius, change);
        }
        if(xhr.readyState == 4){
            change--;
            que--;
            if(!que){
                console.log(simultanius);
            }
        }
    };
    xhr.send();
});


