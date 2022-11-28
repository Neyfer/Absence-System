
const baseURL = "https://neyfer-m-a-s.onrender.com/info";

console.log("3.0")

if(document.URL.includes("maestros.ejs") || document.URL.includes("control.ejs")){
    get_maestros();
}

if(document.URL.includes("Reporte.ejs")){
    get_Report();

    if(document.URL.includes("?success_edit")){
        alert("Record editado exitosamente");
        window.location.href = "Reporte.ejs";
    }
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
            <td><a href="#" id="${data[i].id}" class="edit-m" style="color: green">Editar</a> <a href="#"  style="color: rgb(255, 45, 45); margin-left: 15px" id="${data[i].id}" class="delete_m">Eliminar</a></td>
        </tr>`


        document.getElementById("maestros_table").innerHTML += html;
    }

    //EDIT TEACHERS
    let edit_m = document.querySelectorAll(".edit-m");
    let teachers_m = document.querySelector(".manto_m_edit");
    edit_m.forEach(btn=>{
        btn.addEventListener("click", (e)=>{
        e.preventDefault();
        teachers_m.style.display = "block";
            fetch(`https://neyfer-m-a-s.onrender.com/getteacher/${btn.id}`).then(response=>response.json()).then(data=>{
                console.log(data)
                document.getElementById("name").value = data[0].name;
                document.getElementById("tel").value = data[0].tel;
                document.getElementById("mail").value = data[0].email;
                document.getElementById("area").value = data[0].area;
                document.getElementById("id").value = data[0].id;
            })
     })
    })

    //DELETE Teachers
     let delete_m = document.querySelectorAll(".delete_m");

     delete_m.forEach(btn=>{
         
         btn.addEventListener("click", (e)=>{
             e.preventDefault();
         if(confirm("¿SEGURO QUE QUIERES ELIMINAR ESTE MAESTRO(A)?") == true){
             fetch(`https://neyfer-m-a-s.onrender.com/delete_m/${btn.id}`).then(response => response.json()).then(date=>{
                 alert("Maestro Eliminado con exito!!");
                 location.reload();
             })
         }
         })
     })
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
    const res = await fetch("https://neyfer-m-a-s.onrender.com/report", {
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
            <input type="hidden" value="${data[i].id}">
            <td><a href="#" id="${data[i].id}" class="edit-a" style="color: green">Editar</a> <a href="#"  style="color: rgb(255, 45, 45); margin-left: 15px" id="${data[i].id}" class="delete_i">Eliminar</a></td>
        </tr>`

        document.getElementById("absences_table_body").innerHTML += html;
    }

    //GET THE TOTAL OF DAYS

    document.getElementById("i-t").innerText += " " + data.length;

    run_edit_absences();
    function run_edit_absences(){
    //ACTIVATE THE EDIT FORM FOR ABSENCES

        let edit_a = document.querySelectorAll(".edit-a");
        let absence_f = document.querySelector(".manto_m");
        edit_a.forEach(btn=>{
            btn.addEventListener("click", ()=>{
                absence_f.style.display = "block";

                //FILL EVERYTHING
                fetch("https://neyfer-m-a-s.onrender.com/info").then(response=>response.json()).then(info=>{
                    info.forEach(data=>{
                        let html = `<option value="${data.name}">${data.name}</option>`
                        document.getElementById("maestros_option").innerHTML += html;
                    })
                    
                })
                fetch(`https://neyfer-m-a-s.onrender.com/absence_form_edit/${btn.id}`).then(response => response.json()).then(data=>{
                    document.getElementById("maestros_option").value = data[0].maestro;
                    document.getElementById("type").value = data[0].tipo;
                    document.getElementById("id_h").value = data[0].id;
                    let fecha = data[0].fecha.toString().trim()
                    console.log(fecha);
                    document.getElementById("date").value = fecha;
                })
             })
        })

        document.querySelector(".cancel").addEventListener("click", ()=>{
            absence_f.style.display = "none";
        })
    }

        //DELETE AN ABSENCE

        run_delete_absence();

        function run_delete_absence(){
            let delete_B = document.querySelectorAll(".delete_i");

            delete_B.forEach(btn=>{
            
            btn.addEventListener("click", (e)=>{
                e.preventDefault();
            if(confirm("¿SEGURO QUE QUIERES ELIMINAR ESTA INASISTENCIA?") == true){
                fetch(`https://neyfer-m-a-s.onrender.com/delete_i/${btn.id}`).then(response => response.json()).then(date=>{
                    alert("Inasistencia Eliminada con exito!!");
                    location.reload();
                         })
                     }
                 })
             })
        }

        //FILTER THE ABSENCES BY DATE AND NAME

        
        let btn = document.getElementById("filter_btn");

        btn.addEventListener("click", ()=>{

        let teachers = document.getElementById("m_input").value;
        let f1 = document.getElementById("f1").value;
        let f2 = document.getElementById("f2").value;

        if(f1 == '' & f2 == ''){
            f1 = "NEYFER";
            f2 = "NEYFER2"
        }
            fetch(`https://neyfer-m-a-s.onrender.com/filter_i/${f1}/${f2}/${teachers}`).then(response => response.json()).then(data =>{
                if(data.length > 0){
                    document.getElementById("absences_table_body").innerHTML = "";
                
              for(i = 0; i < data.length; i++){
                let html = `<tr>
                    <td>${i + 1}</td>
                    <td>${data[i].maestro}</td> 
                    <td>${data[i].tipo}</td>
                    <td>${data[i].tel}</td>
                    <td>${data[i].area}</td>
                    <td>${data[i].fecha}</td>
                    <input type="hidden" value="${data[i].id}">
                    <td><a href="#" id="${data[i].id}" class="edit-a" style="color: green">Editar</a> <a href="#"  style="color: rgb(255, 45, 45); margin-left: 15px" id="${data[i].id}" class="delete_i">Eliminar</a></td>
                     </tr>`
                     document.getElementById("absences_table_body").innerHTML += html;

                     if(i == data.length - 1){
                        document.getElementById("i-t").innerText = "Total: "; 
                        document.getElementById("i-t").innerText += " " + data.length;
                        run_delete_absence();
                        run_edit_absences();
                     }
              }
            }else{
               
                if(teachers == 0){
                location.reload();
                }else{
                    document.getElementById("absences_table_body").innerHTML = "";
                    document.getElementById("i-t").innerText = "Total: 0"; 
                    alert("Ningun resultado fue encontrado en la base de datos");
                }
            }
            })

        })

    //FILL THE TEACHERS NAMES

    fetch(baseURL).then(response => response.json()).then(data=>{
        data.forEach(item=>{
            let code = `<option value="${item.name}">${item.name}</option>`
            document.getElementById("m_input").innerHTML += code;
        })    
    })
}

    let names = Array();
    let values = Array();
    
