import Categories from "../components/Categories.tsx";
import HowItWorks from "../components/HowItWorks.tsx";
import Stats from "../components/Stats.tsx";
import TopEvents from "../components/TopEvents.tsx";
import BasePage from "./BasePage.tsx";

export default function Home() {
    return (
      <BasePage pageName={'home'}>
        <div className="flex flex-col items-center bg-dominant h-full w-full">
          <h1 className="mt-20 text-5xl font-bold text-black">Descubre y crea eventos increíbles</h1>
          <h2 className="mt-7 w-1/2 text-2xl text-center text-black/60">Desde festivales hasta casamientos, encuentra o crea el evento perfecto. Gestiona inscripciones, pagos y más en un solo lugar.</h2>
          <Stats />
          <TopEvents />
          <Categories />
          <HowItWorks />
        </div>
      </BasePage>
    );
}
