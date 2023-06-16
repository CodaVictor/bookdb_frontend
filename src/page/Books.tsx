import {useQuery} from "react-query";
import {BookLookup} from "../types/Book";
import {BookList} from "../component/BookList";
import {Backdrop, Box, CircularProgress, Container} from "@mui/material";
import {BookOrder, BookOrderPanel, orderParameters} from "../component/BookOrderPanel";
import {useState} from "react";
import {FilterData, FilterItem, FilterPanel} from "../component/FilterPanel";
import {Category} from "../types/Category";
import {Genre} from "../types/Genre";
import {Publisher} from "../types/Publisher";

export const bookImageUrl = "https://cdn-icons-png.flaticon.com/512/130/130304.png?w=826&t=st=1686157901~exp=1686158501~hmac=e0efc001ae0afdf0b6f039e4fa313e9efb538317cf175378258d5e97c18069d1";

export function Books () {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const category = "Kategorie";
    const genre = "Žánry";
    const publisher = "Vydavatelé";

    const [orderParameter, setOrderParameter] = useState(orderParameters[0]);
    const [filter, setFilter] = useState<FilterData[]>([
        { groupName: category, data: [] },
        { groupName: genre, data: [] },
        { groupName: publisher, data: [] }
    ]);

    const bookQuery = useQuery({
        queryKey: ["books-lookup", orderParameter, filter],
        queryFn: () => fetchBooks(orderParameter, filter)
    });

    // Filters
    const categoryQuery = useQuery({
        queryKey: ["categories-filter"],
        queryFn: () => fetchFilter<Category>("categories")
    });

    const genreQuery = useQuery({
        queryKey: ["genres-filter"],
        queryFn: () => fetchFilter<Genre>("genres")
    });

    const publisherQuery = useQuery({
        queryKey: ["publishers-filter"],
        queryFn: () => fetchFilter<Publisher>("publishers"),
    });

    async function fetchFilter<T>(attributeName: string) {
        const queryString = `${backendUrl}/${attributeName}`;
        const result = await fetch(queryString);
        console.log(`Fetching ${attributeName} from DB. Query string: " + ${queryString}`);
        return (await result.json()) as Array<T>
    }

    async function fetchBooks(bookOrder: BookOrder, filterData: FilterData[]) {
        let categoryParam = "";
        if(filterData[0].data.length > 0) {
            categoryParam = filterData[0].data.map((item) => item.valueId).join(",");
        }

        let genreParam = "";
        if(filterData[1].data.length > 0) {
            genreParam = filterData[1].data.map((item) => item.valueId).join(",");
        }

        let publisherParam = "";
        if(filterData[2].data.length > 0) {
            publisherParam = filterData[2].data.map((item) => item.valueId).join(",");
        }

        console.log(categoryParam);

        const queryString =
            `${backendUrl}/books?orderBy=${bookOrder.orderParameterName}&orderDirection=${bookOrder.orderDirection}&category=${categoryParam}&publisher=${publisherParam}&genre=${genreParam}`;

        const result = await fetch(queryString);
        console.log("Fetching books from DB. Query string: " + queryString);
        return (await result.json()) as Array<BookLookup>
    }

    const filterData: FilterData[] = [];
    if(!categoryQuery.isLoading && !categoryQuery.isError && categoryQuery.data) {
        filterData.push({
            groupName: category,
            data: categoryQuery.data.map<FilterItem>((item) => {
                return { name: item.name, valueId: item.id, checked: false }
            })
        });
    }

    if(!genreQuery.isLoading && !genreQuery.isError && genreQuery.data) {
        filterData.push({
            groupName: genre,
            data: genreQuery.data.map<FilterItem>((item) => {
                return { name: item.genreName, valueId: item.id, checked: false }
            })
        });
    }

    if(!publisherQuery.isLoading && !publisherQuery.isError && publisherQuery.data) {
        filterData.push({
            groupName: publisher,
            data: publisherQuery.data.map<FilterItem>((item) => {
                return { name: item.name, valueId: item.id, checked: false }
            })
        });
    }

    return (
    <Container>
        <BookOrderPanel currentOrder={orderParameter} setNewOrder={setOrderParameter}/>

        <Box sx={{display: "flex", mt: 2}}>
            <Box sx={{width: "22%"}}>
                <FilterPanel currentFilter={filter} setFilter={setFilter} filterData={filterData}/>
            </Box>

            <Box sx={{ml: 2, width: "100%"}}>
                {bookQuery.isError && <Box>{JSON.stringify(bookQuery.error)}</Box>}
                {bookQuery.isLoading &&
                    <Backdrop sx={{ color: "#3870b0", bgcolor: "rgba(227,227,227,.5)", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>}
                {bookQuery.data && <BookList books={(bookQuery.data as Array<BookLookup>)}/>}
            </Box>
        </Box>
    </Container>
    )
}