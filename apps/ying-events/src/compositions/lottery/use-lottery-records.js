// 获取用户抽奖记录的 hook
import { computed } from 'vue'
import { eq, gt } from 'lodash'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { useLotteryStore } from '@/store'
import { LOTTERY_TIMES, LOTTERY_MODE } from '@/constants/lottery'

const useLotteryRecords = () => {
  const lotteryStore = useLotteryStore()
  const records = computed(() => lotteryStore.records.data)
  const hasRecord = computed(() => gt(lotteryStore.records.data?.length, 0))

  // 清除记录
  const removeRecord = (name = '') => {
    lotteryStore.removeRecord(name)
  }

  // 清除所有记录
  const removeAllRecord = () => {
    lotteryStore.removeAllRecord()
  }

  // 设置记录
  const setRecord = ({ name = '', data = 0 }) => {
    const conditions = [
      {
        condition: () => {
          // 单人模式下单次抽号
          return (
            eq(lotteryStore.configs.mode, LOTTERY_MODE.single) &&
            eq(lotteryStore.configs.times, LOTTERY_TIMES.once)
          )
        },
        result: () => {
          if (records.value.length) {
            message.warning('不可重复抽号！')
            return
          }
          lotteryStore.pushRecord({
            name,
            data,
            date: dayjs().format('YYYY-MM-DD HH:mm:ss')
          })
        }
      },
      {
        condition: () => {
          // 单人模式下无限次抽号
          return (
            eq(lotteryStore.configs.mode, LOTTERY_MODE.single) &&
            eq(lotteryStore.configs.times, LOTTERY_TIMES.infinite)
          )
        },
        result: () => {
          lotteryStore.pushRecord({
            name,
            data,
            date: dayjs().format('YYYY-MM-DD HH:mm:ss')
          })
        }
      },
      {
        condition: () => {
          // 多人模式下多次抽号
          return (
            eq(lotteryStore.configs.mode, LOTTERY_MODE.multiple) &&
            eq(lotteryStore.configs.times, LOTTERY_TIMES.infinite)
          )
        },
        result: () => {
          const recordIndex = records.value.findIndex(
            record => record.name === name
          )
          if (recordIndex >= 0) {
            lotteryStore.replaceRecord(recordIndex, {
              ...records.value[recordIndex],
              name,
              data,
              date: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })
          } else {
            lotteryStore.pushRecord({
              name,
              data,
              date: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })
          }
        }
      },
      {
        condition: () => {
          // 多人模式下单次抽号
          return (
            eq(lotteryStore.configs.mode, LOTTERY_MODE.multiple) &&
            eq(lotteryStore.configs.times, LOTTERY_TIMES.once)
          )
        },
        result: () => {
          const recordIndex = records.value.findIndex(
            record => record.name === name
          )
          if (recordIndex >= 0) {
            message.warning('不可重复抽号！')
            return
          }
          lotteryStore.pushRecord({
            name,
            data,
            date: dayjs().format('YYYY-MM-DD HH:mm:ss')
          })
        }
      }
    ]
    const condition = conditions.find(condition => !!condition.condition())
    condition.result()
  }

  return {
    records,
    hasRecord,
    removeRecord,
    removeAllRecord,
    setRecord
  }
}

export default useLotteryRecords