//Get the total number of absences
    async function getTotal(item, list, names)
    {

        if(document.URL.includes("Graficos.ejs")){
        let month = document.getElementById("m-op");
        list.pop();
        const res = await fetch(`https://neyfer-m-a-s.onrender.com/month/${item}/${month.value}`, {
        method: "GET"
    })
    let data = await res.json();
    let data2 = Array();

    names.forEach(name=>{
        if(name == ""){
            console.log("problemmm")
        }
        data2 = [];
        console.log(name)
        data.forEach(item=>{
            data2.push(item.name);
        })
            let each = data2.filter(x => x==`${name}`).length;
            console.log(each);
            list.push(each);
            console.log(list)
        
    })
}else{
    let teacher = document.getElementById("m-op");
        list.pop();
        const res = await fetch(`https://neyfer-m-a-s.onrender.com/teacher/${item}/${teacher.value}`, {
        method: "GET"
    })

    let data = await res.json();
    console.log(data)
    let data2 = Array();

    console.log(names)

    names.forEach(name=>{
        if(name == ""){
            console.log("problemmm")
        }

       
        data2 = [];
        console.log(name)
        data.forEach(item=>{
            data2.push(item.mes);
        })
            let each = data2.filter(x => x==`${name}`).length;
            list.push(each);
            console.log(list)
    })
}
}

//FUNCTION THAT CREATES THE CHARTS

async function get(de, times, label, req){
    if(de == 1){
        document.getElementById('myChart').remove();
        document.getElementById("canvas-holder").innerHTML = `<canvas id="myChart"></canvas>`;
        names = [];
        values = [];
    }
     
        label.forEach(item=>{
            names.push(item)
        })


            if(document.URL.includes("Graficos.ejs")){

             getTotal(names, values, names);
            }else{
                 getTotal(names, values, names);
            }
            if(i == names.length - 1){
                console.log("Cantidad Nombres: " + names.length)
                console.log("Cantidad values: " + values.length)
                console.log("Nombres: " + names)
                console.log("values:" + values)
                setTimeout(() => {
                    const ctx = document.getElementById('myChart').getContext('2d');
                    
                    const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: names,
                        datasets: [{
                            label: 'Dias Faltados',
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
                            y: 0.5
                        }
                    }
                });
                }, 600);

        times = 1;

}

}
//SUBMIT THE MONTH FORM FOR THE GRAPHICS

if(document.URL.includes("Graficos.ejs")){
    let times = 0;
    let teachers = Array();
    fetch(`https://neyfer-m-a-s.onrender.com/charts`).then(response => response.json()).then(data=>{

        data.forEach(item=>{
            teachers.push(item.name)
        })
        get(0, times, teachers, "charts");
    
    console.log("loaded");
    let options = document.getElementById("m-op");

        options.addEventListener("change", ()=>{            
           setTimeout(() => {
                get(1, null, teachers, "charts")    
            }, 10);
        })
    })
}

//CHARTS FOR EACH TEACHER

if(document.URL.includes("chart_teacher.ejs")){
    let times = 0;

    fetch(`https://neyfer-m-a-s.onrender.com/charts`).then(response=>response.json()).then(data=>{
        data.forEach(item=>{
            html = `<option value = '${item.name}'>${item.name}</option>`;
            document.getElementById("m-op").innerHTML += html;
        })
        months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        get(0, times, months, "teacher_chart/");


        document.getElementById("total").innerText = "Total: "
        let maestro = document.getElementById("m-op").value;
        fetch(`https://neyfer-m-a-s.onrender.com/total_absences/${maestro}`).then(response => response.json()).then(data=>{
        if(data.length > 0){
        document.getElementById("total").innerText = "Total: " + data.length;
        }
        })
    })
    

    console.log("loaded");
    let options = document.getElementById("m-op");

        options.addEventListener("change", ()=>{            
           setTimeout(() => {
            get(1, null, months, "teacher_chart") 
            }, 10);

        document.getElementById("total").innerText = "Total: "
        let maestro = document.getElementById("m-op").value;
        fetch(`https://neyfer-m-a-s.onrender.com/total_absences/${maestro}`).then(response => response.json()).then(data=>{
        if(data.length > 0){
        document.getElementById("total").innerText = "Total: " + data.length;
        }
        })
        })


    }

