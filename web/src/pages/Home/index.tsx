import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

import './styles.css';

const Home: React.FC = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="brogrammer" />
        </header>

        <main>
          <h1>Local de estudos para programadores</h1>
          <p>
            Ajudamos programadores a encontrar parceiros de estudos em várias
            stacks..
          </p>

          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um Brogramador</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
