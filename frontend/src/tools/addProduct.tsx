import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { addproduct, getStandList } from "../services/product.service";
import IProduct from "../types/product.type";

import * as AuthService from "../services/auth.service";

import { getModeratorBoard } from "../services/user.service";
import EventBus from "../common/EventBus";

const AddProduct: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [successful, setSuccessful] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [standList, setStandList] = useState<any[]>([]);

  const initialValues: IProduct = {
    name: "",
    stands: [],
    unit: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Preenchimento obrigatório!"),
    unit: Yup.string().required("Preenchimento obrigatório!"),
  });

  const closeAlert = () => {
    setMessage("");
    window.location.reload();
  };

  const handleProduct = (formValue: IProduct) => {
    const { name, stands, unit } = formValue;

    setMessage("");
    setLoading(true);

    addproduct(name, stands, unit).then(
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

    const fetchStandList = async () => {
      try {
        const response = await getStandList();
        setStandList(response.data.standList);
      } catch (error) {
        console.error("Erro ao obter lista de barracas:", error);
      }
    };

    fetchStandList();
  }, []);
  return (
    <div className="">
      <header className="">
        {showModeratorBoard ? (
          <div className="card col-8">
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
                    d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  ></path>{" "}
                  <path
                    d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  ></path>{" "}
                </g>
              </svg>
              <h3 className="px-3">Cadastro de Produto</h3>
            </div>

            <div className="card-body">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleProduct}
              >
                <Form>
                  {!successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="name">Nome do Produto</label>
                        <Field
                          name="name"
                          type="text"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>
                      <label htmlFor="stands">Barracas</label>
                      <div className="form-group container-fluid">
                        <div className="row align-middle">
                          {standList.map((stand: any, index: number) => (
                            <div key={index} className="form-check col-4">
                              <Field
                                name="stands"
                                type="checkbox"
                                value={stand.name}
                                className="form-check-input form-control-sm"
                              />
                              <label className="form-check-label">
                                {stand.name}
                              </label>
                            </div>
                          ))}
                        </div>

                        <ErrorMessage
                          name="stands"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="unit">Medida</label>
                        <Field name="unit" as="select" className="form-control">
                          <option value="">Selecione a unidade de medida</option>
                          <option value="quilo">Kg</option>
                          <option value="unidade">Unidade</option>
                          <option value="litro">Litro</option>
                          <option value="pacote">Pacote</option>
                          <option value="caixa">Caixa</option>
                        </Field>
                        <ErrorMessage
                          name="unit"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="d-grid gap-2 col-2 mx-auto">
                        <button
                          type="submit"
                          className="btn btn-info"
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

export default AddProduct;
