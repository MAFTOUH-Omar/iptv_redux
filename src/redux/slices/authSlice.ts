import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthState, LoginCredentials } from '../../types/authTypes';

const initialState: AuthState = {
    user: null,
    permissions: [],
    token: Cookies.get('token') || null,
    isAuthenticated: !!Cookies.get('token'),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials) => {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('client_id', '1');
        formData.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        formData.append('scope', import.meta.env.VITE_SCOPE);

        const response = await axios.post(
            `${import.meta.env.VITE_API_URL_AUTH}/oauth/token`,
            formData.toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const { access_token } = response.data;
        Cookies.set('token', access_token);
        return access_token;
    }
);

export const fetchUserData = createAsyncThunk(
    'auth/fetchUserData',
    async (_, { getState }) => {
        const { auth } = getState() as { auth: AuthState };
        const token = auth.token;

        const userResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/me`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const permissionsResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/${userResponse.data.id}/permissions`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        return {
            user: userResponse.data,
            permissions: permissionsResponse.data
        };
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.permissions = [];
            state.token = null;
            state.isAuthenticated = false;
            Cookies.remove('token');
        },
    },
    extraReducers: (builder) => {
        builder
        // Login
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Une erreur est survenue';
        })
        // Fetch user data
        .addCase(fetchUserData.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.permissions = action.payload.permissions;
            state.loading = false;
        })
        .addCase(fetchUserData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Erreur lors de la récupération des données';
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;