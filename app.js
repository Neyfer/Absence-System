const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');


//DATABASE
const mysql = require("mysql");
const { compile } = require("ejs");
const { json } = require("express");

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "asistencia"
})

con.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("conected to mysql");
    }
})

//statci use

app.use(express.static("public"));
app.use("/css", express.static(__dirname + 'public/css'));
app.use("/js", express.static(__dirname + 'public/js'));
app.use("/img", express.static(__dirname + 'public/img'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", "./views");
app.set("view engine", "ejs");

//LOAD INDEX'S PAGE
app.get("", (req, res) => {
    res.render("index");
})

//LOAD TEACHER'S PAGE
app.get("/maestros.ejs", (req, res) => {
    res.render("maestros");
})

//GET TEACHERS PERSONAL INFO
app.get("/info", (req, res) =>{
    con.query("SELECT * FROM maestros", function(err, rows, field){
        console.log(rows);
        res.json(rows);
    });
})

//GET TEACHER'S ABSENCES
app.get("/report", (req, res)=>{

  
    con.query("SELECT inasistencia.maestro, inasistencia.tipo, inasistencia.fecha, maestros.tel, maestros.area FROM inasistencia, maestros WHERE inasistencia.maestro = maestros.name", function(err, rows){
        if(err){
            throw err
        }else{
            res.json(rows);
        }
    })
})



//ADD ABSENCES
app.post("/add-inasistencia", (req, res)=>{
    let teacher = req.body.maestros;
    let type = req.body.type;
    let date = req.body.date;
    console.log(type);
    con.query(`INSERT INTO inasistencia(maestro, tipo, fecha) VALUES('${teacher}', '${type}', '${date}')`);
    con.query(`SELECT * FROM i_t WHERE name = '${teacher}'`, function(err, rows){
        let total = rows[0].total + 1;
        con.query(`UPDATE i_t SET total = ${total} WHERE name = '${teacher}'`);
    })
    res.redirect("Reporte.ejs?success");
})


app.get("/charts", (req, res)=>{
    con.query(`SELECT * FROM i_t`, function(err, rows){
        res.json(rows);
    })
})

//LOAD CONTROL PAGE
app.get("/control.ejs", (req, res) => {
    res.render("control");
})

//LOAD GRAPHICS'S PAGE
app.get("/Graficos.ejs", (req, res) => {
    res.render("Graficos");
})

//LOAD REPORT'S PAGE
app.get("/Reporte.ejs", (req, res) => {
    res.render("Reporte");
})

//fORM SUBMITION TO ADD TEACHERS

app.post("/add-m", function(req, res){
    var name = req.body.nom;
    var tel = req.body.tel;
    var mail = req.body.mail;
    var area = req.body.area;
    con.query(`INSERT INTO maestros(name, tel, email, area) VALUES ('${name}', '${tel}', '${mail}', '${area}')`);
    con.query(`INSERT INTO i_t(name, total) VALUES('${name}', 0)`);
    res.redirect("maestros.ejs?success");
})

//GET INFO FOR THE GRAPHICS

app.get("/month/:name", (req, res)=>{
    let name = req.params.name;
    con.query(`SELECT * FROM inasistencia WHERE maestro = '${name}'`, function(err, rows){
    res.json(rows);
    console.log(rows);
    })
})


app.listen(port, ()=>console.log("Happy Hacking!!"))