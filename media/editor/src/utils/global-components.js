import kebabCase from "lodash/kebabCase";
const components = import.meta.globEager("../components/**/*.(vue|js)");

export default {
  install: (app) => {
    for (const [fileName, componentConfig] of Object.entries(components)) {
      const componentName =
        kebabCase(
          fileName
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        );
      app.component(
        componentName,
        componentConfig.default || componentConfig
      );
    }
  }
}
