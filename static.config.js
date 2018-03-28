const { existsSync, copyFileSync, writeFileSync } = require("fs");
const path = require("path");

const matter = require("gray-matter");
const webpack = require("webpack");
const { safeDump, FAILSAFE_SCHEMA } = require("js-yaml");

const COPY_FOLDER = "copy";

const cmsConfig = {
  backend: {
    name: "github",
    repo: "gameworkers/website"
  },
  // Media files will be stored in the repo under public/uploads.
  media_folder: "public/uploads",
  // Folder path where uploaded files will be accessed, relative to the base of the built site
  public_folder: "/uploads"
};

const siteData = {
  defaultLang: "en",
  langs: ["en", "fr", "es", "pt"],
  title: {
    en: "Game Workers Unite!",
    fr: "Travailleur·euse·s du jeu uni·e·s!",
    es: "Trabajadorxs de juegos unidxs!",
    pt: "Trabalhadorxs de jogos unidxs!"
  }
};

const cmsLangData = {
  language: {
    en: "English",
    fr: "Français",
    es: "Español",
    pt: "Português"
  },
  title: {
    en: "Title",
    fr: "Titre",
    es: "Título",
    pt: "Título"
  },
  text: {
    en: "Text",
    fr: "Texte",
    es: "Texto",
    pt: "Texto"
  }
};

const subPages = [
  {
    name: "Why Unionize?",
    path: "why-unionize",
    component: "src/pages/WhyUnionize"
  }
];

const routes = [
  // The base route is in the default language.
  {
    path: "/",
    component: "src/pages/Home",
    getData: getCopy("home", siteData.defaultLang),
    children: subPages.map(pageData => ({
      ...pageData,
      getData: getCopy(pageData.path, siteData.defaultLang)
    }))
  },
  // For each other language defined, generate a base route, like '/fr'...
  ...siteData.langs.filter(lang => lang !== siteData.defaultLang).map(lang => ({
    path: lang,
    // ...that maps to the homepage in that language...
    component: "src/pages/Home",
    getData: getCopy("home", lang),
    // ...and has child routes for the subpages in that language.
    children: subPages.map(pageData => ({
      ...pageData,
      getData: getCopy(pageData.path, lang)
    }))
  })),
  {
    is404: true,
    component: "src/pages/404"
  }
];

function getCopy(folderName, lang) {
  const filename = path.join(COPY_FOLDER, folderName, `${lang}.md`);
  if (!existsSync(filename)) {
    console.warn(`No file "${filename}"!`);
    return () => ({ title: "Not available", text: "No text" });
  }
  const data = matter.read(filename);

  return () => ({
    title: data.data.title,
    text: data.content
  });
}

export default {
  getSiteData: () => siteData,
  getRoutes: () => routes,
  onBuild: async () => {
    console.log("Building CMS...");

    await new Promise(res =>
      webpack(require("./src/cms/webpack.config.js"), (err, stats) => {
        console.log(stats.toString({ colors: true }));

        if (err || stats.hasErrors()) {
          if (err) {
            console.error(err.stack || err);
            if (err.details) {
              console.error(err.details);
            }
            throw new Error(err);
          }

          if (stats.hasErrors()) {
            throw new Error("See Webpack report above for errors.");
          }
        }

        copyFileSync(
          require.resolve("netlify-cms/dist/cms.css"),
          path.join(__dirname, "dist/admin/cms.css")
        );

        writeFileSync(
          path.join(__dirname, "dist/admin/config.yml"),
          generateCMSConfig()
        );

        // copyFileSync(
        //   path.join(__dirname, "src/cms/config.yml"),
        //   path.join(__dirname, "dist/admin/config.yml")
        // );

        copyFileSync(
          path.join(__dirname, "src/cms/index.html"),
          path.join(__dirname, "dist/admin/index.html")
        );
        res();
      })
    );

    console.log("Done building CMS.");
  }
};

function generateCMSConfig() {
  // The list of Pages for the CMS is just the subpages, plus the home page
  // (which is a special case.)
  const cmsPageList = [
    {
      name: "Home",
      path: "home" // the path on disk to the copy is different for Home!
    },
    ...subPages
  ];

  const finalCMSConfig = {
    ...cmsConfig,
    collections: cmsPageList.map(({ name, path: filePath }) => ({
      name: filePath,
      label: name,
      files: siteData.langs.map(lang => ({
        file: path.join(COPY_FOLDER, filePath, `${lang}.md`),
        label: cmsLangData.language[lang],
        name: `${filePath}-${lang}`,
        fields: [
          {
            name: "title",
            label: cmsLangData.title[lang],
            widget: "string"
          },
          {
            name: "body",
            label: cmsLangData.text[lang],
            widget: "markdown"
          }
        ]
      }))
    }))
  };

  return safeDump(finalCMSConfig, { schema: FAILSAFE_SCHEMA });
}
