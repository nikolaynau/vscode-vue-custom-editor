import NotFoundView from '@/views/NotFoundView.vue';

export default [
  {
    path: '/:pathMatch(.*)',
    name: 'notFound',
    component: NotFoundView
  }
];
