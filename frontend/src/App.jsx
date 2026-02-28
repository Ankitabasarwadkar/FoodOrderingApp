import { Routes, Route, Navigate } from "react-router"

import Home from "./pages/Home"

function App() {return (
<Routes>
        <Route path="/home" element={<Home />} />
</Routes>
)
}

export default App
