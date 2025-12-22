import Hero from "./components/Hero";
import Services from "./components/Services";
import Spaces from "./components/Spaces";
import Booking from "./components/Booking";

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params; // Await params to ensure locale is available
  
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
