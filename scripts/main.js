function command(userCom) {
	userCom = userCom.toLowerCase(); //to lower case
	userCom = userCom.replace(/ +(?= )/g,'').trim(); //convert multiple space to one. trim whitespace
	userCom = userCom.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); 	//remove punctuation
	userCom = userCom.replace(" the ",""); 	//remove articles
	userCom = userCom.replace(" a ",""); 	//remove articles
    var splitCommands = splitCommandToWords(userCom); //split command to word array
    
    console.log("command: "+ splitCommands + "," + " first word: " + splitCommands[0]); //for testing purposes
    
	//command parsing
	switch(splitCommands[0]) {
		case 'h':
		case "help":
			newMessage('<em>"l" or "look": Look around<br>"i": Your inventory<br>"x ___" or "examine ___": Examine something<br>"take ___": Take an object<br>"put ___ on ___": Put an object on something</em>');
			break;
		case 'i':
		case 'inventory':
			if (_user.contains.length ==0) {newMessage('You have nothing.');}
			else {newMessage('You have ' + objLister(_user.contains)[0] + '.');};
			break;
		case "l":
		case "look":
			newMessage(_room.describe());
			break;
		case "x":
		case "examine":
			//handles the examine x command
            if (splitCommands[1]) {
            	var objString = userCom.substr(userCom.indexOf(" ") + 1);
                switch(objString) {
                    case "room":
                        newMessage(_room.describeVerbose());
                        break;
                    case "door":
                    	newMessage('There appears to be no door in this room. That might be a little concerning.');
                    	break;
                    case "self":
                    case "yourself":
                    case "you":
                    case "me":
                    case "myself":
                        newMessage("Hey look it's you.");
                        break;
                    default:
                    	var examineObj = findObjByName(objString)
                        if (examineObj == 0) {
                        	newMessage("No such thing exists.");
                        }
                        else if (examineObj == -1) {
                        	newMessage('There are more than one thing by the name ' + '"' + objString + '." Please specify which one you mean.');
                        }
                        else {
                        	newMessage(examineObj.describeVerbose());
                        	break;
                        };
                };
            }
            else {
                newMessage("Please specify something to examine.");
			    return;
            };
            break;
		case "take":
			//handles the take x command
            if (splitCommands[1]) {
            	var objString = userCom.substr(userCom.indexOf(" ") + 1);
                switch(objString) {
                    case "room":
                        newMessage("I'd like to see you try that.");
                        break;
                    case "self":
                    case "yourself":
                    case "you":
                    case "me":
                    case "myself":
                        newMessage("I think you technically have that already.");
                        break;
                    default:
                    	var takeObj = findObjByName(objString)
                        if (takeObj == 0) {
                        	newMessage("No such thing exists.");
                        }
                        else if (takeObj == -1) {
                        	newMessage('There are more than one thing by the name ' + '"' + objString + '." Please specify which one you mean.');
                        }
                        else {
                        	if (takeObj.takeable) {
                        		var result = _user.addObject(takeObj);
                        		if (result == 1) {
                        			newMessage('You take the ' + takeObj.name[0] + '.');
                        		}
                        		else if (result == -1) {
                        			newMessage('You already have that!');
                        		};
                        	}
                        	else {
                        		newMessage('You cannot take that.');
                        	};
                        };
                };
            }
            else {
                newMessage("Please specify something to take.");
			    return;
            };
            break;
        case "put":
        	var putObj = userCom.match(/put (.*) on/);
        	if (putObj == null) {newMessage('Please specify what to put that on.');}
        	else {
        		putObj = putObj[1]
        		var newContainerString = userCom.match(/put (.*) on (.*)/)[2];
        		if (newContainerString == null) {newMessage('Please specify what to put that on.');}
        		else {
        			var findObjResult = findObjByName(putObj);
        			var findNewContainerResult = findObjByName(newContainerString);
        			if (typeof findObjResult == 'number') {
        				if (findObjResult == 0) {
        					newMessage('No such thing exists.');
        				}
        				else if (findObjResult == -1) {
        					newMessage('There are more than one thing by the name ' + '"' + putObj + '." Please specify which one you mean.');
        				};
        			}       				
        			else if (typeof findNewContainerResult == 'number') {
        				if (findNewContainerResult == 0) {
        					newMessage('No such thing exists.');
        				}
        				else if (findNewContainerResult == -1) {
        					newMessage('There are more than one thing by the name ' + '"' + newContainerString + '." Please specify which one you mean.');
        				};
        			}
        			else {
        				if (_user.contains.includes(findObjResult)) {
	        				var validate = findNewContainerResult.addObject(findObjResult);
	        				if (validate == 1) {newMessage('You put the ' + findObjResult.name[0] + ' on the ' + findNewContainerResult.name[0] + '.');}
	        				else if (validate == 0) {newMessage("That's not possible!");};
	        			}
	        			else {newMessage("You don't have that!")};
        			};
        		}
        	}
        	break;

		case "shit":
		case "fuck":
			newMessage("No need to be rude!");
			break;
		default:
			newMessage(capitalizeFirstLetter(splitCommands[0]) + " is not a command I recognize.");
	}; //end switch
};

