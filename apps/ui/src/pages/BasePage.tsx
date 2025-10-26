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
      <div className="text-geist min-h-screen flex flex-col justify-between bg-dominant">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
