import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageLayout({ children }) {
  return (
    <div className="page">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}