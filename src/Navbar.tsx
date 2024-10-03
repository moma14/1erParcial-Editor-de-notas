
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
     <div className='nav-container'>
        {/*aqui esta todo lo que contiene adentro el nav*/}
        <h1>Editor de Notas</h1>
        <h2>Bienvenido a mi editor de notas</h2>
     </div>
    </nav>
  );
};

export default Navbar;
