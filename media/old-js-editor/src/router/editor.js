import CEditor from '@/views/c-editor.vue';

export default [
  {
    path: '/',
    name: 'editor',
    component: CEditor
  },
  {
    path: '/editor-with-inspector',
    name: 'editorWithInspector',
    props: { inspectorEnabled: true },
    component: CEditor
  }
];
