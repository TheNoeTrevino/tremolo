import React, { useState, useEffect } from "react";
import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Typography,
	Alert,
	Container,
	InputAdornment,
	IconButton,
	CircularProgress,
	Fade,
	Link as MuiLink,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>("");

	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	// Check for success message from signup
	useEffect(() => {
		if (location.state?.message) {
			setSuccessMessage(location.state.message);
			// Clear the message from location state
			window.history.replaceState({}, document.title);
		}
	}, [location]);

	const validateEmail = (email: string): boolean => {
		if (!email) {
			setEmailError("Email is required");
			return false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address");
			return false;
		}
		setEmailError("");
		return true;
	};

	const validatePassword = (password: string): boolean => {
		if (!password) {
			setPasswordError("Password is required");
			return false;
		}
		setPasswordError("");
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate inputs
		const isEmailValid = validateEmail(email);
		const isPasswordValid = validatePassword(password);

		if (!isEmailValid || !isPasswordValid) {
			return;
		}

		setIsLoading(true);

		try {
			await login(email, password);
			// Navigate will happen automatically via useEffect when isAuthenticated changes
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (emailError) {
			validateEmail(e.target.value);
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		if (passwordError) {
			validatePassword(e.target.value);
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
	};

	return (
		<Fade in={true} timeout={500}>
			<Container maxWidth="sm">
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "80vh",
						py: { xs: 2, sm: 4 },
					}}
				>
					<Card
						sx={{
							width: "100%",
							maxWidth: 500,
						}}
					>
						<CardContent
							sx={{
								p: { xs: 3, sm: 4 },
							}}
						>
							<Typography
								variant="h4"
								component="h1"
								gutterBottom
								sx={{
									textAlign: "center",
									fontWeight: 600,
									mb: 1,
								}}
							>
								Welcome to Tremolo
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									textAlign: "center",
									mb: 3,
								}}
							>
								Sign in to continue your musical journey
							</Typography>

							{successMessage && (
								<Alert severity="success" sx={{ mb: 2 }}>
									{successMessage}
								</Alert>
							)}

							{error && (
								<Alert severity="error" sx={{ mb: 2 }}>
									{error}
								</Alert>
							)}

							<Box component="form" onSubmit={handleSubmit} noValidate>
								<TextField
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									type="email"
									autoComplete="email"
									autoFocus
									value={email}
									onChange={handleEmailChange}
									onBlur={() => validateEmail(email)}
									error={!!emailError}
									helperText={emailError}
									disabled={isLoading}
									sx={{ mb: 2 }}
									required
								/>

								<TextField
									fullWidth
									id="password"
									label="Password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									value={password}
									onChange={handlePasswordChange}
									onBlur={() => validatePassword(password)}
									error={!!passwordError}
									helperText={passwordError}
									disabled={isLoading}
									required
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end"
													disabled={isLoading}
												>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
									sx={{ mb: 3 }}
								/>

								<Button
									type="submit"
									fullWidth
									variant="contained"
									size="large"
									disabled={isLoading}
									sx={{
										height: 48,
										position: "relative",
									}}
								>
									{isLoading ? (
										<CircularProgress size={24} color="inherit" />
									) : (
										"Sign In"
									)}
								</Button>
							</Box>
						</CardContent>
					</Card>

					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 2, textAlign: "center" }}
					>
						Don't have an account?{" "}
						<MuiLink
							component={Link}
							to="/signup"
							sx={{
								textDecoration: "none",
								fontWeight: 600,
								"&:hover": {
									textDecoration: "underline",
								},
							}}
						>
							Sign up
						</MuiLink>
					</Typography>
				</Box>
			</Container>
		</Fade>
	);
};

export default LoginPage;
