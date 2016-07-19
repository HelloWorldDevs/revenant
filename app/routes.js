

module.exports = function(app, passport, Page, fs) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
        Page.fetchPage();
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
        successRedirect: '/pagesView', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/pagesView', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/pagesView', isLoggedIn, function(req, res) {
        res.render('pagesView.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/page', function(req, res, next) {
      res.render('omsi-mission.ejs', function(err, html){
        res.send(html);
        console.log('pageInit Finished');
      });
  });

    app.post('/data', function(req, res){
      // console.log(JSON.stringify(req.body));
      var json = JSON.stringify(req.body);
      fs.writeFile('./data/data.json', json);
      res.send('good job');
    })

    app.post('/dataUpdate', function(req, res){
      // console.log(JSON.stringify(req.body));
      // var json = JSON.stringify(req.body);
      fs.readFile('./data/data.json', (err, data) => {
          var jsonContent = JSON.parse(data);
          jsonContent.forEach(function(item){
            if(item.completePath === req.body.editorID){
              console.log(item);
            }
          })
          // console.log(jsonContent);
      })
      console.log(req.body);
      res.send('good job');
    })
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
