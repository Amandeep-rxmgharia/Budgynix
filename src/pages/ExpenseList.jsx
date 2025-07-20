import { useRef, useState } from "react";
import { Link, NavLink, useOutletContext } from "react-router-dom";
import searchLogo from "../assets/SEARCH LOGO.svg";
import Select from "react-select";
import manImg from "../assets/man_img-removebg-preview.png";
import { nextMonth, useSelectCustomStyle } from "../hooks/useSelectCustom";
import {
  dateOptionsArray,
  categoryOptionsArray,
} from "../hooks/useSelectCustom";
import {
  useDeleteExpenseMutation,
  useGetExpensesQuery,
  useUpdateExpenseMutation,
} from "../../apiSlice";
import wallet from "../assets/wallet.png";
import useFilter from "../hooks/useFilter";

export default function ExpenseList() {
  function toCapitalize(str) {
    if (!str) return "";
    if (typeof str == "string")
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    else return str;
  }
  const { data: expenses = [],isLoading,isSuccess } = useGetExpensesQuery();
  const [filteredExpense, setQuery] = useFilter(expenses);
  const categoryOptions = [
    { value: "", label: "All" },
    ...categoryOptionsArray,
  ];
  const dateOptions = dateOptionsArray;
  const customStyles = useSelectCustomStyle();
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteExpense] = useDeleteExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [, setExpenseFormData, , setEditingRow, onAutopay, setAutopay] =
    useOutletContext();
  const contextRef = useRef(null);
  const handleChange = (selectedOption) => {
    setQuery(selectedOption.value);
  };
  const findExpense = (selectedRow) => {
    return expenses.find(({ id }) => id == selectedRow);
  };
  return (
    <section
      onClick={() => (contextRef.current.style.visibility = "hidden")}
      className="px-[5vw] sm:px-[15vw] text-[#2C6E51] min-h-screen bg-[#F9FCF7] z-0  py-7 relative pt-18"
    >
      <div
        ref={contextRef}
        className="absolute invisible top-82 sm:text-[16px] text-sm left-50 z-10 flex flex-col shadow-lg font-semibold bg-[#FFFFFD] overflow-hidden border text-[#2C6D50] text-center w-full  max-w-[65px] sm:max-w-[80px]  border-gray-300  rounded-md sm:rounded-lg"
      >
        <NavLink
          to="/add"
          onClick={() => {
            const { title, category, amount, id, nextDueDate } =
              findExpense(selectedRow);
            setEditingRow(true);
            setExpenseFormData({ title, category, amount, id, nextDueDate });
            setAutopay(false);
          }}
          className="border-b-2 sm:leading-8 leading-6 border-[#DBE0E5]  hover:text-[#FFFFFD] hover:bg-[#2C6D50]"
        >
          Edit
        </NavLink>
        <NavLink
          onClick={() => deleteExpense(selectedRow)}
          className="sm:leading-8  leading-6 border-b-2 border-[#DBE0E5] hover:text-[#FFFFFD] hover:bg-[#2C6D50]"
        >
          Delete
        </NavLink>
        <NavLink
          title={
            selectedRow
              ? findExpense(selectedRow)?.nextDueDate
                ? "Turn off autopay"
                : "Turn on autopay"
              : ""
          }
          onClick={() => {
            const selectedExpense = {
              ...findExpense(selectedRow),
              nextDueDate: findExpense(selectedRow).nextDueDate
                ? ""
                : nextMonth,
            };
            updateExpense({ ...selectedExpense });
          }}
          className="sm:leading-8 leading-6 hover:text-[#FFFFFD] hover:bg-[#2C6D50]"
        >
          Autopay
        </NavLink>
      </div>
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Expenses</h1>
        <Link
          className="py-1 px-3 text-[12px] sm:text-[16px] bg-[#2C6E51]   font-medium rounded-lg text-[#FFFEFC] border-2 hover:text-[#2C6E51] hover:bg-[#FFFEFC] hover:font-semibold"
          to="/add"
        >
          Add&nbsp;Expense
        </Link>
      </div>
      <div className="absolute  pt-3 sm:pt-2.5 px-4 sm:px-6">
        <img src={searchLogo} className="w-4 sm:w-5" alt="" />
      </div>
      <input
        type="text"
        className="w-full outline-none border-none text-[#637387] font-bold bg-[#E8F5F0]  px-10 sm:px-14 py-2 rounded-lg "
        placeholder="Search"
        onInput={(e) => {
          setQuery(toCapitalize(e.target.value));
        }}
      />
      <div className="flex gap-3">
        {" "}
        <Select
          className="max-w-[150px] flex-1 my-4"
          styles={customStyles}
          isSearchable={false}
          defaultValue={{ label: "Category" }}
          options={categoryOptions}
          onChange={handleChange}
        />
        <Select
          className="max-w-[150px] flex-1 my-4"
          styles={customStyles}
          isSearchable={false}
          onChange={handleChange}
          defaultValue={{ label: "Date" }}
          options={dateOptions}
        />
      </div>
      <span className="text-[13px] mb-1 inline-block sm:hidden">Note: Highlighted expenses are on Autopay</span>
      {expenses.length && isSuccess ? (
        <div className="border-2 rounded-lg relative h-fit bg-[#FFFEFC] border-[#DBE0E5] text-[#637387] sm:mt-4 ">
          {filteredExpense.length > 2 ? (
            <img
              className="absolute sm:block hidden max-h-60 bottom-0 h-full z-[-1] left-0 -translate-x-20"
              src={manImg}
              alt=""
            />
          ) : undefined}
          <table border="1" className="w-full text-[14px] sm:text-[16px]">
            <thead>
              <tr>
                {Object.keys(expenses[0]).map((key) => {
                  if (key != "id" && key != "nextDueDate") {
                    return (
                     key != 'date' && window.innerWidth < 640 ? <th className="sm:px-4 px-2 py-3 sm:w-1/4  text-center text-[#2C6E51]">
                        {toCapitalize(key)}
                      </th> : window.innerWidth >=640 && <th className="sm:px-4 px-2 py-3 sm:w-1/4  text-center text-[#2C6E51]">
                        {toCapitalize(key)}
                      </th>
                    );
                  }
                })}
              </tr>
            </thead>
            <tbody
              onContextMenu={(e) => {
                e.preventDefault();
                contextRef.current.style.visibility = "visible";
                contextRef.current.style.left = `${e.clientX + 2}px`;
                contextRef.current.style.top = `${
                  e.clientY + 2 + window.scrollY
                }px`;
                setSelectedRow(e.target.parentElement.id);
              }}
              className=""
            >
              {filteredExpense.map(
                ({ id, date, category, title, amount, nextDueDate }) => {
                  return (
                    <tr
                      id={id}
                      key={id}
                      style={nextDueDate ? {backgroundColor:  "#b9d9ba4b", color: "#2C6D51", borderColor: "#b9d9baab", fontWeight: ""} : {}}
                      className="border-t-2 relative border-[#DBE0E5]"
                    >
                      <td className="py-3 sm:py-4 sm:block hidden text-center sm:px-3">
                        {date}
                      </td>
                      <td className="py-3 sm:py-4 text-center sm:px-3">
                        {toCapitalize(title)}
                      </td>
                      <td className="py-3 sm:py-4 text-center sm:px-3">
                        {toCapitalize(category)}
                      </td>
                      <td className="py-3 sm:py-4 text-center sm:px-3">
                        ${amount}
                      </td>
                      {nextDueDate && (
                        <span className="absolute -right-18 top-4 sm:block hidden text-[#2C6D51] font-medium  border-[1.5px] px-[3.5px] rounded-sm text-[13px]">
                          autopay
                        </span>
                      )}
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      ) : isLoading ?  <div className="h-[100vh] w-full rounded-lg bg-[#e3efeb] sm:mt-4"><div
            className=" md:px-6 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          ></div></div> : (
        <div className="flex items-center -mt-18 sm:-mt-24 justify-center">
          <h1 className="text-[22px] sm:text-3xl -mr-7 pt-10 font-bold">
            Your expense list is empty
          </h1>
          <img className="w-[200px] sm:w-[250px]" src={wallet} />
        </div>
      )}
    </section>
  );
}
