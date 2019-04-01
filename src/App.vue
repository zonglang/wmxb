<template>
    <div id="app">
        <!-- <showCarMap></showCarMap> -->
        <!-- <mainshow></mainshow> -->
        <router-view></router-view>
    </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
// import showCarMap from './components/showCarMap.vue';
// import mainshow from './components/mainshow.vue';
// import showLocation from './components/showLocation.vue';
import searchLocation from './components/searchLocation.vue';
export default {
    name: 'app',
    components: {
        // HelloWorld,
        // showCarMap,
        // mainshow,
        // showLocation,
        searchLocation
    }
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
    overflow: hidden;
}
</style>