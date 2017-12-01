<template>
    <ul class="pagination">
        <li v-if="pagination.current_page > 1">
            <a href="#" aria-label="Previous"
               @click.prevent="changePage(pagination.current_page - 1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li v-else class="disabled"><span>&laquo;</span></li>
        <li v-for="page in pagesNumber" :class="[ page == pagination.current_page ? 'active' : '']">
            <a href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li v-if="pagination.current_page < pagination.last_page">
            <a href="#" aria-label="Next"
               @click.prevent="changePage(pagination.current_page + 1)">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
        <li v-else class="disabled"><span>&raquo;</span></li>
    </ul>
</template>
<script>
    export default {
        name: 'pagination',
        props: {
            offset: {
                type: Number,
                default: 4
            },
            pagination: {
                type: Object,
                default() {
                    return {}
                },
            }
        },
        data() {
            return {}
        },
        computed: {
            pagesNumber() {
                if (!this.pagination.to) {
                    return [];
                }
                var from = this.pagination.current_page - this.offset;
                if (from < 1) {
                    from = 1;
                }
                var to = from + (this.offset * 2);
                if (to >= this.pagination.last_page) {
                    to = this.pagination.last_page;
                }
                var pagesArray = [];
                while (from <= to) {
                    pagesArray.push(from);
                    from++;
                }
                return pagesArray;
            }
        },
        methods: {
            changePage(page) {
                this.pagination.current_page = page;
                this.$emit('change-page', page);
            }
        }
    }
</script>
