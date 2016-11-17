function router(app, express) {
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
    
    // app.get('/header', function (req, res) {
    //     res.render('template',
    //         {page: "header",
    //             title: "О нас",
    //             user: {
    //                 id: "12345",
    //                 name: "vasia",
    //                 fname: "petya"
    //             }
    //         }
    //     )
    // })
}

module.exports = router;