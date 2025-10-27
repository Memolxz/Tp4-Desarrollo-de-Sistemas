import type { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface BasePageProps {
  pageName: string;
  children: ReactNode;
}

export default function BasePage({ pageName, children }: BasePageProps) {
  return (
    <>
      <div className="text-geist min-h-screen flex flex-col justify-between items-center w-full bg-dominant">
        <Header />
        <main  className="text-geist flex flex-col w-full bg-dominant">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
