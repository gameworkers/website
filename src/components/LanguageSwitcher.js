import React from "react";
import { Link, Route, withSiteData } from "react-static";

const LanguageSwitcher = withSiteData(({ langs, defaultLang }) => (
  <Route
    path="/:langOrPath?/:path?"
    // eslint-disable-next-line react/no-children-prop
    children={({ match }) => {
      let currentLang;
      let currentPath;
      if (!match) {
        // HACK: this route should always match, but during static rendering
        // seems to fail for some routes.
        currentLang = "en";
        currentPath = "/";
      } else {
        const { params } = match;
        const isPath = !langs.includes(params.langOrPath);
        currentLang = isPath ? defaultLang : params.langOrPath;
        currentPath = (isPath ? params.langOrPath : params.path) || "";
      }

      return (
        <React.Fragment>
          <nav
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "120px"
            }}
          >
            {langs.map((lang, i) => {
              const prefix = lang === defaultLang ? "" : `${lang}/`;
              return lang === currentLang ? (
                <div key={i} style={{ display: "inline" }}>
                  {lang.toUpperCase()}
                </div>
              ) : (
                <Link key={i} to={`/${prefix}${currentPath}`}>
                  {lang.toUpperCase()}
                </Link>
              );
            })}
          </nav>
        </React.Fragment>
      );
    }}
  />
));

export default LanguageSwitcher;
