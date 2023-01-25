<template>
  <div class="App">
    <h2 class="f">靓仔欢迎你</h2>
    <img src="./assets/img/welcome.png" alt="欢迎你" style="width:300px;height: 300px;">
    <div class="num">
      <p>{{ count }}</p>
    <button @click="add">+1</button></div>
</div>
 
</template>

<script setup>
import { ref } from 'vue'
let count = ref(0)
function add() {
  count.value++
}
</script>

<style lang="less" scoped>
.App{
    padding: 0;
    margin: 0;
    overflow:hidden;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .f{
      margin-bottom: 20px;
    }
    .num{
      margin-top: 20px;
      display: flex;
      button{
        margin-left: 10px;
      }
    }
}

</style>