
import Editor from "@/views/editor";

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
