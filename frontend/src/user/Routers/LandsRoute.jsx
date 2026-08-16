import { Route } from 'react-router-dom'
import Lands from '../pages/Lands'

export default function LandsRoute() {
  return <Route path="/lands" element={<Lands />} />
}
