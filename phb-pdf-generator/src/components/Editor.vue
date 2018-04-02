<template>
  <div id="editor">
    <textarea v-model="rawCode" wrap="off"></textarea>
  </div>
</template>

<script>
export default {
  name: 'Editor',
  computed: {
    rawCode: {
      get () {
        return this.$store.state.rawCode
      },
      set (value) {
        this.$store.commit('setRawCode', value)
      }
    }
  }
}
</script>

<style scoped>
#editor > textarea {
  height: 100vh;
  width: 100%;
  margin: 0px;
  border: 0px;
  padding: 0px;
  resize: none;
  background-color: rgb(65,65,65);
  color: rgb(240, 240, 240);
}
</style>
