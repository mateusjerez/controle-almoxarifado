import React, { useState, useEffect } from "react";

import * as AuthService from "../services/auth.service";

import { getModeratorBoard} from "../services/user.service";
import EventBus from "../common/EventBus";

const Test: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

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
  return (
    <div className="container">
      <header className="jumbotron">
        {showModeratorBoard ? <h3>ABC</h3>
:
        <h3>{content}</h3>}
      </header>
    </div>
  );
};

export default Test;