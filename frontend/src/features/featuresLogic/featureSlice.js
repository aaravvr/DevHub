import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import featureService from './featureService';

const initialState = {
  features: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Create feature
export const createFeature = createAsyncThunk(
  'features/create',
  async (featureData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await featureService.createFeature(featureData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'Feature creation failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Feature
export const deleteFeature = createAsyncThunk(
  'features/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await featureService.deleteFeature(id, token);
      return response.id;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || 'Feature deletion failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark Feature Completed
export const markFeatureCompleted = createAsyncThunk(
  'features/complete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await featureService.markFeatureCompleted(id, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || 'Failed to complete';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const featureSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFeature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.features.push(action.payload);
      })
      .addCase(createFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteFeature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.features = state.features.filter(f => f._id !== action.payload);
      })
      .addCase(deleteFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markFeatureCompleted.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markFeatureCompleted.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updated = action.payload;
        state.features = state.features.map(f => f._id === updated._id ? updated : f);
      })
      .addCase(markFeatureCompleted.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = featureSlice.actions;
export default featureSlice.reducer;
