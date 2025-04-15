import React, { useState, useEffect } from 'react';
import showAlert, { confirmation, sendRequest, formatDate } from '../../functions';
import Modal from '../../components/Modal';
import MUIDataTable from "mui-datatables";
import storage from "../../storage/storage";

function Blog() {

    const [isLoading, setIsLoading] = useState(true);
    const API_URL = storage.getAPI_URL();
    const [novedades, setNovedades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);
    const [submitting, setSubmitting] = useState(false);
    const [operation, setOperation] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [title, setTitle] = useState('');
    const [etiqueta, setEtiqueta] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [foto, setFoto] = useState(null);
    const [link_n, setLink_n] = useState('');
    const [id, setId] = useState('');

    const openModal = (op, id_, t, d, e, l) => {
        setOperation(op);
        if (op == 1) {
            setTitleModal('Crear noticia o blog');
        } else {
            setTitleModal('Editar noticia o blog');
            setTitle(t);
            setId(id_);
            setDescripcion(d);
            setEtiqueta(e);
            setLink_n(l);
        }
        setIsModalOpen(true);

    }

    const handleChangeFt = (e) => {
        setFoto(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let method = '';
        let url = '';


        setSubmitting(true);

        if (operation == 1) {
            method = 'POST';
            const f = new FormData();


            for (let i = 0; i < foto.length; i++) {
                f.append('foto', foto[i]);
            }
            f.append('titulo', title);
            f.append('etiqueta', etiqueta);
            f.append('descripcion', descripcion);
            f.append('link', link_n);

            const authToken = storage.get('authToken');

            try {
                const res = await axios.post(`${API_URL}/api/noticias`, f, {
                    headers: {
                        "Content-Type": 'multipart/form-data',
                        "Authorization": 'Bearer ' + authToken,
                        "Accept": 'application/json'
                    }
                });

                if (res.data.status === 201) {
                    getNovedades();
                    setTitle('');
                    setId('');
                    setDescripcion('');
                    setEtiqueta('');
                    setLink_n('');
                    setFoto(null);
                    closeModal();
                    showAlert(res.data.message, 'success');
                    setSubmitting(false);
                }
            } catch (error) {
               
                setSubmitting(false);
                showAlert('Ocurrió un error al enviar el formulario.', 'error');

            }

        } else {
            method = 'PATCH';
            url = '/api/noticias/' + id;
            const response = await sendRequest(method, { titulo: title, etiqueta: etiqueta, descripcion: descripcion, link: link_n }, url, '', true, false);


            if (foto != null) {
                const f = new FormData();
                for (let i = 0; i < foto.length; i++) {
                    f.append('foto', foto[i]);
                }
                const authToken = storage.get('authToken');

                try {
                    const res = await axios.post(`${API_URL}/api/noticias-update-imagen/`+id, f, {
                        headers: {
                            "Content-Type": 'multipart/form-data',
                            "Authorization": 'Bearer ' + authToken,
                            "Accept": 'application/json'
                        }
                    });                  
                   
                } catch (error) {
                  
                    setSubmitting(false);
                    showAlert('Ocurrió un error al actualizar la imagen.', 'error');

                }

            }
            showAlert('Noticia actualizada correctamente', 'success');
            getNovedades();
            setTitle('');
            setId('');
            setDescripcion('');
            setEtiqueta('');
            setLink_n('');
            setFoto(null);
            closeModal();
            setSubmitting(true);
        }



        setSubmitting(false);

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
        downloadOptions: { filename: 'noticias.csv', separator: ',' },
        textLabels: {
            body: {
                noMatch: isLoading ? 'Cargando datos...' : 'No se encontraron registros',
            },
        },
    };

    const columns = [

        { name: 'id', label: 'ID', options: { filter: false, sort: true } },
        { name: 'titulo', label: 'Titulo', options: { filter: false, sort: true } },
        { name: 'descripcion', label: 'Descripcion', options: { filter: false, sort: true } },
        { name: 'etiqueta', label: 'Etiqueta', options: { filter: true, sort: true } },
        {
            name: 'url_foto', label: 'Foto', options: {
                filter: false, sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const name = tableMeta.rowData[1];
                    return (
                        <div className='flex justify-center items-center'>
                            <img src={`${API_URL}${value}`} className='w-20 h-20 ' alt={name} />
                        </div>
                    );
                },
            }
        },
        { name: 'link', label: 'Link', options: { filter: false, sort: true } },
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
                    const t = tableMeta.rowData[1];
                    const d = tableMeta.rowData[2];
                    const e = tableMeta.rowData[3];
                    const l = tableMeta.rowData[5];

                    return (
                        <>
                            <div className='inline-flex justify-center space-x-4 w-full'>
                                <button className="block text-white hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#8EB42D]" onClick={() => openModal(2, id, t, d, e, l)}><i className="fa-solid fa-file-pen"></i></button>
                                <button className="block text-white hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#be0a0a]" onClick={() => deleteNovedades(id, t)}><i className="fa-solid fa-trash"></i></button>

                            </div>

                        </>
                    );
                },
            },
        },
    ];

    const deleteNovedades = (id_, name) => {
        confirmation(name, '/api/noticias/' + id_, 'novedades');
    }


    const getNovedades = async () => {
        const response = await sendRequest('GET', {}, '/api/noticias', '', false);
        setNovedades(response.data.noticias);
        setIsLoading(false);
    }

    useEffect(() => {

        getNovedades();
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
                    title={"Novedades & Blog"}
                    data={novedades}
                    columns={columns}
                    options={options}
                />
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={titleModal}
                modal='novedadesModal'
                ancho='full max-w-2xl'
            >
                <form onSubmit={handleSubmit} autoComplete='off' className='p-4'>

                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
                        <div className="relative col-span-2 z-0 w-full mb-5 group">
                            <input type="text" name="titulo" id="titulo" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-acent focus:outline-none focus:ring-0 focus:border-acent peer" placeholder=" " value={title} onChange={(e) => setTitle(e.target.value)} required />

                            <label htmlFor="titulo" className=" peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Título</label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="text" required name="etiqueta" id="etiqueta" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-acent focus:outline-none focus:ring-0 focus:border-acent peer" placeholder=" " value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)}  />

                            <label htmlFor="etiqueta" className=" peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Etiqueta</label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="url" name="link" id="link" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-acent focus:outline-none focus:ring-0 focus:border-acent peer" placeholder=" " value={link_n} onChange={(e) => setLink_n(e.target.value)} />

                            <label htmlFor="link" className=" peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-acent peer-focus:dark:text-acent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Link</label>
                        </div>
                        <div className="relative col-span-2 z-0 w-full mb-5 group">
                            <label
                                htmlFor="descripcion"
                                className=" text-sm text-gray-500 dark:text-gray-400 "
                            >
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows="4"
                                required
                                className="block mt-2 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Deja un comentario..."
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            ></textarea>

                        </div>
                        <div className={`relative col-span-2 mt-3 z-0 w-full   mb-5 group`} >

                            <input {...(operation === 1 ? { required: true } : {})} type="file" name="foto" id='foto' className='text-white w-full overflow-hidden text-ellipsis whitespace-wrap ' onChange={handleChangeFt} />
                            <label htmlFor="foto" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-0 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-accent peer-focus:dark:text-accent peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Portada</label>
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

export default Blog