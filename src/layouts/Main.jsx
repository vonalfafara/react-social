import React from "react";
import { Box } from "@chakra-ui/react";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import routes from "../router";

const Main = () => {
  return (
    <Box
      bgImage="linear-gradient(to right top, #9c6bd1, #6879d5, #3081cc, #0084ba, #0084a3, #008da3, #0095a0, #1e9d9c, #2fb4b1, #3fcbc6, #4fe3db, #5ffbf1);"
      h="100%"
    >
      <Header />
      <Routes>
        {routes[2].children.map((route, index) => {
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
    </Box>
  );
};

export default Main;
