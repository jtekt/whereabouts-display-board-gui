import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/groups",
      alias: "/",
      name: "groups",
      component: () => import("@/views/Groups.vue"),
    },
    {
      path: "/groups/:group_id",
      name: "whereabouts",
      component: () => import("@/views/Whereabouts.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/About.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
