import React, { useEffect, useState } from 'react';
import '../styles/ScrollToTopButton.scss';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        setVisible(window.scrollY > 300);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        visible && (
            <button
                onClick={scrollToTop}
                className="scroll-to-top"
                aria-label="Volver arriba"
            >
                ^
            </button>
        )
    );
};

export default ScrollToTopButton;
