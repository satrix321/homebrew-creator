<template>
  <table>
    <thead>
      <tr>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td>
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
