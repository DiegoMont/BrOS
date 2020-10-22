let entorno;

function crearEntorno(){
  borrarTodo();
  let numProcesadores = document.getElementById("numero-procesadores").value;
  let quantum = Number.parseInt(document.getElementById("quantum").value);
  let bloqueo = Number.parseInt(document.getElementById("bloqueo").value);
  let tcc = Number.parseInt(document.getElementById("tcc").value);
  entorno = new Entorno(numProcesadores, quantum, bloqueo, tcc);
  document.getElementById("cuerpo-entorno").classList.remove("ocultar");
  console.log(entorno);
}

function procesosPredefinidos(){
  if(entorno == null) 
    return;
  
  entorno.formarProceso(new Proceso("B", 300, 2));
  entorno.formarProceso(new Proceso("D", 100, 2));
  entorno.formarProceso(new Proceso("F", 500, 3));
  entorno.formarProceso(new Proceso("H", 700, 4));
  entorno.formarProceso(new Proceso("J", 300, 2, 1500));
  entorno.formarProceso(new Proceso("L", 3000, 5, 1500));
  entorno.formarProceso(new Proceso("N", 50, 2, 1500));
  entorno.formarProceso(new Proceso("O", 600, 3, 1500));
  entorno.formarProceso(new Proceso("A", 400, 2, 3000));
  entorno.formarProceso(new Proceso("C", 50, 2, 3000));
  entorno.formarProceso(new Proceso("E", 1000, 5, 3000));
  entorno.formarProceso(new Proceso("G", 10, 2, 3000));
  entorno.formarProceso(new Proceso("I", 450, 3, 3000));
  entorno.formarProceso(new Proceso("K", 100, 2, 4000));
  entorno.formarProceso(new Proceso("M", 80, 2, 4000));
  entorno.formarProceso(new Proceso("P", 800, 4, 4000));
  entorno.formarProceso(new Proceso("Ñ", 500, 3, 8000));
  console.log("Procesos cargados");
  displayProcesos();
}

function mostrarProcesos(){
  let divProcesos = document.getElementById("colaProcesos");
  divProcesos.innerHTML = "";
  for (const proceso of entorno.colaProcesos) {
    divProcesos.appendChild("<div class='proceso'>"+ proceso.id +"</div>");
  }
}

function addProceso(){
  if(entorno == null) 
    return;
  let id = document.getElementById("id").value;
  let te = document.getElementById("tiempo-ejecucion").value;
  let bloqueos = document.getElementById("numero-bloqueos").value;
  let ti = document.getElementById("tiempo-entrada").value;
  entorno.formarProceso(new Proceso(id, Number(te), Number(bloqueos), Number(ti)));
  console.log("Proceso añadido");
  displayProcesos();
}

function calcular(){
  borrarTodo();
  entorno.comenzarEjecucion();
  dibujarTablas();
}

function displayProcesos(){
    const colores = ["red", "lime", "orange", "gold", "saddlebrown", "midnightblue", "violet", "darkgrey", "aqua", "indigo", "deeppink", "plum", "teal", "chartreuse", "indigo", "darksalmon", "aquamarine", "antiquewhite", "orangered"];
  const divCola = document.getElementById("cola-procesos");
  divCola.innerHTML = "";
  for (const proceso of entorno.colaProcesos.lista) {
    let element = document.createElement("p");
    let randomColor = Math.floor(Math.random() * colores.length);
    element.style.backgroundColor = colores[randomColor];
    element.classList.add("proceso");
    element.innerHTML = proceso.id;
    divCola.appendChild(element);
  }
}

function dibujarTablas() {
  const espacioTablas = document.getElementById("espacio-tablas");
  espacioTablas.innerHTML = "";
  for (const procesador of entorno.procesadores) {
    espacioTablas.innerHTML += "<h6>Procesador "+procesador.id+"</h6>";
    let stringTable = "<table><tr><th>Proceso</th><th>TCC</th><th>TE</th><th>TVC</th><th>TB</th><th>TT</th><th>TI</th><th>TF</th></tr>";
    for(let j = 0; j < procesador.procesosEjecutados.length; j++) {
      const i = procesador.procesosEjecutados[j];
      stringTable += "<tr><td>"+i.proceso+"</td><td>"+i.tcc+"</td><td>"+i.te+"</td><td>"+i.tvc+"</td><td>"+i.tb+"</td><td>"+i.tt+"</td><td>"+i.ti+"</td><td>"+i.tf+"</td></tr>";
      if (j+1 < procesador.procesosEjecutados.length && procesador.procesosEjecutados[j+1].ti > i.tf) {
        stringTable += "<tr><td>Hueco</td><td></td><td></td><td></td><td></td><td></td><td>"+i.tf+"</td><td>"+procesador.procesosEjecutados[j+1].ti+"</td></tr>";
      }
    }
    stringTable += "</table>";
    espacioTablas.innerHTML += stringTable;
    procesador.procesosEjecutados = new Array();
  }
}

function borrarTodo() {
  const espacioTablas = document.getElementById("espacio-tablas");
  espacioTablas.innerHTML = "";
  const divCola = document.getElementById("cola-procesos");
  divCola.innerHTML = "";
}