import axios, { AxiosError } from "axios";
import {
	LoginRequest,
	LoginResponse,
	User,
	AuthError,
	RegisterRequest,
	RegisterResponse,
} from "../models/models";

const baseUrl = import.meta.env.VITE_BACKEND_MAIN;
const TOKEN_KEY = "auth_token";

export const AuthService = {
	async login(email: string, password: string): Promise<LoginResponse> {
		try {
			const loginData: LoginRequest = { email, password };
			const response = await axios.post<LoginResponse>(
				`${baseUrl}/api/auth/login`,
				loginData,
			);

			if (response.data.token) {
				localStorage.setItem(TOKEN_KEY, response.data.token);
			}

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<AuthError>;
				throw new Error(
					axiosError.response?.data?.error || "Login failed. Please try again.",
				);
			}
			throw new Error("An unexpected error occurred during login.");
		}
	},

	async getCurrentUser(): Promise<User> {
		try {
			const token = this.getToken();
			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get<User>(`${baseUrl}/api/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			this.logout();

			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<AuthError>;
				throw new Error(
					axiosError.response?.data?.error ||
						"Failed to fetch user data. Please login again.",
				);
			}
			throw new Error("An unexpected error occurred.");
		}
	},

	// TODO: can we make the user login right after?
	async register(userData: RegisterRequest): Promise<RegisterResponse> {
		try {
			const response = await axios.post<RegisterResponse>(
				`${baseUrl}/api/auth/register`,
				userData,
			);

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<AuthError>;
				throw new Error(
					axiosError.response?.data?.error ||
						"Registration failed. Please try again.",
				);
			}
			throw new Error("An unexpected error occurred during registration.");
		}
	},

	// helper methods
	logout(): void {
		localStorage.removeItem(TOKEN_KEY);
	},

	getToken(): string | null {
		return localStorage.getItem(TOKEN_KEY);
	},

	isAuthenticated(): boolean {
		return !!this.getToken();
	},
};
