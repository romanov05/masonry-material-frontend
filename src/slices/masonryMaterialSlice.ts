import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { api } from '../api';
import type { RootState } from '../store';
import type { MasonryMaterial } from '../modules/masonry-material-types';
import {
  getMasonryMaterialMockFeedItem,
  getMasonryMaterialMockList,
} from '../modules/masonry-material-mock-api';
import { MASONRY_MATERIAL_MAX_CONSUMPTION } from '../modules/masonry-material-defaults';

interface MasonryMaterialState {
  maxConsumption: number; // фильтр плитки: расход до, шт./м³
  materials: MasonryMaterial[]; // плитка
  feedItem: MasonryMaterial | null; // лента
  draft: MasonryMaterial | null; // черновик текущего пользователя
  loading: boolean; // идёт запрос — кнопки заблокированы
}

const initialState: MasonryMaterialState = {
  maxConsumption: MASONRY_MATERIAL_MAX_CONSUMPTION,
  materials: [],
  feedItem: null,
  draft: null,
  loading: false,
};

// rejectValue — HTTP-код ответа, 0 — ответа нет
const createMasonryMaterialThunk = createAsyncThunk.withTypes<{
  state: RootState;
  rejectValue: number;
}>();

const getMasonryMaterialErrorStatus = (error: unknown): number =>
  isAxiosError(error) ? (error.response?.status ?? 0) : 0;

// веб-сервис недоступен: нет ответа или ошибка прокси/сервера
const isMasonryMaterialServiceUnavailable = (status: number) => status === 0 || status >= 500;

export const getMasonryMaterialList = createMasonryMaterialThunk(
  'masonryMaterial/getList',
  async (_: void, { getState, rejectWithValue }) => {
    const { masonryMaterial, masonryMaterialUser } = getState();
    try {
      const response = await api.masonryMaterials.getList({
        maxConsumption: masonryMaterial.maxConsumption,
      });
      return response.data;
    } catch (error) {
      const status = getMasonryMaterialErrorStatus(error);
      if (!masonryMaterialUser.isAuthenticated && isMasonryMaterialServiceUnavailable(status)) {
        return getMasonryMaterialMockList(masonryMaterial.maxConsumption);
      }
      return rejectWithValue(status);
    }
  },
);

export const getMasonryMaterialFeedItem = createMasonryMaterialThunk(
  'masonryMaterial/getFeed',
  async (
    { id, next }: { id?: number; next: boolean },
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await api.masonryMaterials.getFeed({ id, next: next || undefined });
      return response.data;
    } catch (error) {
      const status = getMasonryMaterialErrorStatus(error);
      if (
        !getState().masonryMaterialUser.isAuthenticated &&
        isMasonryMaterialServiceUnavailable(status)
      ) {
        return getMasonryMaterialMockFeedItem(id, next);
      }
      return rejectWithValue(status);
    }
  },
);

export const getMasonryMaterialDraft = createMasonryMaterialThunk(
  'masonryMaterial/getDraft',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await api.masonryMaterials.getDraft();
      return response.data;
    } catch (error) {
      const status = getMasonryMaterialErrorStatus(error);
      if (status === 404) {
        return null; // черновика нет — шаг 1
      }
      return rejectWithValue(status);
    }
  },
);

export const createMasonryMaterialDraft = createMasonryMaterialThunk(
  'masonryMaterial/create',
  async (
    data: { name: string; image: File; video: File },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.masonryMaterials.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getMasonryMaterialErrorStatus(error));
    }
  },
);

export const publishMasonryMaterial = createMasonryMaterialThunk(
  'masonryMaterial/publish',
  async (
    {
      id,
      ...data
    }: { id: number; shortDescription: string; mortarPerM3: number; consumptionPerM3: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.masonryMaterials.publish(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getMasonryMaterialErrorStatus(error));
    }
  },
);

export const deleteMasonryMaterial = createMasonryMaterialThunk(
  'masonryMaterial/remove',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.masonryMaterials.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(getMasonryMaterialErrorStatus(error));
    }
  },
);

export const setMasonryMaterialLike = createMasonryMaterialThunk(
  'masonryMaterial/setLike',
  async ({ id, value }: { id: number; value: 0 | 1 }, { rejectWithValue }) => {
    try {
      const response = await api.masonryMaterials.setLike(id, { value });
      return response.data;
    } catch (error) {
      return rejectWithValue(getMasonryMaterialErrorStatus(error));
    }
  },
);

const masonryMaterialThunks = [
  getMasonryMaterialList,
  getMasonryMaterialFeedItem,
  getMasonryMaterialDraft,
  createMasonryMaterialDraft,
  publishMasonryMaterial,
  deleteMasonryMaterial,
  setMasonryMaterialLike,
] as const;

const masonryMaterialSlice = createSlice({
  name: 'masonryMaterial',
  initialState,
  reducers: {
    setMasonryMaterialMaxConsumption(state, action: PayloadAction<number>) {
      state.maxConsumption = action.payload;
    },
    resetMasonryMaterialFilter(state) {
      state.maxConsumption = MASONRY_MATERIAL_MAX_CONSUMPTION;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMasonryMaterialList.fulfilled, (state, action) => {
        state.materials = action.payload;
      })
      .addCase(getMasonryMaterialFeedItem.fulfilled, (state, action) => {
        state.feedItem = action.payload;
      })
      .addCase(getMasonryMaterialFeedItem.rejected, (state) => {
        state.feedItem = null;
      })
      .addCase(getMasonryMaterialDraft.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(createMasonryMaterialDraft.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(publishMasonryMaterial.fulfilled, (state) => {
        state.draft = null;
      })
      .addCase(deleteMasonryMaterial.fulfilled, (state, action) => {
        state.materials = state.materials.filter((material) => material.id !== action.payload);
      })
      .addCase(setMasonryMaterialLike.fulfilled, (state, action) => {
        const material = action.payload;
        if (state.feedItem?.id === material.id) {
          state.feedItem = material;
        }
        state.materials = state.materials.map((item) => (item.id === material.id ? material : item));
      })
      .addMatcher(isPending(...masonryMaterialThunks), (state) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(...masonryMaterialThunks), (state) => {
        state.loading = false;
      })
      .addMatcher(isRejected(...masonryMaterialThunks), (state) => {
        state.loading = false;
      });
  },
});

export const { setMasonryMaterialMaxConsumption, resetMasonryMaterialFilter } =
  masonryMaterialSlice.actions;
export default masonryMaterialSlice.reducer;
