//room population below
let _room = new basicObject({name: ['room'], description: "Four walls, a floor and a ceiling. Yep it's a room all right."}); roomMix(_room);
let _roomDoor = new basicObject({name: ['room'], description: "The main room."}); doorMix(_roomDoor, {room: _room});
let _otherRoom = new basicObject({name: ['other room'], description: "Shag carpet and velvet curtains."}); containerMix(_otherRoom); roomMix(_otherRoom);
let _otherRoomDoor = new basicObject({name: ['other room'], description: "The other room."}); doorMix(_otherRoomDoor, {room: _otherRoom});

const sessionId = makeUserId();
let _user = new personObj('You', sessionId); containerMix(_user); userMix(_user,{currentRoom: _room});

let _lamp = new basicObject({name: ['lamp', 'light', 'bulb'], description:'foo', important: true});
containerMix(_lamp, {allowed: ['magenta filter', 'cyan filter','yellow filter']});
_lamp.colorName = "white";
_lamp.color = 9111111
_lamp.describeVerbose = function() {
	if (this.color != 9000000) {var outString = 'A small desk lamp.  Its ' + this.colorName + ' light illuminates the room.'}
	else {var outString = "Only a little light is coming from it, just enough to barely light the room."};
	let temp = objLister(this.contains);
	if (temp[1] != '') {
		outString += ' ' + capitalizeFirstLetter(temp[0] + ' ' + temp[1] + ' attached to the light bulb.'); 
	};
	return outString;
};

_lamp.addObject = function(addObj) {
	//adds object to self.contains
	//if .allowed is [], then it can accept anything
	//if .allowed is populated, then only those objects can be contained.
	//1 if successful, 0 if not allowed, -1 if object already exists in contains
	if (addObj.belongsTo == this) {return -1;} //already exists
	if (this.allowed.length == 0 || this.allowed.includes(addObj.name[0])) {
		//if .allowed is empty or includes the object being added
		if (addObj.belongsTo) {addObj.belongsTo.removeObject(addObj.name[0]);}; //remove object from previous container's .contains
		addObj.belongsTo = this; //sets new container
		this.contains.push(addObj);
		this.changeBackgroundColor(addObj.color)
		return 1;
	}
	else {return 0;};
};

_lamp.removeObject = function(objString) {
	//searches self.contains for object with objString in its .names
	//if found, removes and returns the object
	//returns 0 if not found, -1 if duplicate
    let searchObj = findObjByNameInArray(objString, this);
    const searchIndex = findIndexOfObjInArray(searchObj, this);
	if (searchObj == -1) {return -1;}
	else {
		this.changeBackgroundColor(-1*searchObj.color)
        return this.contains.splice(searchIndex,1);
    };
};

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
	let colorString = (this.color).toString();
	colorString = colorString.replace(/1/g,"F");
	colorString = colorString.replace(/9/,"#");
	document.body.style.backgroundColor = colorString;
	if (this.color - 9000000 == 0) {
		document.body.style.color = "white";
		document.getElementsByClassName('inputForm')[0].style.color = "white";
	}
	else {
		document.body.style.color = "black";
		document.getElementsByClassName('inputForm')[0].style.color = "black";
	};
};

let _magentaFilter = new basicObject({name: ['magenta filter','filter','magenta'], description: "A transparent magenta filter.", takeable: true});
_magentaFilter.color = 1100;
let _cyanFilter = new basicObject({name: ['cyan filter','filter','cyan'], description: "A transparent cyan filter.", takeable: true});
_cyanFilter.color = 110000;
let _yellowFilter = new basicObject({name: ['yellow filter','filter','yellow'], description: "A transparent yellow filter.", takeable: true});
_yellowFilter.color = 11;

let _testStuff = new basicObject({name: ['test', 'test stuff', 'stuff'], description: 'Some stuff for testing.', takeable: true});
let _aha = new basicObject({name: ['A-ha CD', 'me on', 'on me', 'aha','a-ha', 'cd'], description: 'A hit single by the 80s synthpop band A-ha.', takeable: true});

let _table = new basicObject({name:['table','desk'], description:"A sturdy wooden table.", important: true});
containerMix(_table);

_table.addObject(_magentaFilter);
_table.addObject(_cyanFilter);
_table.addObject(_yellowFilter);
_table.addObject(_lamp);
_table.describeVerbose = function() {
	let outString = "A sturdy wooden table.";
	let temp = objLister(this.contains);
	if (temp[1] != '') {
		outString += ' ' + capitalizeFirstLetter(temp[0] + ' ' + temp[1] + ' on the table.' ); 
	};
	return outString;
};

let _wall = new basicObject({name: ['wall','walls'], description:'Large white plaster walls.'});
let _ceiling = new basicObject({name: ['ceiling'], description: "A bland tiled ceiling. Someone should have put more effort into decorating this place!"});
let _floor = new basicObject({name: ['floor','ground'], description: "Speckled linoleum."});
let _door = new basicObject({name: ['door'], description: "There appears to be no door in this room. That might be a little concerning."});

let _box = new basicObject({name: ['box'], description: 'Just a plain ole box.', important: true});
containerMix(_box, {isBox: true});
let _dupeTest = new basicObject({name: ['cyan'], description: "You've been duped!"});

_room.addObject(_table);
_room.addObject(_wall);
_room.addObject(_ceiling);
_room.addObject(_floor);
_room.addObject(_door);
_room.addObject(_user);
/*
_room.addObject(_magentaFilter);
_room.addObject(_cyanFilter);
_room.addObject(_yellowFilter);
*/

_room.addObject(_testStuff);
_room.addObject(_aha);
_room.addObject(_box);
_room.addObject(_otherRoomDoor);

_otherRoom.addObject(_roomDoor);

suppressMessages = false;
newMessage(_user.currentRoom.look());