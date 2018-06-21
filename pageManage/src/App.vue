<template>
  <div id="app">

    <defaultPage name="helloWorld"> <helloWorld></helloWorld> </defaultPage>

  </div>
</template>

<script>

  import helloWorld from './components/helloWorld.vue'

export default {
  name: 'App',
  components: {
    helloWorld
  },
  mounted() {
    PageManage.replace('helloWorld', 'hello world!');
    setTimeout(() => {
      PageManage.pop('helloWorld');
    }, 5000)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
