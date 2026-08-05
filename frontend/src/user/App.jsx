import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Listings from './pages/Listings'
import PropertyDetails from './pages/PropertyDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import HotSales from './pages/HotSales'
import StayToRent from './pages/StayToRent'
import StayToBuy from './pages/StayToBuy'
import Lands from './pages/Lands'
import Wanted from './pages/Wanted'
import Services from './pages/Services'
import RentalDetails from './pages/RentalDetails'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/rental/:id" element={<RentalDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hot-sales" element={<HotSales />} />
          <Route path="/stay-to-rent" element={<StayToRent />} />
          <Route path="/stay-to-buy" element={<StayToBuy />} />
          <Route path="/lands" element={<Lands />} />
          <Route path="/wanted" element={<Wanted />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
