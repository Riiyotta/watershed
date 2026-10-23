import Hero from '../components/Hero.jsx'
import Awards from '../components/Awards.jsx'
import ProductOverview from '../components/ProductOverview.jsx'
import FeatureCarousel from '../components/FeatureCarousel.jsx'
import Agents from '../components/Agents.jsx'
import Stats from '../components/Stats.jsx'
import Mission from '../components/Mission.jsx'
import ContentCards from '../components/ContentCards.jsx'
import LogoMarquee from '../components/LogoMarquee.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Awards />
      <ProductOverview />
      <FeatureCarousel />
      <Agents />
      <Stats />
      <Mission />
      <ContentCards />
      <LogoMarquee />
    </>
  )
}
