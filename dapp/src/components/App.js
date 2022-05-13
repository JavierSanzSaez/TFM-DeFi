import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../css/App.css';
import Loading from './Loading';
import Layout from './Layout';
import Home from './Home/Home';

import {Indices} from "./Indices"


import NoMatch from './NoMatch';

function App() {
    return (
        <div className="App">
            <Loading>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<Home/>}/>
                            <Route path="indices" element={<Indices/>}/>
                            <Route path="createIndex" element={<Create/>}/>
                            <Route path="index/:addr" element={<Index/>}/>
                            <Route path="stats" element={<Stats/>}/>
                            <Route path="*" element={<NoMatch/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Loading>
        </div>
    );
}

export default App;
