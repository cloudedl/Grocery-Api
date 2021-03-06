// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for user
const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { ingredient: { title: '', text: 'foo' } } -> { ingredient: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /recipes
router.get('/users', requireToken, (req, res, next) => {
    const userId = req.data
    console.log('this is req.data', req.data)
    console.log('this is req.user._id', req.user._id)
	User.find(req.user._id)
		.then((user) => {
            console.log('this is user', user)
			// `recipes` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return user
		})
		// respond with status 200 and JSON of the recipes
		.then((fave) => {
            console.log('this is fave', fave)
            res.status(200).json({ fave: fave })
    })
		// if an error occurs, pass it to the handler
		.catch(next)
})

router.post('/favorites/', requireToken, (req, res, next) => {
    // get our favorites from req.body
    const favorites = req.body.favorites
    // get our userId from req.params.id
    const userId = req.user.id
    // find the user
    User.findById(userId)
        // handle what happens if no user is found
        .then(handle404)
        .then(user => {
            console.log('this is the user', user)
            console.log('this is the favorites', favorites)
            // push the favorites to the favorites array
            user.favorites.push(favorites)

            // save the user
            return user.save()
        })
        // then we send the user as json
        .then(user => res.status(201).json({ user: user }))
        // catch errors and send to the handler
        .catch(next)
})

module.exports = router