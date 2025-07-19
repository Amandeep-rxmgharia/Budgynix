export const useSelectCustomStyle = () => ({
    control: (styles, state) => ({
      ...styles,
      backgroundColor: "#FFFFFD",
      border: '2px solid #CFE8DE',
      boxShadow: state.isFocused ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '&:hover': {
        borderColor: '#2C6E51'
      }
    }),
     singleValue: (base) => ({
    ...base,
    color: '#637387', // Tailwind: text-gray-900
  }),
    option: (styles, state) => ({
      ...styles,
      backgroundColor: state.isSelected
        ? "#2D6E51"
        : state.isFocused
        ? "#DEEFDA"
        : "white",
      userSelect: "none",
      color: state.isSelected ? 'white' : '#5B6169',
      cursor: "pointer",
      ":active": {
        backgroundColor: "#dbede6",
      },
    }),
    menu: (base, state) => ({
      ...base,
      borderRadius: "8px",
      display: 'inline-block'
    }),
  })

export const categoryOptionsArray =  [
    { value: "Food", label: "Food" },
    { value: "Transportation", label: "Transportation" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Utilities", label: "Utilities" },
    { value: "Shopping", label: "Shopping" },
  ]


  const now = new Date();
 export const Today = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
 export const TodayWithoutYear = `${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
 export const nextMonth = `${(now.getMonth() + 2 == '13' ? '1' : now.getMonth() + 2)
    .toString()
    .padStart(2, "0")}-01`;
  const Yesterday = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${(now.getDate() - 1).toString().padStart(2, "0")}`;
  const ThisMonth = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`
  const LastMonth = `${now.getFullYear()}-${now.getMonth() != 0 ? now.getMonth()
    .toString()
    .padStart(2, "0") : '12'}`
  const ThisYear = `${now.getFullYear()}`
  const LastYear = `${now.getFullYear() - 1}`
export const dateOptionsArray = [
    { value: "", label: "All Time" },
    { value: Today, label: "Today" },
    { value: Yesterday, label: "Yesterday" },
    { value: ThisMonth, label: "This Month" },
    { value: LastMonth, label: "Last Month" },
    { value: ThisYear, label: "This Year" },
    { value: LastYear, label: "Last Year" },
  ]