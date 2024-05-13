import React, { useState, useEffect } from "react";

import * as AuthService from "../services/auth.service";
import { getModeratorBoard } from "../services/user.service";
import EventBus from "../common/EventBus";

import { getList } from "../services/product.service";

const ListProducts: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [content, setContent] = useState<String>("");

  const [producList, setProductList] = useState<any[]>([]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
    }

    getModeratorBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );

    const fetchProductList = async () => {
      try {
        const response = await getList();
        setProductList(response.data.productList);
      } catch (error) {
        console.error("Erro ao obter lista de produtos:", error);
      }
    };

    fetchProductList();
  }, []);

  return (
    <div>
      {showModeratorBoard ? (
        <div className="card">
          <h4 className="card-header">Produtos em Estoque</h4>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr className="table-active">
                  <th scope="col">Produto</th>
                  <th scope="col">Estoque</th>
                </tr>
              </thead>
              <tbody>
                {producList.map((product: any, index: number) => (
                  <tr className="">
                    <th scope="row"> {product.productname}</th>
                    <td>{product.productStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <h3>Faça o login para ter acesso ao sistema!</h3>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
