//room population below
const sessionId = makeUserId();

//rooms
let _room = new basicObject({name: ['studio', 'apartment', 'room'], description: "Hardwood floors and white painted walls. Located on the top floor of an apartment building on the corner of Howell and 12th."}); roomMix(_room);
_room.look = function() {
    return "Alex's main studio room. There is a bed in the corner, with a nightstand next to it. Along the wall is a brown leather couch. In the middle of the room is a coffee table and a large bean bag chair. There are a few windows on the opposite wall and a small book shelf. Around the corner is the kitchen area. To the other side is the entrance to the walk-in closet and bathroom."
};

let _kitchen = new basicObject({name: ['kitchen'], description: "A narrow kitchen area with a section that doubles as a small office."}); roomMix(_kitchen);
_kitchen.look = function() {
    return "You are in the kitchen. There is a fridge and stove on one side, and a sink on the other. In the office section, there is a desk and a small cabinet."
};

let _closet = new basicObject({name: ['closet', 'walk-in', 'walk in', 'walk-in closet', 'walk in closet', 'alcove'], description: "An alcove of the main area meant for clothing and storage."}); roomMix(_closet);
_closet.look = function() {
	return "You are in the closet alcove. Suspended from the wall is a clothesrack. Behind you is the main apartment area.";
}

let _bathroom = new basicObject({name: ['bathroom', 'restroom'], description: "A small bathroom."}); roomMix(_bathroom);
_bathroom.look = function() {
	return "A bathtub next to a toilet and sink. Out the door is the rest of the apartment.";
}

//doors
let _kitchenDoor = new basicObject({name: ['kitchen'], description: "The kitchen area of the studio."}); doorMix(_kitchenDoor, {room: _kitchen});
let _kitchenToRoomDoor = new basicObject({name: ['studio', 'apartment', 'room'], description: "The main apartment area of the studio."}); doorMix(_kitchenToRoomDoor, {room: _room});

let _bathroomDoor = new basicObject({name: ['bathroom', 'restroom'], description: "A door leading to the bathroom."}); doorMix(_bathroomDoor, {room: _bathroom});
let _bathroomToRoomDoor = new basicObject({name: ['studio', 'apartment', 'room'], description: "A door leading to the apartment."}); doorMix(_bathroomToRoomDoor, {room: _room});

let _closetDoor = new basicObject({name: ['closet', 'walk-in', 'walk in', 'walk-in closet', 'walk in closet', 'alcove'], description: "An alcove of the room that acts as a walk-in closet."}); doorMix(_closetDoor, {room: _closet});
let _closetToRoomDoor = new basicObject({name: ['studio', 'apartment', 'room'], description: "The main apartment area."}); doorMix(_closetToRoomDoor, {room: _room});

//door population
_room.addObject(_kitchenDoor);
_room.addObject(_closetDoor);
_room.addObject(_bathroomDoor);

_kitchen.addObject(_kitchenToRoomDoor);
_closet.addObject(_closetToRoomDoor);
_bathroom.addObject(_bathroomToRoomDoor);

//studio furnishings
let _nightstand = new basicObject({name: ['nightstand', 'night stand', 'bedstand','bed stand', 'night table', 'nighttable'], description: "A small brown table."}); containerMix(_nightstand);
let _lamp = new basicObject({name: ['lamp', 'light'], description: "A minimalist lamp with a dimmer switch."});
let _speaker = new basicObject({name: ['speaker', 'speakers', 'logitech'], description: "Logitech speakers with a subwoofer."})
_nightstand.addObject(_lamp);
_nightstand.addObject(_speaker);
_room.addObject(_nightstand);

let _bed = new basicObject({name: ['bed', 'mattress','box spring'], description: 'A queen-sized mattress and a box spring'}); containerMix(_bed);
_room.addObject(_bed);

let _couch = new basicObject({name: ['couch', 'sofa'], description: "A large brown leather couch. It's a wonder how something so big could be carried up to this apartment!"}); containerMix(_couch);
_room.addObject(_couch);

