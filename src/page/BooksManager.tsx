import {DataGrid, GridActionsCellItem, GridColDef, GridRowId} from '@mui/x-data-grid';
import {
    Backdrop,
    Box, Button,
    CircularProgress,
    Container, FormControl, InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';

import {useCallback, useState} from "react";
import {useQuery} from "react-query";

import {Book} from "../types/Book";
import {AuthorLookup} from "../types/Author";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";
import {Publisher} from "../types/Publisher";
import {Category} from "../types/Category";
import {Genre} from "../types/Genre";

export function BooksManager() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
    const [bookRows, setBookRows] = useState<Book[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>();
    const [successMessage, setSuccessMessage] = useState<string | null>();

    const [bookPublisher, setBookPublisher] = useState<string | null>();
    const [bookCategory, setBookCategory] = useState<string | null>();
    const [bookGenre, setBookGenre] = useState<string | null>();
    const [bookAuthor, setBookAuthor] = useState<string | null>();
    const [bookDate, setBookDate] = useState<Dayjs | null>(dayjs());

    const booksQuery = useQuery({
        queryKey: ["books-list-manager"],
        queryFn: async () => {
            const result = await fetchBooks();
            const jsonContent = await result.json();
            const content = jsonContent["content"] as Array<Book>;
            setBookRows(content);
            return content;
        }
    });

    const publishersQuery = useQuery({
        queryKey: ["books-manager-publishers"],
        queryFn: async () => {
            const result = await fetchPublishers();
            setBookPublisher(result[0].id.toString());
            return result;
        }
    })

    const categoriesQuery = useQuery({
        queryKey: ["books-manager-categories"],
        queryFn: async () => {
            const result = await fetchCategories();
            setBookCategory(result[0].id.toString());
            return result;
        }
    })

    const genresQuery = useQuery({
        queryKey: ["books-manager-genres"],
        queryFn: async () => {
            const result = await fetchGenres();
            setBookGenre(result[0].id.toString());
            return result;
        }
    })

    const authorsQuery = useQuery({
        queryKey: ["books-manager-authors"],
        queryFn: async () => {
            const result = await fetchAuthors();
            setBookAuthor(result[0].id.toString());
            return result;
        }
    })

    async function fetchBooks() {
        const queryString = `${backendUrl}/books`;
        return await fetch(queryString);
    }

    async function fetchPublishers() {
        const queryString = `${backendUrl}/publishers`;
        const result = await fetch(queryString);
        return await result.json() as Array<Publisher>;
    }

    async function fetchCategories() {
        const queryString = `${backendUrl}/categories`;
        const result = await fetch(queryString);
        return await result.json() as Array<Category>;
    }

    async function fetchGenres() {
        const queryString = `${backendUrl}/genres`;
        const result = await fetch(queryString);
        return await result.json() as Array<Genre>;
    }

    async function fetchAuthors() {
        const queryString = `${backendUrl}/authors`;
        const result = await fetch(queryString);
        return await result.json() as Array<AuthorLookup>;
    }

    const httpCodeErrorCodeToErrorMessage = (httpCode: number) => {
        setErrorMessage(null);
        switch (httpCode) {
            case 409: {
                setErrorMessage("Kniha s daným ISBN již existuje.");
                break;
            }
            case 401:
            case 403:
                setErrorMessage("Nemáte dostatečná oprávnění provést tuto operaci.");
                break;
        }
    }

    const deleteBook = useCallback((id: GridRowId) =>
        async () => {
            const queryString = `${backendUrl}/books/${id}`;
            const jwtToken = getAppUserToken();
            setSuccessMessage(null);
            if(jwtToken == null) {
                return;
            }

            const result = await fetch(queryString, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            httpCodeErrorCodeToErrorMessage(result.status);

            if(result.ok) {
                setBookRows((previousRows) => previousRows.filter((row) => row.id !== id));
                const message = `Kniha s ID: ${id} byla úspěšně odstraněna.`;
                setSuccessMessage(message);
                console.log(message);
            }

        },
        [],
    );

    const getAppUserToken = () => {
        const storageAppUser = localStorage.getItem('appUser');
        if(storageAppUser != null) {
            const token = JSON.parse(storageAppUser)["token"];
            if(token == null) {
                console.log("You should sign-in first.");
                return null;
            } else {
                return token;
            }
        } else {
            console.log("You should sign-in first.");
            return null;
        }
    }

    const handleNewBookSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage(null);

        const formData = new FormData(event.currentTarget);
        const jwtToken = getAppUserToken();
        if(jwtToken == null) {
            return;
        }

        const queryString = `${backendUrl}/books`;
        const queryBody = {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") != null ? formData.get("subtitle") as string : null,
            isbn: formData.get("isbn") != null ? formData.get("isbn") as string : null,
            pageCount: Number(formData.get("pageCount")),
            language: formData.get("language") ? formData.get("language") as string : null,
            publicationDate: bookDate != null ? bookDate.toISOString() : null,
            description: formData.get("description") != null ? formData.get("description") as string : null,
            publisher: Number(bookPublisher),
            category: Number(bookCategory),
            genre: Number(bookGenre),
            authors: [ Number(bookAuthor) ]
        };

        const result = await fetch(queryString, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(queryBody)
        });

        httpCodeErrorCodeToErrorMessage(result.status);

        if(result.ok) {
            const newBook: Book = await result.json();
            setBookRows([...bookRows, newBook]);
            const message = "Nová kniha byla úspěšně vytvořena.";
            setSuccessMessage(message);
            console.log(message)
        }
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'title',
            headerName: 'Titulek',
            type: 'string',
            width: 150,
            editable: false,
        },
        {
            field: 'subtitle',
            headerName: 'Podtitulek',
            type: 'string',
            width: 150,
        },
        {
            field: 'isbn',
            headerName: 'ISBN',
            type: 'string',
            width: 110,
        },
        {
            field: 'pageCount',
            headerName: 'Počet stran',
            type: 'number',
            width: 110,
        },
        {
            field: 'language',
            headerName: 'Jazyk',
            type: 'string',
            width: 110,
        },
        {
            field: 'publicationDate',
            headerName: 'Datum vydání',
            width: 110,
            valueFormatter: params => params != null ? new Date(params.value).toLocaleDateString() : ""
        },
        {
            field: 'publisher',
            headerName: 'Vydavatel',
            type: 'string',
            width: 110,
            valueGetter: params => params.value.name
        },
        {
            field: 'category',
            headerName: 'Vydavatel',
            type: 'string',
            width: 110,
            valueGetter: params => params.value.name
        },
        {
            field: 'genre',
            headerName: 'Žánr',
            type: 'string',
            width: 110,
            valueGetter: params => params.value.genreName
        },
        {
            field: 'authors',
            headerName: 'Autoři',
            width: 160,
            valueGetter: params =>
                params.value.map((item: AuthorLookup) => `${item.firstName} ${item.lastName}`,)

        },
        {
            field: 'reviewCount',
            headerName: 'Počet recenzí',
            type: 'number',
            width: 110,
        },
        {
            field: 'rating',
            headerName: 'Hodnocení',
            width: 110,
            valueGetter: params => params.value || ""
        },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={deleteBook(params.id)}
                />
            ],
        },
    ];

    return (
        <Container>
            {(booksQuery.isError || publishersQuery.isError || categoriesQuery.isError || genresQuery.isError || authorsQuery.isError) &&
                <Box>Chyba při načítání</Box>}
            {(booksQuery.isLoading || publishersQuery.isLoading || categoriesQuery.isLoading || genresQuery.isLoading || authorsQuery.isLoading) &&
                <Backdrop sx={{ color: "#3870b0", bgcolor: "rgba(227,227,227,.5)", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit"/>
                </Backdrop>}
            {(booksQuery.data && publishersQuery.data && categoriesQuery.data && genresQuery.data && authorsQuery.data) &&
            <Box>
                <Box sx={{ height: '100%', width: '100%'}}>
                    <Typography variant="h4" align="center" sx={{mt: 2, mb: 1}}>
                        Správce knih
                    </Typography>
                    <DataGrid sx={{bgcolor: "#edebeb"}}
                        rows={bookRows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 25,
                                },
                            },
                        }}
                        pageSizeOptions={[25]}
                        autoHeight={true}
                        onRowSelectionModelChange={rowSelectionModel => {
                            if (rowSelectionModel.length > 1) {
                                const selectionSet = new Set(selectionModel);
                                const result = rowSelectionModel.filter((s) => !selectionSet.has(s));

                                setSelectionModel(result);
                            } else {
                                setSelectionModel(rowSelectionModel);
                            }
                        }}
                    />
                </Box>

                <Box component="form" onSubmit={handleNewBookSubmit} sx={{mt: 4}}>
                    <Typography variant="h5">Nová kniha</Typography>
                    <Stack gap={1}>
                        <TextField
                            margin="normal"
                            required
                            id="title"
                            label="Titulek"
                            name="title"
                            autoFocus/>
                        <TextField
                            margin="normal"
                            id="subtitle"
                            label="Podtitulek"
                            name="subtitle"/>
                        <TextField
                            margin="normal"
                            id="isbn"
                            label="ISBN"
                            name="isbn"/>
                        <TextField
                            margin="normal"
                            id="pageCount"
                            label="Počet stran"
                            name="pageCount"/>
                        <TextField
                            margin="normal"
                            id="language"
                            label="Jazyk"
                            name="language"/>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{mt: 2, mb: 1}}
                            label="Datum vydání"
                            defaultValue={dayjs()}
                            format="DD. MM. YYYY"
                            onChange={(newValue) => setBookDate(newValue)}/>
                        </LocalizationProvider>
                        <TextField
                            margin="normal"
                            id="description"
                            label="Popisek"
                            name="description"
                            multiline/>
                        <Stack direction="row" gap={2}>
                            <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                <InputLabel id="publisher-select-label">Vydavatel</InputLabel>
                                <Select
                                    labelId="publisher-select-label"
                                    id="publisher"
                                    label="Vydavatel"
                                    value={bookPublisher}
                                    onChange={(event) => setBookPublisher(event.target.value)}
                                >
                                    {publishersQuery.data.map((item) => {
                                        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                <InputLabel id="category-select-label">Kategorie</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    id="category"
                                    label="Kategorie"
                                    value={bookCategory}
                                    onChange={(event) => setBookCategory(event.target.value)}
                                >
                                    {categoriesQuery.data.map((item) => {
                                        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                <InputLabel id="genre-select-label">Žánr</InputLabel>
                                <Select
                                    labelId="genre-select-label"
                                    id="genre"
                                    label="Žánr"
                                    value={bookGenre}
                                    onChange={(event) => setBookGenre(event.target.value)}
                                >
                                    {genresQuery.data.map((item) => {
                                        return <MenuItem key={item.id} value={item.id}>{item.genreName}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                <InputLabel id="author-select-label">Autor</InputLabel>
                                <Select
                                    labelId="author-select-label"
                                    id="author"
                                    label="Autor"
                                    value={bookAuthor}
                                    onChange={(event) => {setBookAuthor(event.target.value)}}
                                >
                                    {authorsQuery.data.map((item) => {
                                        return <MenuItem key={item.id} value={item.id}>{item.firstName + " " + item.lastName}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Stack>
                        { errorMessage != null && <Typography color="#db6756">{errorMessage}</Typography> }
                        { successMessage != null && <Typography color="#23c24b">{successMessage}</Typography> }
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2, mb: 3, width: "30%", alignItems: "center", mx: "auto"}}
                        >
                            Přidat
                        </Button>
                    </Stack>
                </Box>
            </Box>}
        </Container>
    );
}