import React, { useState, useEffect } from 'react';
import showAlert, { confirmation, sendRequest, formatDate } from '../../functions';
import Modal from '../../components/Modal';
import MUIDataTable from "mui-datatables";


const User = () => {

  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState('');
  const closeModal = () => setModalOpen(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idUser, setIdUser] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [admin, setAdmin] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  const openModal = (op, id, name, email,admin) => {
    
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setIdUser('');
    setAdmin('');
    setEmailError('');

    setOperation(op);
    if(op == 1){
      setTitle('Crear Usuario');
    }else{
      setTitle('Editar Usuario');
      setName(name);
      setEmail(email);
      setIdUser(id);
      setAdmin(admin);
    }

    setModalOpen(true);
  }

  const [emailError, setEmailError] = useState('');

    const handleEmailChange = (e) => {
        
        const value = e.target.value.toLowerCase();
        setEmail(value);

        // Validación de correo electrónico
        if (!validateEmail(value)) {
            setEmailError('Por favor ingrese un correo electrónico válido.');
        } else {
            setEmailError('');
        }
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

  //Options Datatable
  const options = {
    filter: false,
    selectableRows: "none",
    responsive: 'standard',
    elevation: 8,
    rowsPerPage: 6,
    rowsPerPageOptions: [],
    download: true,
    print: false,
    downloadOptions: { filename: 'users.csv', separator: ',' },
    textLabels: {
      body: {
        noMatch: isLoading ? 'Cargando datos...' : 'No se encontraron registros',
      },
    },
  };

  const columns = [

    { name: 'id', label: 'ID', options: { filter: false, sort: true } },
    { name: 'name', label: 'Nombre', options: { filter: false, sort: true } },
    { name: 'email', label: 'Correo', options: { filter: false, sort: true } },
    { name: 'admin', label: 'Admin', options: { filter: false, sort: true, customBodyRender: (value) => {
      return value
        ? <span className="text-green-600 font-semibold">Sí</span>
        : <span className="text-gray-600">No</span>;
    } } },
    {
      name: 'created_at', label: 'Creado', options: {
        filter: false, sort: true,
        customBodyRender: (value) => {
          return formatDate(value);
        }
      }
    },
    {
      name: 'acciones',
      label: 'Acciones',
      options: {
          filter: false,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
              const id = tableMeta.rowData[0];
              const name = tableMeta.rowData[1];
              const email = tableMeta.rowData[2];
              const admin = tableMeta.rowData[3];
              return (
                  <>
                      <div className='inline-flex justify-center space-x-4 w-full'>
                          <button className="block text-white hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#8EB42D]" onClick={() => openModal(2, id, name, email, admin)}><i className="fa-solid fa-file-pen"></i></button>
                          <button className="block text-white hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#be0a0a]" onClick={() => deleteUsers(id, name)}><i className="fa-solid fa-trash"></i></button>
                          
                      </div>

                  </>
              );
          },
      },
  },
  ];

  const deleteUsers = (id_, name) => {
    confirmation(name, '/api/users/' + id_, 'usuarios');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let method;
      let url;

      if(operation == 1){
        method = 'POST';
        url = '/api/users';
      }else{
        method = 'PUT';
        url = '/api/users/' + idUser;
      }
      const response = await sendRequest(method, { name: name, admin:admin,email: email, password: password, password_confirmation: password_confirmation, type_register: 'user_jmci' }, url , '', true);

      if (response.status == 201 || response.status == 200) {
        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        closeModal(false);
        getUsers();
        setSubmitting(false);
      }
      setSubmitting(false);
    } catch (error) {
      showAlert('error', error.message);
      setSubmitting(false);
    }

  }
  const getUsers = async () => {
    const response = await sendRequest('GET', {}, '/api/users', '', true);
    setUsers(response.data.users);
    setIsLoading(false);
  }

  useEffect(() => {

    getUsers();
  }, []);
  
  return (
    <div>
      <button
        className="block text-white bg-primary hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        onClick={() => openModal(1)}
      >
        <i className='fa-solid fa-circle-plus'></i>
      </button>
      <div className='mt-6'>
        <MUIDataTable
          title={"Usuarios"}
          data={users}
          columns={columns}
          options={options}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title='Crear Usuarios'
        modal='usuariosModal'
        ancho='full max-w-2xl'
      >
        <form onSubmit={handleSubmit} autoComplete='off'>
          <div className="grid md:grid-cols-2 md:gap-6">

            <div className="relative z-0 w-full mb-5 group">
              <input type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-acent focus:outline-none focus:ring-0 focus:border-acent peer" placeholder=" " 
              value={name} onChange={(e) => setName(e.target.value)} required />
              <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombres</label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-acent focus:outline-none focus:ring-0 focus:border-acent peer" placeholder=" " 
              value={email}  onChange={handleEmailChange} required />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}

              <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-acent focus:outline-none focus:ring-0 focus:border-acent peer" placeholder=" " 
              value={password} onChange={(e) => setPassword(e.target.value)} {...(operation === 1 ? { required: true } : {})} />
              <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input type="password" name="password_confirmation" id="password_confirmation" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-acent focus:outline-none focus:ring-0 focus:border-acent peer" placeholder=" " 
              value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} {...(operation === 1 ? { required: true } : {})} />
              <label htmlFor="password_confirmation" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password Confirmation</label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
            <label htmlFor="" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">¿El usuario es administrador?</label>
              
             
            <label htmlFor="si" className='peer-focus:font-medium text-sm text-gray-500 mx-2'>
               <input type="radio" value="1" id='si'name='admin'  checked={admin === 1} className='mr-2' onChange={(e) => setAdmin(Number(e.target.value))}/>
               SI
            </label>

            <label htmlFor="no" className='peer-focus:font-medium text-sm text-gray-500 mx-2'>
               <input type="radio" value="0" id='no' name='admin'  checked={admin === 0} className='mr-2 mt-2' onChange={(e) => setAdmin(Number(e.target.value))}/>
               NO
            </label>
              
            </div>


          </div>
          <div className="relative flex justify-end">
            <button type="submit" disabled={submitting} className='py-2.5 px-5 w-full md:w-1/5  text-sm font-medium hover:bg-acent bg-primary text-white focus:outline-none rounded-lg border border-gray-600  focus:z-10 focus:ring-4 focus:ring-gray-700'>Guardar</button>
          </div>
        </form>

      </Modal>

    </div>
  )
}

export default User