<template>
  <!-- eslint-disable max-len -->
  <div class="centrado">
    <label for="palabra">Palabra: </label>
    <input v-model="palabra" id="palabra" @change="insertaPalabra" />
    <p>{{ fnc("") }}</p>
    <!-- <label for="palabra">Encuentra: </label> -->
    <!-- <input v-model="listado" id="listado" @change="insertaPalabra" /> -->
    <p>{{ fnc("") }}</p>
    <table id="tablaLetras" ref="tablaLetras">
      <tbody>
        <tr v-for="(n, result) in this.letrasTablero.length" v-bind:key="n + result">
          <td v-for="(i, fil) in this.letrasTablero[result]" v-bind:key="i + fil">
            {{ this.letrasTablero[result][fil] }}
          </td>
        </tr>
      </tbody>
    </table>
    <hr />
    <table id="tablaSol" ref="tablaSol">
      <tbody>
        <tr
          v-for="(a, result2) in this.valoresTablero.length"
          v-bind:key="a + result2"
        >
          <td
            v-for="(b, fil2) in this.valoresTablero[result2]"
            v-bind:key="b + fil2"
          >
            {{ this.valoresTablero[result2][fil2] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang='ts'>
/* eslint-disable */
import { defineComponent } from "vue";
import { Tablero } from "../Tablero";

export default defineComponent({
  name: "Tablero",
  props: {
    msg: String,
    size: {
      type: Number,
      default: 6, // TODO: hacerlo parametrizable
    },
  },
  data() {
    return {
      result: [] as any,
      letrasTablero: [] as any,
      valoresTablero: [] as any,
      palabra: "",
      listado:[] as any

    };
  },
  mounted() {
    let tablero = new Tablero(this);
  },
 

  setup() {
    const fnc = (name: string) => `${name}  Tablero`;

    return {
      fnc,
    };
  },
  methods: {
  },
});


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.centrado {
  left: 40%;
  position: absolute;
}
table,
td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 5;
  font-size: larger;
}
td {
  min-width: 1.1em;
}
</style>
