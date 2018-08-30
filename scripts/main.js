function command(userCom) {
	userCom = userCom.toLowerCase(); //to lower case
	userCom = userCom.replace(/ +(?= )/g,'').trim(); //convert multiple space to one. trim whitespace
	userCom = userCom.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	console.log(userCom); //for testing purposes

	//command parsing
	switch(userCom) {
		case "l":
		case "look":
			newMessage(room.describe());
			break;
		case "shit":
		case "fuck":
			newMessage("No need to be rude!");
			break;
		default:
			newMessage("That is not a command I recognize.");
	};


	/*
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
	*/
};

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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//actions

//Object Mixins
let smallMixin = function(obj) {
	obj.pickup = function() {

	};
};
//objects
function roomObj() {
	var contains = [];
	var inanimates = [];

	this.addPerson = function(personObj) {contains.push(personObj);}
	this.addObject = function(obj) {inanimates.push(obj);}
	this.describe = function() {
		return this.describeSelf() + " " + this.describeInanimates();
	};
	this.describeSelf = function() {
		return "You are in a room.";
	};
	this.describeInanimates = function() {
		var outString = "";
		if (inanimates.length == 0) {
			outString = "There is nothing in the room.";
		}
		else if (inanimates.length == 1) {
			outString = inanimates[0].describeSimple + " is in the room.";
		}
		else {
			for (var i = 0; i < inanimates.length-1; i++) {
				outString += inanimates[i].describeSimple + ", ";
			};
			outString += "and " + inanimates[i].describeSimple + " ";
			outString += "are in the room.";
		};
		return capitalizeFirstLetter(outString);
	};

	this.describePeople = function() {
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

function lampObj() {
	this.describeSimple = "a lamp";
	this.name = "lamp";
}

var room = new roomObj();
lamp = new lampObj();
room.addObject(lamp);

newMessage(room.describe());

/*
var room_1 = new room();
var person_1 = new person("Joey");
var person_2 = new person("Frank");

room_1.addPerson(person_1);
room_1.addPerson(person_2);
console.log(room_1.describe());
*/