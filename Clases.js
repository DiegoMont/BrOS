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

