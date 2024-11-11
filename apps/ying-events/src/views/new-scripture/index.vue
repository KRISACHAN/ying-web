<template>
  <article class="new-scripture">
    <div class="new-scripture__main">
      <img
        class="new-scripture__banner"
        src="https://bucket.krissarea.com/activity/new-scripture/banner.png"
        alt="背景图"
      />
      <Core class="new-scripture__core" />
    </div>
  </article>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { LOTTERY_MODE, LOTTERY_TIMES } from '@/constants/lottery'
import Core from './components/core.vue'
import useLottery from '@/compositions/lottery/use-lottery'

export default defineComponent({
  name: 'NewScripture',
  components: {
    Core
  },
  setup() {
    const route = useRoute()
    const { setConfigs, setDataSource, removeAllRecord } = useLottery()
    if (route.query.clean === '1') {
      removeAllRecord()
    }
    setDataSource(new Array(110).fill(0).map((_, i) => i + 1))
    setConfigs({
      mode: LOTTERY_MODE.single,
      times: LOTTERY_TIMES.once,
      identify: route.path
    })
    const showRecord = ref(false)

    return {
      mode: LOTTERY_MODE.single,
      times: LOTTERY_TIMES.once,
      identify: route.path,
      showRecord
    }
  }
})
</script>

<style lang="less">
@b: new-scripture;
.@{b} {
  width: 100vw;
  min-height: 100vh;
  background: #0a2141;

  &__main {
    max-width: 475px;
    margin: 0 auto;

    .@{b}__banner {
      width: 100%;
      margin: 0 auto;
      display: block;
    }

    .@{b}__core {
      margin: 16px auto;
    }
  }
}
</style>
