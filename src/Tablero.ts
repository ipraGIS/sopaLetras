export let $sopa: Tablero;

export class Tablero {
  public static instancia: null | Tablero = null;
  private vue: any;
  private numIntentos = 0;
  private reverse = false;
  private modo = "horizontal";
  private sentidoDiagonal = "";

  constructor(component: any) {
    Tablero.instancia = this;
    this.vue = component;
    const w: { [k: string]: any } = window;
    w.$sopa = this;
    this.completaTablas();
  }

  public addPalabras(palabras: any) {
    this.numIntentos = 0;
    for (const i in palabras) {
      this.addPalabra(palabras[i]);
    }
  }
  private completaTablas() {
    const characters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    for (let i = 0; i < this.vue.size; i++) {
      let result1 = [];
      let result2 = [];
      for (let j = 0; j < this.vue.size; j++) {
        result1.push(
          characters.charAt(Math.floor(Math.random() * characters.length))
        );
        result2.push("$");
      }
      this.vue.letrasTablero.push(result1);
      this.vue.valoresTablero.push(result2);
    }
  }

  private addPalabra(palabra: string) {
    const mensajeError = this.compruebaInputs(palabra);
    if (mensajeError) {
      console.log(mensajeError);
      return;
    }
    this.modosRandom();
    palabra = palabra.toUpperCase();

    let posiciones = [] as any;
    let letras = [] as any;
    this.calculaPosiciones(palabra, posiciones, letras);

    const disponible = this.vue.listado.length === 0 ? true : this.posicionLibre(posiciones, letras);
    this.numIntentos++;
    if(this.vue.listado.length > 0 && this.vue.listado.indexOf(palabra) >= 0){
      console.log(`Mira que hay palabras... prueba con otra.${palabra}  ya está escondida`)
    }
    else if (disponible) {
      this.actualizaValorPosicion(posiciones, letras);
      this.actualizaLetraPosicion(posiciones, letras);
      this.vue.listado.push(palabra);
      this.numIntentos = 0;
      console.log(`Se ha insertado la palabra: ${palabra} en modo: ${this.modo} , ${this.sentidoDiagonal} y direccion: ${this.reverse ? "RTL-revés" : "LTR-derecha"} `);
    } else if (this.numIntentos < 10 * this.vue.size) {
      posiciones.length = 0;
      letras.length = 0;
      this.addPalabra(palabra);
    } else {
      console.log(
        `SE HAN AGOTADO EL NÚMERO DE INTENTOS, LA PALABRA ${palabra} NO ENCAJA EN EL TABLERO`
      );
    }
  }

