<template>
  <div :class="headerClassList">
    <div :class="backgroundClassList"></div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: ['pageNumber', 'pageTheme'],
  data: function () {
    return {
      headerClassList: [
        'page-header'
      ],
      backgroundClassList: [
        'is-textured'
      ]
    };
  },
  created: function () {
    if (this.pageNumber % 2 === 1) {
      this.headerClassList.push('is-odd');
    } else {
      this.headerClassList.push('is-even');
    }
    this.backgroundClassList.push(this.pageTheme);
  }
};
</script>

<style lang="scss" scoped>
</style>
