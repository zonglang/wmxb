<template>
  <div class="setting">
    <div class="username">

      你好你好
    </div>
    <div class="address">
      收货地址
    </div>
    <div class="safe">
      账户与安全
    </div>
    <div class="location">
      地区设置
    </div>
    <div class="privacy">
      隐私
    </div>
    <div class="information">
      通知
    </div>
    <div class="platform">
      关于平台
    </div>
    <button>退出当前账号</button>
  </div>
</template>

<script>
export default {
  name: 'setting',
  data(){
    return {

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .setting{
    /*font-size:100px;*/
    background: rgb(239,239,239);
    padding:0;
    margin:0;
    text-decoration:none;
  }
  .username{
    height:0.72rem;
    background:white;
    border-bottom:1px solid #E0E0E0;
    padding-left:0.17rem;
    padding-right:0.12rem;
    padding-top:0.12rem;
  }
</style>
