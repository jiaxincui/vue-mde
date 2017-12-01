<template>
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="linkModalLabel">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="linkModalLabel">{{locales.insertLink}}</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label>{{locales.linkText}}</label>
                            <input class="form-control" type="text" v-model.lazy="formData.linkText">
                        </div>
                        <div class="form-group">
                            <label>{{locales.linkUrl}}</label>
                            <input class="form-control" type="text" v-model.lazy="formData.linkUrl">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{{locales.cancel}}</button>
                    <button type="button" class="btn btn-primary" @click="apply">{{locales.apply}}</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'insert-link',

        props: {
            linkText: {
                type: String,
                default: ''
            },

            linkUrl: {
                type: String,
                default: 'http://'
            },

            locales: {
                type: Object,
                default() {
                    return {}
                }
            }
        },

        data() {
            return {
                formData: {
                    linkUrl: 'http://'
                }
            }
        },

        watch: {
            linkText(val) {
                this.$set(this.formData, 'linkText', val)
            },
            linkUrl(val) {
                this.$set(this.formData, 'linkUrl', val)
            }
        },

        methods: {
            apply() {
                this.$emit('insert-link', this.formData);
            }
        }
    }

</script>