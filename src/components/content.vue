<!-- 网络请求，vuex，vuerouter的使用 -->
<template>
  <div>
    <myHeader></myHeader>
    <p>content</p>
    <h2>{{index}}</h2>
    <h2>{{singer}}</h2>
     <button @click="addIndex">click</button>
    <div class="article_list">
      <ul>
        <li v-for="i in list">
          <time v-text="$utils.getTime(i.create_at)"></time>
          <router-link :to="'/content/' + i.id">
            {{ i.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <!-- <myFooter></myFooter> -->
  </div>
</template>
<script>
import myHeader from '../components/header.vue'
// import myFooter from '../components/map.vue'
import {mapActions,mapGetters} from 'vuex'
import {singer} from '../vuex/getters'
export default {
  components: { myHeader},
  methods:{

  ...mapActions(['addIndex',]),
  getData () { //网络请求
      this.$api.get('topics', null, r => {
        this.list = r.data
      })
    }
  },
  computed:mapGetters(['singer','index']),
  data () {
      return {
      list: []
    }
  },
  created () {
    this.getData()
  }
}
</script>