import { useState, useEffect } from "react";

/**
 * Custom hook for managing state with localStorage synchronization
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns [value, setValue] - State value and setter function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function (same as useState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Custom hook for managing string state with localStorage
 * Simplified version for string values (no JSON parsing)
 */
export function useLocalStorageString(
  key: string,
  initialValue: string
): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item || initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook to load multiple localStorage values on mount
 * Useful for loading user data at app initialization
 */
export function useLoadUserData() {
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [customBackground, setCustomBackground] = useState<string>("");

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    }

    const savedUserAvatar = localStorage.getItem("userAvatar");
    if (savedUserAvatar) {
      setUserAvatar(savedUserAvatar);
    }

    const savedBackground = localStorage.getItem("customBackground");
    if (savedBackground) {
      setCustomBackground(savedBackground);
    }
  }, []);

  return {
    userName,
    setUserName,
    userAvatar,
    setUserAvatar,
    customBackground,
    setCustomBackground,
  };
}
