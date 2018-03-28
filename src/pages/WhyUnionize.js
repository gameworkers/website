import React from "react";
import { withRouteData, Head } from "react-static";

import Markdown from "react-markdown";

export const WhyUnionize = ({ title, text }) => (
  <React.Fragment>
    <Head>
      <title>{title}</title>
    </Head>
    <div className="content">
      <Markdown source={text} escapeHtml={false} />
    </div>
  </React.Fragment>
);

export default withRouteData(WhyUnionize);
