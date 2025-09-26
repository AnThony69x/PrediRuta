import "./globals.css";

export const metadata = {
  title: "PrediRuta",
  description: "Predicción de tráfico y rutas óptimas"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}