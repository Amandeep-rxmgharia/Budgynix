import wallet from "../assets/wallet img.png";
import CountUp from "react-countup";
import { useGetExpensesQuery, useUpdateExpenseMutation } from "../../apiSlice";
import { useEffect, useRef, useState } from "react";
import NotSpentYet from "../assets/no spending img.png";
import trackingExpense from "../assets/tracking expenses man.png";
import { Link, useOutletContext } from "react-router-dom";
import {
  categoryOptionsArray,
  nextMonth,
  Today,
  TodayWithoutYear,
  useSelectCustomStyle,
} from "../hooks/useSelectCustom";
import useLocalStorage from "../hooks/useLocalStorage";
import Select from "react-select";
import Input from "../components/Input";
import setBudgetImg from "../assets/set budget img.png";
import xMark from "../assets/circle-xmark-regular.svg";
import leafImg from "../assets/Leaf img.png";
import warningImg from "../assets/exclamation-solid (1).svg";
export default function Home() {
  const {
    data: expenseData = [],
    isSuccess,
    isLoading,
  } = useGetExpensesQuery();
  const [update] = useUpdateExpenseMutation();
  useEffect(() => {
    expenseData.forEach((eachExpense) => {
      if (eachExpense.nextDueDate == TodayWithoutYear) {
        const a = {
          id: eachExpense.id,
          ...eachExpense,
          date: Today,
          nextDueDate: nextMonth,
        };
        update(a);
      }
    });
  }, [isSuccess]);
  const totalSpent = expenseData.reduce((acc, curr) => {
    return acc + parseInt(curr.amount);
  }, 0);
  const [foodProgress, setFoodProgress] = useState(0);
  const [transportationProgress, setTransportationProgress] = useState(0);
  const [entertainmentProgress, setEntertainmentProgress] = useState(0);
  const [utilitiesProgress, setUtilitiesProgress] = useState(0);
  const [shoppingProgress, setShoppingProgress] = useState(0);
  const [, setExpenseFormData, , setEditingRow, , setAutopay] =
    useOutletContext();
  const categoryArr = [
    ["Food", foodProgress, "#98C49F"],
    ["Transportation", transportationProgress, "#B9D9BA"],
    ["Entertainment", entertainmentProgress, "#6DA780"],
    ["Utilities", utilitiesProgress, "#86B691"],
    ["Shopping", shoppingProgress, "#589671"],
  ];
  const [budgetInputValue, setBudgetInputValue] = useState("");
  const [categoryBudget, setCategoryBudget] = useLocalStorage(
    "categoryBudget",
    {
      Food: null,
      Transportation: null,
      Entertainment: null,
      Utilities: null,
      Shopping: null,
    }
  );
  const [isPopupOpen, setPopupOpen] = useLocalStorage("isPopupOpen", false);
  const [isSliding, setSliding] = useLocalStorage("isSliding", false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [budgetError, setBudgetError] = useState("");
  const budgetInput = useRef(null);
  function categoryExpense(category) {
    return expenseData
      .filter((expense) => {
        if (expense.category == category) {
          return expense;
        }
      })
      .reduce((acc, filteredExpense) => {
        return acc + parseInt(filteredExpense.amount);
      }, 0);
  }
  useEffect(() => {
    setTimeout(() => {
      setFoodProgress(categoryExpense("Food"));
      setTransportationProgress(categoryExpense("Transportation"));
      setUtilitiesProgress(categoryExpense("Utilities"));
      setShoppingProgress(categoryExpense("Shopping"));
      setEntertainmentProgress(categoryExpense("Entertainment"));
    }, 100);
  }, [expenseData]);
  const progressAnimation = (progressValue, bgColor) => {
    return {
      width: `${(progressValue / totalSpent) * 100}%`,
      transition: "all 0.5s ease-in-out",
      position: progressValue ? "static" : "absolute",
      backgroundColor: bgColor,
    };
  };
  const display = (progressValue) => {
    return { display: progressValue ? "block" : "none" };
  };
  const [isHovered, setIsHovered] = useState(false);
  const popupSubmitHandler = (e) => {
    if (!selectedLabel || budgetInputValue) {
      setCategoryBudget({
        ...categoryBudget,
        [selectedLabel]: budgetInputValue,
      });
      setBudgetInputValue("");
      setSelectedLabel("");
      setBudgetError("");
    } else if (!budgetInputValue) {
      setBudgetError("please set limit!");
    }
  };
  const popupCloseHandler = () => {
    setSliding(false);
    setSelectedLabel("");
    setBudgetError("");
    setCategoryBudget({
      ...categoryBudget,
      [selectedLabel]: categoryBudget[selectedLabel]
        ? categoryBudget[selectedLabel]
        : null,
    });
    setTimeout(() => {
      setPopupOpen(false);
    }, 400);
  };
  return (
    <section
      onClick={popupCloseHandler}
      className="flex flex-col text-[#064d2d] min-h-screen px-[5vw] sm:px-[15vw] bg-[#FCFDF9] py-10 sm:py-7"
    >
      {isPopupOpen ? (
        <div className="w-full h-full p-6 fixed flex justify-center items-center top-0 left-0 z-4 bg-[#00000080]">
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: isSliding ? "translateX(0px)" : "translateX(-150%)",
              transition: "transform 0.5s ease",
            }}
            className="max-w-[350px] sm:max-w-[500px] lg:max-w-[600px]  flex justify-around items-center relative bg-[#FCFDF9] rounded-xl w-full h-60 px-4 sm:h-88 shadow"
          >
            <div className="flex flex-col w-full max-w-[150px] sm:max-w-[230px] lg:max-w-2xs">
              <h1 className="text-[22px] sm:text-3xl font-bold">Set budget</h1>
              <p className="text-[12px] sm:mb-4">by category</p>
              <Select
                className="text-[#2C6D51] flex-1 mt-3 max-w-[150px] sm:max-w-2xs shadow-none"
                styles={useSelectCustomStyle()}
                isSearchable={false}
                onChange={(selected) => {
                  if (budgetInput) {
                    budgetInput.current.focus();
                  }
                  setSelectedLabel(selected.value);
                  setBudgetInputValue("");
                  setBudgetError("");
                }}
                options={categoryOptionsArray}
              />
              <Input
                value={budgetInputValue}
                setValue={setBudgetInputValue}
                labelName=""
                placeholder="amount"
                error={budgetError}
                setError={setBudgetError}
                selectedLabel={selectedLabel}
                categoryBudget={categoryBudget}
                ref={budgetInput}
              />
              <button
                onClick={
                  selectedLabel
                    ? categoryBudget[selectedLabel] && !budgetInputValue
                      ? () => {
                          setCategoryBudget({
                            ...categoryBudget,
                            [selectedLabel]: null,
                          });
                          setSelectedLabel("");
                        }
                      : popupSubmitHandler
                    : popupCloseHandler
                }
                className="cursor-pointer py-1  sm:mt-0.5 px-6 text-sm bg-[#2C6E51] w-full font-medium rounded-sm text-[#FFFEFC] border-2 hover:text-[#2C6E51] hover:bg-[#FFFEFC] hover:font-semibold"
              >
                {selectedLabel
                  ? categoryBudget[selectedLabel] && !budgetInputValue
                    ? "Reset"
                    : "Set"
                  : "Back"}
              </button>
            </div>
            <img
              className="w-30 sm:w-38 mb-10 self-end"
              src={setBudgetImg}
              alt=""
            />
            <img
              onClick={popupCloseHandler}
              className="w-5 absolute top-3 cursor-pointer right-3"
              src={xMark}
              alt=""
            />
          </div>
        </div>
      ) : undefined}
      <h1 className="text-[22px] sm:text-3xl  font-bold py-1 pt-14">
        DashBoard
      </h1>
      <h2 className="text-[12px] sm:text-sm font-medium">
        Welcome Back, Buddy!
      </h2>
      <div className="p-4 sm:p-6  bg-[#FFFFFC] border-2 border-[#CFE8DE] shadow-md  mt-4 rounded-lg">
        <p className="font-medium text-sm sm:text-[16px] leading-6">
          Total Spent
        </p>
        <p className="font-bold text-[22px] sm:text-2xl leading-10">
          <img className="w-7 sm:w-8 mr-1 inline-block" src={wallet} alt="" /> $
          <CountUp end={totalSpent} duration={0.7} />
        </p>
      </div>
      <div className="py-5 sm:py-8 font-bold text-[22px] sm:leading-4">
        {expenseData.length || isLoading
          ? "Spending By Category"
          : "No spending recorded!"}
      </div>
      {isSuccess && expenseData.length ? (
        <div className="px-4 md:px-6 min-h-[288px] sm:min-h-[210px] pb-3 sm:pb-0 pt-3 sm:pt-4 rounded-lg flex flex-col justify-start font-semibold backdrop-blur-sm border-2 shadow-lg bg-[#FFFFFC]  border-[#CFE8DE]">
          {categoryArr.map(
            ([categoryName, categoryProgress, progressColor]) => {
              return (
                <div className="sm:pl-36 sm:relative group">
                  <div
                    className={`absolute right-4 sm:-left-25 sm:right-auto opacity-0 bg-[#2C6D51] text-[#FFFFFD] text-sm sm:text-md px-1 sm:px-2 rounded-sm -translate-x-50 group-hover:translate-0 group-hover:opacity-100 transition-all duration-400`}
                  >
                    {isHovered ? (
                      <>
                        <span>$</span>
                        <CountUp end={categoryProgress} duration={0.5} />
                      </>
                    ) : undefined}
                  </div>
                  <span
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={display(categoryProgress)}
                    className="sm:absolute max-w-fit w-full mb-1 hover:scale-110 sm:hover:border px-1 rounded-sm transition-scale ease-in-out duration-400 cursor-pointer left-0"
                  >
                    {categoryName}
                  </span>
                  <div
                    style={progressAnimation(categoryProgress, progressColor)}
                    className="h-5 ml-1 sm:ml-0 sm:h-6 mb-1 sm:mb-2 block sm:inline-block rounded-r-[3px]"
                  ></div>
                </div>
              );
            }
          )}
        </div>
      ) : isLoading ? (
        <div className="bg-[#B9D9BA] min-h-[288px] sm:min-h-[210px] w-full relative rounded-lg">
          <div
            className=" md:px-6 absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          ></div>
        </div>
      ) : (
        <img
          className="w-[200px] sm:w-[250px] rounded-4xl overflow-hidden"
          src={NotSpentYet}
          alt=""
        />
      )}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="p-4 md:px-6 flex-1 flex flex-col min-w-[200px] justify-around bg-[#FFFFFC] border-2 max-w-2xl border-[#CFE8DE] shadow-md  mt-8 rounded-lg">
          <div>
            {" "}
            <div className="flex justify-start items-start max-w-fit">
              <span className="text-[22px] lg:text-[26px] font-bold flex-0">
                Manage&nbsp;Your Budget
              </span>
              <img className="w-[30px] mt-2 ml-2" src={wallet} alt="" />
            </div>
            <div className="flex mt-2 text-[14px] lg:text-[16px] gap-2">
              <p>Monthly cap:</p>
              <span className="bg-[#e2efe9] px-1 rounded-[6px]">
                $
                <CountUp
                  end={Object.values(categoryBudget).reduce((acc, curr) => {
                    return acc + curr;
                  }, 0)}
                  duration={0.7}
                ></CountUp>
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPopupOpen(true);
              setBudgetInputValue("");
              setTimeout(() => {
                setSliding(true);
              }, 0);
            }}
            className="py-1 cursor-pointer px-3 text-sm bg-[#2C6E51] max-w-fit mt-3 font-medium rounded-lg text-[#FFFEFC] border-2 hover:text-[#2C6E51] hover:bg-[#FFFEFC] hover:font-semibold"
          >
            Set&nbsp;Budget
          </button>
        </div>
        <div className="p-2 sm:p-6 bg-[#FFFFFC]  relative flex-1 border-2 flex sm:items-stretch max-w-2xl   border-[#CFE8DE] shadow-md  mt-8 rounded-lg">
          <img
            className="absolute hidden sm:block w-10 bottom-0 -right-10"
            src={leafImg}
            alt=""
          />
          <div className="flex p-1 gap-2 sm:gap-4">
            {" "}
            <div className="flex flex-col gap-2 sm:gap-4 text-[14px] sm:text-[16px] max-w-fit justify-center sm:mr-8">
              <span className="font-bold text-[16px]">Category</span>
              {categoryArr.map(([categoryName, spent]) => (
                <span className="relative">
                  {categoryBudget[categoryName] - spent < 0 &&
                  categoryBudget[categoryName] ? (
                    <div className="w-4 h-4 -left-5 bottom-1 sm:border-[1.5px] rounded-[100%] absolute text-[#2C6D51]">
                      <img
                        className="h-3.5 sm:h-[9px] absolute top-[9.5px] sm:top-1/2 left-2/2 sm:left-1/2 -translate-y-1/2 -translate-x-1/2"
                        src={warningImg}
                        alt=""
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {categoryName}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:gap-4 justify-center ">
              <span className="font-bold">Allowance</span>
              {categoryArr.map(([categoryName]) => (
                <span className="bg-[#e2efe9] sm:px-1 text-center text-[14px] sm:text-[16px] rounded-[6px] font-normal">
                  {categoryBudget[categoryName] ? (
                    <span>
                      $
                      <CountUp
                        end={categoryBudget[categoryName]}
                        duration={0.7}
                      />
                    </span>
                  ) : (
                    <span>not&nbsp;set</span>
                  )}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:gap-4 justify-center">
              <span className="font-bold">Remaining</span>
              {categoryArr.map(([categoryName, spent]) => (
                <span className="bg-[#e2efe9] px-1 text-center text-[14px] sm:text-[16px] rounded-[6px] font-normal">
                  {categoryBudget[categoryName] ? (
                    <span>
                      $
                      <CountUp
                        end={categoryBudget[categoryName] - spent}
                        duration={0.7}
                      />
                    </span>
                  ) : (
                    <span>not&nbsp;set</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:px-6 min-h-[210px] mt-8 rounded-xl relative max-w-full justify-between flex font-semibold backdrop-blur-sm border-2 shadow-lg bg-[#FFFFFC]  border-[#CFE8DE]">
        <div className="flex flex-col justify-around">
          <div>
            {" "}
            <h3 className="text-[22px] sm:text-[26px] font-bold">Autopay</h3>
            <p className="mt-2 text-[12px] font-normal sm:text-[16px]">
              Autopay helps you stay organized by recording your fixed expenses
              like rent, subscriptions, or EMIs on time.
            </p>
          </div>
          <Link
            onClick={() => {
              setAutopay(true);
              setEditingRow(false);
              setExpenseFormData({ title: "", category: "", amount: "" });
            }}
            className="py-1 px-3 text-[12px] sm:text-sm bg-[#2C6E51] max-w-fit mt-3 font-medium rounded-lg text-[#FFFEFC] border-2 hover:text-[#2C6E51] hover:bg-[#FFFEFC] hover:font-semibold"
            to="/add"
          >
            Add&nbsp;Expense
          </Link>
        </div>
        <img
          className="max-w-[110px] lg:max-w-[150px] -mb-2 rounded-4xl"
          src={trackingExpense}
          alt=""
        />
      </div>
    </section>
  );
}
