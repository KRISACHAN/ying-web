<template>
  <div class="container">
    <h1>活动列表</h1>
    <p>
      <router-link to="/new-scripture">new-scripture</router-link>
    </p>
    <p>
      <router-link to="/new-scripture-group">new-scripture-group</router-link>
    </p>
    <p>
      <router-link to="/promises">promises</router-link>
    </p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  components: {},
  setup() {
    return {}
  }
})
</script>

<style lang="less"></style>
