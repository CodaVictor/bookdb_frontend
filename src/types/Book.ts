import {AuthorLookup} from "./Author";
import {Publisher} from "./Publisher";
import {Genre} from "./Genre";
import {Category} from "./Category";

export interface Book {
    id: number
    title: string
    pageCount: number
    publicationDate: Date
    language: string
    subtitle?: string
    description?: string
    isbn?: string
    category?: Category
    genre?: Genre
    publisher?: Publisher
    authors: Array<AuthorLookup>
    reviewCount: number
    rating?: number
}

export interface BookLookup {
    id: number
    title: string
    authors: Array<AuthorLookup>
    subtitle?: string
    reviewCount: number
    rating?: number
}