import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  Select,
  Box,
  FormHelperText,
} from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import SearchBar from "material-ui-search-bar";
import "./Dashboard.css";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  gender: Yup.string().required("Gender is required"),
  status: Yup.string().required("Status is required"),
});

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://gorest.co.in/public/v2/users",
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        setError("Failed to fetch users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (value) => setSearchTerm(value);

  const handleSearchCancel = () => setSearchTerm("");

  const openDeleteConfirmation = (id) => {
    setUserToDelete(id);
    setOpenDeleteDialog(true);
  };

  const deleteUser = async () => {
    try {
      await axios.delete(
        `https://gorest.co.in/public/v2/users/${userToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}`,
          },
        }
      );
      setUsers(users.filter((user) => user.id !== userToDelete));
      setOpenDeleteDialog(false);
    } catch (error) {
      setError("Failed to delete user");
      console.error(error);
    }
  };

  const addUser = async (values) => {
    const newUser = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      gender: values.gender,
      status: values.status,
    };
    try {
      const response = await axios.post(
        "https://gorest.co.in/public/v2/users",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}`,
          },
        }
      );
      setUsers([...users, response.data]);
      setOpenAddDialog(false);
    } catch (error) {
      setError("Failed to add user");
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = () => setOpenAddDialog(true);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => setOpenEditDialog(false);

  const handleCloseAddDialog = () => setOpenAddDialog(false);

  const handleEditSubmit = async (values) => {
    const updatedUser = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      gender: values.gender,
      status: values.status,
    };
    try {
      const response = await axios.put(
        `https://gorest.co.in/public/v2/users/${currentUser.id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}`,
          },
        }
      );
      setUsers(
        users.map((user) => (user.id === currentUser.id ? response.data : user))
      );
      handleCloseEditDialog();
    } catch (error) {
      setError("Failed to update user");
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1 style={{ marginLeft: "30px" }}>Dashboard</h1>

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={4}>
          <Button
            style={{
              backgroundColor: "#C0C0C0",
              padding: "10px",
              marginLeft: "70px",
            }}
            onClick={handleClick}
          >
            Add New User
          </Button>
        </Grid>
        <Grid item xs={6}>
          <SearchBar
            className="searchBar"
            value={searchTerm}
            onChange={handleSearch}
            onCancelSearch={handleSearchCancel}
            style={{ marginLeft: "50" }}
          />
        </Grid>
      </Grid>

      <Paper sx={{ width: "90%", marginLeft: "50px", marginTop: "15px" }}>
        <TableContainer>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <CreateOutlinedIcon
                      onClick={() => handleEditClick(row)}
                      style={{ cursor: "pointer" }}
                    />
                    <DeleteOutlinedIcon
                      onClick={() => openDeleteConfirmation(row.id)}
                      style={{ cursor: "pointer", marginLeft: 8 }}
                    />
                    <EditNoteIcon
                      style={{ cursor: "pointer", marginLeft: 8 }}
                      onClick={() => navigate(`/posts/${row.id}`)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <Box p={2}>
          <DialogTitle>Add New User</DialogTitle>
          <Box mt={2}>
            <DialogContent>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  gender: "male",
                  status: "",
                }}
                validationSchema={validationSchema}
                onSubmit={addUser}
              >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormLabel>First Name</FormLabel>
                        <Field
                          as={TextField}
                          name="firstName"
                          fullWidth
                          error={touched.firstName && !!errors.firstName}
                          helperText={<ErrorMessage name="firstName" />}
                          sx={{
                            "& .MuiInputBase-input": { paddingLeft: "12px" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormLabel>Last Name</FormLabel>
                        <Field
                          as={TextField}
                          name="lastName"
                          fullWidth
                          error={touched.lastName && !!errors.lastName}
                          helperText={<ErrorMessage name="lastName" />}
                          sx={{
                            "& .MuiInputBase-input": { paddingLeft: "12px" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormLabel>Email</FormLabel>
                        <Field
                          as={TextField}
                          name="email"
                          type="email"
                          fullWidth
                          error={touched.email && !!errors.email}
                          helperText={<ErrorMessage name="email" />}
                          sx={{
                            "& .MuiInputBase-input": { paddingLeft: "12px" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl
                          component="fieldset"
                          error={touched.gender && !!errors.gender}
                          fullWidth
                        >
                          <FormLabel component="legend">Gender</FormLabel>
                          <Field
                            as={RadioGroup}
                            name="gender"
                            value={values.gender}
                            onChange={(event) =>
                              setFieldValue("gender", event.target.value)
                            }
                          >
                            <Grid container spacing={0}>
                              <Grid item>
                                <FormControlLabel
                                  value="male"
                                  control={<Radio />}
                                  label="Male"
                                />
                              </Grid>
                              <Grid item>
                                <FormControlLabel
                                  value="female"
                                  control={<Radio />}
                                  label="Female"
                                />
                              </Grid>
                              <Grid item>
                                <FormControlLabel
                                  value="other"
                                  control={<Radio />}
                                  label="Other"
                                />
                              </Grid>
                            </Grid>
                          </Field>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="field-error"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <FormLabel>Status</FormLabel>
                          <Field
                            as={Select}
                            name="status"
                            value={values.status}
                            onChange={(event) =>
                              setFieldValue("status", event.target.value)
                            }
                            fullWidth
                            sx={{
                              "& .MuiInputBase-input": { paddingLeft: "12px" },
                            }}
                          >
                            <MenuItem value="active" style={{ width: "100%" }}>
                              Active
                            </MenuItem>
                            <br />
                            <MenuItem
                              value="inactive"
                              style={{ width: "100%" }}
                            >
                              Inactive
                            </MenuItem>
                          </Field>
                          <FormHelperText>
                            <ErrorMessage name="status" />
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={6}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          style={{
                            backgroundColor: "#000000",
                            color: "#ffffff",
                            padding: "10px",
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          onClick={handleCloseAddDialog}
                          variant="outlined"
                          fullWidth
                          style={{
                            backgroundColor: "#C0C0C0",
                            color: "#000000",
                            borderColor: "red",
                            padding: "10px",
                          }}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Box>
        </Box>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <Box p={2}>
          <DialogTitle>Edit User</DialogTitle>
          <Box mt={2}>
            <DialogContent>
              <Formik
                initialValues={
                  currentUser
                    ? {
                        firstName: currentUser.name.split(" ")[0] || "",
                        lastName: currentUser.name.split(" ")[1] || "",
                        email: currentUser.email || "",
                        gender: currentUser.gender || "",
                        status: currentUser.status || "",
                      }
                    : {
                        firstName: "",
                        lastName: "",
                        email: "",
                        gender: "",
                        status: "",
                      }
                }
                validationSchema={validationSchema}
                onSubmit={handleEditSubmit}
              >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormLabel>First Name</FormLabel>
                        <Field
                          as={TextField}
                          name="firstName"
                          fullWidth
                          error={touched.firstName && !!errors.firstName}
                          helperText={<ErrorMessage name="firstName" />}
                          sx={{
                            "& .MuiInputBase-input": { paddingLeft: "12px" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormLabel>Last Name</FormLabel>
                        <Field
                          as={TextField}
                          name="lastName"
                          fullWidth
                          error={touched.lastName && !!errors.lastName}
                          helperText={<ErrorMessage name="lastName" />}
                          sx={{
                            "& .MuiInputBase-input": { paddingLeft: "12px" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormLabel>Email</FormLabel>
                        <Field
                          as={TextField}
                          name="email"
                          type="email"
                          fullWidth
                          error={touched.email && !!errors.email}
                          helperText={<ErrorMessage name="email" />}
                          sx={{
                            "& .MuiInputBase-input": { paddingLeft: "12px" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl
                          component="fieldset"
                          error={touched.gender && !!errors.gender}
                          fullWidth
                        >
                          <FormLabel component="legend">Gender</FormLabel>
                          <Field
                            as={RadioGroup}
                            name="gender"
                            value={values.gender}
                            onChange={(event) =>
                              setFieldValue("gender", event.target.value)
                            }
                            sx={{
                              "& .MuiInputBase-input": { paddingLeft: "12px" },
                            }}
                          >
                            <Grid
                              container
                              spacing={0}
                              sx={{
                                "& .MuiInputBase-input": {
                                  paddingLeft: "12px",
                                },
                              }}
                            >
                              <Grid item>
                                <FormControlLabel
                                  value="male"
                                  control={<Radio />}
                                  label="Male"
                                />
                              </Grid>
                              <Grid item>
                                <FormControlLabel
                                  value="female"
                                  control={<Radio />}
                                  label="Female"
                                />
                              </Grid>
                              <Grid item>
                                <FormControlLabel
                                  value="other"
                                  control={<Radio />}
                                  label="Other"
                                />
                              </Grid>
                            </Grid>
                          </Field>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="field-error"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <FormLabel>Status</FormLabel>
                          <Field
                            as={Select}
                            name="status"
                            value={values.status}
                            onChange={(event) =>
                              setFieldValue("status", event.target.value)
                            }
                            error={touched.status && !!errors.status}
                            sx={{
                              "& .MuiInputBase-input": { paddingLeft: "12px" },
                            }}
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </Field>
                          <FormHelperText>
                            <ErrorMessage name="status" />
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={6}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          style={{
                            backgroundColor: "#000000",
                            color: "#ffffff",
                            padding: "8px",
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          onClick={handleCloseEditDialog}
                          variant="outlined"
                          fullWidth
                          style={{
                            backgroundColor: "#C0C0C0",
                            color: "#ffffff",
                            borderColor: "#C0C0C0",
                            padding: "8px",
                          }}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Box>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog  */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogContent>
          <h3>Are you sure you want to delete this user?</h3>
        </DialogContent>
        <DialogActions style={{ marginTop: "-10px" }}>
          <Grid container spacing={2} p={2}>
            <Grid item xs={6}>
              <Button
                onClick={deleteUser}
                color="error"
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  padding: "8px",
                }}
              >
                Delete
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                variant="outlined"
                fullWidth
                style={{
                  backgroundColor: "#C0C0C0",
                  color: "#000000",
                  borderColor: "#C0C0C0",
                  padding: "8px",
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
