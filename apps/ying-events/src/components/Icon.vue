<script lang="jsx">
import { defineComponent, h } from 'vue'
import Icon, * as IconMap from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Icon',
  extends: Icon,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () => {
      const { name, ...rest } = props
      return h(IconMap[name], rest)
    }
  }
})
</script>
