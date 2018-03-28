import React from "react";
import { Home } from "../../pages/Home";

const HomePreview = ({ entry }) => (
  <Home
    title={entry.getIn(["data", "title"])}
    text={entry.getIn(["data", "body"])}
  />
);

export default HomePreview;
