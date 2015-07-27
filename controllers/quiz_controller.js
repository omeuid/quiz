var models = require('../models/models.js');
// Autoload - factorio el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	console.log('LOAD'+quizId);
	console.log('LOAD'+models.Quiz.find(quizId));

	models.Quiz.find(quizId).then(
		function(quiz) {
			console.log('function quiz');
			if (quiz) {
				req.quiz = quiz;
				next();				
			} else { next(new Error('No existe quizes=' + quizId));}
	}).catch(function(error){next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	console.log('AAAAAAAA');
	var search = req.query.search;
	if (search) {
		search = '%' + search.replace(/\s/g, '%') + '%';
	} else {
		search = '%';
	}	
	models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
		res.render('quizes/index', { quizes: quizes, errors: []});
	}).catch(function(error) {next(error);})
}

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: []});	
};

// GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(// crea objecto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"});
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(
		function(err) {
			if(err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				// guarda en DB los campos pregunta y respuesta de quiz
				quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
					res.redirect('/quizes') //Redirección HTTP (URL relativo) lista de preguntas.
				})		
			}
		}
	)
};