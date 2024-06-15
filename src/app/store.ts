import {configureStore} from '@reduxjs/toolkit';

import {UserApi} from '../service/users/UserApi';

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([UserApi.middleware]),
});
