import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type { RootState } from '../store';
import { Package, PackageState } from '../../types/packageTypes';
import { generateFirstPartyHeaders } from '../../utils/apiUtils';

const initialState: PackageState = {
    items: [],
    selectedPackage: null,
    loading: false,
    error: null
};

export const fetchPackages = createAsyncThunk(
    'packages/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: { token: string } };
            const path = '/packages';
            
            const headers = await generateFirstPartyHeaders(path);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${path}?per_page=100`,
                { 
                    headers: {
                        ...headers,
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            );

            return response.data.data;
        } catch (err) {
            const error = err as AxiosError;
            return rejectWithValue(
                error.message || 
                'Failed to fetch packages'
            );
        }
    }
);

export const fetchPackageById = createAsyncThunk(
    'packages/fetchById',
    async (id: number, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: { token: string } };
            const path = `/packages/${id}`;
            
            const headers = await generateFirstPartyHeaders(path);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${path}`,
                { 
                    headers: {
                        ...headers,
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            );

            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            return rejectWithValue(
                error.message || 
                `Failed to fetch package with id ${id}`
            );
        }
    }
);

export const fetchBouquetPackageById = createAsyncThunk(
    'packages/fetchBouquetById',
    async ({ id, type }: { id: number; type: string }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: { token: string } };
            const path = `/packages/${id}/bouquets`;
            
            const headers = await generateFirstPartyHeaders(path);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${path}?filters[type]=${type}`,
                { 
                    headers: {
                        ...headers,
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            );

            return response.data.data;
        } catch (err) {
            const error = err as AxiosError;
            return rejectWithValue(
                error.message || 
                `Failed to fetch bouquets for package with id ${id} and type ${type}`
            );
        }
    }
);

const packageSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {
        clearSelectedPackage: (state) => {
            state.selectedPackage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all packages
            .addCase(fetchPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch single package
            .addCase(fetchPackageById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackageById.fulfilled, (state, action) => {
                state.selectedPackage = action.payload;
                state.loading = false;
            })
            .addCase(fetchPackageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch bouquets by package ID and type
            .addCase(fetchBouquetPackageById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBouquetPackageById.fulfilled, (state, action) => {
                if (!state.selectedPackage) {
                    state.selectedPackage = { bouquets: action.payload } as Package;
                } else {
                    state.selectedPackage = {
                        ...state.selectedPackage,
                        bouquets: action.payload,
                    };
                }
                state.loading = false;
            })
            .addCase(fetchBouquetPackageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

// Selectors
export const selectPackages = (state: RootState) => state.packages.items;
export const selectSelectedPackage = (state: RootState) => state.packages.selectedPackage;

// Memoized selectors
export const selectTrialPackages = createSelector(
    selectPackages,
    (packages) => packages.filter(pkg => pkg.is_trial)
);

export const selectPackagesByPeriodType = createSelector(
    [selectPackages, (periodType: string) => periodType],
    (packages, periodType) => packages.filter(pkg => pkg.period_type === periodType)
);

export const selectBouquetsByType = createSelector(
    [selectSelectedPackage, (state: RootState, type: string) => type],
    (selectedPackage, type) => {
        if (selectedPackage && selectedPackage.bouquets) {
            return selectedPackage.bouquets.filter(bouquet => bouquet.type === type);
        }
        return [];
    }
);

export const { clearSelectedPackage } = packageSlice.actions;
export default packageSlice.reducer;