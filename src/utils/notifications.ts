import { toast, type ToastOptions } from "react-toastify";

/**
 * Default toast configuration
 */
const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Shows an error notification
 * @param message - Error message to display
 * @param options - Optional toast configuration
 */
export function showError(message: string, options?: ToastOptions): void {
  toast.error(message, { ...defaultOptions, ...options });
}

/**
 * Shows a success notification
 * @param message - Success message to display
 * @param options - Optional toast configuration
 */
export function showSuccess(message: string, options?: ToastOptions): void {
  toast.success(message, { ...defaultOptions, ...options });
}

/**
 * Shows a warning notification
 * @param message - Warning message to display
 * @param options - Optional toast configuration
 */
export function showWarning(message: string, options?: ToastOptions): void {
  toast.warning(message, { ...defaultOptions, ...options });
}

/**
 * Shows an info notification
 * @param message - Info message to display
 * @param options - Optional toast configuration
 */
export function showInfo(message: string, options?: ToastOptions): void {
  toast.info(message, { ...defaultOptions, ...options });
}
