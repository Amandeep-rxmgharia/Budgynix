import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Provider } from "react-redux";
import { List } from "./List/index";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [editingRow, setEditingRow] = useLocalStorage("editingRow", false);
  const [expenseFormData, setExpenseFormData] = useLocalStorage(
    "expenseFormData",
    {
      title: "",
      category: "",
      amount: "",
    }
  );
  const [onAutopay, setAutopay] = useLocalStorage("onAutopay", false);
  return (
    <Provider store={List}>
      <Header />
      <Outlet
        context={[
          expenseFormData,
          setExpenseFormData,
          editingRow,
          setEditingRow,
          onAutopay,
          setAutopay,
        ]}
      />
    </Provider>
  );
}
export default App;
