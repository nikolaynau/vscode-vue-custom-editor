import { createRouter, createWebHashHistory } from 'vue-router';
import editor from './editor';
import inspector from './inspector';
import notFound from './not-found';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...editor, ...inspector, ...notFound]
});

export default router;
