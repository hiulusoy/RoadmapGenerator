// auth.reducer.ts
import { AuthState, initialAuthState } from './auth.state';
import { AuthActionTypes, CustomAction } from './auth.actions';

export function authReducer(state: AuthState = initialAuthState, action: CustomAction): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, isLoggedIn: false, user: null, error: null };
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        error: null,
      };
    case AuthActionTypes.LOGIN_FAILURE:
      return { ...state, isLoggedIn: false, user: null, error: action.payload.error };
    case AuthActionTypes.LOGOUT:
      return { ...initialAuthState };
    case AuthActionTypes.SET_LAST_URL:
      return {
        ...state,
        user: {
          ...state.user,
          lastUrl: action.payload.url,
        },
      };
    default:
      return state;
  }
}
