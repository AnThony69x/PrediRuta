import "./globals.css";
import "../styles/accessibility.css";
import "leaflet/dist/leaflet.css";
import { AccessibilityWidget } from "../components/ui/accessibility-widget";

export const metadata = {
  title: "PrediRuta",
  description: "Predicción de tráfico y rutas óptimas",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <AccessibilityWidget />
      </body>
    </html>
  );
}