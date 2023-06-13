import {Box, Card, CardContent, CardMedia, Link} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Author} from "../types/Author";
import {authorImageUrl} from "../page/Authors";

interface Props {
    author: Author
}

export function AuthorCard({author} : Props) {
    return (
        <Card>
            <CardContent sx={{ p: 1.5}}>
                <Box component={RouterLink} to={`/authors/${author.id}`}>
                    <CardMedia
                        component="img"
                        alt={author.firstName + " " + author.lastName}
                        height="100%"
                        image={authorImageUrl}
                        title={author.firstName + " " + author.lastName}
                    />
                </Box>
                <CardContent sx={{ p: 0, pl: 1 }}>
                    <Link component={RouterLink} to={`/authors/${author.id}`} underline="hover">
                        <Typography variant="h5" component="h2" sx={{mt: 1}}>
                            {author.firstName + " " + author.lastName}
                        </Typography>
                    </Link>
                </CardContent>
            </CardContent>
        </Card>
    )
}