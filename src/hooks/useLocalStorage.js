import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const existingValue = localStorage.getItem(key);
  useEffect(() => {
    if (existingValue) {
      setState(JSON.parse(existingValue));
    }
    else {
        localStorage.setItem(key, JSON.stringify(initialValue));
    }
  }, []);
  function updateValue(newValue) {
    localStorage.setItem(key, JSON.stringify(newValue))
    setState(newValue)
  }
  return [state,updateValue]
}
