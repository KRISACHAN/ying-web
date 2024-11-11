import { createPinia } from 'pinia'
import useLotteryStore from './modules/lottery'
const store = createPinia()
export { useLotteryStore }
export default store
