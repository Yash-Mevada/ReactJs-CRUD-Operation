import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Box, FormLabel } from "@mui/material";
import { ErrorMessage } from "formik";
import "./Login.css"; // Import the CSS file

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = ({ setLoggedInUser }) => {
  const navigate = useNavigate();

  const handleSubmit = (values, { setErrors }) => {
    const { email, password } = values;

    const user = localStorage.getItem(email);
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.password === password) {
        localStorage.setItem("loggedInUser", JSON.stringify(parsedUser));
        setLoggedInUser(parsedUser);
        navigate("/dashboard");
      } else {
        setErrors({ password: "Invalid credentials" });
      }
    } else {
      setErrors({ email: "User not found" });
    }
  };

  return (
    <Box className="login-container" sx={{ marginTop: "-20%" }}>
      <h3 style={{ marginLeft: "-25px" }}>SignIn</h3>
      <h5 style={{ marginLeft: "-25px", color: "#C0C0C0" }}>
        Please enter the below details to sign in to your account
      </h5>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, handleBlur, values }) => (
          <Form className="login-form">
            <FormLabel>Email</FormLabel>
            <Field
              name="email"
              as={TextField}
              variant="outlined"
              fullWidth
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="login-field"
              helperText={
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{ color: "red" }}
                />
              }
            />
            <FormLabel></FormLabel>
            <Field
              name="password"
              as={TextField}
              type="password"
              variant="outlined"
              fullWidth
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="login-field"
              helperText={
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red" }}
                />
              }
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="login-button"
              disabled={isSubmitting}
              sx={{ backgroundColor: "black" }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <h5 style={{ marginLeft: "80px" }}>
              Don't have an account ? <Link to="/signup">Sign up</Link>
            </h5>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
