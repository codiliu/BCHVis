<template>
  <div id="app">
 <b-navbar toggleable="md" type="dark" variant="dark" ref="myNavbar">

  <!-- <b-navbar-toggle target="nav_collapse"></b-navbar-toggle> -->
  <b-navbar-brand href="#">Vue demo</b-navbar-brand>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item href="http://vis.pku.edu.cn" target="_blank">PKU VIS</b-nav-item>
    </b-navbar-nav>
</b-navbar>
 <div id="content">
  <myHeader id ="zone1"></myHeader>
  <myHeader id ="zone2"></myHeader>
    <!-- <myContent></myContent> -->
  <myFooter id ="zone3"></myFooter>


<!-- <router-view/> -->
  </div>
  </div>
</template>

<script>

import myHeader from './components/header.vue'
import myFooter from './components/map.vue'
export default {
  name: 'app',
  components: { myHeader, myFooter},
}
</script>

<style lang="less">
@import "./style/style.less";
 #app {
   position: absolute;
    height: 100%;
    width:100%;

   #content{
   position: absolute;
   width:100%;
   height:calc(~"100% - 56px");


   #zone1{
    position: absolute;
    left:0;
    top:0;
    width:50%;
    height:50%;
    background: @color-bd;
   }
   #zone2{
    position: absolute;
    left:50%;
    top:0;
    width:50%;
    height:100%;
    background: @color-main;
   }
   #zone3{
    position: absolute;
    top:50%;
    left:0;
    width:50%;
    height:50%;
   }

  }


 }






</style>
