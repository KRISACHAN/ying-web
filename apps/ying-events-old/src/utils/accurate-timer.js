import { noop, gte, lt } from 'lodash'

/**
 * @func
 * @name accurateTimer
 * @desc 精准的计时器函数，本来一开始是用 requestAnimationFrame 去实现的，
 * @desc 但是最后发现做了误差补偿之后，setTimeout 的准确性反而更高，
 * @desc 所以决定换成 setTimeout 了。
 * @param {number} delay 时间间隔
 * @param {function} endCondition 结束条件
 * @param {function} callback 事件回调
 */
const accurateTimer = ({
  delay = 1000,
  endCondition = () => false,
  callback = noop
}) => {
  if (typeof endCondition !== 'function') {
    throw new Error('End condition must be a function !')
  }

  let task = null
  let startTimestamp = new Date().getTime()
  let difference = 0
  let runningDelay = delay

  const stopTask = () => {
    clearTimeout(task)
    task = null
  }

  const runTask = () => {
    const currentTimestamp = new Date().getTime()

    const runUserCallback = () => {
      difference = currentTimestamp - startTimestamp - delay
      runningDelay = runningDelay - difference

      if (lt(runningDelay, 0)) {
        runningDelay = 0
      }

      callback()
      startTimestamp = new Date().getTime()
    }

    if (gte(currentTimestamp - startTimestamp, runningDelay)) {
      runUserCallback()
    }

    const endConditionIsEnough = endCondition()

    if (endConditionIsEnough) {
      stopTask()
      return
    }

    task = setTimeout(() => {
      runTask()
    }, runningDelay)
  }

  return {
    stopTask,
    runTask
  }
}

export default accurateTimer
