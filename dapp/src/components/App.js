import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../css/App.css';
import Loading from './Loading';
import {Layout} from './Layout';
import {Home} from './Home';

import {IndexDetail, Indices} from "./Indices"
import { Create } from "./Create";

import NoMatch from './NoMatch';
import { Stats } from "./Stats";

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
                            <Route path="index/:addr" element={<IndexDetail/>}/>
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
