import { useTitle } from '@vueuse/core'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './menu/index'

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const title = useTitle()
  if (to.meta.title) {
    title.value = `@muyianking/ui - ${to.meta.title || ''}`
  }

  next()
})

export default router
