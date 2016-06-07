

module.exports = function(app, passport, request, cheerio, fs, _, xpath, dom, Page) {

    app.get('/', function(req, res) {
    //   request('http://www.omsi.edu/history-and-mission', function (error, response, body) {
    //     if (error){
    //       console.log(error);
    //     }
    //     if (!error){
    //       console.log(body);
    //       var $ = cheerio.load(body);
    //       fs.writeFile('views/omsi-mission-backup.ejs', $.html(), function(error){
    //           console.log(error);
    //       });
    //     }
    // });
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });

    });

    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/change', function(req, res) {
        req.flash('info', 'Review your changes');
        res.render('omsi-mission.ejs', {
            message: req.flash('info')
        });
    });

    app.get('/page', function(req, res) {
      Page.loadPage('./views/omsi-mission-backup.ejs');
      Page.addScripts();
      Page.writeJson();
      Page.writeToPage('./views/omsi-mission.ejs', 'output.json' );
      res.render('omsi-mission.ejs');
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
