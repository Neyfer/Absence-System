

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


//SUBMIT THE MONTH FORM FOR THE GRAPHICS

if(document.URL.includes("Graficos.ejs")){

    get();

async function get(de){

    if(de == 1){
        document.getElementById('myChart').remove();
        document.getElementById("canvas-holder").innerHTML = `<canvas id="myChart"></canvas>`;
    }
    

    const res = await fetch("http://localhost:3000/charts", {
    method: "GET"
})
    let = data = await res.json();

    console.log(data);
    
    let names = Array();
    let values = Array();
    
    data.forEach(element => {
        names.push(element.name);    
    });

    names.forEach(item => {
        const test = fetch(`http://localhost:3000/month/${item}`)
        .then(response => response.json)
        .then(data => {
            console.log(data);
        })

        console.log(test);
    })

    const ctx = document.getElementById('myChart').getContext('2d');


    
    const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: names,
        datasets: [{
            label: '# de dias',
            data: values,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


}
    console.log("loaded");
    let options = document.getElementById("m-op");

        options.addEventListener("change", ()=>{
           //document.getElementById("form").submit();
            get(1)
        })
}
