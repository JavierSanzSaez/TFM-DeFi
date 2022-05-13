import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../css/App.css';
import Loading from './Loading';
import Layout from './Layout';
import Home from './Home';
import {Evaluaciones, EvaluacionCalificaciones} from "components/Evaluaciones";
import {Alumnos, Alumno} from "./Alumnos/Alumnos";
import {Calificaciones, NuevaCalificacion} from "components/Calificaciones";
import MisCosas from "./MisCosas/MisCosas";
import NoMatch from './NoMatch';

function App() {
    return (
        <div className="App">
            <Loading>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<Home/>}/>
                            <Route path="evaluaciones" element={<Evaluaciones/>}/>
                            <Route path="alumnos" element={<Alumnos/>}/>
                            <Route path="alumnos/:addr" element={<Alumno/>}/>
                            <Route path="calificaciones" element={<Calificaciones/>}/>
                            <Route path="miscosas" element={<MisCosas/>}/>
                            <Route path="evaluacion/:evaluacionIndex" element={<EvaluacionCalificaciones/>}/>
                            <Route path="calificaciones/nuevaCalificacion/:alumnoAddr/:ei" element={<NuevaCalificacion/>}/>
                            <Route path="*" element={<NoMatch/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Loading>
        </div>
    );
}

export default App;
