var User = require('../models/user');

function router(app, express, passport,io,session) {
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
            var resetInfokUser = req.user.local.nick,
                resetUserId = req.user._id;

            if(resetInfokUser === undefined || resetInfokUser === '') {
                res.cookie('personId', 'User not Logo');
                res.cookie('personId', encodeURIComponent(resetUserId));
            } else {
                // res.cookie('personId', decodeURIComponent(resetUserId));
                res.cookie('personId', encodeURIComponent(resetUserId));
                res.cookie('personInfo', encodeURIComponent(resetInfokUser));
            }

            res.render('template', {
                page: "game",
                title: "game"
            });

        });
    var usernames = {};
    var rooms = ['room1','room2','room3'];
// var
    //var roomno = 1;
        io.on('connection', function(socket){

//added user -----------------------------------------------------------------------------------------------------------|
            socket.on('adduser', function(username){
                var nameUser;
                User.findOne({_id:username},function (err, users) {
                    if(users.local.nick === null || users.local.nick === undefined) {
                        nameUser = 'Not name user ';
                        socket.username = nameUser;
                    } else {
                        nameUser = users.local.nick;
                        socket.username = nameUser;
                        usernames[username] = users.local.nick;
                    }
                    socket.room = 'room1';
                    // add the client's username to the global list

                    // send client to room 1
                    socket.join('room1');
                    // echo to client they've connected
                    socket.emit('updatechat users', 'SERVER', 'you have connected to room1');
                    // echo to room 1 that a person has connected to their room
                    socket.broadcast.to('room1').emit('updatechat users', 'SERVER', socket.username + ' has connected to this room');
                    socket.emit('updaterooms', rooms, 'room1');
                });
            });

            socket.on('sendchat', function (data) {
                // we tell the client to execute 'updatechat' with 2 parameters
                io.sockets.in(socket.room).emit('updatechat',data, socket.username);
            });
//----------------------------------------------------------------------------------------------------------------------|



//User list ------------------------------------------------------------------------------------------------------------|
            socket.on('all user list', function () {
                io.sockets.in(socket.room).emit('all user list added',usernames);
            });
//----------------------------------------------------------------------------------------------------------------------|



            // socket.on('chat message', function (msg, idUser) {
            //     //Ищем по айдишнику юзера в базе
            //     var nameUser;
            //     User.findOne({_id:idUser},function (err, users) {
            //         if(users.local.nick === null || users.local.nick === undefined) {
            //             nameUser = 'Not name user ';
            //         } else {
            //             nameUser = users.local.nick;
            //         }
            //         // Отправляем смс всем юзерам
            //         io.emit('chat messages',msg, nameUser);
            //     });
            // });
            // socket.on('chat message change', function (flag, nameUserMess) {
            //     socket.broadcast.emit('typing user', nameUserMess)
            // });
            socket.on('disconnect', function(){
                delete usernames[socket.username];
                io.sockets.emit('updateusers', usernames);
                // echo globally that this client has left
                socket.broadcast.emit('updatechat users disc', 'SERVER', socket.username + ' has disconnected');
                socket.broadcast.in(socket.room).emit('all user list added',usernames);
                socket.leave(socket.room);
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