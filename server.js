var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var port = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('TODO API Root');
});


app.get('/todos', function(req, res) {
			var query = req.query;

			var where = {};

			if (query.hasOwnProperty('completed') && query.completed === 'true') {
				where.completed = true;
			} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
				where.completed = false;
			}
			if (query.hasOwnProperty('q') && query.q.length > 0) {
				where.description = {
					$like: '%' + query.q + '%'
				};
			}
			db.todo.findAll({
				where: where
			}).then(function(todos) {
				res.json(todos);

			}, function(e) {
				res.status(500).send();
			})

			app.get('/todos/:id', function(req, res) {
				var todoId = parseInt(req.params.id, 10);

				db.todo.findById(todoId).then(function(todo) {
						if (!!todo) {
							res.json(todo.toJSON());
						} else {
							res.status(404).send();
						}
					},
					function(e) {
						res.status(500).send();

					});

			});
			app.post('/todos', function(req, res) {
				var body = _.pick(req.body, 'description', 'completed');
				db.todo.create(body).then(function(todo) {
					res.json(todo.toJSON())

				}, function(e) {
					res.status(400).json(e);

				});
			});
	});



			app.delete('/todos/:id', function(req, res) {
				var todoId = parseInt(req.params.id, 10);
				var matchedToDo = _.findWhere(todos, {
					id: todoId
				});
				if (!matchedToDo) {
					res.status(404).json("error: No todo found with that id");
				} else {
					todos = _.without(todos, matchedToDo);
					res.json(matchedToDo);
					for (var i = 0; i < todos.length; i++) {
						todos[i].id = i + 1;
					}

				}
			});

			app.put('/todos/:id', function(req, res) {
				var todoId = parseInt(req.params.id, 10);
				var matchedToDo = _.findWhere(todos, {
					id: todoId
				});
				var body = _.pick(req.body, 'description', 'completed');
				var validAttributes = {};

				if (!matchedToDo) {
					return f.status(404).send;
				}
				if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
					validAttributes.completed = body.completed;
				} else if (body.hasOwnProperty('completed')) {
					return response.status(400).send();
				}

				if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
					validAttributes.description = body.description;
				} else if (body.hasOwnProperty('description')) {
					return response.status(400).send();
				}

				_.extend(matchedToDo, validAttributes);
				res.json(matchedToDo);
			});

			db.sequelize.sync().then(function() {
				app.listen(port, function() {
					console.log('express listening on port ' + port + '!!');
				});
			});
