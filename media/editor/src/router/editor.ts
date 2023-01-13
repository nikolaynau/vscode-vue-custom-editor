import EditorView from '@/views/EditorView.vue';

export default [
  {
    path: '/',
    name: 'editor',
    component: EditorView
  },
  {
    path: '/editor-with-inspector',
    name: 'editorWithInspector',
    props: { inspectorEnabled: true },
    component: EditorView
  }
];
