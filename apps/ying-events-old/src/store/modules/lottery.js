import { defineStore } from 'pinia'
import { omit, pick } from 'lodash'
import { useRoute } from 'vue-router'
import localStore from 'store2'
import { LOTTERY_KEY, LOTTERY_TIMES, LOTTERY_MODE } from '@/constants/lottery'

const useLotteryStore = defineStore(LOTTERY_KEY, {
  state: () => {
    const route = useRoute()
    const localRecordInfo = localStore.get(route.path)

    return {
      recordInfo: localRecordInfo || {
        mode: LOTTERY_MODE.single,
        times: LOTTERY_TIMES.once,
        identify: route.path,
        data: []
      }
    }
  },

  getters: {
    configs() {
      return omit(this.recordInfo, ['data'])
    },
    records() {
      return pick(this.recordInfo, ['data'])
    },
    mode() {
      return pick(this.recordInfo, ['mode'])
    },
    times() {
      return pick(this.recordInfo, ['times'])
    },
    identify() {
      return pick(this.recordInfo, ['identify'])
    }
  },

  actions: {
    setMode(mode) {
      this.setRecords({
        mode: mode || this.mode
      })
    },
    setTimes(times) {
      this.setRecords({
        times: times || this.times
      })
    },
    setIdentify(identify) {
      this.setRecords({
        identify: identify || this.identify
      })
    },
    setData(data) {
      this.setRecords({
        data: data || this.data
      })
    },
    setConfigs({ identify, mode, times }) {
      this.setIdentify(identify)
      this.setMode(mode)
      this.setTimes(times)
    },
    setRecords({ mode, times, identify, data }) {
      const res = {
        mode: mode || this.recordInfo.mode,
        times: times || this.recordInfo.times,
        identify: identify || this.recordInfo.identify,
        data: data || this.recordInfo.data || []
      }
      this.recordInfo = res
      localStore.set(this.recordInfo.identify, this.recordInfo)
    },
    removeRecord(key) {
      this.recordInfo.data = this.recordInfo.data.filters(item => !item[key])
      localStore.set(this.recordInfo.identify, this.recordInfo)
    },
    removeAllRecord() {
      this.recordInfo.data = []
      localStore.set(this.recordInfo.identify, this.recordInfo)
    },
    resetRecord(data) {
      this.recordInfo.data = data || []
      localStore.set(this.recordInfo.identify, this.recordInfo)
    },
    pushRecord(data) {
      this.recordInfo.data.push(data)
      localStore.set(this.recordInfo.identify, this.recordInfo)
    },
    popRecord() {
      const res = this.recordInfo.data.pop()
      localStore.set(this.recordInfo.identify, this.recordInfo)
      return res
    },
    replaceRecord(index, data) {
      this.recordInfo.data[index] = data
      localStore.set(this.recordInfo.identify, this.recordInfo)
    },
    shift() {
      const res = this.recordInfo.data.shift()
      localStore.set(this.recordInfo.identify, this.recordInfo)
      return res
    },
    head() {
      return this.recordInfo.data[0]
    },
    tail() {
      return this.recordInfo.data[
        this.recordInfo.data.length ? this.recordInfo.data.length - 1 : 0
      ]
    }
  }
})

export default useLotteryStore
