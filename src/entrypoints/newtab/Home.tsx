'use client';

import { useState, useEffect } from 'react';

import '../../assets/styles/reset.css';

import logo_light from './img/Beliani_Icon_Brown_RGB.svg';
import logo_dark from './img/Beliani_Icon_Color_RGB.svg';
import styles from './Home.module.scss';
import { Icon } from '@iconify/react';
import LinksHub from './components/LinksHub';
import SearchBar from './components/SearchBar';
import Projects from './components/Projects.tsx';
import Snowfall from 'react-snowfall';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [sbModalState, setSbModalState] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSbModalState(false);
        return;
      }

      if (e.key === '/') {
        setSbModalState(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.home}>
      <Snowfall />
      <div className={styles.floating}>
        {/* logo */}
        <img className={styles.logo} width={48} src={theme === 'light' ? logo_light : logo_dark} alt="Logo" />

        {/* theme toggle */}
        <div className={styles.toggleTheme}>
          <button
            title={'Switch theme to ' + (theme === 'light' ? 'dark' : 'light')}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Icon icon="si:sun-fill" /> : <Icon icon="si:moon-fill" />}
          </button>
        </div>
      </div>

      <aside className={styles.description}>
        <p>Welcome to the dashboard!</p>
        <p>Here you can find quick links to your favorite tools and resources.</p>
        <br />
        <p>
          Click <kbd style={{ marginLeft: 4 }}>/</kbd> to open the search bar.
        </p>
      </aside>

      <LinksHub />

      <SearchBar shown={sbModalState} />

      <Projects />
    </div>
  );
}
