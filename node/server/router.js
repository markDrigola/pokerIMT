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

    // app.get('/about.html', function (req, res) {
    //     res.render('pages/about');
    // });

    app.get('/index', function (req, res) {
        res.render('pages/index');
    });

    app.get('/tournaments', function (req, res) {
        res.render('pages/tournaments');
    });

    app.get('/statistics', function (req, res) {
        res.render('pages/statistics');
    });

    app.get('/rivers', function (req, res) {
        res.render('pages/rivers');
    });

    app.get('/game', isLoggedIn,  function (req, res) {
        res.render('template', {page: "game",
            title: "game"});
    });



// =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/logined', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('partials/logined.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/logined', passport.authenticate('local-login', {
        successRedirect : '/about', // redirect to the secure profile section
        failureRedirect : '/logined', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signUp', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('partials/signUp.ejs', { message: req.flash('signupMessage') });
    });

    // process the login form
    app.post('/signUp', isValid, passport.authenticate('local-signup', {
        successRedirect : '/about', // redirect to the secure profile section
        failureRedirect : '/signUp', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/about', isLoggedIn, function(req, res) {
        res.render('template', {
            user : req.user, // get the user out of session and pass to template
            page: "about",
            title: "Личный кабинет"
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

}
var validator = require("../lib/validator.js");

function isValid(req, res, next){
    if (validator(req,res)) {
        return next();
        res.redirect('/about');
        console.log("router valid ok")
    } else {
        res.redirect('/signUp');
        console.log("router valid no")
    }


    // if they aren't redirect them to the home page



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