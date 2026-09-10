import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Pixora Capstone",
  description: "FlyRank Frontend AI Engineering Capstone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}