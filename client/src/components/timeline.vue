<template>
  <div id="timeline">
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      address: ''
    }
  },
  computed: {
    ...mapGetters({
      addrData: 'getAddrData',
      newAddress: 'getNewAddress'
    })
  },
  watch: {
    addrData: function(data) {
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
