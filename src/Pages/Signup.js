import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  InputLabel,
} from "@mui/material";
import "./Signup.css"; 
import { useNavigate } from "react-router-dom";
const Signup = () => {

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      subscribe: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      localStorage.setItem(values.email, JSON.stringify(values));
      navigate("/login");
      console.log("Form Submitted:", values);
    },
  });

  return (
    <div className="signup-form-container">
      <h2>Sign Up</h2>
      <p>
        Enjoy the great benefits and exclusive offers by creating your account.
      </p>
      <form onSubmit={formik.handleSubmit} className="signup-form">
        <lable>First Name</lable>
        <TextField
          fullWidth
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
          margin="normal"
        />
        <lable>Last Name</lable>
        <TextField
          fullWidth
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
          margin="normal"
        />
        <lable>Email</lable>
        <TextField
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        <InputLabel>Password</InputLabel>
        <TextField
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="subscribe"
              checked={formik.values.subscribe}
              onChange={formik.handleChange}
            />
          }
          label="Subscribe to news and updates."
        />
        <p>
          By clicking Sign Up, you agree to our{" "}
          <a href="#">Terms and Conditions</a> and{" "}
          <a href="#">Privacy Statement</a>.
        </p>
        <Button variant="contained" type="submit">
          Sign Up
        </Button>
      </form>
      <p>
        Already have an account? <a href="/login">Sign In</a>
      </p>
    </div>
  );
};

export default Signup;
