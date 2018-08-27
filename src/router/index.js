import Vue from 'vue'
import Router from 'vue-router'
import Ebook from '@/Ebook';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/web_dzs/',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/ebook'
    },
    {
      path: '/ebook',
      component: Ebook
    }
  ]
})
