import React, { useState, useEffect } from "react";
import * as AuthService from "../services/auth.service";
import { getProductList } from "../services/product.service";
import { getMovement } from "../services/report.service";

const ListProducts: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);

  const [producList, setProductList] = useState<any[]>([]);
  const [productEntry, setProductEntry] = useState<any[]>([]);
  const [productOut, setProductOut] = useState<any[]>([]);

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

    const fetchProductEntry = async () => {
      try {
        const response = await getMovement("1", "IN");
        setProductEntry(response.data);
      } catch (error) {
        console.error("Erro ao obter entrada de produtos", error);
      }
    };

    const fetchProductOut = async () => {
      try {
        const response = await getMovement("1", "OUT");
        setProductOut(response.data);
      } catch (error) {
        console.error("Erro ao obter saída de produtos", error);
      }
    };

    fetchProductEntry();
    fetchProductOut();
  }, []);

  return (
    <div>
      {showModeratorBoard ? (
        <div className="card">
          <div className="card-header d-flex flex-row">
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M18.18 8.03933L18.6435 7.57589C19.4113 6.80804 20.6563 6.80804 21.4241 7.57589C22.192 8.34374 22.192 9.58868 21.4241 10.3565L20.9607 10.82M18.18 8.03933C18.18 8.03933 18.238 9.02414 19.1069 9.89309C19.9759 10.762 20.9607 10.82 20.9607 10.82M18.18 8.03933L13.9194 12.2999C13.6308 12.5885 13.4865 12.7328 13.3624 12.8919C13.2161 13.0796 13.0906 13.2827 12.9882 13.4975C12.9014 13.6797 12.8368 13.8732 12.7078 14.2604L12.2946 15.5L12.1609 15.901M20.9607 10.82L16.7001 15.0806C16.4115 15.3692 16.2672 15.5135 16.1081 15.6376C15.9204 15.7839 15.7173 15.9094 15.5025 16.0118C15.3203 16.0986 15.1268 16.1632 14.7396 16.2922L13.5 16.7054L13.099 16.8391M13.099 16.8391L12.6979 16.9728C12.5074 17.0363 12.2973 16.9867 12.1553 16.8447C12.0133 16.7027 11.9637 16.4926 12.0272 16.3021L12.1609 15.901M13.099 16.8391L12.1609 15.901"
                  stroke="#000000"
                  strokeWidth="1.5"
                ></path>{" "}
                <path
                  d="M8 13H10.5"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M8 9H14.5"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M8 17H9.5"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M3 14V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157M21 14C21 17.7712 21 19.6569 19.8284 20.8284M4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284M19.8284 20.8284C20.7715 19.8853 20.9554 18.4796 20.9913 16"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
              </g>
            </svg>
            <h4 className="px-3">Produtos em Estoque</h4>
          </div>

          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr className="table-active">
                  <th scope="col">Produto</th>
                  <th scope="col" className="text-center">Entrada Total</th>
                  <th scope="col" className="text-center">Saída Total</th>
                  <th scope="col" className="text-center">Estoque Atual</th>
                </tr>
              </thead>
              <tbody>
                {producList.map((product: any, index: number) => {
                  let entryValue = 0;
                  let outValue = 0;

                  const entry = productEntry.find(
                    (entry) => entry.label === product.name
                  );

                  if (entry) {
                    entryValue = entry.value;
                  }

                  const out = productOut.find(
                    (out) => out.label === product.name
                  );

                  if (out) {
                    outValue = out.value;
                  }
                  return (
                    <tr
                      // className={product.stock < 10 ? "text-danger" : ""}
                      className=""
                      key={index}
                    >
                      <td>{product.name}</td>
                      <td className="text-center">{entryValue}</td>
                      <td className="text-center">{outValue}</td>
                      <td className="text-center">
                        {product.stock}
                        {/* {product.stock < 10 ? (
                          <span className="px-3">
                            <svg
                              width="20px"
                              height="20px"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path
                                  d="M6.30928 9C8.59494 5 9.96832 3 12 3C14.3107 3 15.7699 5.58716 18.6883 10.7615L19.0519 11.4063C21.4771 15.7061 22.6897 17.856 21.5937 19.428C20.4978 21 17.7864 21 12.3637 21H11.6363C6.21356 21 3.50217 21 2.40626 19.428C1.45498 18.0635 2.24306 16.2635 4.05373 13"
                                  stroke="#ff0000"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                ></path>{" "}
                                <path
                                  d="M12 8V13"
                                  stroke="#ff0000"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                ></path>{" "}
                                <circle
                                  cx="12"
                                  cy="16"
                                  r="1"
                                  fill="#ff0000"
                                ></circle>{" "}
                              </g>
                            </svg>
                          </span>
                        ) : (
                          ""
                        )} */}
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
