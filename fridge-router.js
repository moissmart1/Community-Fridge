// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();
let Type = require("./models/typeModel");
let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");

app.use(express.json()); // body-parser middleware

// Get /fridges and return the all of the fridges based on requested format
router.get('/', (req,res)=> {
    res.format({
		'text/html': ()=> {
			res.set('Content-Type', 'text/html');
			res.sendFile(path.join(__dirname,'public','view_pickup.html'),(err) =>{
				if(err) res.status(500).send('500 Server error');
			});
		},
		'application/json': ()=> {
			Fridge.find().exec(function(err, result){
				if(err) {res.status(500).send('500 Server error'); return;}
				res.set('Content-Type', 'application/json');
				res.json(result);
			});
        },
        'default' : ()=> {
            res.status(406).send('Not acceptable');
        }
    })
});
// helper route, which returns the accepted types currently available in our application. This is used by the addFridge.html page


// Middleware function: this function validates the contents of the request body associated with adding a new fridge into the application. At the minimimum, it currently validates that all the required fields for a new fridge are provided.
function validateFridgeBody(req,res,next){
    let properties = ['name','canAcceptItems','acceptedTypes','contactInfo','address'];

    for(property of properties){
      // hasOwnProperty method of an object checks if a specified property exists in the object. If a property does not exist, then we return a 400 bad request error
        if (!req.body.hasOwnProperty(property)){
            return res.status(400).send("Bad request not formatted well");
        }
    }
    // if all the required properties were provided, then we move to the next set of middleware and continue program execution.
    next();
}
function validateFridgeUpdate(req,res,next){
    let properties = ['name','canAcceptItems','acceptedTypes','contactInfo','address','street','postalCode','city','province','country', 'contactInfo','contactPhone','contactPerson'];

    for(property of properties){
      // hasOwnProperty method of an object checks if a specified property exists in the object. If a property does not exist, then we return a 400 bad request error
        if (!properties.includes(Object.keys(req.body)[0])){
            return res.status(400).send("Bad request not formatted well");
        }
    }
    // if all the required properties were provided, then we move to the next set of middleware and continue program execution.
    next();
}
// Middleware function: this validates the contents of request body, verifies item data
function validateItemBody(req,res,next){
    let properties = ['id','quantity'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }
    next();
}

function findFridgesX(fridgeId){
	Fridge.find({id:fridgeId},function(err, result){
		if(err) {res.status(500).send('500 Server error'); return;}
		fridgeFound = result;
		if(result.length == 0) return res.status(404).send('Fridge Not Found');
		let fridge = JSON.parse(JSON.stringify(fridgefound[0]));
		let tempitems = [];
		for(let it of fridge.items){
			Item.findOne({id:it.id},function(err,result){
				let temp = items[result];
				temp["quantity"] = result.quantity
				tempitems.push(temp);
			});
			fridge.items = tempitems;
		}
		res.json(fridge[0]);
	});
}


router.get("/X/:fridgeID", function(req, res, next){
	let id = req.params.fridgeID;
    let validator = id
    if(validator[0] != "fg" || isNaN(parseInt(validator[1])) || validator.length != 2 ){
        res.status(400).send("the Id is not formatted correctly")
    }else if(id != undefined){
        let result = findFridgesX(id);
        if(result == undefined){
            res.status(404).send("the fridge does not exist")
		}
        else{
			res.status(200).set("Content-Type", "application/json").json(result);
		}
    }
    else{
        res.status(500).send("unable to open a file");
    }
});
// Adds a new fridge, returns newly created fridge
router.post('/', validateFridgeBody, (req,res)=> {
	let fridgeLen = Fridge.countDocuments({}).exec(function(err, result){
		let newFridge = req.body;
		let newItem = {
			id: "fg-"+(1+result).toString(), name: newFridge.name, canAcceptItems: newFridge.canAcceptItems, acceptedTypes: newFridge.acceptedTypes,
			contactInfo: newFridge.contactInfo,address: newFridge.address, items: []
		  };
		  Fridge.create(newItem, function(err, newInstance){
			if(err) {
				res.status(400).send(err); return;
			}
			res.json(newInstance);
		});
    });
});

// Get /fridges/{fridgeID}. Returns the data associated with the requested fridge.
router.get("/:fridgeId",function(req, res, next){
	Fridge.find().where("id").equals(req.params.fridgeId).exec(function(err, result){
		if(err) {res.status(500).send('500 Server error'); return;}
		fridgeFound = result;
		if(result.length == 0) return res.status(404).send('Fridge Not Found');
		let fridge = {...fridgeFound};
		res.json(fridge[0]);
	});
});

