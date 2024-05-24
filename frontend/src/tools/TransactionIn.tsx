import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { transactionin } from "../services/product.service";

import * as AuthService from "../services/auth.service";

import { getModeratorBoard } from "../services/user.service";
import EventBus from "../common/EventBus";
import ITransaction from "../types/transaction.type";

import { getProductList } from "../services/product.service";

const ProductIn: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [successful, setSuccessful] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [producList, setProductList] = useState<any[]>([]);

  const initialValues: ITransaction = {
    product: "",
    stand: "",
    quantity: 0,
    user: "",
  };

  const closeAlert = () => {
    setMessage("");
    window.location.reload();
  };

  const validationSchema = Yup.object().shape({
    product: Yup.string().required("Preenchimento obrigatório!"),
    quantity: Yup.string().required("Preenchimento obrigatório!"),
  });

  const handleTransaction = (formValue: ITransaction) => {
    const user = AuthService.getCurrentUser();
    const type = "IN";
    const { product, quantity } = formValue;

    setMessage("");
    setLoading(true);

    transactionin(product, quantity, user.username, type).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

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
        const response = await getProductList();
        setProductList(response.data.productList);
      } catch (error) {
        console.error("Erro ao obter lista de produtos:", error);
      }
    };

    fetchProductList();
  }, []);
  return (
    <div className="card col-8">
      <header className="">
        {showModeratorBoard ? (
          <div>
            <div className="card-header d-flex flex-row">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M12 2L12 10M12 10L15 7M12 10L9 7"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M2 13H5.16026C6.06543 13 6.51802 13 6.91584 13.183C7.31367 13.3659 7.60821 13.7096 8.19729 14.3968L8.80271 15.1032C9.39179 15.7904 9.68633 16.1341 10.0842 16.317C10.482 16.5 10.9346 16.5 11.8397 16.5H12.1603C13.0654 16.5 13.518 16.5 13.9158 16.317C14.3137 16.1341 14.6082 15.7904 15.1973 15.1032L15.8027 14.3968C16.3918 13.7096 16.6863 13.3659 17.0842 13.183C17.482 13 17.9346 13 18.8397 13H22"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  ></path>{" "}
                  <path
                    d="M22 12.0001C22 16.7141 22 19.0712 20.5355 20.5356C19.0711 22.0001 16.714 22.0001 12 22.0001C7.28595 22.0001 4.92893 22.0001 3.46447 20.5356C2 19.0712 2 16.7141 2 12.0001C2 7.28604 2 4.92902 3.46447 3.46455C4.28094 2.64808 5.37486 2.28681 7 2.12695M17 2.12695C18.6251 2.28681 19.7191 2.64808 20.5355 3.46455C21.5093 4.43829 21.8356 5.80655 21.9449 8"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  ></path>{" "}
                </g>
              </svg>

              <h3 className="px-3">Entrada de Produto</h3>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleTransaction}
              >
                <Form>
                  {!successful && (
                    <div className="container">
                      <div className="row">
                        <div className="form-group col-8">
                          <label htmlFor="product">Produto</label>
                          <Field
                            name="product"
                            as="select"
                            className="form-control"
                          >
                            <option value="">Selecione o Produto</option>
                            {producList.map((product: any, index: number) => (
                              <option value={product.id}>{product.name}</option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="product"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>

                        <div className="form-group col-2">
                          <label htmlFor="quantity">Quantidade</label>
                          <Field
                            name="quantity"
                            type="number"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="quantity"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      <div className="d-grid gap-2 d-md-flex mx-auto justify-content-md-center">
                        <button
                          type="submit"
                          className="btn btn-info btn-sm"
                          disabled={loading}
                        >
                          <span>Cadastrar</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {message && (
                    <div className="form-group mt-4">
                      <div
                        className={
                          successful
                            ? "alert alert-success d-flex align-items-center justify-content-between"
                            : "alert alert-danger d-flex align-items-center justify-content-between"
                        }
                        role="alert"
                      >
                        {message}
                        <input
                          type="button"
                          className={
                            successful
                              ? "btn btn-outline-success btn-sm"
                              : "btn btn-outline-danger btn-sm"
                          }
                          data-bs-dismiss="alert"
                          value="X"
                          aria-label="Close"
                          onClick={closeAlert}
                        />
                      </div>
                    </div>
                  )}
                </Form>
              </Formik>
            </div>
          </div> //-------------------------------//
        ) : (
          <h3>{content}</h3>
        )}
      </header>
    </div>
  );
};

export default ProductIn;
