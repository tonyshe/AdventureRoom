function command(userCom) {
	userCom = userCom.toLowerCase(); //to lower case
	userCom = userCom.replace(/ +(?= )/g,'').trim(); //convert multiple space to one. trim whitespace
	userCom = userCom.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); 	//remove punctuation
	userCom = userCom.replace(" the ",""); 	//remove articles
	userCom = userCom.replace(" a ",""); 	//remove articles
    var splitCommands = userCom.split(/\s+/); //split command to word array
    
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
                    case "self":
                    case "yourself":
                    case "you":
                    case "me":
                    case "myself":
                        newMessage("Hey look it's you.");
                        break;
                    default:
                    	var examineObj = findObjByNameInRoom(objString)
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
                    	var takeObj = findObjByNameInRoom(objString)
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
        	var putObj = userCom.match(/put (.*) on/); //the object being moved
        	if (putObj == null) {newMessage('Please specify what to put that on.');}
        	else {
        		putObj = putObj[1]
        		var newContainerString = userCom.match(/put (.*) on (.*)/)[2]; //the object that will contain putObj
        		if (newContainerString == null) {newMessage('Please specify what to put that on.');}
        		else {
        			var findObjResult = findObjByNameInRoom(putObj);
        			var findNewContainerResult = findObjByNameInRoom(newContainerString);
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
        					if (findNewContainerResult.isContainer) {
		        				var validate = findNewContainerResult.addObject(findObjResult);
		        				if (validate == 1) {newMessage('You put the ' + findObjResult.name[0] + ' on the ' + findNewContainerResult.name[0] + '.');}
		        				else if (validate == 0) {newMessage("That's not possible!");};
		        			}
		        			else {newMessage("That's not possible!");};
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
		case "":
			break;
		default:
			newMessage(capitalizeFirstLetter(splitCommands[0]) + " is not a command I recognize.");
	}; //end switch
};

function findObjInArrayByName(name,objArray) {
	//finds object by name in an array of objects
	//takes name (string), and objArray (array of objects)
	//returns [object, index in array] if only one instance is found
	//returns 0 if no instance is found
	//returns -1 if multiple incidences are found
	var findResult = [];
    for (var i = 0; i < objArray.length; i++) {
		for (var j = 0; j < objArray[i].name.length; j++) {
			if (objArray[i].name[j] == name) {				
				findResult.push(objArray[i],i);
				break;
			};
		};
	};
	if (findResult.length == 0) {return 0;}
	else if (findResult.length == 2) {return findResult;} //equals 2 because you push 2 elements into the array per find
	else {return -1;};
};

function findObjByNameInRoom(name) {
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
	if ("aeiou".indexOf(string.charAt(0).toLowerCase()) > -1) {return "an " + string;};
	return "a " + string;
}

//actions

//Object Mixins
let containerMix = function(obj, allowed = []) {
	//mixin to allow objects to contain things
	obj.contains = [];
	obj.isContainer = true;
	obj.allowed = allowed;

	obj.addObject = function(newObj) {
		//adds object to self.contains
		//if .allowed is [], then it can accept anything
		//if .allowed is populated, then only those objects can be contained.
		//1 if successful, 0 if not allowed, -1 if object already exists in contains
		if (newObj.belongsTo == obj) {return -1;} //already exists
		if (obj.allowed.length == 0 || obj.allowed.includes(newObj.name[0])) {
			//if .allowed is empty
			if (newObj.belongsTo) {newObj.belongsTo.removeObject(newObj.name[0]);}; //remove object from previous container's .contains
			newObj.belongsTo = this; //sets mew container
			obj.contains.push(newObj);
			return 1;
		}
		else {return 0;};
	}
	obj.removeObject = function(objString) {
		//searches self.contains for object with objString in its .names
		//if found, removes and returns the object
		//returns 0 if not found, -1 if duplicate
		var searchObj = findObjInArrayByName(objString, obj.contains);
		if (searchObj[0] == 0) {return 0;}
		else if (searchObj[0] == -1) {return -1;}
		else {return obj.contains.splice(searchObj[1],1);};
	}
};

//objects
function basicObject(objInfo) {
	//Makes a basic option with {name, description, important, takeable}
	//properties: name, important, takeable, belongsTo
	//methods: describeVerbose
	this.name = objInfo.name || "noname";
	this.important = objInfo.important || false;
	this.takeable = objInfo.takeable || false;
	this.description = objInfo.description || "It's either undescribeable or I forgot to describe this object sorry";
	this.belongsTo = null;
	this.describeVerbose = function() {return this.description;};
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
        	if (this.inanimates[i].important) {importantObjects.push(this.inanimates[i].name[0]);
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
        if (this.id == userId) {outString = "Hey look it's you.";}
        else {outString = "It's " + this.name;};
        return outString;      
    };      
};

function makeUserId() {
    //make a random UUID for user session
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

var sessionId = makeUserId();
var _user = new personObj('You', sessionId);
containerMix(_user);