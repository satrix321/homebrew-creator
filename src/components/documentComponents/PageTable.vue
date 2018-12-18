<template>
  <table :class="classList">
    <thead>
      <tr>
        <th v-for="(header, index) in processedHeaders" :key="index" v-html="header"/>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in processedCells" :key="rowIndex">
        <td :class="{ 
            'align-left': align[cellIndex] === 'left',
            'align-center': align[cellIndex] === 'center',
            'align-right': align[cellIndex] === 'right'
          }"
          v-for="(cell, cellIndex) in row" :key="cellIndex" v-html="cell"/>
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
    cells: { type: Array, required: true },
    theme: { type: String, required: true }
  },
  data: function () {
    return {
      classList: []
    };
  },
  computed: {
    processedHeaders: function () {
      let output = [];
      for (let header of this.headers) {
        let outputHeader = header;
        outputHeader = outputHeader.replace(/(?<!\*)\*([^\s*].*?[^\s*]|[^\s*])\*(?!\*)/g, function (fullMatch, group1) {
          return '<em>' + group1 + '</em>';
        });
        outputHeader = outputHeader.replace(/(?<!\*)\*\*([^\s*].*?[^\s*]|[^\s*])\*\*(?!\*)/g, function (fullMatch, group1) {
          return '<strong>' + group1 + '</strong>';
        });
        outputHeader = outputHeader.replace(/(?<!\*)\*\*\*([^\s*].*?[^\s*]|[^\s*])\*\*\*(?!\*)/g, function (fullMatch, group1) {
          return '<strong><em>' + group1 + '</em></strong>';
        });
        output.push(outputHeader);
      }
      return output;
    },
    processedCells: function () {
      let output = [];
      for (let row of this.cells) {
        let processedRow = [];
        for (let cell of row) {
          let processedCell = cell;
          processedCell = processedCell.replace(/(?<!\*)\*([^\s*].*?[^\s*])\*(?!\*)/g, function (fullMatch, group1) {
            return '<em>' + group1 + '</em>';
          });
          processedCell = processedCell.replace(/(?<!\*)\*\*([^\s*].*?[^\s*])\*\*(?!\*)/g, function (fullMatch, group1) {
            return '<strong>' + group1 + '</strong>';
          });
          processedCell = processedCell.replace(/(?<!\*)\*\*\*([^\s*].*?[^\s*])\*\*\*(?!\*)/g, function (fullMatch, group1) {
            return '<strong><em>' + group1 + '</em></strong>';
          });
          processedRow.push(processedCell);
        }
        output.push(processedRow);
      }
      return output;
    }
  }
};
</script>

<style lang="scss" scoped>
th {
  white-space: normal;
}
td {
  font-family: 'regular-text';
  font-size: 9pt;
  line-height: 1.25;
  text-align: justify;
  white-space: initial;
}
</style>
