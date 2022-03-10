<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/three">Three</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="less">
  @import  './common.less';

  html {
    font-size: 37.5px;
  }

  /* 元素初始化 */
  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    // background-color: rgb(0 0 0 / 0.5);
    background-color: #FFFFFF;
    color: #ffffff;
    // background: url(assets/bg.png) no-repeat;
    // background-size: cover;
    button {
      border: 0;
    }

  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 60/@rem;
    font-size: 32/@rem;

    a {
      font-size: 32/@rem;
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
