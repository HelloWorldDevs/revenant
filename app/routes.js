

module.exports = function(app, passport, request, cheerio, fs, _, xpath, dom) {

    app.get('/', function(req, res) {
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
      var page = 'views/omsi-mission.ejs';
        //  request url
        var url = 'http://www.omsi.edu/press';
        request(url, function(error, response, body) {
            if (error) {
                console.log(error);
            }

            if (!error) {
              //  load cheerio
              var $ = cheerio.load(fs.readFileSync(page));
                // var $ = cheerio.load(body, {
                //     normalizeWhitespace: true
                // });

                //  get xpath function
                function getXPath(element) {
                    var xpath = '';
                    //  loop walks up dom tree for all nodes
                    for (; element && element.nodeType == 1; element = element.parentNode) {
                        // gets the element node index for each element
                        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
                        // if greateer than one puts in brackets
                        id > 1 ? (id = '[' + id + ']') : (id = '');
                        // prepends to the element tagname and id to the xpath
                        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
                    }
                    return xpath;
                }
                if($('head script[src="' + '//cdn.ckeditor.com/4.5.9/standard/ckeditor.js' + '"]').length > 0) {
                  console.log('CKEditor CDN already added!');
                } else {
                  $('head').append('<script src="//cdn.ckeditor.com/4.5.9/standard/ckeditor.js"></script>');
                }
                if($('head link[href="' + '/assets/style.css' + '"]').length > 0) {
                  console.log('custom stylesheet already added')
                } else {
                  $('head').append('<link rel="stylesheet" href="/assets/style.css">')
                }


                // parse cheerio html to xml to get element by xpath
                var xml = $.xml();
                var doc = new dom().parseFromString(xml);

                //  grab page text and use lodash uniq filter to eliminate duplicates
                var $pageText = $('p');
                _.uniq($pageText);

                //  store xpath in array
                var json = [];
                $pageText.each(function(index, element) {
                    $(this).addClass('edit-text');
                    var xPath = getXPath(element);
                    var xPathText = xpath.select(xPath, doc)[0].toString()
                    json.push({
                        ptext: $(this).text(),
                        xpath: xPath,
                        elementByXpath : xPathText
                    });
                });
                fs.writeFile('views/omsi-mission.ejs', $.html() , function(error){
                  if (error) {
                    console.log(error);
                  }
                })
                //  write json to output.json
                fs.writeFile('output.json', JSON.stringify(json, null, 4), function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('File successfully written! - Check your project directory for the output.json file');
                    }
                });
            }
        });

        //  to send json data back from server.
        function readJsonFileSync(filepath, encoding){
        if (typeof (encoding) == 'undefined'){
            encoding = 'utf8';
        }
        var file = fs.readFileSync(filepath, encoding);
        return JSON.parse(file);
        }

        function getConfig(filepath){
        return readJsonFileSync(filepath);
        }

        var outputToJson = getConfig('output.json');

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
