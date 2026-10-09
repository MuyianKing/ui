<script setup lang="ts">
import HeaderComp from '@layout/Header.vue'
import SidebarComp from '@layout/side-bar/Index.vue'
import useTagsStore from '@pinia/useTagsStore'
import { computed, h } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const tags = useTagsStore()
const _route = useRoute()
const tagsList = computed(() => tags.tagsList)

// 设置标签
function setTags(tag_toute: any) {
  const isExist = tagsList.value.some(item => item.path === tag_toute.fullPath)
  if (!isExist) {
    tags.setTagsItem({
      name: tag_toute.name,
      title: tag_toute.meta.title,
      path: tag_toute.fullPath,
    })
  }
}

setTags(_route)

onBeforeRouteUpdate((to) => {
  setTags(to)
})

// 路由 path 以 '/' 开头，原来写 'login' 恒为真，守卫永远不会生效
const show = computed(() => _route.path !== '/login')

// 用来存已经创建的组件
const components_map = new Map()
// 返回组件实例
function formatComponentInstance(component: any, route: any) {
  // SFC 未写 defineOptions({ name }) 时只有 __name（编译产物里是 __name: 'Index'），
  // 只读 .name 会恒为 undefined，导致下面的缓存分支永远进不去
  const component_name = component?.type?.name || component?.type?.__name

  if (!component_name || !component_name.endsWith('Template'))
    return component

  /**
   * 如果组件名以Template结尾则重新生成一个组件实例并缓存起来
   *
   * TODO: 可设置最大缓存个数
   */
  let new_comp
  const new_comp_name = route.path

  if (components_map.has(new_comp_name)) {
    new_comp = components_map.get(new_comp_name)
  } else {
    // 缓存
    new_comp = {
      name: new_comp_name,
      render() {
        return h(component)
      },
    }
    components_map.set(new_comp_name, new_comp)
  }

  return h(new_comp)
}
</script>

<template>
  <div v-if="show" class="main-body-wrapper">
    <sidebar-comp />
    <div class="bottom-wrapper">
      <header-comp />
      <div class="content-box">
        <router-view v-slot="{ Component, route }">
          <transition name="fade">
            <keep-alive :exclude="/.*(NoAlive)$/" :max="15">
              <component :is="formatComponentInstance(Component, route)" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hidden-hidden {
  width: 0 !important;
  height: 0;
  overflow: hidden;
}

.main-body-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.main-body-wrapper .bottom-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.main-body-wrapper .bottom-wrapper .content-box {
  background: #eee;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.main-body-wrapper .bottom-wrapper .content-box .tags-item {
  margin: 10px 0;
}
</style>
