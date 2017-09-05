<template>
  <div id='app2'>
    <vheader :seller="seller"></vheader>
    <div class='tab'>
      <div class='tab-item'>
        <router-link tag='a' to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link tag='a' to='/ratings'>评论</router-link>
      </div>
      <div class="tab-item">
        <router-link tag='a' to='/seller'>商家</router-link>
      </div> 
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
   
  </div>
</template>

<script>
import vheader from 'components/header/header'
import {urlParse} from './common/js/util';
const ERR_OK = 0;

export default { 
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    this.$http.get('https://easy-mock.com/mock/59ae5513e0dc6633419d4c8c/zhaote_1504597267824/data?id='+this.seller.id).then((response => {
     if (response.ok === true) {
      //this.seller = response.data;
      this.seller = Object.assign({} ,this.seller, response.body.seller)
     }
    }));
  },
  components: { vheader }
}
</script>
<style lang="stylus" rel="sylesheet/stylus">
  @import 'common/stylus/mixin.styl'
  
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px: (rgba(7, 17, 27, 0.1))
    //border-bottom: 1px solid rgba(7, 17 , 27, 0.1)
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 88, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
