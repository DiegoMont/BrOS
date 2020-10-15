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
  }

  correrProceso(proceso){
    let tcc = this.tiempoTerminacion < proceso.tiempoEntrada || this.tiempoEntrada == 0 ? 0: this.tiempoCambioContexto;
    let tvc = (Math.ceil(proceso.tiempoEjecucion / this.quantum) - 1) * this.tiempoCambioContexto;
    let tb = proceso.numBloqueos * this.tiempoBloqueo;
    let tiempoTotal = tcc + proceso.tiempoEjecucion + tvc + tb;
    this.procesosEjecutados.push(proceso.id);
    this.tiempoTerminacion += tiempoTotal;
    console.log(tcc);
    console.log(tvc);
    console.log(tb);
    console.log(tiempoTotal);
    
  }

  toString(){
    console.log("Procesador " + this.id);
    for (const proceso of this.procesosEjecutados) {
      console.log(proceso);
      
    }
    
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
      console.log("Corriendo proceso " + proceso.id);
      for (let micro of this.procesadores) {
        console.log("Procesador " + micro.id + ": " + micro.tiempoTerminacion);
        if(micro.tiempoTerminacion < proceso.tiempoEntrada){
          micro.tiempoTerminacion = proceso.tiempoEntrada;
        }
        if (micro.tiempoTerminacion < tiempoMinimo) {
          procesador = micro;
          tiempoMinimo = micro.tiempoTerminacion;
        }
      }
      procesador.correrProceso(proceso);
      proceso = this.colaProcesos.dequeue();
    }

    for (const procesador of this.procesadores) {
      procesador.toString();
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
}

function calcular(){
  entorno.comenzarEjecucion();
}