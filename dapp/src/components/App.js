import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../css/App.css';
import Loading from './Loading';
import {Layout} from './Layout';
import {Home} from './Home';

import {IndexDetail, Indices} from "./Indices"
import { Create } from "./Create";

import NoMatch from './NoMatch';
import { AdminPanel } from "./AdminPanel";

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
                            <Route path="indices/index/:addr" element={<IndexDetail/>}/>
                            <Route path="adminpanel" element={<AdminPanel/>}/>
                            <Route path="*" element={<NoMatch/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Loading>
        </div>
    );
}

export default App;
