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
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const AuthService = {
	async login(email: string, password: string): Promise<LoginResponse> {
		try {
			const loginData: LoginRequest = { email, password };
			const response = await axios.post<LoginResponse>(
				`${baseUrl}/api/auth/login`,
				loginData,
			);

			if (response.data.access_token && response.data.refresh_token) {
				localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token);
				localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
			}
			console.log(response.data);

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<AuthError>;
				throw new Error(
					axiosError.response?.data?.error || "Login failed. Please try again.",
				);
			}
			console.log(error);
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
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	},

	getToken(): string | null {
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	},

	getRefreshToken(): string | null {
		return localStorage.getItem(REFRESH_TOKEN_KEY);
	},

	async refreshAccessToken(): Promise<string> {
		const refreshToken = this.getRefreshToken();
		if (!refreshToken) {
			throw new Error("No refresh token available");
		}

		try {
			const response = await axios.post<{ access_token: string }>(
				`${baseUrl}/api/auth/refresh`,
				{ refresh_token: refreshToken },
			);

			const newAccessToken = response.data.access_token;
			localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

			return newAccessToken;
		} catch (error) {
			// If refresh fails, logout and redirect to login
			this.logout();
			throw new Error("Session expired. Please login again.");
		}
	},

	isAuthenticated(): boolean {
		return !!this.getToken();
	},
};

// Setup axios interceptor for automatic token refresh
axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If 401 error and haven't already retried this request
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Try to refresh the access token
				const newAccessToken = await AuthService.refreshAccessToken();

				// Update the failed request with new token
				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

				// Retry the original request with new token
				return axios(originalRequest);
			} catch (refreshError) {
				// Refresh failed - logout and redirect to login
				AuthService.logout();
				// TODO: there must be a better way to do this with react-router
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);
