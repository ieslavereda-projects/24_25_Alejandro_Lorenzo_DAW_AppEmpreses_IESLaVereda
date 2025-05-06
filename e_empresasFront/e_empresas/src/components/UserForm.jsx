import { useState } from 'react'
import axios from 'axios'

import '../styles/UserForm.scss'

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        is_admin: false,
        is_student: false,
        is_tutor: false,
        is_instructor: false,
        study_cycle: '',
        nia: '',
        nif: '',
        nuss: '',
        phones: '',
        address: '',
        province: '',
        locality: '',
        zip_code: '',
        gender: '',
        photo: null
    })

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const { name, type, value, checked, files } = e.target
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked })
        } else if (type === 'file') {
            setFormData({ ...formData, photo: files[0] })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = new FormData()
        for (const key in formData) {
            form.append(key, formData[key])
            const value = formData[key]
            if (typeof value === 'boolean') {
                form.append(key, value ? 1 : 0)
            } else {
                form.append(key, value)
            }
        }


        try {
            await axios.post('http://localhost:8000/api/users', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setSuccess(true)
            setError(null)
            setFormData({
                name: '',
                email: '',
                password: '',
                is_admin: false,
                is_student: false,
                is_tutor: false,
                is_instructor: false,
                study_cycle: '',
                nia: '',
                nif: '',
                nuss: '',
                phones: '',
                address: '',
                province: '',
                locality: '',
                zip_code: '',
                gender: '',
                photo: null
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear usuario')
            setSuccess(false)
        }
    }

    return (
        <div className="form-container mt-4 container-fluid col-12">
            <h2 className='mb-3'>Agregar usuario</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data">

                <div className="row">

                        <div className="col-12 col-md-6 mb-3">
                            <label>Nombre</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label>Contraseña</label>
                            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="col-12 mb-3">
                            <label>Correo</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div>

                </div>


                    <div className="">
                        <h5 className='text-left mb-3'>Tipo de usuario</h5>

                        {['is_admin', 'is_student', 'is_tutor', 'is_instructor'].map((field) => (
                            <div className="form-check col-12 col-md-3" key={field}>
                                <input className="form-check-input" type="checkbox" name={field} checked={formData[field]} onChange={handleChange} />
                                <label className="form-check-label">{field.replace('is_', '').toUpperCase()}</label>
                            </div>
                        ))}
                    </div>
                    {[
                        ['study_cycle', 'Ciclo formativo'],
                        ['nia', 'NIA'],
                        ['nif', 'NIF'],
                        ['nuss', 'NUSS'],
                        ['phones', 'Teléfonos'],
                        ['address', 'Dirección'],
                        ['province', 'Provincia'],
                        ['locality', 'Localidad'],
                        ['zip_code', 'Código Postal'],
                        ['gender', 'Género']
                    ].map(([name, label]) => (
                        <div className="mb-3 col-12 col-md-6" key={name}>
                            <label className="form-label">{label}</label>
                            <input type="text" name={name} className="form-control" value={formData[name]} onChange={handleChange} />
                        </div>
                    ))}

                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label">Foto</label>
                        <input type="file" name="photo" className="form-control" onChange={handleChange} />
                    </div>

                <button type="submit" className="btn btn-primary mt-3">Guardar</button>
                {success && <div className="alert alert-success">Usuario creado correctamente</div>}
                {error && <div className="alert alert-danger">{error}</div>}
            </form>
        </div>
    )
}

export default UserForm
