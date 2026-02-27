import { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ShopEase | Upgrade Your Lifestyle",
  description: "Discover the next generation of electronics and fashion.",
  icons: {
    icon: "/images/shopease.png", // Path to your favicon in the public folder
    apple: "/apple-touch-icon.png", // Optional: for iOS devices
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Toaster position="bottom-right" reverseOrder={false} />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
