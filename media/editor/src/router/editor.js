
import Editor from "@/views/editor.vue";

export default [
  {
    path: "/",
    name: "editor",
    component: Editor
  },
  {
    path: "/editor-with-inspector",
    name: "editorWithInspector",
    props: { inspectorEnabled: true },
    component: Editor
  }
]
