import Hero from "./components/Hero";
import Services from "./components/Services";
import Spaces from "./components/Spaces";
import Booking from "./components/Booking";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main>
        <Hero />
        <Services />
        <Spaces />
        <Booking />
      </main>
    </div>
  );
}
