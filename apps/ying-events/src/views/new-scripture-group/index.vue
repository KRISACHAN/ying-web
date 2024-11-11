<template>
  <article class="new-scripture-group">
    <header class="new-scripture-group__header">
      <img
        class="new-scripture-group__banner"
        src="https://bucket.krissarea.com/activity/new-scripture-group/banner-2024.png"
        alt="背景图"
      />
    </header>
    <div class="new-scripture-group__main">
      <div class="new-scripture-group__item">
        <img
          src="https://bucket.krissarea.com/activity/new-scripture-group/core-image.png"
          alt="核心图片"
          class="new-scripture-group__image"
        />
        <div class="new-scripture-group__contents">
          <p class="new-scripture-group__number">{{ currentData }}</p>
          <p class="new-scripture-group__tips">每人只能抽一次哦～</p>
          <AButton
            size="large"
            class="new-scripture-group__btn"
            type="primary"
            @click="handleClick"
          >
            {{ lotteryRunning ? '停止抽号' : '开始抽号' }}
          </AButton>
        </div>
      </div>

      <div class="new-scripture-group__item">
        <img
          src="https://bucket.krissarea.com/activity/new-scripture-group/record.png"
          alt="记录"
          class="new-scripture-group__image"
        />
        <div class="new-scripture-group__records">
          <AAvatarGroup v-if="records.length" size="large">
            <div
              v-for="item in records"
              :key="item.name"
              class="new-scripture-group__record"
            >
              <AAvatar class="new-scripture-group__avatar">
                {{ item.data }}
              </AAvatar>
              <p class="new-scripture-group__name">{{ item.name }}</p>
            </div>
          </AAvatarGroup>
          <AEmpty v-else :image="simpleImage">
            <template #description>
              <span>暂无记录</span>
            </template>
          </AEmpty>
        </div>
      </div>
    </div>

    <a-modal
      v-model:visible="modalVisible"
      wrap-class-name="new-scripture-group__modal"
      width="310px"
      ok-text="确定"
      cancel-text="我知道了"
      :ok-button-props="okButtonProps"
      @ok="handleOk"
    >
      <div class="new-scripture-group__icon-box">
        <img
          class="new-scripture-group__icon"
          src="https://bucket.krissarea.com/activity/new-scripture-group/love.png"
          alt="爱心"
        />
      </div>
      <h2 class="new-scripture-group__name">请填写姓名</h2>
      <AInput v-model:value="inputName" size="large" placeholder="请填写姓名" />
    </a-modal>
  </article>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import {
  Button as AButton,
  Modal as AModal,
  Input as AInput,
  Avatar as AAvatar,
  Empty as AEmpty
} from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { LOTTERY_MODE, LOTTERY_TIMES } from '@/constants/lottery'
import useLottery from '@/compositions/lottery/use-lottery'

export default defineComponent({
  name: 'NewScriptureGroup',
  components: {
    AButton,
    AModal,
    AInput,
    AAvatar,
    AAvatarGroup: AAvatar.Group,
    AEmpty
  },
  setup() {
    const {
      currentData,
      lotteryRunning,
      currentName,
      records,
      startLottery,
      stopLottery,
      setName
    } = useLottery()

    const inputName = ref('')
    const modalVisible = ref(false)

    const okButtonProps = computed(() => ({
      disabled: !inputName.value
    }))

    const handleClick = () => {
      if (lotteryRunning.value) {
        stopLottery()
        inputName.value = ''
        return
      }
      modalVisible.value = true
    }

    const handleOk = () => {
      setName(inputName.value)
      modalVisible.value = false
      startLottery()
    }

    const route = useRoute()
    const { setConfigs, setDataSource, removeAllRecord } = useLottery()
    if (route.query.clean === '1') {
      removeAllRecord()
    }
    setDataSource(new Array(110).fill(0).map((_, i) => i + 1))
    setConfigs({
      mode: LOTTERY_MODE.multiple,
      times: LOTTERY_TIMES.once,
      identify: route.path
    })

    return {
      currentName,
      currentData,
      lotteryRunning,
      modalVisible,
      handleClick,
      handleOk,
      inputName,
      records,
      okButtonProps,
      simpleImage: AEmpty.PRESENTED_IMAGE_SIMPLE
    }
  }
})
</script>

<style lang="less">
@b: new-scripture-group;

.@{b}__modal {
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
    padding: 20px;
    border: none;
  }

  .ant-modal-body {
    height: 268px;
  }

  .ant-modal-footer {
    height: 92px;
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

  .@{b}__icon-box {
    width: 116px;
    height: 116px;
    margin: 0 auto 20px auto;
    background: #d9e4ff;
    border-radius: 4px;
    padding: 10px;

    .@{b}__icon {
      display: block;
      width: 100%;
      margin: 0 auto;
    }
  }

  .@{b}__name {
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    text-align: center;
    color: #000000;
    margin-bottom: 20px;
  }
}

.@{b} {
  width: 100%;
  min-height: 100vh;
  background: #d2eaff;
  min-width: 700px;
  padding: 16px 0;

  .ant-avatar-group {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    flex-direction: row;
    flex-wrap: wrap;
  }

  &__header {
    position: relative;
    color: #fff;
    background: #d2eaff;
    width: 100%;
    height: 300px;
    overflow: hidden;

    .@{b}__banner {
      width: 700px;
      margin: 0 auto;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 8px;
    }
  }

  &__main {
    margin: 16px auto;
    width: 100%;

    .@{b}__item {
      margin: 0 auto 0 auto;
      position: relative;

      .@{b}__image {
        width: 700px;
        display: block;
        margin: 16px auto 0 auto;
      }

      .@{b}__contents {
        position: absolute;
        top: 75px;
        left: 50%;
        width: 670px;
        height: 348px;
        border: solid 1px #0d1250;
        transform: translateX(-50%);
        border-radius: 8px;
        padding: 16px;

        .@{b}__number {
          text-align: center;
          width: 100%;
          font-size: 200px;
          font-weight: bolder;
          color: #5187f7;
          -webkit-text-stroke: 1px #0d1250;
          margin: 0;
          padding: 0;
          line-height: 1;
        }

        .@{b}__tips {
          font-size: 20px;
          text-align: center;
          width: 100%;
          margin: 16px auto;
        }

        .@{b}__btn {
          background: #5187f7;
          border: solid 1px #0d1250;
          display: block;
          margin: 16px auto;

          &:hover,
          &:focus {
            background: #5187f7;
            opacity: 0.7;
          }
        }
      }

      .@{b}__records {
        position: absolute;
        top: 75px;
        left: 50%;
        width: 670px;
        height: 348px;
        border: solid 1px #0d1250;
        transform: translateX(-50%);
        border-radius: 8px;
        padding: 16px;

        .@{b}__record {
          width: 106px;
          text-align: center;

          .ant-avatar {
            width: 70px;
            height: 70px;
            background: #5187f7;

            .ant-avatar-string {
              line-height: 68px;
              font-size: 20px;
              text-align: center;
              color: #fff;
            }
          }

          .@{b}__name {
            font-size: 18px;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
