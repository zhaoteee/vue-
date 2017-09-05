<template>
  <div class="cartControl">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCount($event)">
      <span class="inner icon-remove_circle_outline"></span>
     </div>
    </transition>
     
     <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
     <div class="cart-add icon-add_circle" @click.stop.prevent="addCount($event)"></div>
   </div>
</template>
<script>
import Vue from 'vue';
import bus from '../bus';

export default {
  props: {
    food: {
      type: Object
    }
  },  
  methods: {
    addCount(event) {
      let target = event.target;
 
      if(!event._constructed){
        return;
      }
      if(!this.food.count) {
        Vue.set(this.food, "count", 1);
      }else {
        this.food.count++;
      }
      bus.$emit('cartadd', target);
    },
    decreaseCount(event) {
      if(!event._constructed) {
        return;
      }
      if(this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>
<style lang="stylus" rel="sylesheet/stylus">
  .cartControl
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      &.move-enter-active
        transition: all 0.4s linear
      // &.move-leave-active
      //   transform: translate3d(0, 0, 0)
      //   opacity: 1
      .inner
        display: inline-block      
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 240)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter, &.move-leave-active 
        transition: all 0.4s linear
        transform: translate3d(24px, 0, 0)
        opacity: 0
        .inner     
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      text-align:center
      margin-top: 6px
      width: 12px
      line-height: 24px
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 240)
</style>
