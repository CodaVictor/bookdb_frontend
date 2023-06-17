import {BrowserRouter, Route, Routes} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import {Provider} from "react-redux";

import './App.css'
import store from "./app/store";
import {Container} from "@mui/material";
import {MainNavigationPanel} from "./component/MainNavigationPanel";
import {Books} from "./page/Books";
import {BookDetail} from "./page/BookDetail";
import {AuthorDetail} from "./page/AuthorDetail";
import {Authors} from "./page/Authors";
import {BooksManager} from "./page/BooksManager";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <BrowserRouter>
                    <Container>
                        <MainNavigationPanel/>
                        <Routes>
                            <Route path="/" element={<Books/>}/>
                            <Route path="/books">
                                <Route index element={<Books/>}/>
                                <Route path=":bookId" element={<BookDetail/>}/>
                            </Route>
                            <Route path="/authors">
                                <Route index element={<Authors/>}/>
                                <Route path=":authorId" element={<AuthorDetail/>}/>
                            </Route>
                            <Route path="/manage/books" element={<BooksManager/>}/>
                        </Routes>
                    </Container>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    )
}

export default App
