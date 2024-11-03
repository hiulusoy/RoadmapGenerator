// app.selectors.ts
import {createSelector} from '@ngrx/store';
import {AppState} from './app.state';

export const selectCurrentUser = createSelector(
    (state: AppState) => state.currentUser,
    (currentUser) => currentUser
);


export const selectLastUrl = createSelector(
    (state: AppState) => state.lastUrl,
    (lastUrl) => lastUrl
);
