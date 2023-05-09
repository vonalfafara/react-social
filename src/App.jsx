import React from "react";
import routes from "./router";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={route.element}
              exact
            ></Route>
          );
        })}
      </Routes>
    </>
  );
};

export default App;
