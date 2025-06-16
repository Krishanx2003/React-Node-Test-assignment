import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../redux/action/user";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { CFormSelect } from "@coreui/react";
import { pakistanCities } from "../../constant";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateUser = ({ open, setOpen, scroll }) => {
  //////////////////////////////////////// VARIABLES /////////////////////////////////////
  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initialEmployeeState = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
  }

  const initialValidationState = {
    firstName: { error: false, message: "" },
    lastName: { error: false, message: "" },
    username: { error: false, message: "" },
    password: { error: false, message: "" },
    phone: { error: false, message: "" },
    email: { error: false, message: "" },
  }

  //////////////////////////////////////// STATES /////////////////////////////////////
  const [employeeData, setEmployeeData] = useState(initialEmployeeState);
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  //////////////////////////////////////// USE EFFECTS /////////////////////////////////////

  //////////////////////////////////////// FUNCTIONS /////////////////////////////////////
  const validateField = (field, value) => {
    let error = false;
    let message = "";

    switch (field) {
      case "firstName":
        if (!value.trim()) {
          error = true;
          message = "First name is required";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = true;
          message = "Last name is required";
        }
        break;
      case "username":
        if (!value.trim()) {
          error = true;
          message = "Username is required";
        }
        break;
      case "password":
        if (!value) {
          error = true;
          message = "Password is required";
        } else if (value.length < 6) {
          error = true;
          message = "Password must be at least 6 characters";
        }
        break;
      case "phone":
        if (!value) {
          error = true;
          message = "Phone number is required";
        } else if (!/^\d{10,11}$/.test(value)) {
          error = true;
          message = "Please enter a valid phone number (10-11 digits)";
        }
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = true;
          message = "Please enter a valid email address";
        }
        break;
      default:
        break;
    }

    return { error, message };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, username, password, phone, email } = employeeData;
    
    // Validate all fields
    const newValidationErrors = { ...validationErrors };
    let hasErrors = false;

    Object.keys(employeeData).forEach(field => {
      const validation = validateField(field, employeeData[field]);
      newValidationErrors[field] = validation;
      if (validation.error) hasErrors = true;
    });

    setValidationErrors(newValidationErrors);

    if (hasErrors) {
      return;
    }

    dispatch(createEmployee(employeeData, setOpen));
    setEmployeeData(initialEmployeeState);
    setValidationErrors(initialValidationState);
  };

  const handleChange = (field, value) => {
    setEmployeeData((prevFilters) => ({ ...prevFilters, [field]: value }));
    const validation = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: validation
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setEmployeeData(initialEmployeeState);
    setValidationErrors(initialValidationState);
  };

  return (
    <div>
      <Dialog
        scroll={scroll}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Add New Employee</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>Employee Detials</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">First Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={employeeData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    error={validationErrors.firstName.error}
                    helperText={validationErrors.firstName.message}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Last Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={employeeData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    error={validationErrors.lastName.error}
                    helperText={validationErrors.lastName.message}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">User Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={employeeData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    error={validationErrors.username.error}
                    helperText={validationErrors.username.message}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Email </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Optional"
                    value={employeeData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={validationErrors.email.error}
                    helperText={validationErrors.email.message}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Password </td>
                <td className="pb-4">
                  <TextField
                    type="password"
                    value={employeeData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    size="small"
                    fullWidth
                    error={validationErrors.password.error}
                    helperText={validationErrors.password.message}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Phone </td>
                <td className="pb-4">
                  <TextField
                    type="number"
                    size="small"
                    value={employeeData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    fullWidth
                    error={validationErrors.phone.error}
                    helperText={validationErrors.phone.message}
                  />
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            variant="contained"
            type="reset"
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            variant="contained"
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin">
            {isFetching ? 'Submitting...' : 'Submit'}
          </button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

export default CreateUser;
