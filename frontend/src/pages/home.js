import About from "../components/About/About";
import Work from "../components/Work/Work";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/footer";
const Home = () => {
  return (
    <div>
      <Header />
      <About />
      <Work />
      <Footer />
      {/* Add other content of home page */}
    </div>
  )
}

export default Home