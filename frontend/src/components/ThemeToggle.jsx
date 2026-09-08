import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import "../styles/themeToggle.css"



function ThemeToggle() {

    const [darkMode, setDarkMode] = useState(()=>{
        const savedTheme = localStorage.getItem("theme");
        
        if (savedTheme){
            return savedTheme === "dark";
        }
        return false;
    });

    useEffect(() =>{
        const theme = darkMode ? "dark" : "light";
        document.documentElement.setAttribute(
            "data-theme",
            theme
        );
        localStorage.setItem("theme", theme);
    }, [darkMode]);

    const toggleTheme = ()=>{
        setDarkMode(previous => !previous);
    };
    
    return(
        <button className="theme-toggle" onClick={toggleTheme} aria-label={darkMode 
            ? "Activar modo claro"
            : "Activar modo oscuro"
        }> 
        {darkMode ? ( <FiSun/>) : (<FiMoon/>)}
        </button>
    );
}

export default ThemeToggle;
