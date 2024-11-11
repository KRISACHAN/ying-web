import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import Index from '../views/index/index.vue'
import NewScripture from '../views/new-scripture/index.vue'
import NewScriptureGroup from '../views/new-scripture-group/index.vue'
import Promises from '../views/promises/index.vue'

const createHistoryMode = () => {
  if (import.meta.env.VITE_ROUTE_MODE === 'history') {
    return createWebHistory(import.meta.env.VITE_BASE_URL)
  }
  return createWebHashHistory(import.meta.env.VITE_BASE_URL)
}

const router = createRouter({
  history: createHistoryMode(),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: { title: '首页' }
    },
    {
      path: '/new-scripture',
      name: 'NewScripture',
      component: NewScripture,
      meta: { title: '新年快乐' }
    },
    {
      path: '/new-scripture-group',
      name: 'NewScriptureGroup',
      component: NewScriptureGroup,
      meta: { title: '新年快乐' }
    },
    {
      path: '/promises',
      name: 'Promises',
      component: Promises,
      meta: { title: '圣经应许' }
    }
  ]
})
router.afterEach(to => {
  //遍历meta改变title
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
