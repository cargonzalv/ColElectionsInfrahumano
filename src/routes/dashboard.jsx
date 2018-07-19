import DashboardPage from "views/Dashboard/Dashboard.jsx";

import {
  Dashboard,

} from "@material-ui/icons";

const dashboardRoutes = [
  {
    path: "/",
    sidebarName: "Dashboard",
    navbarName: "ColElections",
    icon: Dashboard,
    component: DashboardPage
  },
/*  {
    path: "/user/:id",
    sidebarName: "User Profile",
    navbarName: "Profile",
    icon: Person,
    component: UserProfile
  },
  {
    path: "/place/:id",
    sidebarName: "Place Profile",
    navbarName: "Place",
    icon: ContentPaste,
    component: TableList
  },*/
  
  { redirect: true, path: "/", to: "/", navbarName: "Redirect" }
];

export default dashboardRoutes;
