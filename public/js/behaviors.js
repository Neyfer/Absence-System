let charts = document.getElementById("c_group");
let expand_i = document.querySelector(".i-expand")

charts.addEventListener("click", ()=>{
    expand_i.style.transform = 'rotate(360deg)';
})