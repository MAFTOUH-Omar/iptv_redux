import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type { RootState } from '../store';
import { Template, TemplateState } from '../../types/templateTypes';
import { generateFirstPartyHeaders } from '../../utils/apiUtils';

const initialState: TemplateState = {
    items: [],
    selectedTemplate: null,
    loading: false,
    error: null,
};

export const fetchTemplates = createAsyncThunk(
    'templates/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: { token: string } };
            const path = '/templates';

            const headers = await generateFirstPartyHeaders(path);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${path}`,
                {
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            return response.data.data;
        } catch (err) {
            const error = err as AxiosError;
            return rejectWithValue(
                error.message || 'Failed to fetch templates'
            );
        }
    }
);

export const fetchTemplateById = createAsyncThunk(
    'templates/fetchById',
    async (id: number, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: { token: string } };
            const path = `/templates/${id}`;

            const headers = await generateFirstPartyHeaders(path);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${path}`,
                {
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            return rejectWithValue(
                error.message || `Failed to fetch template with id ${id}`
            );
        }
    }
);

export const fetchBouquetsByTemplateId = createAsyncThunk(
    'templates/fetchBouquetsById',
    async ({ id, type }: { id: number; type: string }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: { token: string } };
            const path = `/templates/${id}/bouquets`;

            const headers = await generateFirstPartyHeaders(path);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${path}?filters[type]=${type}`,
                {
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            return response.data.data;
        } catch (err) {
            const error = err as AxiosError;
            return rejectWithValue(
                error.message || `Failed to fetch bouquets for template with id ${id} and type ${type}`
            );
        }
    }
);

const templateSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        clearSelectedTemplate: (state) => {
            state.selectedTemplate = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all templates
            .addCase(fetchTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch single template
            .addCase(fetchTemplateById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplateById.fulfilled, (state, action) => {
                state.selectedTemplate = action.payload;
                state.loading = false;
            })
            .addCase(fetchTemplateById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch bouquets by template ID and type
            .addCase(fetchBouquetsByTemplateId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBouquetsByTemplateId.fulfilled, (state, action) => {
                if (!state.selectedTemplate) {
                    state.selectedTemplate = { bouquets: action.payload } as Template;
                } else {
                    state.selectedTemplate = {
                        ...state.selectedTemplate,
                        bouquets: action.payload,
                    };
                }
                state.loading = false;
            })
            .addCase(fetchBouquetsByTemplateId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// Selectors
export const selectTemplates = (state: RootState) => state.templates.items;
export const selectSelectedTemplate = (state: RootState) => state.templates.selectedTemplate;

// Memoized selectors
export const selectGlobalTemplates = createSelector(
    selectTemplates,
    (templates) => templates.filter((template) => template.is_global)
);

export const selectBouquetsByTemplateType = createSelector(
    [selectSelectedTemplate, (state: RootState, type: string) => type],
    (selectedTemplate, type) => {
        if (selectedTemplate && selectedTemplate.bouquets) {
            return selectedTemplate.bouquets.filter((bouquet) => bouquet.type === type);
        }
        return [];
    }
);

export const { clearSelectedTemplate } = templateSlice.actions;
export default templateSlice.reducer;