import { AppActionTypes } from './app.actions';
import { AppState } from './app.state';

const initialState: AppState = {
  currentUser: null, // Başlangıçta kullanıcı bilgisi yok
  lastUrl: null, // Başlangıç değeri,
};

export function appStateReducer(state: AppState = initialState, action: any): AppState {
  switch (action.type) {
    case AppActionTypes.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };
    case AppActionTypes.SET_LAST_URL: // URL'yi güncelle
      return { ...state, lastUrl: action.payload };
    default:
      return state;
  }
}
