function copyText(text) {
  // 创建一个临时的textarea元素
  const textarea = document.createElement('textarea')

  // 将要复制的文本内容赋值给textarea
  textarea.value = text

  // 设置textarea的CSS样式，使其不可见，不影响页面布局
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'

  // 将textarea元素添加到页面中
  document.body.appendChild(textarea)

  // 选中textarea中的所有文本
  textarea.select()

  // 复制选中的文本
  document.execCommand('copy')

  // 移除临时的textarea元素
  document.body.removeChild(textarea)
}

export default copyText
