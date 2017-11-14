<template>
  <div ref="mapContainer">
   <!-- <div ref:"mapContiner"> -->
  
  </div>
</template>

<script>
import Map from '../charts/MapView'
import $ from 'jquery'
export default {
  // components: { myHeader, myContent, myFooter },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.getData();
    // console.log(this.$refs.mainTable)
    console.log(this.$refs.mapContainer)

    this.Map = new Map(this.$refs.mapContainer)
  },
  methods: {
    getData () {
      // this.$api.get('topics', null, r => {
      //   this.list = r.data
      // })
    }
  }
}
</script>

<style>
  /*.article_list {margin: auto;}*/

  #mapContainer{
  	height: 100%;
  	width: 100%;
  }
</style>