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
                    return(
                      <tr className={product.stock < 10 ? "text-danger" : ""} key={index}>
                        <td>{product.name}</td>
                        <td className="">
                          {product.stock}
                          {product.stock < 10 ? (<img
                            src={"../alert.png"}
                            alt=""
                            className="img-fluid px-4"
                          />) : ""}
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <h4>Faça o login para ter acesso ao sistema!</h4>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
