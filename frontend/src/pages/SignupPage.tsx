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
	MenuItem,
	FormControl,
	InputLabel,
	Select,
	LinearProgress,
	Link as MuiLink,
	SelectChangeEvent,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { UserRole } from "../models/models";

const SignupPage: React.FC = () => {
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [role, setRole] = useState<UserRole>("student");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);

	// Error states
	const [error, setError] = useState<string>("");
	const [firstNameError, setFirstNameError] = useState<string>("");
	const [lastNameError, setLastNameError] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");
	const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>("");

	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	// Password strength calculation
	const calculatePasswordStrength = (pwd: string): number => {
		let strength = 0;
		if (pwd.length >= 6) strength += 25;
		if (pwd.length >= 10) strength += 25;
		if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
		if (/\d/.test(pwd)) strength += 15;
		if (/[^a-zA-Z0-9]/.test(pwd)) strength += 10;
		return Math.min(strength, 100);
	};

	const getPasswordStrengthColor = (strength: number): string => {
		if (strength < 40) return "error";
		if (strength < 70) return "warning";
		return "success";
	};

	const getPasswordStrengthLabel = (strength: number): string => {
		if (strength === 0) return "";
		if (strength < 40) return "Weak";
		if (strength < 70) return "Medium";
		return "Strong";
	};

	const passwordStrength = calculatePasswordStrength(password);

	// Validation functions
	const validateFirstName = (name: string): boolean => {
		if (!name.trim()) {
			setFirstNameError("First name is required");
			return false;
		}
		if (name.trim().length < 2) {
			setFirstNameError("First name must be at least 2 characters");
			return false;
		}
		setFirstNameError("");
		return true;
	};

	const validateLastName = (name: string): boolean => {
		if (!name.trim()) {
			setLastNameError("Last name is required");
			return false;
		}
		if (name.trim().length < 2) {
			setLastNameError("Last name must be at least 2 characters");
			return false;
		}
		setLastNameError("");
		return true;
	};

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
		if (password.length < 6) {
			setPasswordError("Password must be at least 6 characters");
			return false;
		}
		setPasswordError("");
		return true;
	};

	const validateConfirmPassword = (
		confirmPwd: string,
		originalPwd: string,
	): boolean => {
		if (!confirmPwd) {
			setConfirmPasswordError("Please confirm your password");
			return false;
		}
		if (confirmPwd !== originalPwd) {
			setConfirmPasswordError("Passwords do not match");
			return false;
		}
		setConfirmPasswordError("");
		return true;
	};

	// Event handlers
	const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFirstName(e.target.value);
		if (firstNameError) {
			validateFirstName(e.target.value);
		}
	};

	const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLastName(e.target.value);
		if (lastNameError) {
			validateLastName(e.target.value);
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (emailError) {
			validateEmail(e.target.value);
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setPassword(newPassword);
		if (passwordError) {
			validatePassword(newPassword);
		}
		// Re-validate confirm password if it's already filled
		if (confirmPassword) {
			validateConfirmPassword(confirmPassword, newPassword);
		}
	};

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setConfirmPassword(e.target.value);
		if (confirmPasswordError) {
			validateConfirmPassword(e.target.value, password);
		}
	};

	const handleRoleChange = (event: SelectChangeEvent<UserRole>) => {
		setRole(event.target.value as UserRole);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		// Validate all inputs
		const isFirstNameValid = validateFirstName(firstName);
		const isLastNameValid = validateLastName(lastName);
		const isEmailValid = validateEmail(email);
		const isPasswordValid = validatePassword(password);
		const isConfirmPasswordValid = validateConfirmPassword(
			confirmPassword,
			password,
		);

		if (
			!isFirstNameValid ||
			!isLastNameValid ||
			!isEmailValid ||
			!isPasswordValid ||
			!isConfirmPasswordValid
		) {
			return;
		}

		setIsLoading(true);

		try {
			await AuthService.register({
				email,
				password,
				first_name: firstName.trim(),
				last_name: lastName.trim(),
				role,
			});

			setSuccessMessage(
				"Account created successfully! Redirecting to login...",
			);

			// Redirect to login after 2 seconds with success message
			navigate("/login", {
				state: { message: "Account created! Please log in." },
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setIsLoading(false);
		}
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
								Create Your Account
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									textAlign: "center",
									mb: 3,
								}}
							>
								Join Tremolo and start your musical journey
							</Typography>

							{error && (
								<Alert severity="error" sx={{ mb: 2 }}>
									{error}
								</Alert>
							)}

							{successMessage && (
								<Alert severity="success" sx={{ mb: 2 }}>
									{successMessage}
								</Alert>
							)}

							<Box component="form" onSubmit={handleSubmit} noValidate>
								<Box
									sx={{
										display: "flex",
										gap: 2,
										flexDirection: { xs: "column", sm: "row" },
										mb: 2,
									}}
								>
									<TextField
										fullWidth
										id="firstName"
										label="First Name"
										name="firstName"
										autoComplete="given-name"
										autoFocus
										value={firstName}
										onChange={handleFirstNameChange}
										onBlur={() => validateFirstName(firstName)}
										error={!!firstNameError}
										helperText={firstNameError}
										disabled={isLoading}
										required
									/>

									<TextField
										fullWidth
										id="lastName"
										label="Last Name"
										name="lastName"
										autoComplete="family-name"
										value={lastName}
										onChange={handleLastNameChange}
										onBlur={() => validateLastName(lastName)}
										error={!!lastNameError}
										helperText={lastNameError}
										disabled={isLoading}
										required
									/>
								</Box>

								<TextField
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									type="email"
									autoComplete="email"
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
									autoComplete="new-password"
									value={password}
									onChange={handlePasswordChange}
									onBlur={() => validatePassword(password)}
									error={!!passwordError}
									helperText={passwordError || "Minimum 6 characters"}
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
									sx={{ mb: 1 }}
								/>

								{password && (
									<Box sx={{ mb: 2 }}>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mb: 0.5,
											}}
										>
											<Typography variant="caption" color="text.secondary">
												Password Strength
											</Typography>
											<Typography
												variant="caption"
												color={`${getPasswordStrengthColor(passwordStrength)}.main`}
											>
												{getPasswordStrengthLabel(passwordStrength)}
											</Typography>
										</Box>
										<LinearProgress
											variant="determinate"
											value={passwordStrength}
											color={getPasswordStrengthColor(passwordStrength) as any}
											sx={{ height: 6, borderRadius: 1 }}
										/>
									</Box>
								)}

								<TextField
									fullWidth
									id="confirmPassword"
									label="Confirm Password"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									autoComplete="new-password"
									value={confirmPassword}
									onChange={handleConfirmPasswordChange}
									onBlur={() =>
										validateConfirmPassword(confirmPassword, password)
									}
									error={!!confirmPasswordError}
									helperText={confirmPasswordError}
									disabled={isLoading}
									required
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle confirm password visibility"
													onClick={handleClickShowConfirmPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end"
													disabled={isLoading}
												>
													{showConfirmPassword ? (
														<VisibilityOff />
													) : (
														<Visibility />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
									sx={{ mb: 2 }}
								/>

								<FormControl fullWidth sx={{ mb: 3 }}>
									<InputLabel id="role-label">I am a...</InputLabel>
									<Select
										labelId="role-label"
										id="role"
										value={role}
										label="I am a..."
										onChange={handleRoleChange}
										disabled={isLoading}
									>
										<MenuItem value="student">Student</MenuItem>
										<MenuItem value="teacher">Teacher</MenuItem>
										<MenuItem value="parent">Parent</MenuItem>
									</Select>
								</FormControl>

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
										"Create Account"
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
						Already have an account?{" "}
						<MuiLink
							component={Link}
							to="/login"
							sx={{
								textDecoration: "none",
								fontWeight: 600,
								"&:hover": {
									textDecoration: "underline",
								},
							}}
						>
							Login
						</MuiLink>
					</Typography>
				</Box>
			</Container>
		</Fade>
	);
};

export default SignupPage;
