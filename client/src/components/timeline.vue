

<template>
    <div id="top">
    </div>
</template>


<script>
    export default {
        data () {
            return {
                address: ''
            }
        },
        watch: {
            address: function(data) {
                console.log(data)
            }
        },
        methods: {
            submit: function(data) {
                console.log(data)
            }
        }
    }
</script>

<style scoped>

</style>

