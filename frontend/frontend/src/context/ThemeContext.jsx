import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("zentra-theme") || "dark");

  useEffect(() => {
    // 🔄 clear previous class
    document.body.className = "";
    // ✅ add new Zentra theme class
    document.body.classList.add(`zentra-${theme}`);
    // 🧠 store in localStorage for persistence
    localStorage.setItem("zentra-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
