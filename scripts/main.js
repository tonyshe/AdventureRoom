function newMessage(msg) {
	if (suppressMessages != true) {
		//Adds new div to HTML body to display messages
		let messages = document.getElementById("messageBox");
		let newDiv = document.createElement('div');

		//Create new div to append to MESSAGEBOX
		newDiv.className = "message";
		messages.appendChild(newDiv);

		//Create new p to insert into MESSAGE
		messageText = document.createElement('p');
		messageText.innerHTML = msg;
		newDiv.appendChild(messageText);
	};
};

//command object and command mixins
function commandObject() {
    this.commandList = {};
    this.command = function(userCom) {
        userCom = userCom.toLowerCase(); //to lower case
        userCom = userCom.replace(/ +(?= )/g,'').trim(); //convert multiple space to one. trim whitespace
        userCom = userCom.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");   //remove punctuation
        userCom = userCom.replace(" the ","");  //remove articles
        userCom = userCom.replace(" a ","");    //remove articles
        const splitCommands = userCom.split(/\s+/); //split command to word array
        console.log("command: "+ splitCommands + "," + " first word: " + splitCommands[0]); //for testing purposes

        if (this.commandList[splitCommands[0]]) {
            this.commandList[splitCommands[0]](splitCommands, userCom)
        }
        else {
            newMessage(capitalizeFirstLetter(splitCommands[0]) + " is not a relevant command right now.");
        };
    };
};
let _commandObj = new commandObject(); //create the Command object

let infoMix = (function(cmdObj) {
    cmdObj.commandList['help'] = function() {newMessage(`
        <em>
        "l" or "look": Look around<br>"i": Your inventory<br>
        "x ___" or "examine ___": Examine something<br>
        "take ___": Take an object<br>
        "put ___ on/in ___": Put an object on/in something<br>
        "open ___" or "close___": Open/close something<br>
        "go ___": Go somewhere<br><br>

        There are other valid commands that you can make in different situations. Feel free to play around and find them!
        </em>
        `);}
    cmdObj.commandList['h'] = cmdObj.commandList['help'];
    cmdObj.commandList['about'] = function() {newMessage('<em>This engine was made by Tony She. Hope you have fun!</em>')};
    cmdObj.commandList['fuck'] = function() {newMessage('No need to be rude!')};
    cmdObj.commandList['shit'] = function() {newMessage("This is not the appropriate place for that!!!")};
})(_commandObj);

