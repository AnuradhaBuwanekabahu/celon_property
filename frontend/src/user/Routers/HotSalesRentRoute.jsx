import { Route } from 'react-router-dom'
import StayToRent from '../pages/StayToRent'

export default function HotSalesRentRoute() {
  return <Route path="/stay-to-rent" element={<StayToRent />} />
}
