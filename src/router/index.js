import { canNavigate } from '@layouts/plugins/casl'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
      path: '/',
      redirect: to => {
        const appUserData = JSON.parse(localStorage.getItem('appUserData') || '{}')
        const userRole = appUserData && appUserData.role ? appUserData.role : null

        const isLoggedIn = isUserLoggedIn()

        if(isLoggedIn){
          return {name:'dashboards-home'}
        }
        // if (userRole === 'administrator'){          
        //   return { name: 'organization' }
        // } 
      
        // if (userRole !== 'administrator'){ 
        //   return { name: 'home' }
        // }
        
        return { name: 'login', query: to.query }
      },
    },
    {
      path: '/pages/user-profile',
      redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
    },
    {
      path: '/pages/account-settings',
      redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
    },
    ...setupLayouts(routes),
  ],
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach((to, from, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login', query: { to: to.fullPath } })
  } else if (to.name === 'login' && isLoggedIn) {
    next({ name: 'dashboards-home' })
  } else {
    next()
  }
})
export default router
