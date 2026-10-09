import Layout from '@layout/Main.vue'

export const menuList = [
  {
    path: '/block-title',
    component: () => import('@views/block-title/Index.vue'),
    meta: {
      title: '标题',
      icon: 'mdi:format-title',
    },
  },
  {
    path: '/button',
    component: () => import('@views/button/Index.vue'),
    meta: {
      title: '按钮',
      icon: 'mdi:button-cursor',
    },
  },
  {
    path: '/date',
    component: () => import('@views/date/Index.vue'),
    meta: {
      title: '日期',
      icon: 'mdi:calendar',
    },
  },
  {
    path: '/descriptions',
    component: () => import('@views/descriptions/Index.vue'),
    meta: {
      title: '描述列表',
      icon: 'mdi:card-text-outline',
    },
  },
  {
    path: '/dialog',
    component: () => import('@views/dialog/Index.vue'),
    meta: {
      title: '弹窗',
      icon: 'material-symbols-light:dialogs-outline',
    },
  },
  {
    path: '/dropdown',
    component: () => import('@views/dropdown/Index.vue'),
    meta: {
      title: '下拉菜单',
      icon: 'mdi:menu-down',
    },
  },
  {
    path: '/dropdown-cascader',
    component: () => import('@views/dropdown-cascader/Index.vue'),
    meta: {
      title: '级联下拉',
      icon: 'mdi:format-list-bulleted-triangle',
    },
  },
  {
    path: '/edit-info',
    component: () => import('@views/edit-info/Index.vue'),
    meta: {
      title: '编辑信息',
      icon: 'mdi:pencil',
    },
  },
  {
    path: '/form',
    component: () => import('@views/form/Index.vue'),
    meta: {
      title: '表单',
      icon: 'mdi:form-textbox',
    },
  },
  {
    path: '/grid',
    component: () => import('@views/grid/Index.vue'),
    meta: {
      title: '网格布局',
      icon: 'mdi:grid',
    },
  },
  {
    path: '/icon',
    component: () => import('@views/icon/Index.vue'),
    meta: {
      title: '图标',
      icon: 'mdi:emoticon-kiss-outline',
    },
  },
  {
    path: '/icon-select',
    component: () => import('@views/icon-select/Index.vue'),
    meta: {
      title: '图标选择',
      icon: 'mdi:emoticon-kiss-outline',
    },
  },
  {
    path: '/number',
    component: () => import('@views/number/Index.vue'),
    meta: {
      title: '数字格式化',
      icon: 'mdi:numeric',
    },
  },
  {
    path: '/page',
    component: () => import('@views/page/Index.vue'),
    meta: {
      title: '分页',
      icon: 'mdi:page-next-outline',
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
  {
    path: '/search-page',
    component: () => import('@views/search-page/Index.vue'),
    meta: {
      title: '搜索页面',
      icon: 'mdi:file-search-outline',
    },
  },
  {
    path: '/select',
    component: () => import('@views/select/Index.vue'),
    meta: {
      title: '下拉框',
      icon: 'iconoir:list-select',
    },
  },
  {
    path: '/select-remote',
    component: () => import('@views/select-remote/Index.vue'),
    meta: {
      title: '远程搜索',
      icon: 'mdi:database-search',
    },
  },
  {
    path: '/upload',
    component: () => import('@views/upload/Index.vue'),
    meta: {
      title: '上传',
      icon: 'mdi:upload',
    },
  },
]

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/block-title',
    name: 'admin',
    children: menuList,
  },
]
