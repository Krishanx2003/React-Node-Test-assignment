import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Add, Close } from "@mui/icons-material";
import { Path } from "../../utils";
import { Chip, FormControl, Input, InputAdornment, Tooltip } from "@mui/material";
import { PiMagnifyingGlass } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import CreateUser from "./CreateEmployee";
import Filter from "./Filter";
import { searchUserReducer } from "../../redux/reducer/user";

const Topbar = ({ view, setView, setIsFiltered, isFiltered, onCreateClick }) => {

  ///////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////
  const { pathname } = useLocation();
  const pathArr = pathname.split("/").filter((item) => item != "");
  const showClientTopBar = !pathArr.includes("employees");
  const showEmployeeTopBar = !pathArr.includes("clients");
  const showCreatePageTopBar = !pathArr.includes("create");
  const title = pathArr.includes("create")
    ? `Create ${pathname.split("/")[1].slice(0, -1)}`
    : pathname.split("/")[1];
  const descriptionElementRef = useRef(null);

  ///////////////////////////////////////// STATES ///////////////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [scroll, setScroll] = useState("paper");

  ///////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////////
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement != null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  ///////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////
  const handleSearch = (searchTerm) => {
    dispatch(searchUserReducer(searchTerm));
  }
  const handleToggleFilters = () => {
    setOpenFilters((pre) => !pre);
  };

  const handleCreateopen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  return (
    <div className="flex flex-col">
      <div className="w-full text-[14px]">
        <Path />
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-primary-blue text-[32px] capitalize">{title}</h1>
        <div className="flex gap-4">
          {showClientTopBar && (
            <button
              onClick={onCreateClick}
              className="bg-primary-red px-4 py-2 rounded-lg text-white hover:bg-red-400 font-thin">
              Add Client
            </button>
          )}
          {showEmployeeTopBar && (
            <button
              onClick={() => setOpen(true)}
              className="bg-primary-red px-4 py-2 rounded-lg text-white hover:bg-red-400 font-thin">
              Add Employee
            </button>
          )}
        </div>
      </div>
      <CreateUser open={open} scroll={scroll} setOpen={setOpen} />
      <Filter open={openFilters} setOpen={setOpenFilters} setIsFiltered={setIsFiltered} />
    </div>
  );
};

export default Topbar;
