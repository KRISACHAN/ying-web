// 抽奖
import { ref, computed } from 'vue'
import accurateTimer from '@/utils/accurate-timer'

const lotteryRunning = ref(false)
const rawDataSource = ref([])
const selectedIndex = ref(0)
const selectedName = ref('')

const dataSource = computed(() => rawDataSource.value)
const currentIndex = computed(() => selectedIndex.value)
const currentData = computed(() => dataSource.value[selectedIndex.value])
const currentName = computed(() => selectedName.value)

const useLotteryActivity = () => {
  const setDataSource = data => {
    rawDataSource.value = data
  }

  const setName = (name = '') => {
    selectedName.value = name
  }

  const getRandomNumber = (min = 0, max = 1) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  const taskCallback = () => {
    selectedIndex.value = getRandomNumber(1, rawDataSource.value.length)
  }

  const { stopTask, runTask } = accurateTimer({
    delay: 50,
    endCondition: () => !lotteryRunning.value,
    callback: taskCallback
  })

  const startLotteryTask = () => {
    if (lotteryRunning.value) {
      return
    }
    lotteryRunning.value = true
    runTask()
  }

  const stopLotteryTask = () => {
    lotteryRunning.value = false
    stopTask()
  }

  return {
    dataSource,
    lotteryRunning,
    currentData,
    currentIndex,
    currentName,
    startLotteryTask,
    stopLotteryTask,
    setDataSource,
    setName
  }
}

export default useLotteryActivity
