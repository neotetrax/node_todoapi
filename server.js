var server = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = server();
var PORT = process.env.PORT || 3000;
//creaing todo list
var lists = [];
var nextId = 1;

//middle ware 
app.use(bodyParser.json());
//accesing todo list

//fetching individual todos
app.get('/todos/:id', function(req, res) {
	var todos = parseInt(req.params.id, 10); //give string as json
	var matchedtodos;
	matchedtodos = _.findWhere(lists, {
		id: todos
	}); //underscore js

	/* lists.forEach(function(list) {
        if (todos === list.id) {
            matchedtodos = list;
        }
    });*/
	if (matchedtodos) {
		res.json(matchedtodos);
	} else {
		res.status(404).send();
	}
});

//post request of todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'task', 'completed');
	if (!_.isBoolean(body.completed) || !_.isString(body.task) || !body.task.trim()) {
		return res.status(400).send();
	}
	body.task = body.task.trim();
	//add id to todo
	body.id = nextId++;
	//push the id
	lists.push(body);
	res.json(body);


});
//delete request by underscore 
app.delete('/todos/:id', function(req, res) {
	var todos = parseInt(req.params.id, 10);
	var matchedtodos = _.findWhere(lists, {
		id: todos
	});
	if (!matchedtodos) {
		res.status(404).json("not found");
	} else {
		lists = _.without(lists, matchedtodos);
		res.send(matchedtodos);
	}

});

//update request
app.put('/todos/:id', function(req, res) {
	var todos = parseInt(req.params.id, 10);
	var matchedtodos = _.findWhere(lists, {
		id: todos
	});
	var body = _.pick(req.body, 'task', 'completed');
	var Attrib = {};
	if (!matchedtodos) {
		return res.status(404).send();
	}
	
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		Attrib.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		res.status(400).send();
	}

	if (body.hasOwnProperty('task') && _.isString(body.task) && body.task.trim().length > 0) {
		Attrib.task = body.task;

	} else if (body.hasOwnProperty('task')) {
		res.status(400).send();

	}
	_.extend(matchedtodos, Attrib);
	res.json(matchedtodos);
});

//query params based serching
app.get('/todos',function(req,res){
	var queryParams = req.query;
	var searchedList= lists;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		 searchedList = _.where(searchedList,{completed:true});
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		 searchedList = _.where(searchedList,{completed:false});
	}
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		searchedList = _.filter(searchedList,function(list){
			return list.task.toLowerCase().indexOf(queryParams.q.toLowerCase())> -1;
		}
		)
	}
	res.json(searchedList);
})








app.get('/', function(req, res) {
	res.send('<h1>Hai Krypton</h1>');
});

app.listen(PORT, function() {
	console.log('server is running on ' + PORT)
});