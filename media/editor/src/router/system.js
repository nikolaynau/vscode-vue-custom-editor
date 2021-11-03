import NotFound from "@/views/not-found.vue";

export default [
  {
    path: "/:pathMatch(.*)",
    name: "not-found",
    component: NotFound
  }
]
