import {Backdrop, Box, Button, CircularProgress, Container, Rating, Typography} from "@mui/material";
import {useQuery} from "react-query";
import {Book} from "../types/Book";
import {bookImageUrl} from "./Books";
import {Link as RouterLink, useParams} from "react-router-dom";

export function BookDetail() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const {bookId} = useParams<'bookId'>();

    const bookQuery = useQuery({
        queryKey: ["book-detail"],
        queryFn: () => fetchBook(bookId as string)
    });

    async function fetchBook(bookId: number | string) {
        const queryString = `${backendUrl}/books/${bookId}`;
        const result = await fetch(queryString);
        console.log(`Fetching book with ID ${bookId} from DB. Query string: " + ${queryString}`);
        return (await result.json()) as Book;
    }

    return (
    <Container>
        { bookQuery.isError && <Box>{JSON.stringify(bookQuery.error)}</Box>}
        { bookQuery.isLoading &&
            <Backdrop sx={{ color: "#3870b0", bgcolor: "rgba(227,227,227,.5)", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>}
        { bookQuery.data &&
            <Box sx={{mt: 2, p: 3, bgcolor: "#f7f7f7"}}>
                <Box sx={{ display: "flex" }}>
                    <Box component="img"
                         alt={bookQuery.data.title}
                         width="33%"
                         src={bookImageUrl}
                         title={bookQuery.data.title}>
                    </Box>
                    <Box sx={{width:"-webkit-fill-available", ml: 4}}>
                        <Box sx={{display: "flex"}}>
                            <Box sx={{flex: 1}}>
                                <Typography variant="h2">{bookQuery.data.title}</Typography>
                                <Typography fontSize="1em" fontFamily="Sans-Serif" fontWeight="500" color="#969ca3">Autor
                                    { bookQuery.data.authors.map((item)=> {
                                        return <Button component={RouterLink} to={`/authors/${item.id}`} size="small" color="primary" key={item.id} sx={{ml: 1}}>{item.firstName + " " + item.lastName}</Button>
                                    })}
                                </Typography>
                            </Box>
                            <Box>
                                <Box component="span" sx={{ display: "flex", justifyContent: "left", alignItems: "center"}}>
                                    { bookQuery.data.reviewCount > 0 && <>
                                        <Rating readOnly value={bookQuery.data.rating} precision={0.1}/>
                                        <Typography variant="body1" sx={{ ml: 0.5}}>({bookQuery.data.reviewCount})</Typography>
                                    </>
                                    }
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{mt: 2}}>
                            { bookQuery.data.subtitle && <Typography variant="body1">{"Podtitulek: " + bookQuery.data.subtitle}</Typography> }
                            { bookQuery.data.category && <Typography variant="body1">{"Kategorie: " + bookQuery.data.category.name}</Typography> }
                            { bookQuery.data.genre && <Typography variant="body1">{"Žánr: " + bookQuery.data.genre.genreName}</Typography> }
                            { bookQuery.data.publisher  && <Typography variant="body1">{"Vydavatel: " + bookQuery.data.publisher.name}</Typography> }
                            { bookQuery.data.isbn && <Typography variant="body1">{"ISBN: " + bookQuery.data.isbn}</Typography> }
                            { bookQuery.data.pageCount && <Typography variant="body1">{"Počet stran: " + bookQuery.data.pageCount}</Typography> }
                            { bookQuery.data.language && <Typography variant="body1">{"Jazyk: " + bookQuery.data.language}</Typography> }
                        </Box>
                    </Box>
                </Box>
                <Typography variant="body1" sx={{mt: 1}}>
                    {bookQuery.data.description != null && bookQuery.data.description.length > 0 ? bookQuery.data.description : "Bez popisku."}
                </Typography>
            </Box>
        }
    </Container>
    )
}