let _beanbag = new basicObject({name: ['beanbag', 'bean bag', 'bean bag chair', 'beanbag chair'], description: "An oversized bean bag chair. Its outer shell is made of soft faux velvet."}); containerMix(_beanbag);
_room.addObject(_beanbag);

let _coffeeTable = new basicObject({name: ['coffee table', 'table'], description: "A standard IKEA coffee table."}); containerMix(_coffeeTable);
let _coaster = new basicObject({name: ['coaster'], description: "A rubber square coaster.", takeable: true});
_coffeeTable.addObject(_coaster);
_room.addObject(_coffeeTable);

let _bookshelf = new basicObject({name: ['bookshelf', 'shelf', 'book shelf', 'shelves'], description: "A small neat piece of furniture."}); containerMix(_bookshelf, {putIn: false});
let _book = new basicObject({name: ['book', "blowjobs"], description: "A hardback edition of <em>Blowjobs: An Oral History</em>.", takeable: true})
_book.isBook = true
let readMix = (function(cmdObj) {
	cmdObj.commandList['read'] = function(splitCommands, userCom) {
	    if (splitCommands[1]) {
		    const objString = userCom.substr(userCom.indexOf(" ") + 1);
		    switch(objString) {
		        default:
		            let searchObj = findObjByNameInArray(objString, _user.currentRoom, true)
		            if (searchObj == 0) {
		                newMessage("No such thing exists.");
		            }
		            else if (searchObj == -1) {
		                newMessage('There are more than one thing by the name ' + '"' + objString + '." Please specify which one you mean.');
		            }
		            else {
		                if (searchObj.isBook) {
		                	newMessage("It's probably best not to describe it here. The narrative is very thorough.")
		                }
		                else {
		                    newMessage('You cannot read that.');
		                };
		            };
		    };
		}
		else {
		    newMessage("Please specify something to play.");
		    return;
		};
	};
})(_commandObj);

let _ukulele = new basicObject({name: ['ukulele', 'uke'], description: "Mahogany with white trim.", takeable: true})
_ukulele.playable = true
let playMix = (function(cmdObj) {
	cmdObj.commandList['play'] = function(splitCommands, userCom) {
	    if (splitCommands[1]) {
		    const objString = userCom.substr(userCom.indexOf(" ") + 1);
		    switch(objString) {
		        case "self":
		        case "yourself":
		        case "you":
		        case "me":
		        case "myself":
		            newMessage("DJ Khaled smiles far off in the distance.");
		            break;
		        default:
		            let playObj = findObjByNameInArray(objString, _user.currentRoom, true)
		            if (playObj == 0) {
		                newMessage("No such thing exists.");
		            }
		            else if (playObj == -1) {
		                newMessage('There are more than one thing by the name ' + '"' + objString + '." Please specify which one you mean.');
		            }
		            else {
		                if (playObj.playable) {
		                	newMessage("You play your favorite song on the " + playObj.name[0] + ".")
		                }
		                else {
		                    newMessage('You cannot play that.');
		                };
		            };
		    };
		}
		else {
		    newMessage("Please specify something to play.");
		    return;
		};
	};
})(_commandObj);
_bookshelf.addObject(_book);
_bookshelf.addObject(_ukulele);
_room.addObject(_bookshelf);

let _aha = new basicObject({name: ['A-ha CD', 'me on', 'on me', 'aha','a-ha', 'cd'], description: 'A hit single by the 80s synthpop band A-ha.', takeable: true});
_room.addObject(_aha);

let _window = new basicObject({name: ['window', 'windows'], description: "North-facing windows. You can see a glimpse of Cal Anderson park."}); containerMix(_window, {isBox: true, allowed: ['nothing_at_all']});
_room.addObject(_window);

//kitchen furnishings
let _desk = new basicObject({name: ['desk', 'table'], description: "A large office desk that fits flush with the wall."}); containerMix(_desk);
let _plant = new basicObject({name: ['plant', 'bamboo', 'bamboo plant'], description: 'A few shoots of bamboo in a glass of water.', takeable: true});
_desk.addObject(_plant);
_kitchen.addObject(_desk);

