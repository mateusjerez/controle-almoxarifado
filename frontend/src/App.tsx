import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import * as AuthService from "./services/auth.service";
import IUser from "./types/user.type";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./tools/ListProducts";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import ListProducts from "./tools/ListProducts";
import AddProduct from "./tools/AddProduct";
import TransactionIn from "./tools/TransactionIn";
import TransactionOut from "./tools/TransactionOut";
import EventBus from "./common/EventBus";
//import Teste from "./tools/teste";


const App: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <div className="flex row container-fluid">
          <nav className="container navbar navbar-dark flex col-md-2 d-md-block bg-primary bg-gradient flex-column min-vh-100 sidebar gap=3">
            <Link to={"/"} className="navbar-brand">
              Controle
            </Link>
            <div className="flex">
              <div className="flex">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link to={"/home"} className="nav-link text-white">
                      Home
                    </Link>
                  </li>

                  {showModeratorBoard && (
                    <>
                      <li className="nav-item">
                        <Link to={"/addproduct"} className="nav-link text-white">
                          Cadastro de Produto
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link to={"/transactionin"} className="nav-link text-white">
                          Entrada de Produtos
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link to={"/transactionout"} className="nav-link text-white">
                          Saída de Produtos
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="pt-">
              {currentUser ? (
                <div className="flex align-self-en">
                  <div className="navbar-nav flex-column">
                    <li className="nav-item">
                      <Link to={"/profile"} className="nav-link">
                        Usuário: {currentUser.username}
                      </Link>
                    </li>

                    <li className="nav-item">
                      <a href="/login" className="nav-link" onClick={logOut}>
                        LogOut
                      </a>
                    </li>
                  </div>
                </div>
              ) : (
                <div className="align-self-end">
                  <div className="navbar-nav">
                    <li className="nav-item">
                      <Link to={"/login"} className="nav-link">
                        Login
                      </Link>
                    </li>
                  </div>
                </div>
              )}
            </div>
          </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/listproduct" element={<ListProducts />} />
            <Route path="/transactionin" element={<TransactionIn />} />
            <Route path="/transactionout" element={<TransactionOut />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;