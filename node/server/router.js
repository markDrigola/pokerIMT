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

    app.get('/tournaments', function (req, res) {
        res.render('pages/tournaments');
    });

    app.get('/statistics', function (req, res) {
        res.render('pages/statistics');
    });

    app.get('/rivers', function (req, res) {
        res.render('pages/rivers');
    });

    app.get('/game', function (req, res) {
        res.render('template', {page: "game",
            title: "game"});
    });
}

module.exports = router;