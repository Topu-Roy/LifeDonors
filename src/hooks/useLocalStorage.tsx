import { useCallback } from "react";

export function useLocalStorage<T>(key: string) {
  const getItem = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : undefined;
    } catch (error) {
      console.log(error);
    }
  }, []);

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
