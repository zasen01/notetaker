const { application } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");
const {v4:uuidv4} = require("uuid");
const readFile = util.promisify(fs.readFile);
const getNotes = () => {
    return readFile("db/db.json","utf-8").then(rawNotes => [].concat(JSON.parse(rawNotes)))
    };

const writeFile = util.promisify(fs.writeFile);

const PORT = 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"));
});
//displays notes page
app.get("/notes",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/notes.html"));
});

app.get("/api/notes",(req,res)=>{
   //get notes from db
    getNotes().then(notes => res.json(notes)).catch(err => res.json(err))
});

app.post("/api/notes",(req,res) =>{
    getNotes().then(oldNotes => {
       var newArray = [...oldNotes,{title:req.body.title, text: req.body.text, id:uuidv4()}]
       writeFile("db/db.json",JSON.stringify(newArray)).then(()=>res.json({msg:"ok"})).catch(err => res.json(err))
    })
});
app.delete("/api/notes/:id", (req,res)=>{
    getNotes().then(unfilteredNotes =>{
        let filteredNotes = unfilteredNotes.filter(note => note.id !== req.params.id)
        writeFile("db/db.json",JSON.stringify(filteredNotes)).then(()=>res.json({msg:"ok"})).catch(err => res.json(err))
        
    })
});

app.listen(PORT, ()=> {console.log("app Running")});

//3 api routes to get, add and delete note