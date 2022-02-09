import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5d2eb5ba = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _faa95444 = () => interopDefault(import('../pages/orders/index.vue' /* webpackChunkName: "pages/orders/index" */))
const _6d2a73bc = () => interopDefault(import('../pages/reports/index.vue' /* webpackChunkName: "pages/reports/index" */))
const _46a32551 = () => interopDefault(import('../pages/students/index.vue' /* webpackChunkName: "pages/students/index" */))
const _5084ad76 = () => interopDefault(import('../pages/users/index.vue' /* webpackChunkName: "pages/users/index" */))
const _786501e3 = () => interopDefault(import('../pages/students/add/index.vue' /* webpackChunkName: "pages/students/add/index" */))
const _733abe93 = () => interopDefault(import('../pages/students/profile/_id.vue' /* webpackChunkName: "pages/students/profile/_id" */))
const _07c1020c = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/login",
    component: _5d2eb5ba,
    name: "login"
  }, {
    path: "/orders",
    component: _faa95444,
    name: "orders"
  }, {
    path: "/reports",
    component: _6d2a73bc,
    name: "reports"
  }, {
    path: "/students",
    component: _46a32551,
    name: "students"
  }, {
    path: "/users",
    component: _5084ad76,
    name: "users"
  }, {
    path: "/students/add",
    component: _786501e3,
    name: "students-add"
  }, {
    path: "/students/profile/:id?",
    component: _733abe93,
    name: "students-profile-id"
  }, {
    path: "/",
    component: _07c1020c,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
