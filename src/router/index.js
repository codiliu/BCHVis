import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Content from '@/components/content'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //     path: '/',
    //     name: 'Hello',
    //     component: HelloWorld
    //   }
    {
      path: '/',
      component: Index
    }, {
      path: '/content/:id',
      component: Content
    }


  ]
})
