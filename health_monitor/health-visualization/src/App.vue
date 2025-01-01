<template>
  <router-view></router-view>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'App',
  data() {
    return {
      projectName: '',
      chart: null,
    };
  },
  
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

form {
  margin-bottom: 20px;
}
</style>