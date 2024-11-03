// auth.selectors.ts
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from './auth.state';

const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(selectAuthState, (state: AuthState) => state.isLoggedIn);

export const selectLoggedUser = createSelector(selectAuthState, (state: AuthState) => state.user);

export const selectUserLastUrl = createSelector(selectAuthState, (state: AuthState) => state.user.lastUrl);

export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error);

export const selectCurrentUser = createSelector(selectAuthState, (state: AuthState) => state.user);

export const selectCurrentUserToken = createSelector(selectCurrentUser, (user) => (user ? user.accessToken : null));