function findObjInArrayByName(name,objArray) {
	//finds object by name in an array of objects
	//returns [object, index in array] if only one instance is found
	//returns 0 if no instance is found
	//returns -1 if multiple incidences are found
	var findResult = [];
    for (var i = 0; i < objArray.length; i++) {
		for (var j = 0; j < objArray[i].name.length; j++) {
			if (objArray[i].name[j] == name) {				
				findResult.push([objArray[i],i]);
				break;
			};
		};
	};
	if (findResult.length == 0) {return 0;}
	else if (findResult.length == 1) {return findResult;}
	else {return -1;};
};

function findObjByName(name) {
	//finds object in room by iterating through every .name array in every object in room.contains and room.inanimates
	//returns object if found, 0 if not found, and -1 if duplicates found.
	var examineResult = [];
    //i-level iterates on individual objects
    //j-level iterates on different possible names
    for (var i = 0; i < _room.inanimates.length; i++) {
    	for (var j = 0; j < _room.inanimates[i].name.length; j++) {
    		if (_room.inanimates[i].name[j] == name) {
    			examineResult.push(_room.inanimates[i]);
    			break;
        	};
    	};
    };
    for (var i = 0; i < _room.contains.length; i++) {
        if (_room.contains[i].name == name) {
            examineResult.push(_room.contains[i]);
            break;
        };
    };

    if (examineResult.length == 0) {return 0;}
    else if (examineResult.length == 1) {return examineResult[0];}
    else {return -1;};
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

//String functions
function objLister(objArray) {
	//goes through a list of objects and returns a list
	//first index of list is a concatenated string of "x, y... and z"
	//second index of list is the verb is/are
	var outString = ['',''];
	if (objArray.length == 0) {
		//empty list inputted
		return outString;
	}
	else if (objArray.length == 1) {
		//just one thing in list
		outString[0] += addArticle(objArray[0].name[0]);
		outString[1] = 'is';
	}
	else {
		//2 or more
		for (var i = 0; i < objArray.length-1; i++) {
			outString[0] +=addArticle(objArray[i].name[0]) + ", ";
		};
		outString[0] += "and " + addArticle(objArray[i].name[0]);
		outString[1] = 'are';
	}
	return outString;
}

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
	//splits a string with words into an array with individual words
    return command.split(/\s+/);
};

//actions

