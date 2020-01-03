var express= require ('express');
var app = express();
var bodyParser= require ('body-parser');
var _ = require('underscore');

var port = process.env.PORT || 3000;
var todos=[];
var todoNextId=1;

app.use(bodyParser.json());

app.get('/',function(req,res) {
	res.send('TODO API Root');
});

app.get('/todos',function(req,res) {
	res.json(todos);
});

app.get('/todos/:id',function(req,res) {
	var todoId = parseInt(req.params.id,10);
	var matchedToDo = _.findWhere(todos,{id:todoId});
	/*var matchedToDo;
	todos.forEach(function(todo) {
		if(todoId === todo.id){
			matchedToDo=todo;
		}
	});*/

	if (matchedToDo){
		res.json(matchedToDo);
	}else{
		res.status(404).send();
	}
})
app.post('/todos',function(req,res) {
	 var body=_.pick(req.body,'description','completed');

	if(!_.isBoolean(body.completed)|| !_.isString(body.description)|| !body.description.trim().length === 0){
		return res.status(400).send();
	}

	body.description = 	body.description.trim();

	body.id = todoNextId++;
	todos.push(body);

	console.log('description: '+body.description);
	res.json(body);

});
app.listen(port,function() {
	console.log('express listening on port '+ port + '!!');
});