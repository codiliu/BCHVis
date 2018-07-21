<template>
  <div id='tableContainer' ref="tableContainer">
    <div id="title">
      <button id="title_left" class="selected">
      </button>
      <button id="title_middle" class="unselected">
      </button>
      <button id="title_right" class="unselected">
      </button>
    </div>
    <div id="tableDiv">
      <table id="example" class="display" style="text-align:center;" border="0" cellpadding="0" cellspacing="0">
      </table>
    </div>
    <!-- <div id="workloadDiv">
    </div>
    <div id="blockDiv">
    </div> -->
   <!--  <data-table :data-table="tableData"></data-table> -->
  </div>
</template>
<script>
// import Map from '../charts/MapView'

// import DataTable from 'vue-datatable';
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
//import $ from 'jquery'
window.$ = window.jQuery = require('jquery');

import d3Tip from 'd3-tip'
import d3 from 'd3v4'
import { mapActions, mapGetters } from 'vuex'
import $ from 'jquery'
//import dataTablesCSS from '../../plugins/datatable/css/jquery.dataTables.min.css'
//import aa from "../../plugins/datatable/js/jquery.dataTables.min.js"
import DataTable from 'datatables'
export default {
  components: { },
  data() {
    return {
      // list: []
    }
  },
  mounted() {
    console.log('enter table')
    

    
  },
  computed: {
      ...mapGetters({
        addrData: 'getAddrData',
        newAddress: 'getNewAddress',
        timeRange: 'getTimeRange'
      })
  },
   watch: {
    addrData: function(allData) {
      var self = this
      
      var newAddress = self.newAddress

      $('#title_left').text('#TXS: '+ allData[newAddress]['txData']['n_tx'])
      $('#title_middle').text('#ADDRS: '+ allData[newAddress]['addrData'].length)

      
      var txData = allData[newAddress]['txData']
      var addrData = allData[newAddress]['addrData']


      self.drawTxs(txData)
      $(document).ready(function() {
        //$("#title button").attr('class', 'unselected')
        $("#title button").unbind();
        $("#title button").click(function(){
           if($(this).attr('class')=='unselected'){
            $("#title button").attr('class', 'unselected')
             $(this).attr('class', 'selected')
             if($(this).attr('id')=='title_left'){
              self.drawTxs(txData)
             }
             else if($(this).attr('id')=='title_middle'){
              self.drawAddr(addrData)
             }
           }
           else{
             $(this).attr('class', 'unselected')
           }
        })

      })
      
      // $(document).ready(function() {
      //     var t = $('#example').DataTable( {

      //         data: dataSet,
      //         columns: [
      //             { title: "ID" },
      //             { title: "Tx Time" },
      //             { title: "Tx Number" },
      //             { title: "Hash" },
      //         ],
      //         "columnDefs": [ {
      //           "searchable": false,
      //           "orderable": false,
      //           "targets": 0
      //         } ],
      //         "order": [[ 1, 'asc' ]]
      //     } );
       
      //     t.on( 'order.dt search.dt', function () {
      //         t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
      //             cell.innerHTML = i+1;
      //         } );
      //     } ).draw();
      // } );

      
      
    },
    timeRange: function(timeRange){
      var self=this
      var newAddress = self.newAddress
      var txs=[]
      var txData = self.deepCopy(self.addrData[newAddress]['txData'])
      var addrData = self.deepCopy(self.addrData[newAddress]['addrData'])

      txData['txs'].forEach(function(d){
        if(timeRange[0]<=d.time && d.time<=timeRange[1])
          txs.push(d)
      })
      txData['n_tx']=txData['txs'].length

      


      var temp={}
      self.addrData[newAddress]['txData']['txs'].forEach(function(d){
        if(timeRange[0]<=d.time && d.time<=timeRange[1]){
          d.inputs.forEach(function(index){
            var addr=index['addr']
            if(!temp[addr]) temp[addr]={'addr': addr, 'balance': 0, 'input_n': 0, 'output_n': 0, 'received': 0, 'sent': 0, 'tx_n': 0}
            temp[addr]['sent']+=index['value']
            temp[addr]['input_n']+=1
            temp[addr]['tx_n']+=1
          })

          d.outputs.forEach(function(index){
            var addr=index['addr']
            if(!temp[addr]) temp[addr]={'addr': addr, 'balance': 0, 'input_n': 0, 'output_n': 0, 'received': 0, 'sent': 0, 'tx_n': 0}
            temp[addr]['received']+=index['value']
            temp[addr]['output_n']+=1
            temp[addr]['tx_n']+=1
          })
           
        }
      })



      var addrData=[]
      for(var index in temp){
        temp[index]['balance'] = temp[index]['received']-temp[index]['sent']
        addrData.push(temp[index])
      }

      if(!temp[newAddress]) {
        $('#tableDiv').empty()

        return;
      }

      txData['txs']=txs
      txData['total_received'] = temp[newAddress]['received']
      txData['total_sent'] = temp[newAddress]['sent']
      txData['final_balance'] = temp[newAddress]['balance']

      console.log('sent:', txData)
      self.drawTxs(txData)


      $('#title_left').text('#TXS: '+ txData['txs'].length)
      $('#title_middle').text('#ADDRS: '+ addrData.length)


      $(document).ready(function() {
        //$("#title button").attr('class', 'unselected')
        $("#title button").unbind();

        $("#title button").click(function(){
           if($(this).attr('class')=='unselected'){
            $("#title button").attr('class', 'unselected')
             $(this).attr('class', 'selected')
             if($(this).attr('id')=='title_left'){
              self.drawTxs(txData)
             }
             else if($(this).attr('id')=='title_middle'){
              self.drawAddr(addrData)
             }
           }
           else{
             $(this).attr('class', 'unselected')
           }
        })

      })


    }
  },
  methods: {
    ...mapActions(['setSelectRound']),
    satoshi2BTC(str){
      str=String(str)
      var a = parseInt(str/100000000)
      var b = str%100000000
      return a+'. '+b+' bch'
    },
    drawAddr(data){
      var self = this
      var txData = data
      var len = txData.length

      $('#tableDiv').empty()
      $('#tableDiv').html("<table id='example' class='display' style='text-align:center;' border='0' cellpadding='0' cellspacing='0'></table>")
      // var final_balance = self.satoshi2BTC(data['final_balance'])
      // var total_received = self.satoshi2BTC(data['total_received'])
      // var total_sent = self.satoshi2BTC(data['total_sent'])
      // var n_txs = len

      
      var dataSet = []
      txData.forEach(function(d, i){
        var record=[]
        record.push(len-i)
        record.push(d['addr'].substring(0,5)+"...")
        record.push(d['received'])
        record.push(d['sent'])
        record.push(d['balance'])
        record.push(d['input_n'])
        record.push(d['output_n'])
        //record.push(d['tx_n'])
        dataSet.push(record)
      })



      var scrollY = parseInt($("#tableContainer").css('height').split('p')[0])-100

      $(document).ready(function() {
          $('#example').DataTable( {
              data: dataSet,
              "scrollY": scrollY+'px',
              "paging": false,
              columns: [
                  { title: "ID" },
                  { title: "Addr" },
                  { title: "Received" },
                  { title: "Sent" },
                  { title: "Balance" },
                  { title: "Input_n" },
                  { title: "Output_n" },
                 // { title: "Tx_n" },
              ],
              "order": [[ 1, 'asc' ]]
          } );

          // var text = "<div style='float:left;text-align:left'><strong>Balance: "+final_balance+"<br>Received: "+total_received+"<br>Sent: "+total_sent+"<br>Txs: "+n_txs+"</strong></div>"
          // $("#example_filter label").before(text)

          $("#example > tbody > tr").css("background", "white")
          $("#example > tbody > tr").attr("class","unselected")
          $("#example > tbody > tr").click(function(d){
            if($(this).attr("class")=="unselected"){
              $(this).css("background", "#addd8e")
              $(this).attr("class", "selected")
            }
            else{
              $(this).css("background", "white")
              $(this).attr("class", "unselected")
            }
          })
      } );
    },
    drawTxs(data){
      var self = this
      var txData = data['txs']
      var len = txData.length

      console.log('sent:', txData)

      $('#tableDiv').empty()
      $('#tableDiv').html("<table id='example' class='display' style='text-align:center;' border='0' cellpadding='0' cellspacing='0'></table>")

      var final_balance = self.satoshi2BTC(data['balance'])
      var total_received = self.satoshi2BTC(data['received'])
      var total_sent = self.satoshi2BTC(data['sent'])
      var n_txs = len

      
      var dataSet = []
      txData.forEach(function(d, i){
        var record=[]
        record.push(len-i)
        record.push(self.timeConverter(d['time']))
        record.push(d['in_value'])
        record.push(d['out_value'])
        record.push(d['fee'])
        record.push(d['hash'].substring(0,5)+"...")
        dataSet.push(record)
      })


      console.log('table:', dataSet)


      var scrollY = parseInt($("#tableContainer").css('height').split('p')[0])-100
      $(document).ready(function() {
          $('#example').DataTable( {
              data: dataSet,
              "scrollY": scrollY+'px',
              "paging": false,
              columns: [
                  { title: "ID" },
                  { title: "Time" },
                  { title: "Received" },
                  { title: "Sent" },
                  { title: "Fee" },
                  { title: "Hash" },
              ],
              "order": [[ 1, 'asc' ]]
          } );

          console.log('sent: ', total_sent)
          var text = "<div style='float:left;text-align:left'><strong>Balance: "+final_balance+"<br>Received: "+total_received+"<br>Sent: "+total_sent+"<br>Txs: "+n_txs+"</strong></div>"
          $("#example_filter label").before(text)

          $("#example > tbody > tr").css("background", "white")
          $("#example > tbody > tr").attr("class","unselected")
          $("#example > tbody > tr").click(function(d,i){

            console.log($(this).find('td').eq(0).text())
    


            if($(this).attr("class")=="unselected"){
              $(this).css("background", "#addd8e")
              $(this).attr("class", "selected")
            }
            else{
              $(this).css("background", "white")
              $(this).attr("class", "unselected")
            }
          })
      } );
    },
    addZero(str){
      str=String(str)
      if(str.length==1) str='0'+str;
      return str
    },
    timeConverter(UNIX_timestamp){
      var a = new Date(parseInt(UNIX_timestamp) * 1000)
      var year = this.addZero(a.getFullYear())
      var month = this.addZero(a.getMonth())
      var date = this.addZero(a.getDate())
      var hour = this.addZero(a.getHours())
      var min = this.addZero(a.getMinutes())
      var sec = this.addZero(a.getSeconds())
      var time = year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec 
      return time;
    },
    deepCopy: function(obj){
        var str, newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        } else if(window.JSON){
            str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
        } else {
            for(var i in obj){
                newobj[i] = typeof obj[i] === 'object' ? 
                cloneObj(obj[i]) : obj[i]; 
            }
        }
        return newobj;
    },
    extractProcess(data, keyValue){
      var processData={}
      data.forEach(function(d){
        if(!processData[d['round']])  processData[d['round']]=[]
        var re = {}
        re['name'] = d['name']
        re[keyValue] = +d[keyValue]
        processData[d['round']].push(re)
      })
      var filterData=[]
      for(var index in processData){
        processData[index].sort(function(a,b){
          return a.name-b.name
        })
        filterData.push(processData[index])
      }
      return filterData
    },
  }
}

