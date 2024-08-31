import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string) {
  const [value, setValue] = useState<T | null>(null);

  const getItem = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : undefined;
    } catch (error) {
      console.log(error);
    }
  }, []);

  // useEffect(() => {
  //   try {
  //     const item = window.localStorage.getItem(key);
  //     item ? setValue(JSON.parse(item) as T) : setValue(null);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  const setItem = useCallback((value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { getItem, setItem, removeItem };
}

export function useNewLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
) {
  // Helper function to safely parse stored value
  const parseStoredValue = (item: string | null): T => {
    if (item === null) {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
    try {
      return JSON.parse(item) as T;
    } catch {
      console.log(`Error parsing stored value for key "${key}"`);
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
  };

  // Initialize state
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
    return parseStoredValue(window.localStorage.getItem(key));
  });

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // Sync state with other tabs/windows
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key && event.newValue !== null) {
          const newValue = parseStoredValue(event.newValue);
          if (JSON.stringify(newValue) !== JSON.stringify(storedValue)) {
            setStoredValue(newValue);
          }
        } else if (event.key === key && event.newValue === null) {
          setStoredValue(
            typeof initialValue === "function"
              ? (initialValue as () => T)()
              : initialValue,
          );
        }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [key, storedValue, initialValue]);

  // Remove item from localStorage
  const removeItem = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        setStoredValue(
          typeof initialValue === "function"
            ? (initialValue as () => T)()
            : initialValue,
        );
      }
    } catch (error) {
      console.log(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeItem] as const;
}
