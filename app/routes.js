

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

    app.post('/change', function(req, res) {
        req.flash('info', 'Review your changes');
        res.render('profile-changed.ejs', {
            message: req.flash('info')
        });
    });

    app.get('/data', function(req, res) {

        //request url
        var url = 'http://www.omsi.edu/history-and-mission';
        request(url, function(error, response, body) {
            if (error) {
                console.log(error);
            }
            if (!error) {
              //load cheerio
                var $ = cheerio.load(body, {
                    normalizeWhitespace: true
                });

                //get xpath function
                function getXPath(element) {
                    var xpath = '';
                    for (; element && element.nodeType == 1; element = element.parentNode) {
                        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
                        id > 1 ? (id = '[' + id + ']') : (id = '');
                        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
                    }
                    return xpath;
                }

                // parse cheerio html to xml to get element by xpath
                var xml = $.xml();
                var doc = new dom().parseFromString(xml);

                //grab page text and use lodash uniq filter to eliminate duplicates
                var $pageText = $('p');
                _.uniq($pageText);

                //store xpath in array
                var json = [];
                $pageText.each(function(index, element) {
                    var xPath = getXPath(element);
                    var xPathText = xpath.select(xPath, doc).toString()
                    json.push({
                        ptext: $(this).text(),
                        xpath: xPath,
                        elementByXpath : xPathText
                    });
                });

                //write json to output.json
                fs.writeFile('output.json', JSON.stringify(json, null, 4), function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('File successfully written! - Check your project directory for the output.json file');
                    }
                });
            }
        });
        var outputToJson;

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

        //assume that config.json is in application root

        outputToJson = getConfig('output.json');

        res.send(outputToJson);
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
