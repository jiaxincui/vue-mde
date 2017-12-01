<template>
  <div id="app" class="container">
    <vue-mde :options="options"/>
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
          options: {
              toolbars: [],
              dropzone: {
                  url: '/',
                  headers: {
                      Authorization: `Bearer ${localStorage.token}`,
                      Accept: 'application/json',
                  },
              }
          }
      }
    }
}
</script>
