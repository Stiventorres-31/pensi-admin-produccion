import React, { useState, useEffect } from 'react';
import showAlert, { confirmation, sendRequest, formatDate } from '../../functions';
import MUIDataTable from "mui-datatables";


function Client() {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    //Options Datatable
    const options = {
        filter: true,
        selectableRows: "none",
        responsive: 'standard',
        elevation: 8,
        rowsPerPage: 6,
        rowsPerPageOptions: [],
        download: true,
        print: false,
        downloadOptions: { filename: 'clientes.csv', separator: ',' },
        textLabels: {
            body: {
                noMatch: isLoading ? 'Cargando datos...' : 'No se encontraron registros',
            },
        },
    };

    const columns = [

        { name: 'id', label: 'ID', options: { filter: false, sort: true } },
        { name: 'tipo_identidad', label: 'Tipo documento', options: { filter: true, sort: true } },
        { name: 'numero_identidad', label: 'Número', options: { filter: false, sort: true } },
        { name: 'nombres', label: 'Nombres', options: { filter: false, sort: true } },
        { name: 'email', label: 'Correo', options: { filter: false, sort: true } },
        {
            name: 'created_at', label: 'Creado', options: {
                filter: false, sort: true,
                customBodyRender: (value) => {
                    return formatDate(value);
                }
            }
        },
    ];

    const getClients = async () => {
        const response = await sendRequest('GET', {}, '/api/clients', '', true);
        setClients(response.clientes);
        setIsLoading(false);
    }

    useEffect(() => {

        getClients();
    }, []);



    return (
        <div>
            {/* <button
                disabled
                className="block  text-white bg-primary hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                <i className='fa-solid fa-circle-plus'></i>
            </button> */}
            <div className='mt-6'>
                <MUIDataTable
                    title={"Clientes registrados"}
                    data={clients}
                    columns={columns}
                    options={options}
                />
            </div>
        </div>
    )
}

export default Client