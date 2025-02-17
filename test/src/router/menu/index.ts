import Layout from '@layout/Main.vue'

export const menuList = [
  {
    path: '/select',
    component: () => import('@views/select/Index.vue'),
    meta: {
      title: '下拉框',
      icon: 'iconoir:list-select',
    },
  },
  {
    path: '/radio',
    component: () => import('@views/radio/Index.vue'),
    meta: {
      title: '单选框',
      icon: 'ri:list-radio',
    },
  },
]

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/select',
    name: 'admin',
    children: menuList,
  },
]
