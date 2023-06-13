import {Author} from "../types/Author";
import {useQuery} from "react-query";
import {Backdrop, Box, CircularProgress, Container} from "@mui/material";
import {AuthorList} from "../component/AuthorList";

export const authorImageUrl = "https://cdn-icons-png.flaticon.com/512/1995/1995463.png";

export function Authors() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const authorsQuery = useQuery({
        queryKey: ["authors-lookup"],
        queryFn: () => fetchAuthors()
    });

    async function fetchAuthors() {
        const queryString = `${backendUrl}/authors`;
        const result = await fetch(queryString);
        console.log(`Fetching authors from DB. Query string: " + ${queryString}`);
        return (await result.json()) as Array<Author>
    }

    return (
        <Container>
            <Box sx={{display: "flex", mt: 2}}>
                <Box sx={{ml: 2}}>
                    {authorsQuery.isError && <Box>{JSON.stringify(authorsQuery.error)}</Box>}
                    {authorsQuery.isLoading &&
                        <Backdrop sx={{ color: "#3870b0", bgcolor: "rgba(227,227,227,.5)", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                            <CircularProgress color="inherit"/>
                        </Backdrop>}
                    {authorsQuery.data && <AuthorList authors={(authorsQuery.data as Array<Author>)}/>}
                </Box>
            </Box>
        </Container>
    )
}