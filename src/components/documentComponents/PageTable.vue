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
          v-for="(cell, cellIndex) in row" :key="cellIndex" v-html="cell"
        />
      </tr>
    </tbody>
  </table>
</template>

<script>
import { regexConsts } from '@/modules/globals';

export default {
  name: 'PageTable',
  props: {
    headers: {
      type: Array,
      required: true,
    },
    align: {
      type: Array,
      required: true,
    },
    cells: {
      type: Array,
      required: true,
    },
    pageTheme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      classList: [ this.pageTheme ],
    };
  },
  computed: {
    processedHeaders() {
      const output = [];

      for (const header of this.headers) {
        let outputHeader = header;
        outputHeader = outputHeader.replace(
          regexConsts.italicTextRegex,
          (fullMatch, group1, group2) => `${group1}<em>${group2}</em>`
        );
        outputHeader = outputHeader.replace(
          regexConsts.boldTextRegex,
          (fullMatch, group1, group2) => `${group1}<strong>${group2}</strong>`
        );
        outputHeader = outputHeader.replace(
          regexConsts.italicBoldTextRegex,
          (fullMatch, group1, group2) => `${group1}<strong><em>${group2}</em></strong>`
        );
        output.push(outputHeader);
      }
      return output;
    },
    processedCells() {
      const output = [];

      for (const row of this.cells) {
        const processedRow = [];

        for (const cell of row) {
          let processedCell = cell;

          processedCell = processedCell.replace(
            regexConsts.italicTextRegex,
            (fullMatch, group1, group2) => `${group1}<em>${group2}</em>`
          );
          processedCell = processedCell.replace(
            regexConsts.boldTextRegex,
            (fullMatch, group1, group2) => `${group1}<strong>${group2}</strong>`
          );
          processedCell = processedCell.replace(
            regexConsts.italicBoldTextRegex,
            (fullMatch, group1, group2) => `${group1}<strong><em>${group2}</em></strong>`
          );
          processedRow.push(processedCell);
        }
        output.push(processedRow);
      }
      return output;
    },
  },
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

  border-spacing: 0;
  margin-bottom: 10px;
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
