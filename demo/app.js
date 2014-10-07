var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Rutas
var routes = require('./routes/index');
var users = require('./routes/users');
var test500 = require('./routes/test500');


// Aplicacion
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/test500', test500);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


//
//var express = require('express'),
//    app = express();
//
//
//app.use(express.static(path.join(__dirname, 'public')));
//app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);
//
////app.get("/", function(req,res) {
////    res.write(Array(1025).join("a"));
////    setTimeout(function() {
////        res.end("a");
////    },500);
////});
//
//
//
//
//app.get('/test', function (req, res) {
//    res.render('test500.html');
//});
//
//
//var server = app.listen(8080, function(err) {
//    if(err) throw err;
//    console.log('Listening on port %d', server.address().port);
//});
//