let _cabinet = new basicObject({name: ['cabinet', 'shelf', 'small shelf', 'shelves'], description: "A few shelves of dishware."}); containerMix(_cabinet, {putIn: true});
let _mug = new basicObject({name: ['mug', 'cup'], description: 'Novelty gag mug. It says <em>Peas on Earth, and Gouda wheel to all men!</em> Ugh.', takeable: true});
_cabinet.addObject(_mug);
_kitchen.addObject(_cabinet);

let _fridge = new basicObject({name: ['refrigerator', 'fridge'], description: "A plain white fridge."}); containerMix(_fridge, {isClosed: true, isBox: true, putIn: true})
let _gin = new basicObject({name: ['bottle of gin', 'bottle', 'gin'], description: "A bottle of locally distilled gin. There's only a little bit left.", takeable: true}); foodMix(_gin, {isLiquid: true});
_gin.consume = function() {
    if (this.isLiquid) {
        newMessage("You drink the last drops from the " + this.name[0] + ". A little warmth fills your belly.")
    }
    else {
        newMessage("You eat the " + this.name[0] + ".");
    };
    this.objType = "basic";
    this.description = "An empty bottle."
    this.name = ['bottle', 'empty bottle']
};
_fridge.addObject(_gin,true);
_kitchen.addObject(_fridge);

let _sink = new basicObject({name: ['sink'], description: "A robust metal sink."}); containerMix(_sink, {putIn: true})
_kitchen.addObject(_sink);

let _stove = new basicObject({name: ['stove', 'range'], description: "A simple stove with four burners."}); containerMix(_stove)
let _burner = new basicObject({name: ['burner', 'burners'], description: "Metal coils that turn red-hot when in use."});
_kitchen.addObject(_stove);
_kitchen.addObject(_burner);

//closet furnishings
let _rack = new basicObject({name: ['rack', 'clothesrack', 'clothes rack'], description:'A wire clothesrack.'}); containerMix(_rack, {allowed: ['jacket', 'shirt']});
let _jacket = new basicObject({name: ['jacket', 'coat', 'windbreaker', 'arcteryx'], description: "A lightweight red Arcteryx windbreaker.", takeable: true})
let _shirt = new basicObject({name: ['shirt','t-shirt','tshirt'], description: "A striped T-shirt.", takeable: true})
_rack.addObject(_shirt);
_rack.addObject(_jacket);
_closet.addObject(_rack);

//bathroom furnishings
let _bathtub = new basicObject({name: ['bathtub','tub','shower'], description: "A white porcelain bathtub with white curtains."}); containerMix(_bathtub, {putIn: true});
let _curtains = new basicObject({name: ['curtains', 'curtain'], description: "Double layer curtain with a vinyl inside and cotton outside."})
let _bathsink = new basicObject({name: ['sink'], description: "A white porcelain sink."}); containerMix(_bathsink, {putIn:true});
let _toilet = new basicObject({name: ['toilet'], description: "A Toto brand toilet. Built to last."}); containerMix(_toilet, {putIn: true});

_bathroom.addObject(_toilet);
_bathroom.addObject(_bathtub);
_bathroom.addObject(_bathsink);
_bathroom.addObject(_curtains);

let pissMix = (function(cmdObj) {
	cmdObj.commandList['pee'] = function(splitCommands, userCom) {
	    if (_user.currentRoom == _bathroom) {
	    	newMessage('You pee in the sink. Gross.');
	    }
		else {
		    newMessage("This is not the appropriate place for that!!!");
		    return;
		};
	};
	cmdObj.commandList['piss'] = cmdObj.commandList['pee'];
	cmdObj.commandList['poop'] = function(splitCommands, userCom) {
	    if (_user.currentRoom == _bathroom) {
	    	newMessage('You use the toilet and spiral your products to oblivion.');
	    }
		else {
		    newMessage("This is not the appropriate place for that!!!");
		    return;
		};
	};
	cmdObj.commandList['shit'] = cmdObj.commandList['poop'];
})(_commandObj);

let _user = new personObj('You', sessionId); containerMix(_user); userMix(_user,{currentRoom: _room});
_room.addObject(_user)

suppressMessages = false;
newMessage(_user.currentRoom.look());