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
                            <Route path="books/:bookId" element={<BookDetail/>}/>
                            <Route path="authors/" element={<Authors/>}/>
                            <Route path="authors/:authorId" element={<AuthorDetail/>}/>
                        </Routes>
                    </Container>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    )
}

export default App
