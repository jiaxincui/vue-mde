<template>
  <div id="app" class="container">
    <vue-mde v-model="content" :options="options"/>
  </div>
</template>

<script>
import VueMDE from './components/VueMDE.vue'

export default {
  name: 'app',
  components: {
      'vue-mde': VueMDE
  },
    data() {
      return {
          content: {markdown: 'this.id'},
          options: {
              toolbars: [],
              dropzone: {
                  url: '/',
                  headers: {
                      Authorization: `Bearer ${sessionStorage.token}`,
                      Accept: 'application/json',
                  },
              }
          }
      }
    }
}
</script>
