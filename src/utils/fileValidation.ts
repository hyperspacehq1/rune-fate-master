export interface FileValidationResult {
  success: boolean;
  error?: string;
  data?: string;
}

export interface FileValidationOptions {
  maxSizeMB: number;
  allowedTypes: readonly string[];
}

/**
 * Validates an image file for type and size
 * @param file - The file to validate
 * @param options - Validation options (maxSizeMB, allowedTypes)
 * @returns Validation result with success flag and optional error message
 */
export function validateImageFile(
  file: File,
  options: FileValidationOptions
): { valid: boolean; error?: string } {
  // Validate file type
  if (!options.allowedTypes.includes(file.type)) {
    const types = options.allowedTypes
      .map((t) => t.replace("image/", "").toUpperCase())
      .join(", ");
    return {
      valid: false,
      error: `Please upload a valid image file (${types})`,
    };
  }

  // Validate file size
  const maxSizeBytes = options.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${options.maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Reads a file as a data URL (base64 encoded string)
 * @param file - The file to read
 * @returns Promise that resolves with FileValidationResult
 */
export function readFileAsDataURL(file: File): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve({ success: true, data: result });
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: "Failed to read the image file. Please try another file.",
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates and reads an image file
 * @param file - The file to validate and read
 * @param options - Validation options
 * @returns Promise that resolves with FileValidationResult containing the data URL
 */
export async function validateAndReadImageFile(
  file: File,
  options: FileValidationOptions
): Promise<FileValidationResult> {
  // First validate
  const validation = validateImageFile(file, options);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Then read
  return readFileAsDataURL(file);
}

// Common validation presets
export const IMAGE_VALIDATION = {
  BACKGROUND: {
    maxSizeMB: 5,
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ],
  },
  AVATAR: {
    maxSizeMB: 2,
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
} as const;
