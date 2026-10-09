import { useTitle } from '@vueuse/core'
import { ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './menu/index'

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes,
})

// useTitle 内部会建立 watcher，写在 beforeEach 里等于每次导航泄漏一个；
// 这里在模块作用域只建一次，导航时改 ref 即可
const title = ref('')
useTitle(title)

router.beforeEach((to) => {
  if (to.meta.title) {
    title.value = `@muyianking/ui - ${to.meta.title || ''}`
  }

  return true
})

export default router
