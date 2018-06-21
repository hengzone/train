<template>

  <div>
    hello world
  </div>

</template>

<script>

    export default {
        props: {},
        watch: {},
        data() {
            return {}
        },

        created() {
        },

        mounted() {
        },

        onEnter(str) {
          console.log('test: hello World enter!', str);
        },
        onExit() {
          console.log('test: hello World exit!')
        },

        components: {},

        computed: {},

        methods: {}

    }

</script>

<style>

</style>
