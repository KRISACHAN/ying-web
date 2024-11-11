<template>
  <div class="lottery-core">
    <div></div>
    <AButton
      class="lottery-core__btn"
      type="primary"
      shape="round"
      @click="handleClick"
    >
      {{ lotteryRunning ? '停止抽号' : '开始抽号' }}
    </AButton>
    <p class="lottery-core__tips">可长按图片或使用手机截屏保存图片</p>
    <a-modal
      v-model:visible="modalVisible"
      wrap-class-name="lottery-modal"
      width="310px"
      ok-text="确定"
      cancel-text="我知道了"
      @ok="handleOk"
    >
      <AInput v-model:value="inputName" size="large" placeholder="请填写姓名" />
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {
  Button as AButton,
  Modal as AModal,
  Input as AInput
} from 'ant-design-vue'
import { eq } from 'lodash'
import useLottery from '@/compositions/lottery/use-lottery'
import { LOTTERY_MODE } from '@/constants/lottery'

export default defineComponent({
  name: 'LotteryCore',
  components: {
    AButton,
    AModal,
    AInput
  },
  props: {},
  setup() {
    const {
      currentData,
      lotteryRunning,
      currentName,
      currentMode,
      currentTimes,
      currentIdentify,
      startLottery,
      stopLottery,
      setName
    } = useLottery()

    const inputName = ref('')
    const modalVisible = ref(false)

    const handleClick = () => {
      if (lotteryRunning.value) {
        stopLottery()
        return
      }
      if (!eq(currentMode, LOTTERY_MODE.single)) {
        modalVisible.value = true
        return
      }
    }

    const handleOk = () => {
      setName(inputName.value)
      modalVisible.value = false
      startLottery()
    }

    return {
      currentName,
      currentData,
      lotteryRunning,
      modalVisible,
      handleClick,
      handleOk,
      inputName
    }
  }
})
</script>

<style lang="less">
.lottery-modal {
  .ant-modal,
  .ant-modal-content {
    height: 360px;
    background: #ffffff;
    border-radius: 12px;
  }
  .ant-modal-header,
  .ant-modal-close {
    display: none;
  }
  .ant-modal-body,
  .ant-modal-footer {
    padding: 0;
    border: none;
  }

  .ant-modal-body {
    height: 268px;
  }

  .ant-modal-footer {
    height: 92px;
    padding: 20px;
    display: flex;
    justify-content: space-between;

    .ant-btn {
      width: 130px;
      height: 48px;
      border-radius: 4px;
      border: none;
      font-weight: 500;
      font-size: 15px;

      &:nth-child(1) {
        background: #f1f2f4;
        color: #33383e;
      }

      &:nth-child(2) {
        background: #2254f4;
        color: #ffffff;
      }
    }
  }
}
.lottery-core {
  background: url(https://bucket.krissarea.com/activity/new-scripture/box.png)
    top / contain no-repeat;
  width: 359px;
  height: 500px;
  position: relative;

  &__btn {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 162px;
    height: 53px;
    font-size: 20px;
  }

  &__tips {
    font-size: 14px;
    color: #fff;
    text-align: center;
  }
}
</style>
