<template>
  <div class="lottery-records">
    <ul class="lottery-record-group">
      <li
        v-for="record in records"
        :key="record.data"
        class="lottery-record-item"
      >
        {{ record.name }} - {{ record.data }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import useLottery from '@/compositions/lottery/use-lottery'

export default defineComponent({
  name: 'LotteryRecords',
  components: {},
  props: {},
  setup() {
    const { records } = useLottery()
    return {
      records
    }
  }
})
</script>

<style lang="less">
.lottery-records {
}
</style>
