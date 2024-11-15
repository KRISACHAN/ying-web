<template>
  <div class="lottery">
    <LotteryCore class="lottery__core" />
    <LotteryRecords v-if="showRecord" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import LotteryCore from './core.vue'
import LotteryRecords from './records.vue'
import useLottery from '@/compositions/lottery/use-lottery'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Lottery',
  components: {
    LotteryCore,
    LotteryRecords
  },
  props: {
    showRecord: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  setup() {
    const route = useRoute()
    const { removeAllRecord } = useLottery()
    if (route.query.clean === '1') {
      removeAllRecord()
    }
    return {}
  }
})
</script>

<style lang="less">
@b: lottery;
.@{b} {
  width: 100%;

  &__core {
    margin: 0 auto;
  }
}
</style>
