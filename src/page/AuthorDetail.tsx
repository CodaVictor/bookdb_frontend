import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {Author} from "../types/Author";
import {Backdrop, Box, CircularProgress, Container, Typography} from "@mui/material";
import {authorImageUrl} from "./Authors";

export function AuthorDetail() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const {authorId} = useParams<'authorId'>();

    const authorQuery = useQuery({
        queryKey: ["author-detail"],
        queryFn: () => fetchAuthor(authorId as string)
    });

    async function fetchAuthor(authorId: number | string) {
        const queryString = `${backendUrl}/authors/${authorId}`;
        const result = await fetch(queryString);
        console.log(`Fetching author with ID ${authorId} from DB. Query string: " + ${queryString}`);
        return (await result.json()) as Author;
    }

    let authorBirthDate: Date | undefined
    if(authorQuery.data?.birthdate) {
        authorBirthDate = new Date(authorQuery.data.birthdate);
    }

    return (
        <Container>
            { authorQuery.isError && <Box>{JSON.stringify(authorQuery.error)}</Box>}
            { authorQuery.isLoading &&
                <Backdrop sx={{ color: "#3870b0", bgcolor: "rgba(227,227,227,.5)", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit"/>
                </Backdrop>}
            { authorQuery.data &&
                <Box sx={{mt: 2, p: 3, bgcolor: "#f7f7f7"}}>
                    <Box sx={{ display: "flex" }}>
                        <Box component="img"
                             alt={authorQuery.data.firstName + " " + authorQuery.data.lastName}
                             width="33%"
                             src={authorImageUrl}
                             title={authorQuery.data.firstName + " " + authorQuery.data.lastName}>
                        </Box>
                        <Box sx={{width:"-webkit-fill-available", ml: 4}}>
                            <Box sx={{display: "flex"}}>
                                <Typography variant="h2">{authorQuery.data.firstName + " " + authorQuery.data.lastName}</Typography>
                            </Box>
                            <Box sx={{mt: 2}}>
                                { authorQuery.data.birthdate &&
                                    <Typography variant="body1">
                                        {"Datum narození: " + authorBirthDate?.toLocaleDateString()}
                                    </Typography> }
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{mt: 1}}>
                        {authorQuery.data.description != null && authorQuery.data.description.length > 0 ? authorQuery.data.description : "Bez popisku."}
                    </Typography>
                </Box>
            }
        </Container>
    )
}