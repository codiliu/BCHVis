<template>
  <div>
    <div id="displayControlTitle" class="controlTitle">
      <span @click="panelShow = !panelShow">Display <i class="fa fa-caret-down"></i></span>
    </div>
    <!--  -->
    <transition name="slide-fade">
      <div v-if="panelShow" id="displayControl" class="controlSetting">
        <!--  -->
        <div><span>Airport</span></div>
        <!-- <Dropdown trigger="click" style="margin-left: 0px" id='airportDropdown'>
        <Button size="small">
          ZBAA
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem>ZBAA</DropdownItem>
          <DropdownItem>ZBNY</DropdownItem>
          <DropdownItem>ZBSJ</DropdownItem>
          <DropdownItem>ZBTJ</DropdownItem>
        </DropdownMenu>
      </Dropdown> -->
        <Select v-model="airport" size="small">
          <Option v-for="item in airportList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <!--  -->
        <div> <span>Filter</span></div>
        <ButtonGroup size="small" id="filterBtnGroup">
          <Button><i class="icon iconfont icon-yuan" aria-hidden="true" value="filterCircle"></i></Button>
          <Button><i class="icon iconfont icon-huizhiduobianxing" aria-hidden="true" value="filterPolygon"></i></Button>
          <Button><i class="icon iconfont icon-hand" aria-hidden="true" value="filterForbid"></i></Button>
          <Button><i class="icon iconfont icon-attentionforbid" aria-hidden="true" value="filterRemove"></i></Button>
          <Button type="ghost" icon="close"></Button>
        </ButtonGroup>
        <!--  -->
        <table width="95%">
          <tbody>
            <tr>
              <td width="15%" class='leftTd'>Size</td>
              <td width="65%">
                <Slider :max='sizeMax' v-model="sliderSize" :tip-format="hideFormat"></Slider>
              </td>
              <td width="20%">
                <div id="flight-size-slider-value">{{sliderSize}}</div>
              </td>
            </tr>
            <tr>
              <td width="15%" class='leftTd'>Width</td>
              <td width="65%">
                <Slider :max='widthMax' v-model="sliderWidth" :tip-format="hideFormat"></Slider>
              </td>
              <td width="20%">
                <div id="flight-size-slider-value">{{sliderWidth}}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <!--  -->
        <Checkbox size='small' v-model="fixpotCheck">Fix Way Points</Checkbox>
        <Checkbox size='small' v-model="single">
          <span>Beijing FixPts <i class="fa fa-remove" id="resetFixpotSelection"></i></span>
        </Checkbox>
        <Checkbox size='small' v-model="single">Airports</Checkbox>
        <div>
          <Checkbox size='small' v-model="single">
            <span>Arr. Paths <i class="fa fa-plane" style="color: rgb(209, 71, 69);"></i></span>
          </Checkbox>
          <!-- <span class="badge arr_num_control" id="currentArrNum"></span> -->
          <Badge size='small' count="8" class-name="badge-currentArrNum"></Badge>
        </div>
        <div>
          <Checkbox size='small' v-model="single">
            <span>Dep. Paths <i class="fa fa-plane" style="color: rgb(41, 170, 227);"></i></span>
          </Checkbox>
          <!-- <span class="badge dep_num_control" id="currentDepNum"></span> -->
          <Badge size='small' count="10" class-name="badge-currentDepNum"></Badge>
        </div>
        <Checkbox size='small' v-model="single">Origin Points</Checkbox>
        <Checkbox size='small' v-model="single">History Traj</Checkbox>
        <!--  -->
        <div> <span id="searchFlight">Search Flight:</span> </div>
        <Input size='small' icon="search" placeholder="" style="width: 85%"></Input>
        <br>
        <!--  -->
        <span>Focus Location:</span>
        <br>
        <ButtonGroup size="small" id="filterBtnGroup">
          <Button><i class="icon iconfont icon-global" value="World"></i></Button>
          <Button><i class="icon iconfont icon-china" value="China"></i></Button>
          <Button><i class="icon iconfont icon-beijing" value="Beijing"></i></Button>
          <Button><i class="icon iconfont icon-airport" value="PEK"></i></Button>
        </ButtonGroup>
        <!--  -->
        <div>
          <span id="currentDate">2017-10-12</span>
          <br>
          <span id="currentSTime">5:00:00</span> - <span id="currentETime">10:00:00</span>
          <br>
          <Button size='small'><i class="fa fa-filter" value="filter" style="padding: 3px;"></i></Button>
          </br>
        </div>
        <!--  -->
        <span>Selected Flight:</span>
        <Input size='small' icon="forward" placeholder="" style="width: 85%"></Input>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  // components: { myHeader, myContent, myFooter },
  data() {
    return {
      panelShow: true,
      sliderSize: 3,
      sliderWidth: 3,
      sizeMax: 8,
      widthMax: 5,
      fixpotCheck: true,
      single: false,
      airport: 'ZBAA',

      airportList: [{
          value: 'ZBAA',
          label: 'ZBAA'
        },
        {
          value: 'ZBNY',
          label: 'ZBNY'
        },
        {
          value: 'ZBSJ',
          label: 'ZBSJ'
        },
        {
          value: 'ZBTJ',
          label: 'ZBTJ'
        },
      ],


    }
  },
  mounted() {
    this.getData();


  },
  methods: {
    getData() {
      console.log("getData")
      //LoadingBar
      // this.$Loading.start();
      // this.$api.get('topics', null, r => {
      //   // this.list = r.data
      //   console.log(r.data)
      //   this.$Loading.finish();
      // })
    },
    hideFormat() {
      return null;
    }
  }
}

</script>
<style lang='less'>
@import "../style/map_content.less";

.slide-fade-enter-active {
  transition: all .5s ease;
}

.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */

{
  transform: translateY(-10px);
  opacity: 0;
}

</style>
