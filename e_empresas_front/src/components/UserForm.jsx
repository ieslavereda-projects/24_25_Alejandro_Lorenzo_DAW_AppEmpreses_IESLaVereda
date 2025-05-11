import React, { useState } from "react";
import axios from "axios";

const UserForm = ({ onUserCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTutor, setIsTutor] = useState(false);
  const [studyCycle, setStudyCycle] = useState("");
  const [nia, setNia] = useState("");
  const [nif, setNif] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!name || !email || !password) {
      setError("Nombre, correo electrónico y contraseña son obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("is_admin", isAdmin);
    formData.append("is_student", isStudent);
    formData.append("is_tutor", isTutor);
    formData.append("study_cycle", studyCycle);
    formData.append("nia", nia);
    formData.append("nif", nif);
    formData.append("gender", gender);
    if (photo) {
      formData.append("photo", photo);
    }
    formData.append("status", status);
    formData.append("email_verified", emailVerified);

    try {
      const response = await axios.post("http://localhost:8000/api/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Manejar respuesta exitosa
      if (response.status === 200) {
        setSuccess(true);
        setError(null);
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setIsAdmin(false);
        setIsStudent(false);
        setIsTutor(false);
        setStudyCycle("");
        setNia("");
        setNif("");
        setGender("");
        setPhoto(null);
        setStatus(true);
        setEmailVerified(false);
        
        // Llamar al callback para notificar que el usuario ha sido creado
        onUserCreated(response.data);
      }
    } catch (err) {
      // Manejar error
      setError("Hubo un error al crear el usuario");
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Usuario creado exitosamente</div>}
      
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
        <label htmlFor="phone">Teléfono</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ingrese teléfono"
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

      <div className="form-group">
        <label htmlFor="isAdmin">¿Es Administrador?</label>
        <input
          type="checkbox"
          id="isAdmin"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="isStudent">¿Es Estudiante?</label>
        <input
          type="checkbox"
          id="isStudent"
          checked={isStudent}
          onChange={(e) => setIsStudent(e.target.checked)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="isTutor">¿Es Tutor?</label>
        <input
          type="checkbox"
          id="isTutor"
          checked={isTutor}
          onChange={(e) => setIsTutor(e.target.checked)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="studyCycle">Ciclo de estudio</label>
        <input
          type="text"
          id="studyCycle"
          value={studyCycle}
          onChange={(e) => setStudyCycle(e.target.value)}
          placeholder="Ingrese ciclo de estudio"
        />
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
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="photo">Foto</label>
        <input
          type="file"
          id="photo"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Estado</label>
        <input
          type="checkbox"
          id="status"
          checked={status}
          onChange={(e) => setStatus(e.target.checked)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="emailVerified">Correo verificado</label>
        <input
          type="checkbox"
          id="emailVerified"
          checked={emailVerified}
          onChange={(e) => setEmailVerified(e.target.checked)}
        />
      </div>

      <button type="submit">Crear Usuario</button>
    </form>
  );
};

export default UserForm;
