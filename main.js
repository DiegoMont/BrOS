class Proceso {
  id = "";
  te = 0;
  constructor(id, tiempoEjecucion, numBloqueos, tiempoEntrada = 0){
    this.id = id;
    this.tiempoEjecucion = tiempoEjecucion;
    this.tiempoEntrada = tiempoEntrada;
    this.numBloqueos = numBloqueos;
  }
}

class InfoProcesado {
  constructor(idProceso, tcc, te, tvc, tb, tiempoTotal, ti, tf){
    this.proceso = idProceso;
    this.tcc = tcc;
    this.te = te;
    this.tvc = tvc;
    this.tb = tb;
    this.tt = tiempoTotal;
    this.ti = ti;
    this.tf = tf;
  }
}

class Procesador {
  quantum = 0;
  tiempoBloqueo = 0;
  tiempoCambioContexto = 0;
  
  constructor(id, quantum, bloqueo, tcc){
    this.id = id;
    this.quantum = quantum;
    this.tiempoBloqueo = bloqueo;
    this.tiempoCambioContexto = tcc;
    this.tiempoTerminacion = 0;
    this.procesosEjecutados = new Array();
    this.libre = false;
  }

  correrProceso(proceso){
    //console.log(proceso.id+" "+this.tiempoTerminacion + "   " + proceso.tiempoEntrada);
    let tcc = this.libre || this.tiempoTerminacion == 0 ? 0: this.tiempoCambioContexto;
    let tvc = (Math.ceil(proceso.tiempoEjecucion / this.quantum) - 1) * this.tiempoCambioContexto;
    let tb = proceso.numBloqueos * this.tiempoBloqueo;
    let tiempoTotal = tcc + proceso.tiempoEjecucion + tvc + tb;
    //this.procesosEjecutados.push(proceso.id);
    let ti = this.tiempoTerminacion;
    this.tiempoTerminacion += tiempoTotal;
    let infoProcesado = new InfoProcesado(proceso.id, tcc, proceso.tiempoEjecucion, tvc, tb, tiempoTotal, ti, this.tiempoTerminacion);
    this.procesosEjecutados.push(infoProcesado);
    this.libre = false;
  }

  toString(){
    
  }

}

class Queue {
  constructor(){
    this.lista = new Array();
    this.length = 0;
  }

  isEmpty(){
    return this.length == 0;
  }

  enqueue(elemento){
    this.lista.push(elemento);
    this.length++;
  }

  dequeue(){
    if (this.isEmpty()) {
      return null;
    } else {
      this.length--;
      return this.lista.shift();
    }
  }

}

class Entorno {
  constructor(numProcesadores, quantum, bloqueo, tcc){
    this.procesadores = new Array();
    for (let i = 0; i < numProcesadores; i++) {
      this.procesadores.push(new Procesador(i+1, quantum, bloqueo, tcc));
    }
    this.colaProcesos = new Queue();
  }

  formarProceso(proceso){
    this.colaProcesos.enqueue(proceso);
  }

  comenzarEjecucion(){
    let proceso = this.colaProcesos.dequeue();
    let tiempoActual = proceso.tiempoEntrada;
    while (proceso !== null) {
      let procesador = this.procesadores[0];
      let tiempoMinimo = 1000000;
      //console.log("Corriendo proceso " + proceso.id);
      for (let micro of this.procesadores) {
        //console.log("Procesador " + micro.id + ": " + micro.tiempoTerminacion);
        if(micro.tiempoTerminacion < proceso.tiempoEntrada){
          micro.tiempoTerminacion = proceso.tiempoEntrada;
          micro.libre = true;
        }
        if (micro.tiempoTerminacion < tiempoMinimo) {
          procesador = micro;
          tiempoMinimo = micro.tiempoTerminacion;
        }
      }
      procesador.correrProceso(proceso);
      proceso = this.colaProcesos.dequeue();
    }
  }

}

function main() {
  const entorno1 = new Entorno(3, 100, 10, 15);
  entorno1.formarProceso(new Proceso("B", 300, 2));
  entorno1.formarProceso(new Proceso("D", 100, 2));
  entorno1.formarProceso(new Proceso("F", 500, 3));
  entorno1.formarProceso(new Proceso("H", 700, 4));
  entorno1.formarProceso(new Proceso("J", 300, 2, 1500));
  entorno1.formarProceso(new Proceso("L", 3000, 5, 1500));
  entorno1.formarProceso(new Proceso("N", 50, 2, 1500));
  entorno1.formarProceso(new Proceso("O", 600, 3, 1500));
  entorno1.comenzarEjecucion();
}

//main();

let entorno;

function crearEntorno(){
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
  entorno.formarProceso(new Proceso(id, te, bloqueos, ti));
  console.log("Proceso añadido");
  displayProcesos();
}

function calcular(){
  entorno.comenzarEjecucion();
  dibujarTablas();
}

function displayProcesos(){
  const divCola = document.getElementById("cola-procesos");
  divCola.innerHTML = "";
  for (const proceso of entorno.colaProcesos.lista) {
    let element = document.createElement("p");
    element.classList.add("proceso");
    element.innerHTML = proceso.id;
    divCola.appendChild(element);
  }
}

function dibujarTablas() {
  const espacioTablas = document.getElementById("espacio-tablas");
  for (const procesador of entorno.procesadores) {
    let stringTable = "<table><tr><th>Proceso</th><th>TCC</th><th>TE</th><th>TVC</th><th>TB</th><th>TT</th><th>TI</th><th>TF</th></tr>";
    for (const i of procesador.procesosEjecutados) {
      stringTable += "<tr><td>"+i.proceso+"</td><td>"+i.tcc+"</td><td>"+i.te+"</td><td>"+i.tvc+"</td><td>"+i.tb+"</td><td>"+i.tt+"</td><td>"+i.ti+"</td><td>"+i.tf+"</td></tr>";
    }
    stringTable += "</table>";
    espacioTablas.innerHTML += stringTable;
  }
}