//Obj Mixins
let containerMix = function(obj, allowed = []) {
	//mixin to allow objects to contain things
	obj.contains = [];
	obj.container = true;
	obj.allowed = allowed;

	obj.addObject = function(newObj) {
		//adds object to self.contains
		//if .allowed is [], then it can accept anything
		//if .allowed is populated, then only those objects can be contained.
		//1 if successful, 0 if not allowed, -1 if object already exists in contains
		if (obj.contains.includes(newObj)) {
			return -1;
		}

		if (obj.allowed.length == 0) {
			//if .allowed is empty
			if (newObj.belongsTo) {newObj.belongsTo.removeObject(newObj.name[0]);}; //remove object from previous container's .contains
			newObj.belongsTo = this; //sets mew container
			obj.contains.push(newObj);
			return 1;
		}
		else {
			//check if in .allowed
			if (obj.allowed.includes(newObj.name[0])) {
				if (newObj.belongsTo) {newObj.belongsTo.removeObject(newObj.name[0]);}; //remove object from previous container's .contains
				newObj.belongsTo = this; //sets mew container
				obj.contains.push(newObj);
				return 1;
			}
			else {
				return 0;
			};
		};
	}
	obj.removeObject = function(objString) {
		//searches self.contains for object with objString in its .names
		//if found, removes and returns the object
		//returns 0 if not found, -1 if duplicate
		var searchObj = findObjInArrayByName(objString, obj.contains);
		if (searchObj[0] == 0) {
			return 0;
		}
		else if (searchObj[0] == -1) {
			return -1;
		}
		else {
			return obj.contains.splice(searchObj[0][1],1);
		};
	}
};

//objects
function basicObject(objInfo) {
	//Makes a basic option with {name, description, important, takeable}
	//properties: name, important, takeable
	//methods: describeVerbose
	this.name = objInfo.name || "noname";
	this.important = objInfo.important || false;
	this.takeable = objInfo.takeable || false;
	this.description = objInfo.description || "It's either undescribeable or I forgot to describe this object sorry";
	this.belongsTo || null;
	this.describeVerbose = function() {
		return this.description;
	};
};

