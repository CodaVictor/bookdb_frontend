import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Book} from "../../types/Book";

// Definice výchozího stavu
const initialState: Book[] = [];

export const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        addBook: (books, action: PayloadAction<Book>) => {
            return [...books, action.payload]
        },
        removeBook: (books, action: PayloadAction<Book>) => {
            return books.filter((bookItem : Book) => {
                if(bookItem.id !== action.payload.id) {
                    return bookItem;
                }
            });
        },
        updateBook: (books, action: PayloadAction<Book>) => {
            return books.map((bookItem : Book) => {
                if(bookItem.id === action.payload.id) {
                    return {...bookItem,
                        title: action.payload.title,
                        subtitle: action.payload.subtitle,
                        isbn: action.payload.isbn,
                        language: action.payload.language,
                        pageCount: action.payload.pageCount,
                        publicationDate: action.payload.publicationDate,
                        description: action.payload.description,
                        categoryId: action.payload.category,
                        publisherId: action.payload.publisher,
                        genreId: action.payload.genre
                    }
                } else {
                    return bookItem;
                }
            });
        }
    },
})

export const { addBook, removeBook, updateBook } = bookSlice.actions;

export default bookSlice.reducer;
