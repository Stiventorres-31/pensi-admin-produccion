import React, { useState, useEffect } from 'react';
import showAlert, { confirmation, sendRequest, formatDate } from '../../functions';
import Modal from '../../components/Modal';
import MUIDataTable from "mui-datatables";


const Genero = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [generos, setGeneros] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [operation, setOperation] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [id, setId] = useState('');

    const openModal = (op, id, descrip) => {
        setOperation(op);
        if (op == 1) {
            setTitle('Crear Genero');
        } else {
            setTitle('Editar Genero');
            setId(id);
            setDescripcion(descrip);
        }
        setIsModalOpen(true);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let method = '';
        let url = '';
       
        setSubmitting(true);

        if(operation == 1){
            method = 'POST';
            url = '/api/generos';
          
        }else{
            method = 'PUT';
            url = '/api/generos/' + id;
        }
        const response = await sendRequest(method, { descripcion: descripcion }, url, '', true);

        if (response.status == 201 || response.status == 200) {

            getGeneros();
            setId('');
            setDescripcion('');
            closeModal();
        }
        setSubmitting(false);

    }

    const handleVer = (id) => {
        //Constante para redirigir a vista inmuebles con el genero.
    };

    const deleteGeneros = (id_, name) => {
        confirmation(name, '/api/generos/' + id_, 'generos');
    }

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
        downloadOptions: { filename: 'generos.csv', separator: ',' },
        textLabels: {
            body: {
                noMatch: isLoading ? 'Cargando datos...' : 'No se encontraron registros',
            },
        },
    };

    const columns = [

        { name: 'id_genero', label: 'ID', options: { filter: false, sort: true } },
        { name: 'descripcion', label: 'Nombre', options: { filter: false, sort: true } },
        { name: 'created_at', label: 'Creado', options: { filter: false, sort: true,
            customBodyRender: (value) => {
                return formatDate(value);
              }
         } },
        { name: 'updated_at', label: 'Actualizado', options: { filter: false, sort: true,
            customBodyRender: (value) => {
                return formatDate(value);
              }
         } },

        {
            name: 'acciones',
            label: 'Acciones',
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const id = tableMeta.rowData[0];
                    const name = tableMeta.rowData[1];
                    return (
                        <>
                            <div className='inline-flex justify-center space-x-4 w-full'>
                                <button className="block text-white hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#8EB42D]" onClick={() => openModal(2, id, name)}><i className="fa-solid fa-file-pen"></i></button>
                                <button className="block text-white hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#be0a0a]" onClick={() => deleteGeneros(id, name)}><i className="fa-solid fa-trash"></i></button>
                                <button disabled className="hidden text-white hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary" onClick={() => handleVer(id)}><i className="fa-solid fa-eye"></i></button>
                            </div>

                        </>
                    );
                },
            },
        },
    ];

    const getGeneros = async () => {
        const response = await sendRequest('GET', {}, '/api/generos', '', false);
        setGeneros(response.data.generos);
        setIsLoading(false);
    }

    useEffect(() => {

        getGeneros();
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
                    title={"Generos"}
                    data={generos}
                    columns={columns}
                    options={options}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={title}
                modal='generosModal'
                ancho='full max-w-2xl'
            >
                <form onSubmit={handleSubmit} autoComplete='off'>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="col-span-2">
                            <div className="relative z-0 w-full mb-5 group">
                                <input type="text" name="descripcion" id="descripcion" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-acent focus:outline-none focus:ring-0 focus:border-acent peer" placeholder=" " value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                                <label htmlFor="descripcion" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex justify-end">
                        <button type="submit" disabled={submitting} className='py-2.5 px-5 w-full md:w-1/5  text-sm font-medium text-white focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-acent focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-acent dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-primary'>Guardar</button>
                    </div>


                </form>
            </Modal>

        </div>
    )
}

export default Genero