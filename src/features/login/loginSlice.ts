import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {AppUser} from "../../types/AppUser";

// Definice slice typu
interface LoginState {
    value: AppUser | undefined
}

// Definice výchozího stavu
const initialState: LoginState = {
    value: undefined
}

// Zdroj: https://redux.js.org/tutorials/essentials/part-2-app-structure
// Slice je sbírka logiky reduxu a akcí pro jednu funkci v aplikaci.
// Název pochází z rozdělení kořenového objektu stavu Redux na více dílů „slice“ stavu.
export const loginSlice = createSlice({
    name: 'login',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setLogin: (state, action: PayloadAction<AppUser | undefined>) => {
            state.value = action.payload
            localStorage.setItem('appUser', `${action.payload}`);
        },
        setLogout: (state, action: PayloadAction<AppUser | undefined>) => {
            state.value = action.payload
            localStorage.removeItem('appUser');
        },
    },
})

export const { setLogin, setLogout } = loginSlice.actions;

export default loginSlice.reducer;