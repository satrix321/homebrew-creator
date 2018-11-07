<template>
  <div :class="footerClassList" :data-page="pageNumber">
    <div :class="backgroundClassList"></div>
    <p :class="pageNumberClassList">{{ pageNumber }}</p>
  </div>
</template>

<script>
export default {
  name: 'PageFooter',
  props: ['pageNumber', 'pageTheme'],
  data: function () {
    return {
      footerClassList: [
        'page-footer'
      ],
      backgroundClassList: [
        'is-textured'
      ],
      pageNumberClassList: [
        'page-number'
      ]
    };
  },
  created: function () {
    if (this.pageNumber % 2 === 1) {
      this.footerClassList.push('is-odd');
    } else {
      this.footerClassList.push('is-even');
    }
    this.backgroundClassList.push(this.pageTheme);
    this.pageNumberClassList.push(this.pageTheme);
  }
};
</script>

<style lang="scss" scoped>
</style>
