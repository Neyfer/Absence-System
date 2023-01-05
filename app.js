const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');


//DATABASE
const mysql = require("mysql");
const { compile } = require("ejs");
const { json } = require("express");

let con = mysql.createConnection({
    host: "sql.freedb.tech ",
    user: "freedb_neyfer",
    password: "nPcR@u4dK7QGn!4",
    database: "freedb_asistencia"
})

con.connect(function(err){
    if(err){
        throw err;
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
        res.json(rows);
    });
})


//GET TEACHER'S ABSENCES
app.get("/report", (req, res)=>{

  
    con.query("SELECT inasistencia.id, inasistencia.maestro, inasistencia.tipo, inasistencia.fecha, maestros.tel, maestros.area FROM inasistencia, maestros WHERE inasistencia.maestro = maestros.name ORDER BY id DESC", function(err, rows){
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
    con.query(`INSERT INTO inasistencia(maestro, tipo, fecha) VALUES('${teacher}', '${type}', '${date}')`);
    res.redirect("Reporte.ejs");
})


app.get("/charts", (req, res)=>{
    con.query(`SELECT * FROM maestros`, function(err, rows){
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

//LOAD THE CHARTS BY TEACHER
app.get("/chart_teacher.ejs", (req, res)=>{
    res.render("chart_teacher");
})

//fORM SUBMITION TO ADD TEACHERS

app.post("/add-m", function(req, res){
    var name = req.body.nom;
    var tel = req.body.tel;
    var mail = req.body.mail;
    var area = req.body.area;
    con.query(`INSERT INTO maestros(name, tel, email, area) VALUES ('${name}', '${tel}', '${mail}', '${area}')`, function(err){
        if(!err){
            res.redirect("maestros.ejs?success");
        }
    });
    
})

//GET INFO FOR THE GRAPHICS

app.get("/month/:name/:month", (req, res)=>{
    let month = req.params.month;

    if(month == 0){
        con.query(`
        select inasistencia.tipo, maestros.name from inasistencia, maestros WHERE inasistencia.maestro = maestros.name order by maestros.id ASC;`, async function(err, rows){
            await res.json(rows);
        })
    }else{
        console.log(month);
        con.query(`select inasistencia.tipo, inasistencia.fecha, maestros.name from inasistencia, maestros WHERE inasistencia.maestro = maestros.name AND MONTH(inasistencia.fecha) = ${month} order by maestros.id ASC;`, async function(err, rows){
            await res.json(rows);
            })
    }
})

//GET INFO TO EDIT ABSENCES

app.get("/absence_form_edit/:id", (req, res) =>{
    let id = req.params.id;
    con.query(`SELECT * FROM inasistencia WHERE id = ${id}`, function(err, rows){
        res.json(rows);
    });
})

//EDIT THE ABSENCE RECORD

app.post("/edit-i", (req, res)=>{
    let teacher = req.body.maestros;
    let type = req.body.type;
    let date = req.body.date;
    let id = req.body.id_h;

    con.query(`UPDATE inasistencia SET maestro = '${teacher}', tipo = '${type}', fecha = '${date}' WHERE id = ${id}`);
    res.redirect("Reporte.ejs?success_edit");
})

//DELETE AN ABSENCE RECORD

app.get("/delete_i/:id", (req, res)=>{
    let id = req.params.id;

    con.query(`DELETE FROM inasistencia WHERE id = ${id}`, (err, res)=>{
        if(err){
            throw err;
        }
    });

    res.json("NEYFER THE BEST");
    
})

app.get("/getteacher/:id", (req, res)=>{
    let id = req.params.id;
    con.query(`SELECT * FROM maestros WHERE id = ${id}`, (err, rows)=>{
        res.json(rows);
    })
})      

app.post("/edit_m", (req, res)=>{
    let name = req.body.nom;
    let tel = req.body.tel;
    let mail = req.body.mail;
    let area = req.body.area;
    let id = req.body.id;

    con.query(`UPDATE maestros SET name = '${name}', tel = '${tel}', email = '${mail}', area = '${area}' WHERE id = ${id}`);

    res.redirect("maestros.ejs?success_edit")
})

app.get("/delete_m/:id", (req, res)=>{
    let id = req.params.id;

    con.query(`DELETE FROM maestros WHERE id = ${id}`);
    res.json("NEYFER THE BEST");
})

app.get("/filter_i/:f1/:f2/:teacher", (req, res)=>{
    let date1 = req.params.f1;
    let date2 = req.params.f2; 
    let teacher = req.params.teacher;


     if(date1 == "NEYFER"){
        con.query(`SELECT inasistencia.id, inasistencia.maestro, inasistencia.tipo, inasistencia.fecha, maestros.tel, maestros.area FROM inasistencia, maestros WHERE inasistencia.maestro = maestros.name AND maestro = '${teacher}'`, (err, rows)=>{
            res.json(rows);
        })
    }else if (teacher == "0"){
        con.query(`SELECT inasistencia.id, inasistencia.maestro, inasistencia.tipo, inasistencia.fecha, maestros.tel, maestros.area FROM inasistencia, maestros WHERE inasistencia.maestro = maestros.name AND (fecha BETWEEN '${date1}'AND '${date2}')`, (err, rows)=>{
            res.json(rows);
        })
    }else{
        con.query(`SELECT inasistencia.id, inasistencia.maestro, inasistencia.tipo, inasistencia.fecha, maestros.tel, maestros.area FROM inasistencia, maestros WHERE inasistencia.maestro = maestros.name AND (fecha BETWEEN '${date1}'AND '${date2}') AND maestro = '${teacher}'`, (err, rows)=>{
            res.json(rows);
        })
    }


})

//GET THE DATA FOR PAGE TWO OF CHARTS

app.get("/teacher/:month/:name", (req, res)=>{
    let name = req.params.name;
    con.query(`select inasistencia.tipo, inasistencia.fecha, months.mes from inasistencia, months WHERE inasistencia.maestro = '${name}' AND MONTH(inasistencia.fecha) = months.id order by months.id ASC;`, (err, rows)=>{ 
        
        res.json(rows);

        if(err){
            throw err
        }
   })
})

app.get("/total_absences/:name", (req, res)=>{
    let name = req.params.name;

    con.query(`SELECT * FROM inasistencia WHERE maestro = '${name}'`, (err, rows)=>{
        res.json(rows);
    })
})

app.listen(port, ()=>console.log("Happy Hacking!!"))
