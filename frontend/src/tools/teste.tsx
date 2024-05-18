import React, { useState, useEffect } from "react";
import {
  Formik,
  Field,
  Form,
  FieldArray
} from "formik";

//import { transactionout } from "../services/product.service";

import * as AuthService from "../services/auth.service";

import { getModeratorBoard } from "../services/user.service";
import EventBus from "../common/EventBus";

import {
  getAvailableList,
  getStand,
} from "../services/product.service";

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

  const handleTransaction = (formValue: {
    standIdent: string;
    transactions: Array<any>;
  }) => {
    setMessage("");
    setLoading(true);

    const { standIdent, transactions } = formValue;

    setStandIdent(standIdent);

    /*transactionout(product, quantity, stand, user.username, type).then(
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
    );*/
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
      } catch (error) {
        console.error("Erro ao obter barraca", error);
      }
    }

    fetchStand();

  }, [standIdent]);

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h4 className="card-title">Idenfique a Barraca</h4>
            <Formik initialValues={initialValues} onSubmit={handleTransaction}>
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
                  <div className="d-grid gap-2 d-md-flex col-3 mx-auto justify-content-md-end">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-sm"
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
              {({values}) => (
                <Form>
                  <FieldArray name="transactions" render={arrayHelpers => (
                    <div className="container">
                      {values.transactions.map((transaction, index) => (
                        <div key={index} className="row my-1">
                          <Field
                            name={`transactions.${index}.product`}
                            className="form-control col-6"
                            />
                          <Field
                            name={`transactions.${index}.quantity`}
                            className="form-control col-2 mx-1"
                            />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                            className="btn btn-danger"
                            >
                              -
                          </button>
                          <button 
                            type="button"
                            onClick={() => arrayHelpers.insert(index, {product: "", quantity: 0})}
                            className="btn btn-primary mx-1"
                            >
                              +
                          </button>
                        </div>
                      ))}
                    </div>
                  )}/>
                  <button type="submit" className="btn btn-info">Cadastrar</button>
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
        <h3 className="card-header">Saída de Produto</h3>
        <div className="card-body">{renderContent()}</div>
      </div>
    </>
  );
};

export default TransactionOut;
