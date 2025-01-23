import Layout from '@layout/Main.vue'

export const menuList = [
  {
    path: '/select',
    component: () => import('@views/select/Index.vue'),
    meta: {
      title: '下拉框',
      icon: 'gg:view-list',
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
