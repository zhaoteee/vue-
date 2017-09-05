<template>
<div class="shopcar-wrapper">
  <div class="shopcart" >
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'hightLight': totalCount>0}">
            <span class="icon-shopping_cart"  :class="{'hightLight': totalCount>0}"></span>
          </div>
          <div class="num" v-show="totalCount>0">
            {{totalCount}}
          </div>
        </div>
        
        <div class="price" :class="{'hightLight': totalPrice>0}">¥ {{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay" :class="payClass">{{payDesc}}</div>
    </div>
  <div class="ball-container">
    <transition v-for="ball in balls"  name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
      <div class="ball"  v-show="ball.show" > 
        <div class="inner inner-hook"></div>
      </div>     
    </transition>
  </div> 
  <transition name="fold">
    <div class="shopcart-list" v-show="listShow" >
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" ref="listcont">
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>¥{{food.price*food.count}}</span>
            </div>
            <div class="cartControl-wrapper">
              <cartControl :food="food"></cartControl>
            </div>
          </li>
        </ul>
      </div>
    </div> 
  </transition>
  </div>    
  <transition name="fade">
    <div class="list-mask" @click="hidelist" v-show="listShow"></div>
  </transition>
</div>
  

</template>
<script>
import BScroll from 'better-scroll';
import cartControl from '../cartControl/cartControl';
import bus from '../bus';
export default {
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      balls: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        }
      ],
      dropBalls: [],
      num: 0,
      fold: true
    }
  },
  created() {
    bus.$on('cartadd', this.cartadd);
  },
  methods: {
    cartadd(target) {

      this.drop(target);
    },
    // 每次点击的时候，都会从新从i=0开始，导致每次选取的小球都为第一个
    // 所以增加额外的计数变量，点击一次this.num++;，计数一次
    drop(el) {
     for (let i = 0; i< this.balls.length; i++ ) {              
       if(this.num===this.balls.length) {
        this.num = 0;
       }
       let ball = this.balls[this.num];
       this.num++;
       if(!ball.show) {
        ball.show = true;
        ball.el = el;
        this.dropBalls.push(ball);
        return;
       }

     }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while(count--) {
        let ball =this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let left = (rect.left - 32);
          let top = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.webkitTransform = `translate3d(0,${top}px,0)`;
          el.style.transform = `translate3d(0,${top}px,0)`;
          let inner = el.getElementsByClassName('inner')[0];
          inner.style.webkitTransform = `translate3d(${left}px,0,0)`;
          inner.style.transform = `translate3d(${left}px,0,0)`;
        }
      }
    },
    enter(el, done) {
      let rf = el.offsetHeight;//触发浏览器重绘
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner')[0];
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
      });
      done();
    },   
    afterEnter(el) {  
      let ball = this.dropBalls.shift();
      if(ball) {
        ball.show = false;
        // el.style.display = "none";
      }    
      // 不需要手动将display='none';,无法生成动画
    },
    toggleList() {
      if(!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    empty() {
      this.selectFoods.forEach((food) => {
         food.count = 0;
      });
    },
    hidelist() {
      this.fold = true;
    },
    pay() {
      if(this.totalPrice < this.minPrice) {
        return;
      }else {
        window.alert(`总计¥${this.totalPrice}元`);
      }
    }
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice ===0 ) {
        return '¥'+this.minPrice+'元起送';
      }else if(this.totalPrice < this.minPrice) {
         let dif = this.minPrice - this.totalPrice;
         return '还差¥'+dif+'元起送';
      }else {
        return '去结算';
      };
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      }else {
        return 'enough';
      }
    },
    listShow() {
      if(!this.totalCount) {
        this.fold = true;
        return false
      }
      let show = !this.fold;
      if(show) {
        this.$nextTick(() => {
          if(!this.scroll) {
            this.scroll = new BScroll(this.$refs.listcont, {
              click: true
            })
          }else {
            this.scroll.refresh();
          }
        })
       
      }
      return show;
    }
  },
  components: {
    cartControl
  }
};
</script>
<style lang="stylus" rel="sylesheet/stylus"> 
@import '../../common/stylus/mixin.styl' 
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    background: #131d26
    .content
      display: flex
      background: #141d27
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          position: relative
          vertical-align: top
          z-index: 80
          top: -12px
          left: 12px
          box-sizing: border-box
          width: 56px
          height: 56px
          padding: 6px
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.hightLight
              background: rgb(0, 160, 220)   
            .icon-shopping_cart
              font-size: 24px
              line-height: 44px
            &.hightLight
              color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            border-radius: 16px
            text-align: center
            font-size: 9px
            font-weight: 700
            color: rgb(255, 255, 255)
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgb(0, 0, 0, 0.4)
        .price
          display: inline-block
          font-size: 16px
          line-height: 24px
          font-weight: 700
          margin: 12px 0 12px 30px
          padding-right: 12px
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          &.hightLight
            color: #fff
        .desc
          display: inline-block
          margin-left: 12px
          font-size: 10px
          line-height: 24px
          font-weight: 700
      .content-right
        flex: 0 0 105px
        width: 105px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        &.not-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 100
        transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%    
      transform: translate3d(0, -100%, 0)     
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s ease  
      &.fold-enter,&.fold-leave-active 
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 28)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 28)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            color: rgb(240 ,20, 20)
          .cartControl-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    transition: all 0.5s ease
    background: rgba(7, 17, 27, 0.6)
    &.fold-enter-active
      opacity: 1   
    &.fade-enter, &.fade-leave-active     
      opacity: 0
      background: rgba(7, 17, 27, 0)          
</style>
