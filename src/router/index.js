import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由懒加载
// 使用异步的方式把每个路由build成一个代码块可缩小文件体积
const Recommend = resolve => {
  import('components/recommend/recommend').then(router => {
    resolve(router)
  })
}
const Rank = resolve => {
  import('components/rank/rank').then(router => {
    resolve(router)
  })
}
const Singer = resolve => {
  import('components/singer/singer').then(router => {
    resolve(router)
  })
}
const Tab = resolve => {
  import('components/tab/tab').then(router => {
    resolve(router)
  })
}
const UserCenter = resolve => {
  import('components/user-center/user-center').then(router => {
    resolve(router)
  })
}
const Search = resolve => {
  import('components/search/search').then(router => {
    resolve(router)
  })
}
const SingerDetail = resolve => {
  import('components/singer-detail/singer-detail').then(router => {
    resolve(router)
  })
}
const Disc = resolve => {
  import('components/disc/disc').then(router => {
    resolve(router)
  })
}
const TopList = resolve => {
  import('components/top-list/top-list').then(router => {
    resolve(router)
  })
}

export default new Router({
  routes: [
    // 当刚进入的时候默认进入排行榜界面
    // 就是把根路由 绑给/recommend
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/tab',
      component: Tab
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
