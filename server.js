var express= require ('express');
var app = express();
var port = process.env.PORT || 3000;
var todos=[{
	id:1,
	description: 'Grocery',
	completed: false

},{
	id:2,
	description:'servicing',
	completed:false
},{
	id:3,
	description:'school',
	completed:true

}
];
app.get('/',function(req,res) {
	res.send('TODO API Root');
});

app.get('/todos',function(req,res) {
	res.json(todos);
});

app.get('/todos/:id',function(req,res) {
	var todoId = parseInt(req.params.id,10);
	var matchedToDo;
	todos.forEach(function(todo) {
		if(todoId === todo.id){
			matchedToDo=todo;
		}
	});

	if (matchedToDo){
		res.json(matchedToDo);
	}else{
		res.status(404).send();
	}
})

app.listen(port,function() {
	console.log('express listening on port '+ port + '!!');
});