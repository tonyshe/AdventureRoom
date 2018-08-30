function command(userCom) {

	userCom = userCom.toLowerCase(); //to lower case
	userCom = userCom.replace(/ +(?= )/g,'').trim(); //convert multiple space to one. trim whitespace
	userCom = userCom.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    var splitCommands = [];
    splitCommands = splitCommandToWords(userCom);
    
    console.log("command: "+ splitCommands + "," + " first word: " + splitCommands[0]); //for testing purposes
    
	//command parsing
	switch(splitCommands[0]) {
		case "help":
			newMessage('"l" or "look": Look around<br>"x ___" or "examine ___": Examine an object<br>"take ___": Take an object');
			break;

		case "l":
		case "look":
			newMessage(room.describe());
			break;

		case "x":
		case "examine":
            if (splitCommands[1]) {
                switch(splitCommands[1]) {
                    case "room":
                        newMessage(room.describeVerbose());
                        break;
                    case "self":
                    case "yourself":
                    case "you":
                    case "me":
                    case "myself":
                        newMessage("Hey look it's you.");
                        break; 
                    default:
                        //go through all things in the room and return .describeVerbose() if it's there.
                        for (var i = 0; i < room.inanimates.length; i++) {
                            if (room.inanimates[i].name == splitCommands[1]) {
                                newMessage(room.inanimates[i].describeVerbose());
                                return;
                            };
                        for (var i = 0; i < room.contains.length; i++) {
                            if (room.contains[i].name == splitCommands[1]) {
                                newMessage(room.contains[i].describeVerbose());
                                return;
                            };
                        };
                        newMessage("No such thing exists.");   
                        };
                };
            }
            else {
                newMessage("Please specify something to examine.");
			    break;
            };

		case "take":
			break;

		case "shit":
		case "fuck":
			newMessage("No need to be rude!");
			break;

		default:
			newMessage("That is not a command I recognize.");
	};
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

//String formatting functions
function capitalizeFirstLetter(string) {
	//Add capital to first letter of a sentence.
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addArticle(string) {
	//adds AN to words that start with vowels, otherwise A
	if ("aeiou".indexOf(string.charAt(0).toLowerCase()) > -1) {
		return "an " + string;
	}
	return "a " + string;
}

function splitCommandToWords(command) {
    return command.split(/\s+/);
};

//actions

//Object Mixins
let smallMixin = function(obj) {
	obj.pickup = function() {
	};
};

let containerMixin = function(obj) {
	
};

//objects
function roomObj() {
	this.contains = [];
	this.inanimates = [];

	this.addPerson = function(personObj) {this.contains.push(personObj);}
	this.addObject = function(obj) {this.inanimates.push(obj);}
    this.describeVerbose = function() {
        return "Four walls, a floor and a ceiling. Yep it's a room all right.";
    };
	this.describe = function() {
		return this.describeSelf() + " " + this.describeInanimates() + " " + this.describePeople();
	};
	this.describeSelf = function() {
		return "You are in a room.";
	};
	this.describeInanimates = function() {
        //describes all important inanimate things
        //TODO: filter out only important things. Make a temporary array of all important things and then constructing the string.
		var outString = "";
		if (this.inanimates.length == 0) {
			outString = "There is nothing in the room.";
		}
		else if (this.inanimates.length == 1) {
			outString = addArticle(this.inanimates[0].name) + " is in the room.";
		}
		else {
			for (var i = 0; i < this.inanimates.length-1; i++) {
				outString +=addArticle(this.inanimates[i].name) + ", ";
			};
			outString += "and " + addArticle(this.inanimates[i].name) + " ";
			outString += "are in the room.";
		};
		return capitalizeFirstLetter(outString);
	};

	this.describePeople = function() {
		var outString = "";
		if (this.contains.length == 0) {
			outString = "Nobody is in the room.";
		}
		else if (this.contains.length == 1) {
			outString = this.contains[0].name + " are in the room.";
		}
		else {
			for (var i = 0; i < this.contains.length; i++) {
				outString += this.contains[i].name + " ";
			};
			outString += "are in the room.";
		};
		return capitalizeFirstLetter(outString);
	};
};

function user() {
	var inventory = [];
	
	this.describe = function() {
	};
};

function personObj(name, userId) {
    this.id = userId;
	this.name = name;
    this.contains = [];
    
	this.sayStuff = function() {console.log("stuff");}
    this.describeVerbose = function() {
        var outString = "";
        if (this.id == userId) {
            outString = "Hey look it's you.";
        }
        else {
            outString = "It's " + this.name;
        };
        return outString;
        
    };
        
};

function lampObj() {
	var contains = [];

	this.name = "lamp";
	this.describeVerbose = function () {
        return "A small lamp. Its light illuminates the room."
    };
};

function wallObj() {
    var contains = [];
    this.name = "wall";
    this.describeVerbose = function() {
        return "An unadorned wall."
    };
};
    
function ceilObj() {
    var contains = [];
    this.name = "ceiling";
    this.describeVerbose = function() {
        return "An unadorned wall."
    };
};
    
function filterObj(name, color) {
	this.color = color;
	this.name = name;
};

function makeUserId() {
    //make a random UUID for user session
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


var sessionId = makeUserId();
console.log(sessionId);

var person = new personObj('You', sessionId);


var room = new roomObj();
lamp = new lampObj();
wall = new wallObj();

room.addObject(lamp);

room.addPerson(person);

newMessage(room.describe());