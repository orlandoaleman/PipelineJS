var express = require('express');
var router = express.Router();


router.get("/", function(req,res) {
    var timeout = Math.floor(2000 * Math.random());
    console.log("Timeout: " + timeout);

    res.write(Array(1025).join("a"));
    setTimeout(function() {
        res.end("1");
    }, timeout);

});

module.exports = router;