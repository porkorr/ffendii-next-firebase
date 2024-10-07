import AppProvider from "@/providers/AppProvider";
import "@/styles/globals.css";

// Metadata configuration
export const metadata = {
  title: "ffendii",
  description: "request song",
  themeColor: "black",
  appleMobileWebAppStatusBarStyle: "black",
};

// Viewport configuration
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({ children }) => {
  return <AppProvider>{children}</AppProvider>;
};

export default RootLayout;
