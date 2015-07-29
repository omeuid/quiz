var path = require('path');

// Postgresql DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, {dialect: protocol, protocol: protocol, port: port, host: host, storage: storage, omitNull: true});

//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Importar la definición de la tabla Quiz en quiz.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exportar definición de la tabla Quiz
exports.Comment = Comment;

//sequelize.sync() crea e inicializar tabla de pregunta en DB
sequelize.sync().then(function(){
	//sucess(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count===0) { // la tabla solo se iniciliza si está vacia
			Quiz.create({ 
				tema: 'otro',
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'});
			Quiz.create({
				tema: 'otro', 
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa'})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});