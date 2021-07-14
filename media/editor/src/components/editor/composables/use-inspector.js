export default function useInspector({ model, inspectorEnabled, emit }) {
  if (inspectorEnabled.value) {
    model.value.on("change", updateInspector);
    updateInspector();
  }

  function updateInspector() {
    emit("update-inspector", createDataModel());
  }

  function createDataModel() {
    return {
      counterValue: model.value.counter,
      buttons: model.value.buttons.map(button => ({
        id: button.id,
        value: button.value
      }))
    }
  }

  return {
    updateInspector
  }
}