  private calculaPosiciones(palabra: string, posiciones: any, letras: any) {
    palabra = palabra.toUpperCase();
    let x = 0;
    let y = 0;
    if (this.modo === "vertical" && !this.reverse) {
      x = this.generateRandomInt(0, this.vue.size - palabra.length);
      y = this.generateRandomInt(0, this.vue.size - 1);
      for (let i = 0; i < palabra.length; i++) {
        posiciones.push([x + i, y]);
        letras.push(palabra[i]);
      }
    } else if (this.modo === "vertical" && this.reverse) {
      x = this.generateRandomInt(palabra.length - 1, this.vue.size - 1);
      y = this.generateRandomInt(0, this.vue.size - 1);
      for (let i = palabra.length - 1; i >= 0; i--) {
        posiciones.push([x - i, y]);
        letras.push(palabra[i]);
      }
    } else if (this.modo === "horizontal" && !this.reverse) {
      x = this.generateRandomInt(0, this.vue.size - 1);
      y = this.generateRandomInt(0, this.vue.size - palabra.length);
      for (let i = 0; i < palabra.length; i++) {
        posiciones.push([x, y + i]);
        letras.push(palabra[i]);
      }
    } else if (this.modo === "horizontal" && this.reverse) {
      x = this.generateRandomInt(0, this.vue.size - 1);
      y = this.generateRandomInt(palabra.length - 1, this.vue.size - 1);
      for (let i = palabra.length - 1; i >= 0; i--) {
        posiciones.push([x, y - i]);
        letras.push(palabra[i]);
      }
    } else if (this.sentidoDiagonal === "uppperLeft" && !this.reverse) {
      x = this.generateRandomInt(0, this.vue.size - palabra.length);
      y = this.generateRandomInt(0, this.vue.size - palabra.length);
      for (let i = 0; i < palabra.length; i++) {
        posiciones.push([x + i, y + i]);
        letras.push(palabra[i]);
      }
    } else if (this.sentidoDiagonal === "uppperLeft" && this.reverse) {
      x = this.generateRandomInt(palabra.length -1, this.vue.size-1);
      y = this.generateRandomInt(palabra.length -1, this.vue.size-1);
      for (let i = palabra.length - 1; i >= 0; i--) {
        posiciones.push([x - i, y - i]);
        letras.push(palabra[i]);
      }
    } else if (this.sentidoDiagonal === "bottomLeft" && !this.reverse) {
      x = this.generateRandomInt(palabra.length - 1, this.vue.size - 1);
      y = this.generateRandomInt(0, this.vue.size - palabra.length);
      for (let i = 0; i < palabra.length; i++) {
        posiciones.push([x - i, y + i]);
        letras.push(palabra[i]);
      }
    } else if (this.sentidoDiagonal === "bottomLeft" && this.reverse) {
      x = this.generateRandomInt(0, this.vue.size - palabra.length);
      y = this.generateRandomInt(this.vue.size - palabra.length, this.vue.size - 1);
      for (let i = palabra.length - 1; i >= 0; i--) {
        posiciones.push([x + i, y - i]);
        letras.push(palabra[i]);
      }
    }
  }


  private compruebaInputs(palabra: string) {
    if((/\d/).test((palabra))){
      return "solo letras por favor";
    }
    if (palabra.length == 0 || palabra.length === 1 || palabra.length > this.vue.size) {
      return "palabra de longitud errónea";
    }
    

    if (!this.vue.$refs.tablaLetras) {
      return "error al generar el tablero";
    }
    return "";
  }

  private modosRandom() {
    const modos = ["vertical", "horizontal", "diagonal"];
    this.modo = modos[Math.floor(Math.random() * modos.length)];
    this.reverse = Math.random() < 0.5 ? true : false;
    this.sentidoDiagonal = "";

    if (this.modo === "diagonal") {
      this.sentidoDiagonal =
        Math.random() < 0.5 ? "uppperLeft" : "bottomLeft";
    }

    //TODO TEST:
    this.modo = "diagonal";
    this.reverse = false;
    this.sentidoDiagonal = "bottomLeft";
  }


  private posicionLibre(posiciones: any, letras: any) {
    for (const i in posiciones) {
      if (this.vue.valoresTablero[posiciones[i][0]][posiciones[i][1]] !== "$" && this.vue.valoresTablero[posiciones[i][0]][posiciones[i][1]] !== letras[i]) {
        return false;
      } 
    }
    return true;
  }

  actualizaValorPosicion(posiciones: any, letras: any) {
    for (const i in posiciones) {
      // console.log('Se va actualizar el valor: ' + this.vue.valoresTablero[posiciones[i][0]][posiciones[i][1]] + 'con la letra' + letras[i])
      this.vue.valoresTablero[posiciones[i][0]][posiciones[i][1]] = letras[i];
    }
  }
  actualizaLetraPosicion(posiciones: any, letras: any) {
    for (const i in posiciones) {
      this.vue.letrasTablero[posiciones[i][0]][posiciones[i][1]] = letras[i];
    }

    this.coloreaPosiciones(posiciones);
  }
  coloreaPosiciones(posiciones: any) {
    const tabla = document.getElementById("tablaLetras") as HTMLTableElement;
    for (const i in posiciones) {
      if (tabla && tabla.rows[posiciones[i][0]].cells[posiciones[i][1]]) {
        tabla.rows[posiciones[i][0]].cells[posiciones[i][1]].style.backgroundColor = "red"
      }
    }
  }

  private generateRandomInt(min: any, max: any) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}