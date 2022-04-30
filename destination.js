var express = require('express');
var router = express.Router();
var connection = require('../database');
/* GET home page. */
router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM trips ORDER BY id desc', function(err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('trips', { page_title: "trips - Node.js", data: '' });
        } else {

            res.render('trips', { page_title: "trips - Node.js", data: rows });
        }

    });

});
// SHOW ADD USER FORM
router.get('/add', function(req, res, next) {
        // render to views/user/add.ejs
        res.render('tripss/add', {
            title: 'Add New trips',
            country: '',
            city: ''
        })
    })
    // ADD NEW USER POST ACTION
router.post('/add', function(req, res, next) {
        req.assert('country', 'country is required').notEmpty() //Validate country
        req.assert('city', 'A valid city is required').iscity() //Validate city

        var errors = req.validationErrors()

        if (!errors) { //No errors were found.  Passed Validation!


            var user = {
                country: req.sanitize('country').escape().trim(),
                city: req.sanitize('city').escape().trim()
            }

            connection.query('INSERT INTO trips SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/user/add.ejs
                    res.render('trips/add', {
                        title: 'Add New trip',
                        country: user.country,
                        city: user.city
                    })
                } else {
                    req.flash('success', 'Data added successfully!');
                    res.redirect('/trips');
                }
            })
        } else { //Display errors to user
            var error_msg = ''
            errors.forEach(function(error) {
                error_msg += error.msg + '<br>'
            })
            req.flash('error', error_msg)

            /**
             * Using req.body.country 
             * because req.param('country') is deprecated
             */
            res.render('trips/add', {
                title: 'Add New trip',
                country: req.body.country,
                city: req.body.city
            })
        }
    })
    // SHOW EDIT USER FORM
router.get('/edit/(:id)', function(req, res, next) {

        connection.query('SELECT * FROM trips WHERE id = ' + req.params.id, function(err, rows, fields) {
            if (err) throw err

            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'trips not found with id = ' + req.params.id)
                res.redirect('/trips')
            } else { // if user found
                // render to views/user/edit.ejs template file
                res.render('trips/edit', {
                    title: 'Edit trip',
                    //data: rows[0],
                    id: rows[0].id,
                    country: rows[0].country,
                    city: rows[0].city
                })
            }
        })

    })
    // EDIT USER POST ACTION
router.post('/update/:id', function(req, res, next) {
    req.assert('country', 'country is required').notEmpty() //Validate nam           //Validate age
    req.assert('city', 'A valid city is required').iscity() //Validate city

    var errors = req.validationErrors()

    if (!errors) {
        var user = {
            country: req.sanitize('country').escape().trim(),
            city: req.sanitize('city').escape().trim()
        }

        connection.query('UPDATE trips SET ? WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/user/add.ejs
                res.render('trips/edit', {
                    title: 'Edit trip',
                    id: req.params.id,
                    country: req.body.country,
                    city: req.body.city
                })
            } else {
                req.flash('success', 'Data updated successfully!');
                res.redirect('/trips');
            }
        })

    } else { //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.country 
         * because req.param('country') is deprecated
         */
        res.render('trips/edit', {
            title: 'Edit trip',
            id: req.params.id,
            country: req.body.country,
            city: req.body.city
        })
    }
})

// DELETE USER
router.get('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }

    connection.query('DELETE FROM trips WHERE id = ' + req.params.id, user, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
                // redirect to users list page
            res.redirect('/trips')
        } else {
            req.flash('success', 'trip deleted successfully! id = ' + req.params.id)
                // redirect to users list page
            res.redirect('/trips')
        }
    })
})
module.exports = router;