import {BookLookup} from "../types/Book";
import {Button, Card, CardActions, CardContent, CardMedia, Box, Link, Rating} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Link as RouterLink} from "react-router-dom";
import {bookImageUrl} from "../page/Books";

interface Props {
    author: BookLookup
}

export function BookCard({author} : Props) {
    return (
        <Card>
            <CardContent sx={{ p: 1.5}}>
                <Box component={RouterLink} to={`/books/${author.id}`}>
                    <CardMedia
                        component="img"
                        alt={author.title}
                        height="100%"
                        image={bookImageUrl}
                        title={author.title}
                    />
                </Box>
                <CardContent sx={{ p: 0, pl: 1 }}>
                    <Link component={RouterLink} to={`/books/${author.id}`} underline="hover">
                        <Typography variant="h5" component="h2" sx={{mt: 1}}>
                            {author.title}
                        </Typography>
                    </Link>
                </CardContent>
                <CardContent sx={{ p: 0, pt: 1}}>
                    <Box component="span" sx={{ display: "flex", justifyContent: "left", alignItems: "center"}}>
                        { author.reviewCount > 0 && <>
                            <Rating readOnly value={author.rating} precision={0.1}/>
                            <Typography variant="body1" sx={{ ml: 0.5}}>({author.reviewCount})</Typography>
                        </>
                        }
                    </Box>
                </CardContent>
            </CardContent>
            <CardActions>
                <Box>
                    { author.authors.map((item)=> {
                        return <Button component={RouterLink} to={`/authors/${item.id}`} size="small" color="primary" key={item.id}>{item.firstName + " " + item.lastName}</Button>
                    })}
                </Box>
            </CardActions>
        </Card>
    )
}