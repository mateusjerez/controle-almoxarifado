import React, { useState, useEffect } from "react";

import * as AuthService from "../services/auth.service";

import { getProductList } from "../services/product.service";

const ListProducts: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  
  const [producList, setProductList] = useState<any[]>([]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
    }

    const fetchProductList = async () => {
      try {
        const response = await getProductList();
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
                {producList.map((product: any, index: number) => {
                  if (product.stock < 10) {
                    return (
                      <tr className="text-danger" key={index}>
                        <th scope="row">{product.name}</th>
                        <td className="">{product.stock}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr className="" key={index}>
                        <th scope="row">{product.name}</th>
                        <td>{product.stock}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <h4>Faça o login para ter acesso ao sistema!</h4>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
