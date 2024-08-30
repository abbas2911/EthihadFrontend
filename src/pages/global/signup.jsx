import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const defaultTheme = createTheme();

const countries = [
  { code: 'AE', name: 'United Arab Emirates', dial_code: '+971' },
  { code: 'IN', name: 'India', dial_code: '+91' },
  { code: 'US', name: 'United States', dial_code: '+1' },
];

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '+971'
  });

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));

    if (name === 'password') {
      const strength = zxcvbn(value);
      setPasswordStrength(strength.score);
    }
  };

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Average';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { firstName, lastName, username, email, phone, password, confirmPassword, country } = form;

    if (!firstName || !lastName || !username || !email || !phone || !password || !confirmPassword || !country) {
      setAlertMessage('Please fill all fields');
      setOpen(true);
      return;
    }

    if (!email.includes('@') || !email.includes('.com')) {
      setAlertMessage('Invalid email');
      setOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match');
      setOpen(true);
      return;
    }

    if (passwordStrength < 2) {
      setAlertMessage('Password is too weak');
      setOpen(true);
      return;
    }

    try {
      const formData = { ...form, role: 'parent' };
      const response = await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/signup', formData);
      
      console.log(response.data);
      setAlertMessage('Sign up successful');
      setAlertSeverity('success');
      setOpen(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.data && error.response.data.message === 'Username already exists') {
        setAlertMessage('Username already exists');
      } else {
        setAlertMessage('Registration failed');
      }
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={form.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    id="country"
                    name="country"
                    value={form.country}
                    label="Country"
                    onChange={handleChange}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.dial_code}>
                        {country.name} ({country.dial_code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  helperText={passwordStrength !== null && `Password strength: ${getPasswordStrengthLabel(passwordStrength)}`}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="Password"
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
  </Container>
  <Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
  <MuiAlert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
    {alertMessage}
  </MuiAlert>
</Snackbar>
</ThemeProvider>
);
};

export default SignUp;