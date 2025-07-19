import { useState } from "react";

export default function useFilter(data) {
  const [query, setQuery] = useState(null);
  function toCapitalize(str) {
    if (!str) return "";
    if (typeof str == "string")
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    else return str;
  }

  const filteredData = data.filter((eachExpense) => {
    if (!query) {
      return eachExpense;
    }
    return Object.entries(eachExpense)
      .filter(([key, value]) => key != "id" && key != "nextDueDate")
      .some(([key, value]) => {
        return toCapitalize(value).toString().includes(query);
      })
      ? eachExpense
      : undefined;
  });

  return [filteredData,setQuery]
}
