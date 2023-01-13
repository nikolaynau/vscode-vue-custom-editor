import { createRouter, createWebHashHistory } from 'vue-router';
import editor from './editor';
import inspector from './inspector';
import system from './system';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...editor, ...inspector, ...system]
});

export default router;
