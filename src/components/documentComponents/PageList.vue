<template>
  <div class="list">
    <ul ref="unorderedList" v-if="listType === 'unordered'">
    </ul>
    <ol ref="orderedList" v-if="listType === 'ordered'">
    </ol>
  </div>
</template>

<script>
export default {
  name: 'PageList',
  props: {
    listType: { type: String, required: true },
    listComponents: { type: Array, required: true },
    theme: { type: String, required: true }
  },
  mounted: function () {
    switch (this.listType) {
      case 'unordered': {
        for (let component of this.listComponents) {
          if (component.$el.classList.contains('list')) {
            this.$refs.unorderedList.appendChild(component.$el);
          } else {
            let listItem = document.createElement('li');
            listItem.appendChild(component.$el);
            this.$refs.unorderedList.appendChild(listItem);
          }
        }
        break;
      }
      case 'ordered': {
        for (let component of this.listComponents) {
          if (component.$el.classList.contains('list')) {
            this.$refs.orderedList.appendChild(component.$el);
          } else {
            let listItem = document.createElement('li');
            listItem.appendChild(component.$el);
            this.$refs.orderedList.appendChild(listItem);
          }
        }
        break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
