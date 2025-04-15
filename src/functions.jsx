import Swal from "sweetalert2";
import storage from "./storage/storage";
import axiosInstance from "./config/axios";
import { jwtDecode } from 'jwt-decode';

export const showAlert = (msj, icon, timer = 2000, redir = '') => {
    Swal.fire({
        title: msj,
        icon: icon,
        showConfirmButton: false,
        buttonsStyling: true,
        timer: timer,
    });
    setTimeout(() =>
        (redir !== '') ? window.location.href = redir : '', 2000)
}

export const sendRequest = async (method, params, url, redir = '', token = true, show = true) => {


    if (token) {
        const authToken = storage.get('authToken');
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
    }
    let res;
    await axiosInstance({ method: method, url: url, data: params }).then(
        response => {
            res = response.data,
                (method != 'GET' && show) ? showAlert(response.data.message, 'success') : '';
            setTimeout(() =>
                (redir !== '') ? window.location.href = redir : '', 2000)
        }).catch(err => {
            console.log(err)
            res = err.response.data,
                showAlert(res.message, 'error', 4000)

        })
    return res;
}
export const confirmation = async (name, url, redir) => {
    const alert = Swal.mixin({ buttonsStyling: true });
    alert.fire({
        title: '¿Estás seguro?',
        text: `¿Eliminar ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
        cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            sendRequest('DELETE', {}, url, redir)
        }
    })

}

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


export default showAlert;