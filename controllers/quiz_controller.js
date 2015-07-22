var models = require('../models/models.js');
// Autoload - factorio el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();				
			} else { next(new Error('No existe quizes=' + quizId));}
	}).catch(function(error){next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	var search = req.query.search;
	if (search) {
		search = '%' + search.replace(/\s/g, '%') + '%';
	} else {
		search = '%';
	}	
	models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
		res.render('quizes/index', { quizes: quizes})
	}).catch(function(error) {next(error);})
}

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});		
};

// GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

