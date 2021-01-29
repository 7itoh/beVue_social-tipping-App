import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home'
import Signin from '../views/Signin'
import Signup from '../views/Signup'

const routes = [
    {
        path: '/',
        redirect: 'signin'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
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

export default router;