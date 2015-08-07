var models = require('../models/models.js');

// GET /statistics
exports.show = function(req, res) {	
	var totalQuizes = 0;
	var totalComments = 0;
	var commentsPerQuiz = 0;
	var totalQuizesWithComments = 0;
	var totalQuizesWithoutComments = 0;
	models.Quiz.count().then(function(c) {
		totalQuizes = c;
		models.Comment.count().then(function(c){
			totalComments = c;
			commentsPerQuiz = totalComments / totalQuizes;
			models.Quiz.count({ distinct: true, include: [ { model: models.Comment, required: true} ]}).then(function(c){				
				totalQuizesWithComments = c;
				totalQuizesWithoutComments = totalQuizes - totalQuizesWithComments;
				res.render('statistics/show', {totalQuizes: totalQuizes, totalComments: totalComments, commentsPerQuiz: commentsPerQuiz.toFixed(2), totalQuizesWithComments: totalQuizesWithComments, totalQuizesWithoutComments: totalQuizesWithoutComments, errors: []});		
			});				
		});		
	});	
};
