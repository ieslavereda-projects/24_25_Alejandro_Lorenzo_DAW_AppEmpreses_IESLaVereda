import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles//UserForm.scss";

const UserForm = ({ onUserCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTutor, setIsTutor] = useState(false);
  const [studyCycle, setStudyCycle] = useState("");
  const [nia, setNia] = useState("");
  const [nif, setNif] = useState("");
  const [gender, setGender] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Nombre, correo electrónico y contraseña son obligatorios");
      return;
    }

    if (nia && isNaN(nia)) {
      setError("El NIA debe ser un número");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("is_admin", isAdmin ? '1' : '0');
    formData.append("is_student", isStudent ? '1' : '0');
    formData.append("is_tutor", isTutor ? '1' : '0');
    formData.append("study_cycle", studyCycle);
    formData.append("nia", nia);
    formData.append("nif", nif);
    formData.append("gender", gender);

    try {
      const response = await axios.post("/api/users", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201 && response.data.message) {
        setSuccess(true); 
        setError(null);
        setName("");
        setEmail("");
        setPassword("");
        setIsAdmin(false);
        setIsStudent(false);
        setIsTutor(false);
        setStudyCycle("");
        setNia("");
        setNif("");
        setGender("");

        alert('Usuario creado exitosamente');
        navigate("/user-menu");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(" ");
        setError(errorMessages);
      } else {
        setError("Hubo un error al crear el usuario");
      }
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Usuario</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">Usuario creado correctamente</div>}

      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingrese nombre"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingrese correo electrónico"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingrese contraseña"
          required
        />
      </div>

      <div className="form-group roles">
        <label>Roles</label>
        <div>
          <section>
            <label htmlFor="isAdmin">Administrador</label>
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </section>
          <section>
            <label htmlFor="isStudent">Estudiante</label>
            <input
              type="checkbox"
              id="isStudent"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
            />
          </section>
          <section>
            <label htmlFor="isTutor">Tutor</label>
            <input
              type="checkbox"
              id="isTutor"
              checked={isTutor}
              onChange={(e) => setIsTutor(e.target.checked)}
            />
          </section>

        </div>


      </div>

      <div className="form-group">
        <label htmlFor="studyCycle">Curso</label>
        <select
          id="studyCycle"
          value={studyCycle}
          onChange={(e) => setStudyCycle(e.target.value)}
          required
        >
          <option value="">Seleccionar</option>
          <option value="DAW">DAW</option>
          <option value="DAM">DAM</option>
          <option value="ASIR">ASIR</option>
          <option value="ESTETICA">ESTÉTICA</option>
        </select>
      </div>


      <div className="form-group">
        <label htmlFor="nia">NIA</label>
        <input
          type="text"
          id="nia"
          value={nia}
          onChange={(e) => setNia(e.target.value)}
          placeholder="Ingrese NIA"
        />
      </div>

      <div className="form-group">
        <label htmlFor="nif">NIF</label>
        <input
          type="text"
          id="nif"
          value={nif}
          onChange={(e) => setNif(e.target.value)}
          placeholder="Ingrese NIF"
        />
      </div>

      <div className="form-group">
        <label htmlFor="gender">Género</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div className="button">
        <button type="submit">Crear Usuario</button>
      </div>
    </form>
  );
};

export default UserForm;
