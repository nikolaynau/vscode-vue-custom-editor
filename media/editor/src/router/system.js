import NotFound from "@/views/not-found";

export default [
  {
    path: "/:pathMatch(.*)",
    name: "not-found",
    component: NotFound
  }
]
