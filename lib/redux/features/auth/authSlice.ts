import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = {
  token: null,
  user: null,
  resetEmail: null,
  otpVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string }>
    ) => {
      state.token = action.payload.token;
    },
    setUser: (
      state,
      action: PayloadAction<AuthState["user"]>
    ) => {
      state.user = action.payload;
    },
    setResetEmail: (state, action: PayloadAction<string>) => {
      state.resetEmail = action.payload;
      state.otpVerified = false;
    },
    setOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.otpVerified = action.payload;
    },
    clearResetFlow: (state) => {
      state.resetEmail = null;
      state.otpVerified = false;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.resetEmail = null;
      state.otpVerified = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const {
  setCredentials,
  setUser,
  setResetEmail,
  setOtpVerified,
  clearResetFlow,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
