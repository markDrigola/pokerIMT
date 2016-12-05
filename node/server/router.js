function router(app, express, passport) {
    //связываем express vs ejs
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/../public'));

    app.get('/', function (req, res) {
        res.render('template',
            { page: "main",
              title: "Главная"}
        )
    });

    app.get('/about.html', function (req, res) {
        res.render('pages/about');
    });

    app.get('/index', function (req, res) {
        res.render('pages/index');
    });

    app.get('/tournaments', function (req, res) {
        res.render('pages/tournaments');
    });

    app.get('/statistics', function (req, res) {
        res.render('pages/statistics');
    });

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('partials/signUp', { message: req.flash('signupMessage') });
    });

    app.post('/signup', isValid, passport.authenticate('local-signup', {
        successRedirect : '/game', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/logined', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('partials/logined.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/logined', passport.authenticate('local-login', {
        successRedirect : '/game', // redirect to the secure profile section
        failureRedirect : '/logined', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/rivers', function (req, res) {
        res.render('pages/rivers');
    });

    app.get('/game', isLoggedIn,  function (req, res) {
        res.render('template', {page: "game",
            title: "game"});
    });
}
var validator = require("../lib/validator.js");

function isValid(req, res, next){
    if (validator(req,res))
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/logined');
}


module.exports = router;