import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

function Header() {
    return (
        <>
            <header className="app-header">
                <h1>Catálogo de Usuários Avançado</h1>
                <nav>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Inicio</NavLink>

                    <NavLink to='/sobre' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Sobre</NavLink>
                </nav>

            </header>
        </>
    )
}

export default Header;