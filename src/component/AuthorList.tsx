import {Grid} from "@mui/material";
import {Author} from "../types/Author";
import {AuthorCard} from "./AuthorCard";

interface Props {
    authors: Array<Author>
}

export function AuthorList({authors} : Props) {
    return (
        <Grid container spacing={3} justifyContent="center">
            {authors.map(author => (
                <Grid item key={author.id} xs={12} sm={6} md={4} lg={3}>
                    <AuthorCard author={author}/>
                </Grid>
            ))}
        </Grid>
    )
}