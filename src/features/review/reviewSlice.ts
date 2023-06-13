import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Review} from "../../types/Review";

// Definice výchozího stavu
const initialState: Review[] = [];

export const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        addReview: (reviews, action: PayloadAction<Review>) => {
            return [...reviews, action.payload]
        },
        removeReview: (reviews, action: PayloadAction<Review>) => {
            return reviews.filter((reviewItem : Review) => {
                if(reviewItem.id !== action.payload.id) {
                    return reviewItem;
                }
            });
        },
        updateReview: (reviews, action: PayloadAction<Review>) => {
            return reviews.map((reviewItem : Review) => {
                if(reviewItem.id === action.payload.id) {
                    return {...reviewItem,
                        text: action.payload.text,
                        rating: action.payload.rating,
                        creationDate: action.payload.creationDate
                    }
                } else {
                    return reviewItem;
                }
            });
        }
    },
})

export const { addReview, removeReview, updateReview } = reviewSlice.actions;

export default reviewSlice.reducer;
