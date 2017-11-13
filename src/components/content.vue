<template>
  <div>
    <myHeader></myHeader>
    <p>content</p>
    <h2>{{index}}</h2>
    <h2>{{singer}}</h2>
    <h2>{{add()}}</h2>
    <button @click="addIndex">click</button>
    <myFooter></myFooter>
  </div>
</template>
<script>
import myHeader from '../components/header.vue'
import myFooter from '../components/footer.vue'
import {mapActions,mapGetters} from 'vuex'
import {singer} from '../vuex/getters'
export default {
  components: { myHeader, myFooter },
  methods:{

  ...mapActions(['addIndex',]),
  add(){
    return $("#app").text()
  },
  },
  computed:mapGetters(['singer','index']),
  data () {
    return {
      id: this.$route.params.id,
    }
  },
  created () {
  },
}
</script>