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
			res.sendFile(path.join(__dirname,'public','search.html'),(err) =>{
				if(err) res.status(500).send('500 Server error');
			});
		},
        'default' : ()=> {
            res.status(406).send('Not acceptable');
        }
    })
});
// helper route, which returns the accepted types currently available in our application. This is used by the addFridge.html page

function validateItemBody(req,res,next,type){
    let properties = ['name','type','img'];
    for (property of properties){
      if(type == 1 && !req.query.hasOwnProperty(property) && property != 'img')
        return false;
      else if (type != 1 && !req.body.hasOwnProperty(property) ||  type != 1 && Object.getOwnPropertyNames(req.body).length != 3)
        return false;
    }
    return true;
  }


router.get('/items', function(req, res, next){
      if(validateItemBody(req,res,next,1)){
        Type.findOne({name: req.query.type},function(err, type){
          if(err) return res.status(500).send("Database error");
          else if(type){
            let allItems = []
            Item.find().where("type").equals(type.id).exec(function(err, found){
              if(err) return res.status(500).send("Database error");
              
              else{
                for(let it of found){
                  if(it.name.includes(req.query.name))
                    allItems.push(it);
                }
                if(allItems.length > 0)res.json(allItems);
                else res.status(409).send("no items of this type exist");
              }
                
              
            });
          }else
            res.status(409).send("Type does not exist");
        });
      }else
        res.status(400).send("Bad request");
      
})


module.exports = router;