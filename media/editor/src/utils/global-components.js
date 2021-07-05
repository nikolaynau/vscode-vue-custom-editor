import kebabCase from "lodash/kebabCase";

const requireComponent = require.context(
  "@/components",
  true,
  /v-[a-z0-9-]*.(vue|js)$/
);

export default {
  install: (app) => {
    requireComponent.keys().forEach(fileName => {
      const componentConfig = requireComponent(fileName);
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
    });
  }
}
