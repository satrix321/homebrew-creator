<template>
  <table :class="classList">
    <thead>
      <tr>
        <th v-for="(header, index) in processedHeaders" :key="index" v-html="header" :class="{ 
            'align-center': align[index] === 'center',
            'align-right': align[index] === 'right'
          }"/>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in processedCells" :key="rowIndex">
        <td :class="{ 
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
    pageTheme: { type: String, required: true }
  },
  data: function () {
    return {
      classList: [ this.pageTheme ]
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
table {
  width: 100%;

  th {
    text-align: left;
    white-space: normal;

    &.align-center {
      text-align: center;
    }

    &.align-right {
      text-align: right;
    }
  }

  td {
    font-family: 'regular-text';
    font-size: 9pt;
    line-height: 1.25;
    text-align: justify;
    white-space: initial;

    &.align-center {
      text-align: center;
    }

    &.align-right {
      text-align: right;
    }
  }

  border-spacing: 0px;
  margin-bottom: 12px;
  thead {
    th {
      padding: 3px;
    }
  }

  tbody {
    td {
      padding: 3px;
    }
  }

  &.theme--default {
    thead {
      th {
        font-family: $site-font;
      }
    }
    
    tbody {
      tr:nth-child(odd) {
        background-color: $page-table-row-odd-default-background-color;
      }
    }
  }

  &.theme--cthulhu-1,
  &.theme--cthulhu-2 {
    thead {
      background-color: $page-table-header-cthulhu-background-color;

      th {
        color: $page-table-header-cthulhu-color;
      }
    }
  
    tbody {
      tr:nth-child(even) {
        background-color: $page-table-row-even-cthulhu-background-color;
      }
    }
  }
}
</style>
