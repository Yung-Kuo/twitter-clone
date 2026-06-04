export default function useAlert() {
  const alertMode = ref("");
  const alertMessage = ref("");
  const errorTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  function hasError() {
    if (errorTimeout.value) clearTimeout(errorTimeout.value);
    errorTimeout.value = setTimeout(() => {
      alertMode.value = "";
      alertMessage.value = "";
    }, 2000);
  }

  return { alertMode, alertMessage, errorTimeout, hasError };
}
