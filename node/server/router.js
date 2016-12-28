var User = require('../models/user');

function router(app, express, passport,io) {
    //связываем express vs ejs
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/../public'));
    app.get('/', function (req, res) {
        res.render('template',
            { page: "main",
              title: "Главная"}
        )
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

    app.get('/rivers', function (req, res) {
        res.render('pages/rivers');
    });



        app.get('/game', isLoggedIn,  function (req, res) {
            var resetNickUser = req.user.local.nick;

            if(resetNickUser === undefined || resetNickUser === '') {
                res.cookie('personId', decodeURIComponent('User not Logo'));
            } else {
                res.cookie('personId', decodeURIComponent(resetNickUser));
            }

            res.render('template', {
                page: "game",
                title: "game"
            });

        });

// var
        io.on('connection', function(socket){
            socket.on('user this chat', function (nick) {
                socket.broadcast.emit('user connection', nick);
            });

            socket.on('chat message', function(msg, nameUserMess){
                io.emit('chat message', msg, nameUserMess);
            });

            socket.on('chat message change', function (flag, nameUserMess) {
                socket.broadcast.emit('typing user', nameUserMess)
            });
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });

        });



    function obtainedUser(req, res) {

        User.findOne({_id:req.user._id}, function(err, user) {
            var thisUser;
            if (err) {
                res.send("error");
                return;
            }
            if(user.local.nick == null || user.local.nick == undefined) {
                thisUser = 'Anonimus user'
            } else {
                thisUser = user.local.nick;
            }
            return thisUser;
        });

    }

// =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/logined', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('partials/logined.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/logined', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
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
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signUp', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        User.findOne({_id:req.user._id},function (err, usersThis) {
            res.render('template', {
                user : usersThis, // get the user out of session and pass to template
                page: "profile",
                title: "Личный кабинет"
            });
        });
    });

    // app.post('/formProfile', function (req, res) {
    //     User.find(req.user._id,function (err, usersThis) {
    //         usersThis[0].local.nick = req.body.nick;
    //         usersThis[0].save();
    //     });
    //     // res.redirect('/profile')
    // });

    // app.post('/profile', function (req, res) {
    //     console.log(req.body);
    //     User.find(req.user._id,function (err, usersThis) {
    //     usersThis[0].local.tel = req.body.tel;
    //     usersThis[0].local.password = req.body.tel;
    //         usersThis[0].save(function (err) {
    //             if (!err) {
    //                 res.send('ok');
    //             }
    //         });
    //     });
    // });

    app.post('/formProfile', isLoggedIn, function(req, res) {
        User.findOne({_id:req.user._id}, function(err, user){
            if (err) {
                res.send("error");
                return;
            }
            user.local.email = req.body.email;
            // user.local.password = user.generateHash(req.body.password);
            user.local.nick = req.body.nick;
            user.local.tel = req.body.tel;
            user.local.fio = req.body.fio;
            user.save(function(err){
                if(!err){
                    res.send(user);
                    return;
                }
                res.send('error');
            });
            console.log(user)
        })
    });
    // User.find(function (err, userAll) {
    //     console.log(userAll)
    // })
        // User.find(req.user._id,function (err, usersThis) {
        //     // console.log(usersThis[0])
        //
        //     usersThis[0].local.tel = req.body.tel;
        //     usersThis[0].save(function (err) {
        //         if (!err) {
        //             res.render('template', {
        //                 user : usersThis[0], // get the user out of session and pass to template
        //                 page: "profile",
        //                 title: "Личный кабинет"
        //             });
        //         }
        //     });
        // });
    // });


    // app.get('/aboutNavs', isLoggedIn, function(req, res) {
    //     res.render('pages/aboutNavs', {
    //         user : req.user, // get the user out of session and pass to template
    //         page: "aboutNavs",
    //         title: "Личный кабинет"
    //     });
    // });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //CHAT



}
var validator = require("../lib/validator.js");

function isValid(req, res, next){
    if (validator(req,res)) {
        return next();
        res.redirect('/profile');
    } else {
        res.redirect('/signUp');
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