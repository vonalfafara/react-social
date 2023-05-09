import Login from "./views/Login";
import Register from "./views/Register";

import Main from "./layouts/Main";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Search from "./views/Search";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/*",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search/:searchTerm",
        element: <Search />,
      },
    ],
  },
];

export default routes;
