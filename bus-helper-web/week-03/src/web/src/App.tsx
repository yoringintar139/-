import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import DateRange from './pages/DateRange'
import MealsResult from './pages/MealsResult'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/date-range" element={<DateRange />} />
        <Route path="/meals" element={<MealsResult />} />
      </Routes>
    </BrowserRouter>
  )
}
