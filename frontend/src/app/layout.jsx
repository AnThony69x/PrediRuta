import "./globals.css";
import "../styles/accessibility.css";
// Leaflet ha sido reemplazado por Mapbox GL JS
// import "leaflet/dist/leaflet.css";
import { AccessibilityWidget } from "../components/ui/accessibility-widget";
import { ToasterProvider } from "../components/ui/toaster";
import { ThemeProvider } from "../components/ThemeProvider";
import { LanguageProvider } from "../components/LanguageProvider";

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
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Load Inter font (default beautiful font for the app) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Inline script: apply language BEFORE hydration */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var locale = localStorage.getItem('locale') || 'es';
              document.documentElement.lang = locale;
            } catch (e) { /* silent */ }
          })();
        ` }} />

        {/* Inline script: apply theme BEFORE hydration to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var theme = localStorage.getItem('theme');
              var root = document.documentElement;
              if (theme === 'dark') {
                root.classList.add('dark');
              } else if (theme === 'light') {
                root.classList.remove('dark');
              } else {
                // Check system preference
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  root.classList.add('dark');
                  localStorage.setItem('theme', 'dark');
                } else {
                  root.classList.remove('dark');
                  localStorage.setItem('theme', 'light');
                }
              }
            } catch (e) { /* silent */ }
          })();
        ` }} />

        {/* Inline script: read saved accessibility settings from localStorage and apply classes
            BEFORE React hydrates so the font and other accessibility classes don't 'saltar' */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var s = localStorage.getItem('accessibility-settings');
              if (!s) return;
              var settings = JSON.parse(s);
              var root = document.documentElement;
              if (settings.readableFont) root.classList.add('readable-font');
              if (settings.dyslexiaFont) root.classList.add('dyslexia-font');
              if (settings.highlightHeadings) root.classList.add('highlight-headings');
              if (settings.highlightLinks) root.classList.add('highlight-links');
              if (settings.highlightButtons) root.classList.add('highlight-buttons');
              if (settings.hideImages) root.classList.add('hide-images');
              if (settings.tooltips) root.classList.add('tooltips-enabled');
              if (settings.stopAnimations) root.classList.add('stop-animations');
              if (settings.accessibilityDarkMode) { root.classList.add('accessibility-dark-mode'); root.classList.add('dark'); }
              // Only apply text/line-height/spacing classes if NOT default 'medium'
              if (settings.textSize && settings.textSize !== 'medium') root.classList.add('text-' + settings.textSize);
              if (settings.lineHeight && settings.lineHeight !== 'medium') root.classList.add('line-height-' + settings.lineHeight);
              if (settings.textSpacing && settings.textSpacing !== 'medium') root.classList.add('spacing-' + settings.textSpacing);
            } catch (e) { /* silent */ }
          })();
        ` }} />
      </head>
      <body>
        {/* Skip Links para accesibilidad (WCAG 2.2 - Criterio 2.4.1) */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only 
            focus:fixed focus:top-4 focus:left-4 
            bg-blue-600 text-white 
            px-6 py-3 rounded-lg 
            z-[9999] 
            font-medium
            focus:outline-none focus:ring-4 focus:ring-blue-300
            shadow-lg
          "
        >
          Saltar al contenido principal
        </a>
        <a
          href="#navigation"
          className="
            sr-only focus:not-sr-only 
            focus:fixed focus:top-4 focus:left-52
            bg-cyan-600 text-white 
            px-6 py-3 rounded-lg 
            z-[9999] 
            font-medium
            focus:outline-none focus:ring-4 focus:ring-cyan-300
            shadow-lg
          "
        >
          Ir al menú de navegación
        </a>

        <ToasterProvider>
          <ThemeProvider />
          <LanguageProvider />
          {children}
          <AccessibilityWidget />
        </ToasterProvider>
      </body>
    </html>
  );
}