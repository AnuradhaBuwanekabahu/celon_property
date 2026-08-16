import { Route } from 'react-router-dom'
import HotSales from '../pages/HotSales'

export default function HotsalesRoute() {
  return <Route path="/hot-sales" element={<HotSales />} />
}
