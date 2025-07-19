import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import menuIcon from "../assets/bars-solid.svg";
export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSlideMenu, setOpenSlideMenu] = useState(false);
  const menuCloseHandler = () => {
    setOpenSlideMenu(false);
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  };
  return (
    <header className="bg-[#FFFFFC] fixed w-full  z-3 flex justify-between items-center sm:px-[15vw]  py-5 shadow">
      {isMenuOpen ? (
        <div
          onClick={menuCloseHandler}
          className="top-5 right-40 sm:hidden block absolute"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: openSlideMenu ? "translateX(0%)" : "translateX(101%)",
              transition: "transform 0.2s ease-out",
            }}
            className="h-fit w-fit flex flex-col rounded-lg  p-5 text-[16px] font-semibold gap-6 translate-x-[101%] text-[#2C6D51] bg-white/65 backdrop-blur-[2px] border border-white/20 shadow-lg"
          >
            <div>
              {" "}
              <NavLink
                onClick={menuCloseHandler}
                to="/"
                className={({ isActive }) =>
                  isActive ? "border-[2px] rounded-sm -ml-1 px-1" : ""
                }
              >
                Home
              </NavLink>
            </div>
            <NavLink
              onClick={menuCloseHandler}
              to="/add"
              className={({ isActive }) =>
                isActive ? "border-[2px] rounded-sm -ml-1 px-1" : ""
              }
            >
              Add expense
            </NavLink>
            <div>
              {" "}
              <NavLink
                onClick={menuCloseHandler}
                to="/list"
                className={({ isActive }) =>
                  isActive ? "border-[2px] rounded-sm -ml-1 px-1" : ""
                }
              >
                List
              </NavLink>
            </div>
            <button
              onClick={menuCloseHandler}
              className="text-2xl absolute cursor-pointer right-2 top-0 font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      ) : undefined}
      <h1
        onClick={() => {
          navigate("/");
        }}
        className="text-lg font-bold cursor-pointer sm:ml-0 ml-[5vw]"
      >
        Budgynix
      </h1>
      <div className="flex gap-5">
        <nav className="sm:flex hidden items-center gap-5 font-medium">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "border-2 font-semibold border-[#2C6D51] text-[#2C6D51]  px-1 rounded-sm"
                : "px-1"
            }
            to="/"
          >
            DashBoard
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "border-2 font-semibold border-[#2C6D51] text-[#2C6D51]  px-1 rounded-sm"
                : "px-1"
            }
            to="/add"
          >
            Add Expense
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "border-2 font-semibold border-[#2C6D51] text-[#2C6D51]  px-1 rounded-sm"
                : "px-1"
            }
            to="/list"
          >
            List
          </NavLink>
        </nav>
      </div>
      {isMenuOpen ? undefined : (
        <img
          onClick={() => {
            setIsMenuOpen(true);
            setTimeout(() => {
              setOpenSlideMenu(true);
            }, 0);
          }}
          className="w-4.5 mr-[5.5vw] cursor-pointer sm:hidden block"
          src={menuIcon}
          alt=""
        />
      )}
    </header>
  );
}
