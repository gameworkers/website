import CMS from "netlify-cms";

import "../app.css"; // should compile to './main.css

import HomePreview from "./preview-templates/HomePreview";
import WhyUnionizePreview from "./preview-templates/WhyUnionizePreview";

CMS.registerPreviewStyle("./main.css");

const pages = {
  home: HomePreview,
  "why-unionize": WhyUnionizePreview
};
const langs = ["en", "fr", "es", "pt"];

Object.entries(pages).forEach(([page, comp]) => {
  langs.forEach(lang => {
    CMS.registerPreviewTemplate(`${page}-${lang}`, comp);
  });
});

// CMS.registerPreviewTemplate("home", HomePreview);
// CMS.registerPreviewTemplate("why-unionize", WhyUnionizePreview);
