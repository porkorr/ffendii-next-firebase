"use client";
import { App } from "antd";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { FirestoreProvider } from "@/context/FirestoreContext";
import MainLayout from "@/layouts/MainLayout";
import WidgetLayout from "@/layouts/WidgetLayout";

const AppProvider = ({ children }) => {
  const pathname = usePathname();
  const isWidgetPath = pathname.startsWith("/widget");

  return (
    <html lang="en">
      <body className={`${isWidgetPath ? "widget" : "main"}`}>
        <AuthProvider>
          <FirestoreProvider>
            <App>{isWidgetPath ? <WidgetLayout>{children}</WidgetLayout> : <MainLayout>{children}</MainLayout>}</App>
          </FirestoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default AppProvider;
