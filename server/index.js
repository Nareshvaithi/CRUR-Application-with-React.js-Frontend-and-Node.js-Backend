const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const app = express();
app.use(express.json());
const port = 8000;
const fs = require("fs");
// Display all Users
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PATCH","DELETE"]
}));

// display all users
app.get("/users",(req,res)=>{
    return res.json(users);
});
// delete all users
app.delete("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let filtereduser = users.filter((user)=>user.id !== id);
    fs.writeFile("./sample.json",JSON.stringify(filtereduser),(err,data)=>{
        return res.json(filtereduser);
    });
});
// add user data

app.post("/users",(req,res)=>{
    let {name,age,city} = req.body;
    if(!name||!age||!city){
        res.status(400).send({message:"all fields required"});
    }
    let id = Date.now();
    users.push({id,name,age,city});
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
        return res.json({message:"user detail add successfully"})
    });
});
// update user data{
    app.patch("/users/:id",(req,res)=>{
        let id = Number(req.params.id);
        let {name,age,city} = req.body;
        if(!name||!age||!city){
            res.status(400).send({message:"all fields required"});
        }
      let index = users.findIndex((user)=>user.id===id);
      users.splice(index,1,{...req.body});
        fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
            return res.json({message:"user detail updated successfully"})
        });
    });
// }
app.listen(port,(err)=>{
    console.log(`App is running in port ${port}`);
});

