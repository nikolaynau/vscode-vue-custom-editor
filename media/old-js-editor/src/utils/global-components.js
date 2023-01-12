import kebabCase from 'lodash/kebabCase';

export default {
  install: app => {
    loadGlobalViews(
      app,
      import.meta.globEager('../components/**/v-*.(vue|js)')
    );
  }
};

function loadGlobalViews(app, components) {
  for (const [fileName, componentConfig] of Object.entries(components)) {
    const componentName = kebabCase(
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    );
    app.component(componentName, componentConfig.default || componentConfig);
  }
}
