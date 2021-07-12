export default function useInspector({ model, inspectorEnabled, emit }) {
  if (inspectorEnabled.value) {
    model.value.on("change", e => {
      emit("update-inspector", e);
    });

    emit("update-inspector", { start: true });
  }
}
