import {BookLookup} from "../types/Book";
import {BookCard} from "./BookCard";
import {Grid} from "@mui/material";

interface Props {
    books: Array<BookLookup>
}

export function BookList({books} : Props) {
    return (
        <Grid container spacing={3} justifyContent="center">
            {books.map(book => (
                <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                    <BookCard author={book}/>
                </Grid>
            ))}
        </Grid>
    )
}