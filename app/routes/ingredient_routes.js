// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for ingredients
const Ingredients = require('../models/ingredient')

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



// CREATE
// POST /ingredients
router.post('/ingredients', (req, res, next) => {
	// set owner of new ingredient to be current user
	// req.body.ingredient.owner = req.user.id
	console.log('this is req.body.Ingredient.price', req.body.Ingredient.price)

	Ingredients.create(req.body.Ingredient)
		// respond to succesful `create` with status 201 and JSON of new "ingredient"
		.then((ingredient) => {
			res.status(201).json({ ingredient: ingredient.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

module.exports = router
