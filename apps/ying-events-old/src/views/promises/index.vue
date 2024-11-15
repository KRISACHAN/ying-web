<template>
  <article class="promises">
    <section class="promises__main">
      <APageHeader
        class="promises__title"
        :back-icon="false"
        @back="() => null"
      >
        <template #title>
          <ATypographyTitle>
            <AAvatar :src="LoveImage" :size="42" />
            <span class="promises__title-content">圣经应许</span>
          </ATypographyTitle>
        </template>
      </APageHeader>
      <ADivider />
      <AAlert
        :class="['promises__sermon', { 'promises__sermon--loading': spinning }]"
        :message="sermon"
      />
      <div class="promises__button-group">
        <AButton
          type="primary"
          size="large"
          :class="['promises__button', 'promises__button--submit']"
          :loading="spinning"
          @click="getBibleInfo"
          >抽取经文</AButton
        >
        <AButton
          type="primary"
          ghost
          size="large"
          :disabled="spinning || !inited"
          :class="['promises__button', 'promises__button--copy']"
          @click="copyBibleInfo"
          >复制</AButton
        >
      </div>
    </section>
  </article>
</template>

<script>
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import to from 'await-to-js'
import {
  message,
  Divider,
  Alert,
  PageHeader,
  Typography,
  Avatar,
  Button
} from 'ant-design-vue'
import copyText from '@/utils/copy-text'
import LoveImage from '@/assets/love.png'

export default defineComponent({
  name: 'Promises',
  components: {
    [Divider.name]: Divider,
    [Alert.name]: Alert,
    [PageHeader.name]: PageHeader,
    ATypographyTitle: Typography.Title,
    [Avatar.name]: Avatar,
    [Button.name]: Button
  },
  setup() {
    const sermon = ref('请点击抽取经文！')
    const spinning = ref(false)
    const inited = ref(false)
    const getBibleInfo = async () => {
      inited.value = true
      spinning.value = true
      const [err, res] = await to(
        axios.get(
          `https://${
            import.meta.env.VITE_REQUEST_HOSTNAME
          }/api/v1/promises/result`
        )
      )
      spinning.value = false
      if (err) {
        message.error(err?.message ?? '获取经文失败，请刷新页面，重新获取')
      }
      sermon.value = res?.data?.data ?? '获取经文失败，请刷新页面，重新获取'
    }
    const copyBibleInfo = () => {
      copyText(sermon.value)
      message.success('复制成功！')
    }

    return {
      sermon,
      spinning,
      inited,
      getBibleInfo,
      copyBibleInfo,
      LoveImage
    }
  }
})
</script>

<style lang="less">
@b: promises;

.@{b} {
  width: 100%;
  background: #d2eaff;
  padding: 24px;
  position: relative;
  display: flex;
  height: 100%;

  h1.ant-typography {
    line-height: 1;
    margin-bottom: 0;
  }

  .ant-page-header-content {
    padding-top: 0;
  }

  .ant-page-header {
    padding: 0;
    line-height: 1;
  }

  .ant-page-header-heading-left {
    margin: 0;
  }

  .ant-avatar {
    width: 36px;
    height: 36px;
    line-height: 36px;
    font-size: 20px;
  }

  .ant-page-header-heading-title {
    font-size: 32px;
  }

  .ant-alert-content {
    max-height: 320px;
    overflow-y: auto;
  }

  &__main {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    position: relative;
  }

  &__title-content {
    display: inline-block;
    margin: 0px 0 0 8px;
    position: relative;
    top: 2px;
  }

  &__sermon {
    font-size: 24px;
    padding: 16px;
    border-radius: 8px;

    &--loading {
      .ant-alert-message {
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }

  &__button-group {
    position: fixed;
    left: 50%;
    bottom: 50px;
    transform: translateX(-50%);
    width: calc(100% - 48px);
    height: 50px;
    font-size: 20px;
    max-width: 1024px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__button {
    border-radius: 8px;
    height: 50px;
    font-size: 20px;

    &--submit {
      width: 68%;
    }

    &--copy {
      width: calc(32% - 16px);
    }
  }
}
</style>
