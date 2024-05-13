import React, { useState, useEffect } from 'react';

const Theme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            setIsDarkMode(e.matches);
        };

        // Initial check
        setIsDarkMode(darkModeMediaQuery.matches);

        // Listen for changes in user's theme preference
        darkModeMediaQuery.addListener(handleChange);

        return () => {
            darkModeMediaQuery.removeListener(handleChange);
        };
    }, []);

    useEffect(() => {
        // Set favicon based on theme
        const favicon = document.querySelectorAll("link[rel='icon']");
        // console.log(favicon)
        if(favicon != null && favicon != undefined){
            if (isDarkMode) {
                favicon[0].href = '';
            } else {
                favicon[0].href = '';
            }
        }
       
    }, [isDarkMode]);

    return null; // Since this component doesn't render anything visible
};

export default Theme;
