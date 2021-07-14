<template>
  <!-- eslint-disable max-len -->
  <input v-model="palabra" @change="insertaPalabra" />
  <p>Palabra: {{ palabra }}</p>
  <div class="centrado">
    <p>{{ fnc("") }}</p>
    <table id="myTable" ref="myTable">
      <tbody>
        <tr v-for="(n, result) in this.letrasTablero.length" v-bind:key="n">
          <th v-for="(i, fil) in this.letrasTablero[result]" v-bind:key="i">
            {{ this.letrasTablero[result][fil] }}
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang='ts'>
/* eslint-disable */
import { defineComponent } from "vue";

export default defineComponent({
  name: "Tablero",
  props: {
    msg: String,
    size: {
      type: Number,
      default: 12, // TODO: hacerlo parametrizable
    },
  },
  data() {
    return {
      result: [] as any,
      letrasTablero: [] as any,
      palabra: "",
      vertical: true,
      reverse: true,
    };
  },
  mounted() {
    this.completaTablas();
  },
  updated() {
    console.log(this.$refs.myTable as any);
  },

  setup() {
    const fnc = (name: string) => `${name}  Tablero`;

    return {
      fnc,
    };
  },
  methods: {
    completaTablas() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < this.size; i++) {
        let result1 = [];
        const charactersLength = characters.length;
        for (let i = 0; i < this.size; i++) {
          result1.push(
            characters.charAt(Math.floor(Math.random() * charactersLength))
          );
        }
        this.letrasTablero.push(result1);
      }
    },
    modosRandom() {
      this.vertical = Math.random() < 0.5 ? true : false;
      this.reverse = Math.random() < 0.5 ? true : false;
    },


// NOTA: ojoooooo así lo estoy modificando por medio del objeto TABLA....pero al ser reactive... sería mejor hacerlo por medio del objeto ARRAY.. result o letrasTablero?????
    insertaPalabra() {
      if (this.palabra.length > this.size) {
        alert("palabra de longitud mayor al tablero");
        return;
      }

      if (!this.$refs.myTable) {
        alert("error al generar el tablero");
        return;
      }

      this.modosRandom();
      const tabla = this.$refs.myTable as any;
      const th = [...tabla.getElementsByTagName("th")];
      th.forEach(x => x.style.color = "black");

      this.palabra = this.palabra.toUpperCase();
      console.log(`Se va a insertar la palabra: ${this.palabra} en sentido: ${this.vertical ? "Vertical" : "Horizontal"} y direccion: ${this.reverse ? "RTL-revés" : "LTR-derecha"} `);

     let x, y;

      if (this.vertical && !this.reverse) {
        y = Math.floor(Math.random() * (this.size - this.palabra.length) + 1);
        x = Math.floor(Math.random() * this.size);
        for (let i = 0; i < this.palabra.length; i++) {
          tabla.rows[y + i].cells[x].innerHTML = this.palabra[i];
          tabla.rows[y + i].cells[x].style.color = "green";
        }
      } else if (this.vertical && this.reverse) {
        y = generateRandomInt(this.palabra.length, this.size);
        x = Math.floor(Math.random() * this.size);
        for (let i = this.palabra.length - 1; i >= 0; i--) {
          tabla.rows[y - i].cells[x].innerHTML = this.palabra[i];
          tabla.rows[y - i].cells[x].style.color = "orange";
        }
      } else if (!this.vertical && !this.reverse) {
        y = generateRandomInt(0, this.size - this.palabra.length);
        x = generateRandomInt(0, this.size);
        for (let i = 0; i < this.palabra.length; i++) {
          tabla.rows[x].cells[y + i].innerHTML = this.palabra[i];
          tabla.rows[x].cells[y + i].style.color = "red";
        }
      } else if (!this.vertical && this.reverse) {
        y = generateRandomInt(this.palabra.length, this.size);
        x = generateRandomInt(this.palabra.length, this.size);
        for (let i = 0; i < this.palabra.length; i++) {
          tabla.rows[x].cells[y - i].innerHTML = this.palabra[i];
          tabla.rows[x].cells[y - i].style.color = "blue";
        }
      }
    },
  },
});

function generateRandomInt(min: any, max: any) {
  return Math.floor(Math.random() * (max - min) + min);
}

function dameXY() {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.centrado {
  left: 50%;
  position: absolute;
}
table,
td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 5;
  font-size: larger;
}
</style>