</script>
<style lang="less">

#tableContainer {
  /*background: red;*/
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  border: 1px solid grey;
  #example_filter > label > input{
    width: 100px
  }
  #title {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 3em;
    border: 1px solid grey;
    #title_left{
      float: left;
      width: 33.33%;
      height: 100%;
    }
    #title_middle{
      float: left;
      width: 33.33%;
      height: 100%;
    }
    #title_right{
      float: right;
      width: 33.33%;
      height: 100%;
    }
    button:hover{
      cursor: pointer;
    }
    .selected{
      background: grey;
    }
  }
  #tableDiv {
    /*background: red;*/
    position: absolute;
    top: 3em;
    left: 0%;
    width: 100%;
    height: calc(~"100% - 3em");
    table{
      border-collapse:collapse;
      text-align:center;
      thead th{
        border-bottom:2px solid black;
      }
      td{
        border-bottom:1px solid black;
        
      }
      tr:hover{
        cursor: pointer;
      }
 
    }
  }

}


.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}

/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
}

/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.bar {
  fill: orange;
}

.solidArc:hover {
  stroke: white;
}

.solidArc {
    -moz-transition: all 0.3s;
    -o-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
}

.x.axis path {
  display: none;
}

.aster-score { 
  line-height: 1;
  font-weight: bold;
  font-size: 500%;
}




</style>
