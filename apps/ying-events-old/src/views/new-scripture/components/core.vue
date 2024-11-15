<template>
  <div class="new-scripture-core">
    <div ref="main" class="new-scripture-core__main">
      <img
        ref="shownCard"
        class="new-scripture-core__shown-card"
        :src="image?.src || bgImg"
        alt="号码卡片"
      />
      <canvas
        ref="realCard"
        hidden
        class="new-scripture-core__real-card"
        width="360"
        height="360"
      >
      </canvas>
    </div>
    <AButton
      class="new-scripture-core__btn"
      type="primary"
      :disabled="hasRecord"
      @click="toLottery"
      >{{ btnText }}</AButton
    >
    <p class="new-scripture-core__tips">可长按图片或使用手机截屏保存图片</p>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { Button as AButton } from 'ant-design-vue'
import useLottery from '@/compositions/lottery/use-lottery'
import useImage from '@/compositions/image/use-image'
import bgImg from '@/assets/box.png'

export default defineComponent({
  name: 'NewScriptureCore',
  components: {
    AButton
  },
  props: {},
  setup() {
    const shownCard = ref(null)
    const realCard = ref(null)
    const { toRenderImage, imageCreating, image } = useImage()
    const {
      currentData,
      lotteryRunning,
      startLottery,
      stopLottery,
      setName,
      records,
      hasRecord
    } = useLottery()

    onMounted(async () => {
      await toRenderImage({
        url: bgImg,
        canvasDom: realCard.value,
        text: records.value[0]?.data ?? '?'
      })
    })

    watch(
      () => currentData.value,
      data => {
        toRenderImage({
          url: bgImg,
          canvasDom: realCard.value,
          text: data
        })
      }
    )

    const toLottery = () => {
      if (lotteryRunning.value) {
        stopLottery()
        return
      }
      setName('')
      startLottery()
    }

    const btnText = computed(() => {
      if (hasRecord.value) {
        return '您已抽过'
      }
      if (lotteryRunning.value) {
        return '停止抽号'
      }
      return '开始抽号'
    })

    return {
      bgImg,
      shownCard,
      realCard,
      image,
      imageCreating,
      toLottery,
      btnText,
      hasRecord
    }
  }
})
</script>

<style lang="less">
@b: new-scripture-core;
.@{b} {
  position: relative;

  &__result {
    width: 340px;
    height: 340px;
    margin: 0 auto;
    display: block;
    border-radius: 4px;
  }

  &__main {
    width: 340px;
    height: 340px;
    margin: 0 auto;

    .@{b}__shown-card {
      vertical-align: middle;
      width: 100%;
    }
  }

  &__btn {
    width: 130px;
    height: 42px;
    font-size: 16px;
    margin: 12px auto;
    display: block;
    background: #5086f7;
    border-color: #5086f7;
  }

  &__tips {
    font-size: 14px;
    color: #ffffff;
    text-align: center;
  }
}
</style>
