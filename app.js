//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const date = require(__dirname + "/date.js");


const app = express();
// const items = ["Buy Food","Complete Dev"];
// const works = [];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Ashu:Test123@cluster0.pzpnk.mongodb.net/todolistDB");

const itemSchema = {
  name: String
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welocome to your toDo list"
});
const item2 = new Item({
  name: "Hit + this to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item "
});

const defaultarr = [item1, item2, item3];

const listSchema = {
  name:String,
  items:[itemSchema]
};

const List = mongoose.model("List",listSchema);
// Item.insertMany(defaultarr,function(err)
// {
//   if(err)
//   {
//     console.log(err);
//   }
//   else{
//     console.log("successfully saved the items");
//   }
// })

app.get("/", (req, res) => {

  //const day = date.getDate();
  Item.find({}, function(err, foundresult) {
    if (foundresult.length === 0) {
      Item.insertMany(defaultarr, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully saved the items");
        }
      });
      res.redirect("/");
    } else {
      res.render("blog", {
        listitems: "Today",
        newitems: foundresult
      });
    }

  });

});

app.get("/:customListName",function(req,res){
  const customListName =req.params.customListName;

List.findOne({name:customListName},function(err,foundList){
  if(!err){
    if(!foundList){
      const list = new List ({
        name:customListName,
        items: defaultarr
      });
      list.save();
      res.redirect("/");
    }
    else{
      //console.log("exists");
      res.render("blog",{
        listitems: foundList.name,
        newitems: foundList.items
      });
    }
  }
});


});

app.post("/", function(req, res) {
  const itemName = req.body.litem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if(listName === "Today")
  {
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }


  // if(req.body.list === "WorkList")
  // {
  //   works.push(item);
  //   res.redirect("/work");
  // }
  // else{
  //   items.push(item)
  //   res.redirect("/");
  // }

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checked;
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log("successfully deleted");
    } else {
      console.log(err);
    }
  });
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("server started at port 3k");
});
