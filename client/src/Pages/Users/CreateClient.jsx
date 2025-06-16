import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClient } from "../../redux/action/user";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateClient = ({ open, setOpen, scroll }) => {
  //////////////////////////////////////// VARIABLES /////////////////////////////////////
  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initialClientState = {
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
  }

  const initialValidationState = {
    firstName: { error: false, message: "" },
    lastName: { error: false, message: "" },
    username: { error: false, message: "" },
    phone: { error: false, message: "" },
    email: { error: false, message: "" },
  }

  //////////////////////////////////////// STATES /////////////////////////////////////
  const [clientData, setClientData] = useState(initialClientState);
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

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
    const { firstName, lastName, username, phone, email } = clientData;
    
    // Validate all fields
    const newValidationErrors = { ...validationErrors };
    let hasErrors = false;

    Object.keys(clientData).forEach(field => {
      const validation = validateField(field, clientData[field]);
      newValidationErrors[field] = validation;
      if (validation.error) hasErrors = true;
    });

    setValidationErrors(newValidationErrors);

    if (hasErrors) {
      return;
    }

    dispatch(createClient(clientData, setOpen));
    setClientData(initialClientState);
    setValidationErrors(initialValidationState);
  };

  const handleChange = (field, value) => {
    setClientData((prevFilters) => ({ ...prevFilters, [field]: value }));
    const validation = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: validation
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setClientData(initialClientState);
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
          <div className="text-sky-400 font-primary">Add New Client</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>Client Details</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">First Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={clientData.firstName}
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
                    value={clientData.lastName}
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
                    value={clientData.username}
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
                    value={clientData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={validationErrors.email.error}
                    helperText={validationErrors.email.message}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Phone </td>
                <td className="pb-4">
                  <TextField
                    type="number"
                    size="small"
                    value={clientData.phone}
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

export default CreateClient; 