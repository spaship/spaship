import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.SPAship = {
  environments: [],
  keycloak: {
    url: "https://xxxx.com",
    realm: "xxxx",
    clientId: "xxxx",
  },
};

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
