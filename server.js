var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');

var port = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('TODO API Root');
});


app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	// var todoId = parseInt(req.params.id,10);	
	// var matchedToDo = _.findWhere(todos,{id:todoId});
	// var body=_.pick(req.body,'description','completed');
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === "true") {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		})
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === "false") {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;

		})
	}


	res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
var todoId = parseInt(req.params.id, 10);
	  		var matchedToDo = _.findWhere(todos, {
		id: todoId
	});
	/*var matchedToDo;
	todos.forEach(function(todo) {
		if(todoId === todo.id){
			matchedToDo=todo;
		}
	});*/

	if (matchedToDo) {
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}

})
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || !body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	body.id = todos.length + 1;
	todos.push(body);

	console.log('description: ' + body.description);
	res.json(body);

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
		return res.status(404).send;
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

app.listen(port, function() {
	console.log('express listening on port ' + port + '!!');
});