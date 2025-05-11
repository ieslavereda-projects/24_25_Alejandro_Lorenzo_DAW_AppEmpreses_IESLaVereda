import React, { useState } from "react";
import UserForm from "../components/UserForm";
import "../styles/AddUserPage.scss";

const AddUserPage = () => {
  const [userCreated, setUserCreated] = useState(null);

  const handleUserCreated = (user) => {
    setUserCreated(user);
  };

  return (
    <div className="add-user-page">
      <h1>Agregar Usuario</h1>
      <UserForm onUserCreated={handleUserCreated} />

      {userCreated && (
        <div className="user-created-message">
          <p>Usuario creado: {userCreated.name}</p>
        </div>
      )}
    </div>
  );
};

export default AddUserPage;
