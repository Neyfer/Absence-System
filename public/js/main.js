

const baseURL = "http://localhost:3000/info";



if(document.URL.includes("maestros.ejs") || document.URL.includes("control.ejs")){
    get_maestros();
}

if(document.URL.includes("Reporte.ejs")){
    get_Report();
}


//GET INFO FROM TEACHERS TABLE!!!!!!!!!!!

async function get_maestros(){
    let data;

    const res = await fetch(baseURL, 
    {
        method: "GET"
    })
     data = await res.json()

     //IF THE DOCUMENT IS TEACHERS
     
     if(document.URL.includes("maestros.ejs")){

        let add_maestro = document.getElementById("add-m");
        let btn = document.getElementById("btn");
        let maestro_f = document.querySelector(".manto_m");
        add_maestro.addEventListener("click", ()=>{
            maestro_f.style.display = "block";
        })

        //fILL THE TABLE
        fill_Teachers(data);
     }

     //if the document is controls

     else if(document.URL.includes("control.ejs")){
        //fill teachers options
        fill_teacher_option(data);
     }
}


function fill_Teachers(data){
    for(i = 0; i < data.length; i++){
        let html = `<tr>
            <td>${i + 1}</td>
            <td>${data[i].name}</td> 
            <td>${data[i].tel}</td>
            <td>${data[i].email}</td>
            <td>${data[i].area}</td>
        </tr>`


        document.getElementById("maestros_table").innerHTML += html;
    }
}

//Lllenar las opciones en agregar inasistencia
function fill_teacher_option(data){
    for(i = 0; i < data.length; i++){
        let html = `<option value="${data[i].name}">${data[i].name}</option>`
        document.getElementById("maestros_option").innerHTML += html;
    }
}


//GET INFO FROM ABSENCE TABLE!!!!!

async function get_Report(){
    const res = await fetch("http://localhost:3000/report", {
        method: "GET"
    })

    const data = await res.json()

    fill_Absence(data);
}


//FILL ABSENCE'S TABLE

function fill_Absence(data){
    console.log(data)
    for(i = 0; i < data.length; i++){
        let html = `<tr>
            <td>${i + 1}</td>
            <td>${data[i].maestro}</td> 
            <td>${data[i].tipo}</td>
            <td>${data[i].tel}</td>
            <td>${data[i].area}</td>
            <td>${data[i].fecha}</td>
        </tr>`

        document.getElementById("absences_table").innerHTML += html;
    }
}



