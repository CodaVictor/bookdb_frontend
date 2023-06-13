import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Author} from "../../types/Author";

// Definice výchozího stavu
const initialState: Author[] = [];

export const authorSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        addAuthor: (authors, action: PayloadAction<Author>) => {
            return [...authors, action.payload]
        },
        removeAuthor: (authors, action: PayloadAction<Author>) => {
            return authors.filter((authorItem : Author) => {
                if(authorItem.id !== action.payload.id) {
                    return authorItem;
                }
            });
        },
        updateAuthor: (authors, action: PayloadAction<Author>) => {
            return authors.map((authorItem : Author) => {
                if(authorItem.id === action.payload.id) {
                    return {...authorItem,
                        firstname: action.payload.firstname,
                        lastname: action.payload.lastname,
                        description: action.payload.description,
                        birthdate: action.payload.birthdate
                    }
                } else {
                    return authorItem;
                }
            });
        }
    },
})

export const { addAuthor, removeAuthor, updateAuthor } = authorSlice.actions;

export default authorSlice.reducer;
