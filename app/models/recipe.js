const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
	{

        title: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true,
        },
		ingredientsArr: [{
            type: Object
        }],
        instructions: {
            type: String,
            required: true
        },
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Recipe', recipeSchema)
