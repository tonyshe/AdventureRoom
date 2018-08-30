function command(userCom) {
	var com = document.getElementById("command");
	var messages = document.getElementById("messageBox");
	var newDiv = document.createElement('div');

	//Create new div to append to MESSAGEBOX
	newDiv.className = "message";
	messages.appendChild(newDiv);

	//Create new p to insert into MESSAGE
	messageText = document.createElement('p');
	messageText.innerHTML = userCom;
	newDiv.appendChild(messageText);
}

function newMessage(msg) {
	var messages = document.getElementById("messageBox");
	var newDiv = document.createElement('div');

	//Create new div to append to MESSAGEBOX
	newDiv.className = "message";
	messages.appendChild(newDiv);

	//Create new p to insert into MESSAGE
	messageText = document.createElement('p');
	messageText.innerHTML = msg;
	newDiv.appendChild(messageText);
}

//actions
function look() {

};

//objects
function roomObj() {
	var contains = [];
	this.addPerson = function(personObj) {contains.push(personObj);}
	this.describeSelf = function() {
		return "You are in a room.";
	};
	this.describe = function() {
		var outString = "";
		if (contains.length == 0) {
			outString = "Nobody is in the room.";
		}
		else if (contains.length == 1) {
			outString = contains[0].name + " is in the room.";
		}
		else {
			for (var i = 0; i < contains.length; i++) {
				outString += contains[i].name + " ";
			};
			outString += "are in the room.";
		};
		return outString
	};
};

function person(name) {
	this.name = name;
	this.sayStuff = function() {console.log("stuff");}
};

function chair() {
	this.describe = "A wooden chair";
}

var room = new roomObj();
newMessage(room.describeSelf());


/*
var room_1 = new room();
var person_1 = new person("Joey");
var person_2 = new person("Frank");

room_1.addPerson(person_1);
room_1.addPerson(person_2);
console.log(room_1.describe());
*/