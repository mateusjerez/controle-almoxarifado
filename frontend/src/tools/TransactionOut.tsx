import React, { useState, useEffect } from "react";
import { Formik, Field, Form, FieldArray } from "formik";

import { transactionout } from "../services/product.service";

import * as AuthService from "../services/auth.service";

import { getModeratorBoard } from "../services/user.service";
import EventBus from "../common/EventBus";

import { getAvailableList, getStand } from "../services/product.service";

const TransactionOut: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [successful, setSuccessful] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [standIdent, setStandIdent] = useState<string>("");
  const [standName, setStandName] = useState<string>("");
  const [productAvailable, setProductAvailable] = useState<any[]>([]);
  const [standId, setStandId] = useState<number>(0);

  const initialValues: {
    standIdent: "";
    transactions: [
      {
        product: "";
        quantity: 0;
      }
    ];
  } = {
    standIdent: "",
    transactions: [
      {
        product: "",
        quantity: 0,
      },
    ],
  };

  const handleIdent = (formValue: {
    standIdent: string;
    transactions: Array<any>;
  }) => {
    setMessage("");
    setLoading(true);

    const { standIdent } = formValue;

    setStandIdent(standIdent);
  };

  const handleTransaction = (formValue: {
    standIdent: string;
    transactions: Array<any>;
  }) => {
    setMessage("");
    setLoading(true);

    console.log("standName = " + standName);

    const type = "OUT";
    const user = AuthService.getCurrentUser();

    const { transactions } = formValue;

    transactions.forEach((transaction) => {
      const { product, quantity } = transaction;

      console.log("product = " + product);
      console.log("quantity = " + quantity);

      transactionout(product, quantity, standId, user.username, type).then(
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
    });
  };

  const closeAlert = () => {
    setMessage("");
    window.location.reload();
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
  }, []);

  useEffect(() => {
    if (!standIdent) return;

    const fetchProductAvailable = async () => {
      try {
        const response = await getAvailableList(standIdent);
        setProductAvailable(response.data.availableList);
        setLoading(false);
        setCurrentStep(3);
      } catch (error) {
        console.error("Erro ao obter lista de produtos disponíveis:", error);
      }
    };

    fetchProductAvailable();

    const fetchStand = async () => {
      try {
        const response = await getStand(standIdent);
        setStandName(response.data.stand.name);
        setStandId(response.data.stand.id);
      } catch (error) {
        console.error("Erro ao obter barraca", error);
      }
    };

    fetchStand();
  }, [standIdent]);

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h4 className="card-title">Idenfique a Barraca</h4>
            <Formik initialValues={initialValues} onSubmit={handleIdent}>
              <Form>
                <div>
                  <div className="form-group">
                    <label htmlFor="standIdent">
                      Digite a idenficação da Barraca
                    </label>
                    <Field
                      type="text"
                      name="standIdent"
                      className="form-control"
                    />
                  </div>
                  <div className="d-grid gap-2 d-md-flex mx-auto justify-content-md-center">
                    <button
                      type="submit"
                      className="btn btn-info btn-sm"
                      disabled={loading}
                    >
                      {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>Próximo</span>
                    </button>
                    {message && (
                      <div className="form-group">
                        <div
                          className={
                            successful
                              ? "alert alert-success"
                              : "alert alert-danger"
                          }
                          role="alert"
                        >
                          {message}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Form>
            </Formik>
          </>
        );
        break;

      case 3:
        return (
          <>
            <h4 className="card-title">
              Liste os Produtos para a barraca {standName}
            </h4>
            <Formik initialValues={initialValues} onSubmit={handleTransaction}>
              {({ values }) => (
                <Form>
                  {!successful && (
                    <>
                      <FieldArray
                        name="transactions"
                        render={(arrayHelpers) => (
                          <div className="d-flex flex-column-reverse">
                            {values.transactions.map((transaction, index) => (
                              <div key={index} className="row my-1">
                                <Field
                                  name={`transactions.${index}.product`}
                                  as="select"
                                  className="form-control col-6"
                                >
                                  <option value="">Selecione um produto</option>
                                  {productAvailable.map((product) => (
                                    <option key={product.id} value={product.id}>
                                      {product.name}
                                    </option>
                                  ))}
                                </Field>
                                <Field
                                  name={`transactions.${index}.quantity`}
                                  type="number"
                                  className="form-control col-2 mx-1"
                                />
                                {productAvailable.length > 1 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        arrayHelpers.insert(index, {
                                          product: "",
                                          quantity: 0,
                                        })
                                      }
                                      className="btn btn-primary mx-1"
                                    >
                                      <svg
                                        width="22px"
                                        height="22px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g
                                          id="SVGRepo_bgCarrier"
                                          stroke-width="0"
                                        ></g>
                                        <g
                                          id="SVGRepo_tracerCarrier"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                          {" "}
                                          <path
                                            d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                                            stroke="#ffffff"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                          ></path>{" "}
                                          <path
                                            d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                                            stroke="#ffffff"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                          ></path>{" "}
                                        </g>
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => arrayHelpers.remove(index)}
                                      className="btn btn-danger"
                                    >
                                      <svg
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g
                                          id="SVGRepo_bgCarrier"
                                          stroke-width="0"
                                        ></g>
                                        <g
                                          id="SVGRepo_tracerCarrier"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                          {" "}
                                          <path
                                            d="M18 2.05222C19.3683 2.14165 20.2228 2.38425 20.7896 3.04233C21.6872 4.08466 21.4469 5.68646 20.9664 8.89004L19.7664 16.89C19.4008 19.3276 19.2179 20.5464 18.374 21.2732C17.5301 22 16.2976 22 13.8328 22H10.167C7.70216 22 6.46972 22 5.6258 21.2732C4.78187 20.5464 4.59905 19.3276 4.23341 16.89L3.03341 8.89004C2.55287 5.68645 2.3126 4.08466 3.21024 3.04233C4.10789 2 5.7276 2 8.96703 2H14"
                                            stroke="#ffffff"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                          ></path>{" "}
                                          <path
                                            d="M21 6H3"
                                            stroke="#ffffff"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                          ></path>{" "}
                                          <path
                                            d="M19 19H5"
                                            stroke="#ffffff"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                          ></path>{" "}
                                          <path
                                            d="M8 6L3.5 11L11 19M14 6L4 16M20 6L7 19M13 19L20.5 11L16 6M10 6L20 16M4 6L17 19"
                                            stroke="#ffffff"
                                            stroke-width="1.5"
                                            stroke-linejoin="round"
                                          ></path>{" "}
                                        </g>
                                      </svg>
                                    </button>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      />
                      <button type="submit" className="btn btn-info mt-3">
                        Concluir
                      </button>
                    </>
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
              )}
            </Formik>
          </>
        );
        break;
    }
  };

  return (
    <>
      <div className="card col-8">
        {showModeratorBoard && (
          <>
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
                    d="M12 10L12 2M12 2L15 5M12 2L9 5"
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
              <h3 className="px-3">Saída de Produto</h3>
            </div>

            <div className="card-body">{renderContent()}</div>
          </>
        )}
      </div>
    </>
  );
};

export default TransactionOut;