// Updates a fridge and returns the data associated.
// Should probably also validate the item data if any is sent, oh well :)
router.put("/:fridgeId",validateFridgeUpdate, (req, res) =>{
	console.log(req.body);
	let props = Object.getOwnPropertyNames(req.body);
	// Find fridge in 'database'
	Fridge.findOne({id: req.params.fridgeId}, function(err, result){
		if(err) {return res.status(500).send("Database error"); }
		else{
			if(!result)
				res.status(404).send("Fridge not found");
			else{
				let foundFridge = result;
				let data = req.body
				let attrib = ["street","postal_code","city","province"];
				let contact = ["contactPerson","contactPhone"];
				for(pro of props){
					if(!attrib.includes(pro) && !contact.includes(pro)) {
						foundFridge[pro] = data[pro];
					}else if(contact.includes(pro)){
						foundFridge.contactInfo[pro] = data[pro];
					}else if(attrib.includes(pro)) {
						foundFridge.address[pro] = data[pro];
					}
				}
			  foundFridge.save(function(err,updatedFridge){
					if(err) {return res.status(400).send(err);}
					else
						res.send(updatedFridge);
			  });
			}
		}

	});

});

// Adds an item to specified fridge
router.post("/:fridgeId/items", validateItemBody, (req,res)=>{
	let props = Object.getOwnPropertyNames(req.body);
	// Find fridge in 'database'
	Fridge.findOne({id: req.params.fridgeId}, function(err, result){
		if(err) {return res.status(500).send("Database error"); }
		else{
			let foundFridge = result;
			if(!foundFridge)
				res.status(404).send("Fridge not found");
			else{
				if(!foundFridge.findItem(req.body.id)){
					foundFridge.items.push(req.body);
					foundFridge.save(function(err,updatedFridge){
						if(err) {return res.status(400).send(err);}
						else
							res.send(updatedFridge);
				  });
				}else
					res.status(409).send("already exist");
			}
		}
	});

})

// Deletes an item from specified fridge
router.delete("/:fridgeId/items/:itemId", (req,res)=>{
	// Find fridge in 'database'
	Fridge.findOne({id: req.params.fridgeId}, function(err, result){
		if(err) {return res.status(500).send("Database error"); }
		else{
			let foundFridge = result;
			if(!foundFridge)
				res.status(404).send("Fridge not found");
			else{
				if(foundFridge.findItem(req.params.itemId)){
					foundFridge.items = foundFridge.items.filter(item=> item.id != req.params.itemId)
					foundFridge.save(function(err,updatedFridge){
						if(err) {return res.status(400).send(err);}
						else
							res.send(updatedFridge);
				  });
				}else
					res.status(404).send("Item not found");
			}
		}
	});

})

router.delete("/:fridgeId/items", (req,res)=>{
	Fridge.findOne({id: req.params.fridgeId}, function(err, result){
		if(err) {return res.status(500).send("Database error"); }
		else{
			let foundFridge = result;
			if(!foundFridge)
				res.status(404).send("Fridge not found");
			else{
				if (!req.query.hasOwnProperty('item')){
					foundFridge.items = [];
					foundFridge.save(function(err,updatedFridge){
						if(err) {return res.status(400).send(err);}
						else
							res.send(updatedFridge);
				  });
				}
				else if(foundFridge.findItem(req.query.item,1)){
					// for(ids of req.query)
					foundFridge.items = foundFridge.items.filter(item=> !req.query.item.includes(item.id));
					foundFridge.save(function(err,updatedFridge){
						if(err) {return res.status(400).send(err);}
						else
							res.send(updatedFridge);
				  });
				}else
					res.status(404).send("Item not found");
			}
		}
	});
})


router.put("/:fridgeId/items/:itemId", (req,res)=>{
	// Find fridge in 'database'
	if (!req.body.hasOwnProperty("quantity"))
			res.status(400).send("Bad request");
	else{
		Fridge.findOne({id: req.params.fridgeId}, function(err, result){
		if(err) {return res.status(500).send("Database error"); }
		else{
			let foundFridge = result;
			if(!foundFridge)
				res.status(404).send("Fridge not found");
			else{
				if(foundFridge.findItem(req.params.itemId)){
					foundFridge.items = foundFridge.items.map(item=> {
						if(item.id == req.params.itemId)
							return {...item, quantity: req.body.quantity};
						else
							return {...item};
					})
					foundFridge.save(function(err,updatedFridge){
						if(err) {return res.status(400).send(err);}
						else
							res.status(200).send(updatedFridge);
				  });
				}else
					res.status(404).send("Item not found");
				}
			}
		});
	}

})

module.exports = router;
