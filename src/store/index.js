import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import adminReducer from "./admin/adminSlice";
import applicationReducer from "./application/applicationSlice";
import environmentReducer from "./environment/environmentSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        application: applicationReducer,
        environment: environmentReducer,
        user: userReducer,
    },
});
