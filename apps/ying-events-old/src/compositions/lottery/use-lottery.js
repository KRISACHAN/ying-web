// 核心抽奖程序
// 需求：
// 1. 可以选择号码只能抽去一次或者无限次
// 2. 可以选择单人或者多人
// 3. 可以记录抽号者
import { useLotteryStore } from '@/store'
import useLotteryRecords from './use-lottery-records'
import useLotteryActivity from './use-lottery-activity'

const useLottery = () => {
  const lotteryStore = useLotteryStore()
  const { records, hasRecord, removeRecord, removeAllRecord, setRecord } =
    useLotteryRecords()
  const {
    dataSource,
    lotteryRunning,
    currentData,
    currentIndex,
    currentName,
    setName,
    setDataSource,
    startLotteryTask,
    stopLotteryTask
  } = useLotteryActivity()

  const setConfigs = config => {
    lotteryStore.setConfigs(config)
  }

  const startLottery = () => {
    startLotteryTask()
  }

  const stopLottery = () => {
    stopLotteryTask()
    setRecord({
      name: currentName.value,
      data: currentData.value
    })
  }

  return {
    records,
    hasRecord,
    dataSource,
    lotteryRunning,
    currentData,
    currentIndex,
    currentName,
    currentMode: lotteryStore.mode,
    currentTimes: lotteryStore.times,
    currentIdentify: lotteryStore.identify,
    removeRecord,
    removeAllRecord,
    setRecord,
    setConfigs,
    setDataSource,
    startLottery,
    stopLottery,
    setName
  }
}

export default useLottery