function roomObj() {
	this.contains = [];
	this.inanimates = [];

	this.addPerson = function(personObj) {this.contains.push(personObj);}
	this.addObject = function(obj) {this.inanimates.push(obj);}
    this.describeVerbose = function() {
        return "Four walls, a floor and a ceiling. Yep it's a room all right.";
    };
	this.describe = function() {
		return this.describePeople() + " " + this.describeInanimates();
	};
	this.describeSelf = function() {
		return "You are in a room.";
	};
	this.describeInanimates = function() {
        //describes all important inanimate things
        //TODO: filter out only important things. Make a temporary array of all important things and then constructing the string.
        var importantObjects = [];
        for (var i=0; i < this.inanimates.length; i++) {
        	if (this.inanimates[i].important) {
        		importantObjects.push(this.inanimates[i].name[0]);
        	};
        };
		var outString = "";
		if (importantObjects.length == 0) {
			outString = "There is nothing in the room.";
		}
		else if (importantObjects.length == 1) {
			outString = addArticle(importantObjects[0]) + " is in the room.";
		}
		else {
			for (var i = 0; i < importantObjects.length-1; i++) {
				outString +=addArticle(importantObjects[i]) + ", ";
			};
			outString += "and " + addArticle(importantObjects[i]) + " ";
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
			outString = this.contains[0].name + " are in a room.";
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

function personObj(name, userId) {
    this.id = userId;
	this.name = name;
    
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

function makeUserId() {
    //make a random UUID for user session
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

var sessionId = makeUserId();
console.log(sessionId);
var _user = new personObj('You', sessionId);
containerMix(_user);









//room population below
var _room = new roomObj();
var _lamp = new basicObject({name: ['lamp', 'light', 'bulb'], description:'foo', important: true});
containerMix(_lamp, ['magenta filter', 'cyan filter','yellow filter']);
_lamp.colorName = "white";
_lamp.color = 9111111
_lamp.describeVerbose = function() {
	if (this.color != 9000000) {var outString = 'A small desk lamp.  Its ' + this.colorName + ' light illuminates the room.'}
	else {var outString = "Only a little light is coming from it, just enough to barely light the room."}
	var temp = objLister(this.contains);
	if (temp[1] != '') {
		outString += ' ' + capitalizeFirstLetter(temp[0] + ' ' + temp[1] + ' attached to the light bulb.'); 
	};
	return outString;
};
_lamp.addObject = function(newObj) {
	//adds object to self.contains
	//if .allowed is [], then it can accept anything
	//if .allowed is populated, then only those objects can be contained.
	//1 if successful, 0 if not allowed, -1 if object already exists in contains
	if (this.contains.includes(newObj)) {
		return -1;
	}

	if (this.allowed.includes(newObj.name[0])) {
		if (newObj.belongsTo) {newObj.belongsTo.removeObject(newObj.name[0]);}; //remove object from previous container's .contains
		newObj.belongsTo = this; //sets mew container
		this.contains.push(newObj);
			this.changeBackgroundColor(newObj.color);
		return 1;
	}
	else {
		return 0;
	};
}
_lamp.removeObject = function(objString) {
	//searches self.contains for object with objString in its .names
	//if found, removes and returns the object
	//returns 0 if not found, -1 if duplicate
	var searchObj = findObjInArrayByName(objString, this.contains);
	if (searchObj[0] == 0) {
		return 0;
	}
	else if (searchObj[0] == -1) {
		return -1;
	}
	else {
		this.changeBackgroundColor(-1*searchObj[0][0].color);
		return this.contains.splice(searchObj[0][1],1);

	};
}
_lamp.changeBackgroundColor = function(color) {
	this.color -= color
	switch(this.color - 9000000) {
		case 111111:
			this.colorName = "white";
			break;
		case 111100:
			this.colorName = "yellow";
			break;
		case 110011:
			this.colorName = "magenta";
			break;
		case 1111:
			this.colorName = "cyan";
			break;
		case 11:
			this.colorName = "blue";
			break;
		case 1100:
			this.colorName = "green";
			break;
		case 110000:
			this.colorName = "red";
			break;
		case 0:
			this.colorName = "black";
			break;
	};
	var colorString = (this.color).toString();
	colorString = colorString.replace(/1/g,"F");
	colorString = colorString.replace(/9/,"#");
	console.log(colorString);
	document.body.style.backgroundColor = colorString;
	var inputForm = document.getElementsByClassName('inputForm');
	if (this.color - 9000000 == 0) {
		document.body.style.color = "white";
		inputForm[0].style.color = "white";
	}
	else {
		document.body.style.color = "black";
		inputForm[0].style.color = "black";
	};
};

var _magentaFilter = new basicObject({name: ['magenta filter','filter','magenta'], description: "A transparent magenta filter.", takeable: true});
_magentaFilter.color = 1100;
var _cyanFilter = new basicObject({name: ['cyan filter','filter','cyan'], description: "A transparent cyan filter.", takeable: true});
_cyanFilter.color = 110000;
var _yellowFilter = new basicObject({name: ['yellow filter','filter','yellow'], description: "A transparent yellow filter.", takeable: true});
_yellowFilter.color = 11;
var _testStuff = new basicObject({name: ['test', 'test stuff', 'stuff'], description: 'Some stuff for testing.', takeable: true});
var _aha = new basicObject({name: ['A-ha CD', 'me on', 'on me', 'aha','a-ha', 'cd'], description: 'A hit single by the 80s synthpop band A-ha.', takeable: true});

var _table = new basicObject({name:['table','desk'], description:"A sturdy wooden table.", important: true});
containerMix(_table);
_table.addObject(_magentaFilter);
_table.addObject(_cyanFilter);
_table.addObject(_yellowFilter);
_table.addObject(_lamp);
_table.describeVerbose = function() {
	var outString = "A sturdy wooden table.";
	var temp = objLister(this.contains);
	if (temp[1] != '') {
		outString += ' ' + capitalizeFirstLetter(temp[0] + ' ' + temp[1] + ' on the table.' ); 
	};
	return outString;
};

var _wall = new basicObject({name: ['wall','walls'], description:'Large white plaster walls.'});
var _ceiling = new basicObject({name: ['ceiling'], description: "A bland tiled ceiling. Someone should have put more effort into decorating this place!"});
var _floor = new basicObject({name: ['floor','ground'], description: "Speckled linoleum."});

_room.addObject(_lamp);
_room.addObject(_table);
_room.addObject(_wall);
_room.addObject(_ceiling);
_room.addObject(_floor);
_room.addObject(_magentaFilter);
_room.addObject(_cyanFilter);
_room.addObject(_yellowFilter);
_room.addObject(_testStuff);
_room.addObject(_aha);
_room.addPerson(_user);

newMessage(_room.describe());