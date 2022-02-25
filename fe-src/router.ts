import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  {
    path: "/login",
    children: [
      { path: "", component: "login-page" },
      { path: "/password", component: "password-page" },
    ],
  },
  { path: "/mis-datos", component: "mis-datos-page" },
  {
    path: "/mis-mascotas",
    children: [
      { path: "", component: "mis-mascotas-page" },
      { path: "/editar", component: "editar-reporte" },
    ],
  },
  { path: "/reportar", component: "reportar-mascota-page" },
]);
