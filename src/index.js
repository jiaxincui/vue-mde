import VueMDE from './components/VueMDE.vue'

VueMDE.install = function(Vue) {
    Vue.component('vue-mde', VueMDE);
};