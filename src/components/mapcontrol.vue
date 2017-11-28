<template>
  <div>
    <div id="displayControlTitle" class="controlTitle">
      <span>Display <i class="fa fa-caret-down"></i></span>
    </div>
    <div id="displayControl" class="controlSetting" style="width:100%;">
      Airport
      <div class="dropdown" id='airportDropdown'>
        <button class="btn btn-default dropdown-toggle btn-xs" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          ZBAA
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li><a value="ZBAA">ZBAA</a></li>
          <li><a value="ZBNY">ZBNY</a></li>
          <li><a value="ZBSJ">ZBSJ</a></li>
          <li><a value="ZBTJ">ZBTJ</a></li>
        </ul>
      </div>
      <span>Filter</span>
      <div class="btn-group" data-toggle="buttons" id="filterBtnGroup">
        <label class="btn btn-default btn-xs" value="filterCircle">
          <input type="radio" name="options" id="option"><i class="icon iconfont icon-yuan" aria-hidden="true" value="filterCircle"></i>
        </label>
        <label class="btn btn-default btn-xs" value="filterPolygon">
          <input type="radio" name="options" id="option"><i class="icon iconfont icon-huizhiduobianxing" aria-hidden="true" value="filterPolygon"></i>
        </label>
        <label class="btn btn-default btn-xs" value="filterForbid">
          <input type="radio" name="options" id="option"><i class="icon iconfont icon-hand" aria-hidden="true" value="filterForbid"></i>
        </label>
        <label class="btn btn-default btn-xs" value="filterRemove">
          <input type="radio" name="options" id="option"><i class="icon iconfont icon-attentionforbid" aria-hidden="true" value="filterRemove"></i>
        </label>
        <label class="btn btn-default btn-xs" value="filterDeleteAll">
          <input type="radio" name="options" id="option"><i class="fa fa-remove" aria-hidden="true" value="filterDeleteAll"></i>
        </label>
      </div>
      <table width="100%">
        <tbody>
          <tr>
            <td width="20%">Size</td>
            <td width="65%">
              <div id="flight-size-slider"></div>
            </td>
            <td width="15%">
              <div id="flight-size-slider-value"></div>
            </td>
          </tr>
          <tr>
            <td width="20%">Width</td>
            <td width="65%">
              <div id="flight-width-slider"></div>
            </td>
            <td width="15%">
              <div id="flight-width-slider-value"></div>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <input type="checkbox" id="fixpot-check">
        <span>Fix Way Points</span>
        </br>
      </div>
      <div>
        <input type="checkbox" id="beijing-fixpot-check">
        <span>Beijing FixPts <i class="fa fa-remove" id="resetFixpotSelection"></i></span>
        </br>
      </div>
      <div>
        <input type="checkbox" id="airport-check">
        <span>Airports</span>
        </br>
      </div>
      <div>
        <input type="checkbox" id="arrtraj-check" checked="checked">
        <span>Arr. Paths <i class="fa fa-plane" style="color: rgb(209, 71, 69);"></i></span>
        <!-- <span id="currentArrNum">Arr</span> -->
        <span class="badge arr_num_control" id="currentArrNum"></span>
      </div>
      <div>
        <input type="checkbox" id="deptraj-check" checked="checked">
        <span>Dep. Paths <i class="fa fa-plane" style="color: rgb(41, 170, 227);"></i></span>
        <!-- <span id="currentDepNum">Dep</span> -->
        <span class="badge dep_num_control" id="currentDepNum"></span>
        </br>
      </div>
      <div>
        <input type="checkbox" id="oriPoint-check">
        <span>Origin Points</span>
        </br>
      </div>
      <div>
        <input type="checkbox" id="historyTraj-check">
        <span>History Traj</span>
        </br>
      </div>
      <span id="searchFlight">Search Flight:</span>
      <div>
        <input type="text" class="btn btn-default btn-xs" id="callsignSelectedValue">
        </input>
        <button type="button" class="btn btn-default btn-xs" id="callsignSelectedBtn">
          <i class="glyphicon glyphicon-search"></i>
        </button>
        <br>
      </div>
      <!-- <label class="btn btn-default btn-xs">
                <i class="glyphicon glyphicon-search">          
            </label> -->
      <!--  <label class="btn btn-default btn-xs">
                <i class="glyphicon glyphicon-search">
            </label>

            <label class="btn btn-default btn-xs">
                <i class="glyphicon glyphicon-search">
            </label> -->
      <span>Focus Location:</span>
      <br>
      <div class="b-button-group" data-toggle="buttons" id="focusLocationBtnGroup">
        <label class="btn btn-default btn-xs" value="World">
          <input type="radio" name="options" id="option1"><i class="icon iconfont icon-global" value="World"></i>
        </label>
        <label class="btn btn-default btn-xs" value="China">
          <input type="radio" name="options" id="option2"><i class="icon iconfont icon-china" value="China"></i>
        </label>
        <label class="btn btn-default btn-xs" value="Beijing">
          <input type="radio" name="options" id="option3"><i class="icon iconfont icon-beijing" value="Beijing"></i>
        </label>
        <label class="btn btn-default btn-xs" value="PEK">
          <input type="radio" name="options" id="option4"><i class="icon iconfont icon-airport" value="PEK"></i>
        </label>
      </div>
      <div>
        <span id="currentDate"></span>
        <br>
        <span id="currentSTime"></span> - <span id="currentETime"></span>
        <br>
        <button type="button" class="btn btn-default btn-xs" id="cdmSelectedBtn">
          <i class="glyphicon glyphicon-filter"></i>
        </button>
        </br>
      </div>
      <span>Selected Flight:</span>
      <div>
        <!--  <span id="callsignCurrentSelectedValue" s></span> -->
        <!-- <input type="text" class="btn btn-default btn-xs" disabled="true" style="background:#000000;color:#dad7d7"  id="callsignCurrentSelectedValue"> -->
        <input type="text" class="btn btn-default btn-xs" disabled="true" id="callsignCurrentSelectedValue">
        </input>
        <button type="button" class="btn btn-default btn-xs" id="callsignCurrentSelectedBtn">
          <i class="glyphicon glyphicon-share-alt"></i>
        </button>
        <span><i id="callsignCurrentSelectedIcon" class="fa fa-plane" style="color: #000000;"></i></span>
        <br>
      </div>
      <!--         <span id='selectedFlightSTime'></span>
        <br>
        <span id='selectedFlightETime'></span>
        <br> -->
      <!-- 
        <span >2D3D Switch:</span>
        <br>
        <div class="btn-group" data-toggle="buttons" id="2d3dBtnGroup">
            <label class="btn btn-default btn-xs"  id="btn2d">
                <input type="radio" name="options"><i value="">2D</i>
            </label>
            <label class="btn btn-default btn-xs" id="btn3d">
                <input type="radio" name="options" ><i value="">3D</i>
            </label>
        </div> -->
      <!--         <div class="dropdown" id = 'focusLocationDropdown'>
          <button class="btn btn-default dropdown-toggle btn-xs" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            World
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style='width:70%'>
            <li><a value = "World">World</a></li>
            <li><a value = "PEK">PEK</a></li>
          </ul>
        </div> -->
    </div>
  </div>
</template>
<script>
export default {
  // components: { myHeader, myContent, myFooter },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      // this.$api.get('topics', null, r => {
      //   this.list = r.data
      // })
    }
  }
}

</script>
<style lang="less">
//@import "../style/map.less";


</style>
