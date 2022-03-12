import CNotFound from "@/views/c-not-found.vue";

export default [
  {
    path: "/:pathMatch(.*)",
    name: "not-found",
    component: CNotFound
  }
]
