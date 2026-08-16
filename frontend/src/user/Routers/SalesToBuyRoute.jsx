import { Route } from 'react-router-dom'
import StayToBuy from '../pages/StayToBuy'

export default function SalesToBuyRoute() {
  return <Route path="/stay-to-buy" element={<StayToBuy />} />
}
