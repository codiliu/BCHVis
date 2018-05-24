

<template>
    <div id="top">
        <Layout>
            <Header :style="{position: 'fixed', width: '100%'}">
                <Menu mode="horizontal" theme="dark" active-name="1">
                     <span style="font-family:PingFang SC;" > BitcoinVis </span>
                     <Input id = 'input' v-model="address" @keyup.enter="submit" placeholder="Enter bitcoin address..." style="width: 400px"></Input>
                </Menu>
            </Header>
         
           <!--  <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
 -->        </Layout>
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
        method: {
            submit: function(data) {
                console.log(data)
            }
        }
    }
</script>

<style scoped>
    .layout{
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
    .layout-logo{
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

    .layout-nav{
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
    .layout-footer-center{
        text-align: center;
    }
</style>

