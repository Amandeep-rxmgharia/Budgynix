import { useState } from "react";
import Input from "../components/Input";
import leafIcon from "../assets/Leaf img.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import Select from "react-select";
import exit from "../assets/right-from-bracket-solid.svg";
import {
  useSelectCustomStyle,
  categoryOptionsArray,
  Today,
  nextMonth,
} from "../hooks/useSelectCustom.js";
import {
  useAddExpenseMutation,
  useGetExpensesQuery,
  useUpdateExpenseMutation,
} from "../../apiSlice.js";
import warningImg from "../assets/exclamation-solid (1).svg";

export default function AddExpense() {
  const customStyles = useSelectCustomStyle();
  const [errorsData, setErrorData] = useState("errorData", {});
  const [addExpense] = useAddExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const { data: expenseData = [], isSuccess } = useGetExpensesQuery();
  const navigate = useNavigate();
  const [
    expenseFormData,
    setExpenseFormData,
    editingRow,
    setEditingRow,
    onAutopay,
    setAutopay,
  ] = useOutletContext();
  const formValidation = {
    title: [
      { required: true, message: "Please fill out this field!" },
      { minlength: 3, message: "Please enter at least 3 characters" },
    ],
    category: [{ required: true, message: "Category is required to proceed!" }],
    amount: [{ required: true, message: "Please enter amount!" }],
  };

  function validate(formData) {
    const errorsData = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key != "id" && key != "nextDueDate") {
        formValidation[key].forEach((rule) => {
          if (rule.required && !value) {
            errorsData[key] = rule.message;
            return;
          }
          if (value) {
            if (rule.minlength && value.length < rule.minlength) {
              errorsData[key] = rule.message;
            }
          }
        });
      }
    });
    return errorsData;
  }
  function budgetSucceeded([FormCategory]) {
    let notHavingBudget = false;
    if (!JSON.parse(localStorage.getItem("categoryBudget"))[FormCategory]) {
      return notHavingBudget;
    }
    let totalCategorySpentAmount = 0;
    expenseData.forEach(({ category, amount }) => {
      if (FormCategory == category) {
        totalCategorySpentAmount = totalCategorySpentAmount + amount;
      }
    });
    console.log(totalCategorySpentAmount);
    if (
      JSON.parse(localStorage.getItem("categoryBudget"))[FormCategory] -
        totalCategorySpentAmount >=
      0
    ) {
      return notHavingBudget;
    } else {
      notHavingBudget = true;
      return notHavingBudget;
    }
  }
  const submitHandler = () => {
    if (Object.keys(validate(expenseFormData)).length) {
      setErrorData(validate(expenseFormData));
      return;
    }
    if (budgetSucceeded([expenseFormData.category, expenseFormData.amount])) {
      setNotification(true);
      setTimeout(() => {
        setNotification(false);
      }, 1000);
      return;
    }
    navigate("/list");
    setExpenseFormData({ title: "", category: "", amount: "" });
    setEditingRow(false);
    setAutopay(false);
    editingRow
      ? updateExpense({
          id: expenseFormData.id,
          ...expenseFormData,
          date: Today,
          nextDueDate: expenseFormData.nextDueDate ? nextMonth : undefined,
        })
      : onAutopay
      ? addExpense({
          date: Today,
          ...expenseFormData,
          id: crypto.randomUUID(),
          nextDueDate: nextMonth,
        })
      : addExpense({
          date: Today,
          ...expenseFormData,
          id: crypto.randomUUID(),
        });
  };
  const [showNotification, setNotification] = useState(false);
  return (
    <section className="mx-auto px-2 py-7 relative bg-[#F9FCF7] h-screen flex justify-center  items-start sm:items-center">
      <div
        style={{
          transform: showNotification ? "translateY(180%)" : "translateY(0px)",
          transition: "transform 0.3s ease-out",
        }}
        className="max-w-fit gap-2 py-2 px-3 sm:p-4 w-full flex items-center rounded-sm z-2 top-3 left-5 sm:h-12 bg-[#FFFFFD] border border-[#CFE8DE] text-[#2C6D51] anim shadow-lg absolute"
      >
        <span className="font-bold sm:block hidden">WARNING</span>
        <div className="w-5 h-5 flex items-center -ml-1 mr-1 border-[1.5px] rounded-[100%] relative text-[#2C6D51]">
          <img
            className="h-3  absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
            src={warningImg}
            alt=""
          />
        </div>
        <p className="text-sm max-w-fit w-full">{`You’ve crossed your ${expenseFormData.category} limit`}</p>
      </div>
      <div className="backdrop-blur-sm relative mt-20 justify-self-center bg-[#FFFFFD] border border-[#CFE8DE] text-[#2C6D51] rounded-md p-6 shadow-lg  max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg w-full ">
        {onAutopay || editingRow ? (
          <span className="text-[10px] font-semibold ml-2 border-2 rounded-[4px] p-[2px] sm:p-[3px] absolute top-2 sm:top-4 right-2 sm:right-3">
            {onAutopay ? "Autopay" : "Editing"}&nbsp;mode
          </span>
        ) : undefined}
        <h1 className="lg:pb-5 text-center font-bold text-2xl lg:text-3xl">
          {editingRow ? "Update" : "Add"} Expense
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          action=""
        >
          <div className="w-full">
            <Input
              value={expenseFormData}
              setValue={setExpenseFormData}
              labelName="Title"
              placeholder="title"
              setError={setErrorData}
              error={errorsData.title}
            />
            <div className="relative sm:py-5">
              <label className="font-semibold inline-block" htmlFor="">
                Category
              </label>
              <Select
                className="text-[#2C6D51] flex-1 mt-3 shadow-none"
                styles={customStyles}
                isSearchable={false}
                onChange={(selected) => {
                  setExpenseFormData({
                    ...expenseFormData,
                    category: selected.value,
                  });
                  setErrorData({});
                }}
                options={categoryOptionsArray}
              />
              <p className="text-[12px] font-medium mb-3 absolute ml-0.5 sm:ml-0 sm:bottom-[-12px] text-[#2C6D51]">
                {errorsData.category}
              </p>
            </div>
            <Input
              value={expenseFormData}
              setValue={setExpenseFormData}
              labelName="Amount"
              placeholder="amount"
              error={errorsData.amount}
              setError={setErrorData}
            />
          </div>
          <p
            onClick={submitHandler}
            className="cursor-pointer block w-full sm:mt-5 font-bold border-2 text-center p-1 text-md bg-[#2C6D51] hover:bg-[#FFFFFD] hover:border-2 hover:border-[#2C6D51] hover:text-[#2C6D51] rounded-sm text-[#FFFFFD]"
          >
            {editingRow ? "Save" : "Add"}
          </p>
        </form>
        <img
          className="h-35 absolute sm:block hidden right-0 translate-x-[57px] bottom-0"
          src={leafIcon}
          alt=""
        />

        {onAutopay || editingRow ? (
          <>
            <p className="text-[12px] font-medium -mb-2 pt-1">
              {onAutopay
                ? "Note: This expense will be auto-added every month!"
                : "Note: You're editing an existing entry!"}
            </p>
            <img
              onClick={() => {
                onAutopay ? setAutopay(false) : setEditingRow(false);
                setExpenseFormData({ title: "", category: "", amount: "" });
              }}
              title={`Stop ${onAutopay ? "Autopay" : "Editing"}`}
              className="w-4 absolute -right-7 top-5 cursor-pointer"
              src={exit}
              alt=""
            />
          </>
        ) : undefined}
      </div>
    </section>
  );
}
