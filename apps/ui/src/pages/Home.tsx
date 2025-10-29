import Categories from "../components/Categories.tsx";
import HowItWorks from "../components/HowItWorks.tsx";
import BasePage from "./BasePage.tsx";

export default function Home() {
    return (
      <BasePage pageName={'home'}>
        <div className="flex flex-col items-center bg-dominant h-full w-full font-geist">
          <Categories />
          <HowItWorks />
        </div>
      </BasePage>
    );
}
