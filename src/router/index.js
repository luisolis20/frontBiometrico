import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Estudiantes_FotoViews from '../views/FotosViews/Estudiantes_FotoViews.vue'
import Estudiantes_Pre_FotoViews from '../views/FotosViews/Estudiantes_Pre_FotoViews.vue'
import Docentes_FotoViews from '../views/FotosViews/Docentes_FotoViews.vue'
import Registro_IndvDoc from '../views/FotosViews/Registro_IndvDoc.vue'
import Registro_IndvEst from '../views/FotosViews/Registro_IndvEst.vue'
import Registro_IndvPreEst from '../views/FotosViews/Registro_IndvPreEst.vue'
import Devices_allViews from '../views/Devices/Devices_allViews.vue'

import Login from '../views/Login/Signin.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/estudiantes_pre_pictures',
    name: 'Estudiantes Pre',
    component: Estudiantes_Pre_FotoViews
  },
  {
    path: '/estudiantes_pre_registro',
    name: 'Estudiantes Pre R',
    component: Registro_IndvPreEst
  },
  {
    path: '/estudiantes_pictures',
    name: 'Estudiantes',
    component: Estudiantes_FotoViews
  },
  {
    path: '/docentes_pictures',
    name: 'Docentes',
    component: Docentes_FotoViews
  },
  {
    path: '/docentes_registro',
    name: 'DocenteR',
    component: Registro_IndvDoc
  },
  {
    path: '/estudiantes_registro',
    name: 'EstudianteR',
    component: Registro_IndvEst
  },
  {
    path: '/devices',
    name: 'Devices',
    component: Devices_allViews
  },
  
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