let basicCommandMix = (function(cmdObj) {
    //inventory
    cmdObj.commandList['inventory'] = function() {
        if (_user.contains.length ==0) {newMessage('You have nothing.');}
        else {newMessage('You have ' + objLister(_user.contains)[0] + '.');};
    };
    cmdObj.commandList['i'] = cmdObj.commandList['inventory'];

    //look
    cmdObj.commandList['look'] = function() {newMessage(_user.currentRoom.look());};
    cmdObj.commandList['l'] = cmdObj.commandList['look'];

    //examine
    cmdObj.commandList['examine'] = function(splitCommands, userCom) {
        if (splitCommands[1]) {
                const objString = userCom.substr(userCom.indexOf(" ") + 1);
                switch(objString) {
                    case "self":
                    case "yourself":
                    case "you":
                    case "me":
                    case "myself":
                        newMessage("Hey look it's you.");
                        break;
                    default:
                        for (var i=0; i<_user.currentRoom.name.length; i++) {
                            if (objString == _user.currentRoom.name[i]) {
                                newMessage(_user.currentRoom.describeVerbose());
                                return;
                            };
                        };
                        const examineObj = findObjByNameInArray(objString, _user.currentRoom, true)
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
    };
    cmdObj.commandList['x'] = cmdObj.commandList['examine'];

    //take
    cmdObj.commandList['take'] = function(splitCommands, userCom) {
        if (splitCommands[1]) {
            const objString = userCom.substr(userCom.indexOf(" ") + 1);
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
                    let takeObj = findObjByNameInArray(objString, _user.currentRoom, true)
                    if (takeObj == 0) {
                        newMessage("No such thing exists.");
                    }

                    else if (takeObj == -1) {
                        newMessage('There are more than one thing by the name ' + '"' + objString + '." Please specify which one you mean.');
                    }
                    else {
                        if (takeObj.takeable) {
                            const result = _user.addObject(takeObj);
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
    };

    //put
    cmdObj.commandList['put'] = function(splitCommands, userCom) {
        var putObj = userCom.match(/put (.*) (?:on|in)/); //the object being moved
        if (putObj == null) {newMessage('Please specify where to put that.');}
        else {
            putObj = putObj[1]
            var newContainerString = userCom.match(/put (.*) (?:on|in) (.*)/); //the object that will contain putObj
            if (newContainerString == null) {newMessage('Please specify what to put that on.');}
            else {
                newContainerString = newContainerString[2]
                var findObjResult = findObjByNameInArray(putObj, _user.currentRoom, true);
                var findNewContainerResult = findObjByNameInArray(newContainerString, _user.currentRoom, true);
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
                            else if (validate == 0) {newMessage("That's not possible!");}
                            else if (validate == -2) {newMessage("It is closed.");};
                        }
                        else {
                            newMessage("That's not possible!");
                        };
                    }
                    else {
                        newMessage("You don't have that!")
                    };
                };
            }
        };
    };

    //Open and close
    cmdObj.commandList['open'] = function(splitCommands, userCom) {
        if (splitCommands[1]) {
            var objString = userCom.substr(userCom.indexOf(" ") + 1);
            var openObj = findObjByNameInArray(objString, _user.currentRoom, true)
            if (openObj == 0) {
                newMessage("No such thing exists.");
            }
            else if (openObj == -1) {
                newMessage('There are more than one thing by the name ' + '"' + objString + '." Please specify which one you mean.');
            }
            else {
                openObj.open();
            };
        }
        else {
            newMessage("Please specify something to open.");
            return;
        };
    };
    cmdObj.commandList['close'] = function(splitCommands, userCom) {
        if (splitCommands[1]) {
            var objString = userCom.substr(userCom.indexOf(" ") + 1);
            var closeObj = findObjByNameInArray(objString, _user.currentRoom, true)
            if (closeObj == 0) {
                newMessage("No such thing exists.");
            }
            else if (closeObj == -1) {
                newMessage('There are more than one thing by the name ' + '"' + objString + '." Please specify which one you mean.');
            }
            else {
                closeObj.close();
            };
        }
        else {
            newMessage("Please specify something to close.");
            return;
        };
    };
    cmdObj.commandList['go'] = function(splitCommands, userCom) {
        if (splitCommands[1]) {
            var objString = userCom.substr(userCom.indexOf(" ") + 1);
            var doorObj = findObjByNameInArray(objString, _user.currentRoom, true)
        };
        if (doorObj == 0) {
            newMessage("You can't go there.");
        }
        else if (doorObj == -1) {
            newMessage('There are more than one place by the name ' + '"' + objString + '." Please specify which one you mean.');
        }
        else {
            if (doorObj.objType == "door") {
                doorObj.goThru(_user);
            }
            else {
                newMessage("No such place exists.");
            };
        };
    };
})(_commandObj);

let specialCommandMix = (function(cmdObj) {
    cmdObj.commandList['eat'] = function(splitCommands, userCom) {
        if (splitCommands[1]) {
            var objString = userCom.substr(userCom.indexOf(" ") + 1);
            var foodObj = findObjByNameInArray(objString, _user.currentRoom, true)
            if (foodObj == 0) {
                newMessage("No such thing exists.");
            }
            else if (foodObj == -1) {
                newMessage('There are more than one thing by the name ' + '"' + objString + '." Please specify which one you mean.');
            }
            else {
                if (foodObj.objType == "food") {
                    foodObj.consume();
                }
                else {
                    newMessage('You cannot ' + splitCommands[0] + " that.")
                };
            };
        }
        else {
            newMessage("Please specify something to " + splitCommands[0] + ".");
            return;
        };
    };
    cmdObj.commandList['drink'] = cmdObj.commandList['eat']
})(_commandObj);


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

//Search functions
function findObjByNameInArray(name, containerObj, searchRecursively = false) {
	//finds object in room by iterating through every .name array in every object in room.contains
	//returns object if found, 0 if not found, and -1 if duplicates found.
    //if searchRecursively is set, it will also search all open containers in the object space
	let examineResult = [];
    //i-level iterates on individual objects
    //j-level iterates on different possible names
    for (let i = 0; i < containerObj.contains.length; i++) {
    	for (let j = 0; j < containerObj.contains[i].name.length; j++) {
    		if (containerObj.contains[i].name[j] == name) {
    			examineResult.push(containerObj.contains[i]);
    			break;
    		};
    	};
    	if (searchRecursively && containerObj.contains[i].isContainer && containerObj.contains[i].isClosed != true) {
            const recursiveSearchResult = findObjByNameInArray(name, containerObj.contains[i], true) //Don't add 0 to array if nothing is found
            if (recursiveSearchResult != 0) {examineResult.push(recursiveSearchResult);}; //add found object or -1 (duplicate) to array
    	};
    };
    if (examineResult.length == 0) {
        return 0;
    }
    else if (examineResult.length == 1) {
        return examineResult[0];
    }
    else {
        return -1;
    };
};

function findIndexOfObjInArray(obj, containerObj) {
    if (containerObj.contains.includes(obj)) {
        for (let i=0; i < containerObj.contains.length; i++) {
            if (containerObj.contains[i] == obj) {
                return i;
            };
        };
    }
    else {return -1;};
};

//Objects
function basicObject(objInfo) {
	//Makes a basic option with {name, description, important, takeable}
	//properties: name, important, takeable, belongsTo
	//methods: describeVerbose
    this.objType = "basic";
	this.name = objInfo.name || "noname";
	this.important = objInfo.important || false;
	this.takeable = objInfo.takeable || false;
	this.description = objInfo.description || "It's either undescribeable or I forgot to describe this object sorry";
	this.belongsTo = null;
	this.describeVerbose = function() {return this.description;};
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

//Object Mixins
let containerMix = function(obj, containerProps = {}) {
	//mixin to allow objects to contain things
    obj.objType = "container";
	obj.contains = [];
	obj.isContainer = true;
	obj.putIn = containerProps.putIn || false; //determines whether or not you put "on" or "in"
	obj.isBox = containerProps.isBox || false; //"Box" gives a container open/close functionality.
	obj.isClosed = containerProps.isClosed || false;
	obj.isLocked = containerProps.isLocked || false;
	obj.allowed = containerProps.allowed || []; //list of allowed objects
	obj.describeVerbose = function() {
		var outString = obj.description;
		if (obj.isBox) {
			if (obj.isClosed) {
                var openString = ' closed.'
            }
			else {
                var openString = ' open.'
            };
			outString += ' It is currently ' + openString;
		};

        if (obj.isContainer && obj.isClosed == false) {
            let temp = objLister(this.contains);
            if (obj.putIn) {
                var preposition = "in"
            }
            else {
                var preposition = "on"
            };
            if (temp[1] != '') {
                outString += ' ' + capitalizeFirstLetter(temp[0] + ' ' + temp[1] + ' ' + preposition + ' the ' + obj.name[0]+ '.' ); 
            };
        };
        return outString;
    };

	obj.open = function() {;
		if (obj.isBox == false) {
            newMessage("It can't do that.");
        }
		else if (obj.isLocked) {
            newMessage("It's locked.");
        }
		else if (obj.isClosed == false) {
            newMessage("It's already open.");
        }
		else {
			newMessage("You open the " + obj.name[0]);
			obj.isClosed = false;
		};
	}
	obj.close = function() {
		if (obj.isBox == false) {
            newMessage("It can't do that.");
        }
		else if (obj.isClosed == true) {
            newMessage("It's already closed.");
        }
		else {
			newMessage("You close the " + obj.name[0]);
			obj.isClosed = true;
		};
	}

	obj.lock = function() {};
	obj.unlock = function() {};

	obj.addObject = function(addObj, bypass = false) {
		//adds object to self.contains
		//if .allowed is [], then it can accept anything
		//if .allowed is populated, then only those objects can be contained.
		//1 if successful, 0 if not allowed, -1 if object already exists in contains
        if (obj.isClosed && bypass != true) {
            return -2;
        };
		if (addObj.belongsTo == obj) { //already exists
            return -1;
        }; 
		if (obj.allowed.length == 0 || obj.allowed.includes(addObj.name[0])) {
			//if .allowed is empty or includes the object being added
			if (addObj.belongsTo) {
                addObj.belongsTo.removeObject(addObj.name[0]);
            }; //remove object from previous container's .contains
			addObj.belongsTo = obj; //sets new container
			obj.contains.push(addObj);
			return 1;
		}
		else {
            return 0;
        };
	}
	obj.removeObject = function(objString) {
		//searches self.contains for object with objString in its .names
		//if found, removes and returns the object
		//returns 0 if not found, -1 if duplicate
        let searchObj = findObjByNameInArray(objString, obj);
        const searchIndex = findIndexOfObjInArray(searchObj, obj);
		if (searchObj == -1) {
            return -1;
        }
		else {
            return obj.contains.splice(searchIndex,1);
        };
	}
};

let roomMix = function(obj, roomProps = {}) {
    containerMix(obj); //all room objects are containers
    obj.objType = "room";

    obj.look = function() {
        let importantObjects = [];
        for (var i=0; i < this.contains.length; i++) {
            if (this.contains[i].important) {importantObjects.push(this.contains[i].name[0]);};
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
        return "You are in a room. " + capitalizeFirstLetter(outString);
    };
	obj.describeVerbose = function() {
        return obj.description;
    };

};

let userMix = function(obj, userProps = {}) {
    obj.objType = "user";
	obj.currentRoom = userProps.currentRoom || null;
};

let doorMix = function(obj, doorProps = {}) {
    obj.objType = "door";
    obj.room = doorProps.room || null;
    obj.isClosed = doorProps.isClosed || false;
    obj.isLocked = doorProps.isLocked || false;
    obj.enterMessage = doorProps.enterMessage || "You go to the " + obj.name[0] + ".";

    obj.goThru = function(userObj) {
        if (obj.isClosed != true && obj.isLocked != true) {
            userObj.currentRoom = obj.room;
            obj.room.addObject(userObj)
            newMessage(obj.enterMessage);
        }
        else if (obj.isLocked) {
            newMessage('It is locked.');
        }
        else if (obj.isClosed) {
            newMessage('It is closed.');
        };
    };
};

let foodMix = function(obj, foodProps = {}) {
    obj.objType = "food";
    obj.isLiquid = foodProps.isLiquid || false;
    obj.consume = function() {
        if (obj.isLiquid) {
            newMessage("You drink the " + obj.name[0] + ".")
        }
        else {
            newMessage("You eat the " + obj.name[0] + ".");
        };
        if (obj.belongsTo) {
            obj.belongsTo.removeObject(obj.name[0]);
            obj.belongsTo = null;
        };
    };
};

function makeUserId() {
    //make a random UUID for user session
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

let suppressMessages = true; //boolean to hide messages when necessary