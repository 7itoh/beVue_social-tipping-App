import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home'
import Signin from '../views/Signin'
import Signup from '../views/Signup'
import store from '../store/index'

const routes = [
    {
        path: '/',
        redirect: 'signin'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/signin',
        name: 'Signin',
        component: Signin,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
    },
]

const router = new createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.setIdToken) {
            next({
                path: 'signin',
                query: {
                    redirect: to.fullPath
                }
            })
        } else {
            next();
        }
    } else { 
        next();
    }
});

export default router;