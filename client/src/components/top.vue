<template>
  <div id="top">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%'}">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <span style="font-family:PingFang SC;"> BCH Explorer </span>
          <Input id='input' v-model="address" @keyup.enter.native="submit(address)" placeholder="Enter BCH address..." style="width: 400px"></Input>
        </Menu>
      </Header>
      <!--  <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
 -->
    </Layout>
  </div>
</template>
<script>
import $ from 'jquery'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      address: ''
    }
  },
  computed: {
      ...mapGetters({
        newAddress: 'getNewAddress'
      })
  },
  watch: {
    address: function(data) {
      console.log(data)

      
    },
    newAddress: function(newAddress){
      $('#input > input').attr('placeholder', newAddress)
    },
  },
  methods: {
    ...mapActions(['setNewAddress']),
    submit: function(data) {
        var self = this
        self.setNewAddress(data)
    }
  }
}

</script>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #000;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

#input {
  position: relative;
  left: 20px;
}

.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}

.ivu-layout-header {
  background: #fff;
  /*border: 1px solid #d7dde4;*/
  border-radius: 4px;
}

.ivu-menu {
  background: #fff;
}

.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}

.layout-footer-center {
  text-align: center;
}

</style>
