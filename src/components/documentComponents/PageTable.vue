<template>
  <table>
    <thead>
      <tr>
        <th v-for="(headerItem, index) in headers" :key="index">
          {{ headerItem }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(cellsItem, cellsIndex) in cells" :key="cellsIndex">
        <td :class="{ 
            'align-left': align[cellIndex] === 'left',
            'align-center': align[cellIndex] === 'center',
            'align-right': align[cellIndex] === 'right'
          }"
          v-for="(cell, cellIndex) in cellsItem" :key="cellIndex">
          {{ cell }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    headers: { type: Array, required: true },
    align: { type: Array, required: true },
    cells: { type: Array, required: true }
  },
  mounted: function () {
    console.log(this.headers);
    console.log(this.align);
    console.log(this.cells);
  }
};
</script>

<style lang="scss" scoped>
</style>
