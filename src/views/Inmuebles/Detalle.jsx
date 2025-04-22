import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { confirmation, sendRequest, showAlert } from "../../functions";
import loadingImage from "../../assets/logo.png";
import defaultImage from "../../assets/img-default.png";
import Modal from "../../components/Modal";
import axios from "axios";
import storage from "../../storage/storage";

const Detalle = () => {
  //Const form Files
  const [isModalFtOpen, setIsModalFtOpen] = useState(false);
  const closeModalFt = () => {
    document.activeElement?.blur();
    setIsModalFtOpen(false);
  };
  const [titleFt, setTitlFt] = useState("");
  const [archivos, setArchivos] = useState(null);
  const [destacada, setDestacada] = useState(0);
  const API_URL = storage.getAPI_URL();
  const [submitting, setSubmitting] = useState(false);
  const [submittings, setSubmittings] = useState(false);
  const [submittingse, setSubmittingse] = useState(false);

  const clearFormFt = () => {
    setArchivos(null);
    setDestacada(0);
  };

  const handleChangeFt = (e) => {
    setArchivos(e.target.files);
  };

  const handleChangeCheck = (e) => {
    setDestacada(e.target.checked ? 1 : 0);
  };

  const handleSubmitFt = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    const f = new FormData();

    for (let i = 0; i < archivos.length; i++) {
      f.append("fotos[]", archivos[i]);
    }
    f.append("destacado", destacada);
    f.append("inmueble_id", inmueble.id_inmueble);

    const authToken = storage.get("authToken");

    try {
      const res = await axios.post(`${API_URL}/api/upload/imagenes`, f, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authToken,
          Accept: "application/json",
        },
      });

      if (res.data.status === 201) {
        getInmuebles();
        clearFormFt();
        closeModalFt();
        showAlert(res.data.message, "success");
      }
    } catch (error) {
      //console.log(error.response.data.message)
      showAlert(error.response.data.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openModalFt = () => {
    clearFormFt();

    setTitlFt("Subir fotos inmueble...");

    setIsModalFtOpen(true);
  };

  const handleEliminarImagen = (id, name) => {
    confirmation(name, "/api/imagenes/" + id, inmueble.id_inmueble);
  };

  //Const Servicios
  const [modalOpenService, setModalOpenService] = useState(false);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const OpenModalService = () => {
    setModalOpenService(true);
  };

  const closeModalService = () => {
    document.activeElement?.blur();
    setModalOpenService(false);
  };

  const handleServiceChange = (event) => {
    const servicioId = parseInt(event.target.value);
    if (event.target.checked) {
      setServiciosSeleccionados([...serviciosSeleccionados, servicioId]);
    } else {
      const updatedSelection = serviciosSeleccionados.filter(
        (id) => id !== servicioId
      );
      setServiciosSeleccionados(updatedSelection);
    }
  };

  const enviarServiciosSeleccionados = async () => {
    setSubmittings(true);
    try {
      // Servicios actuales del inmueble con sus ids
      const currentServicios = inmueble.servicios.map((servicio) => ({
        id: servicio.id_inmueble_tipo_servicio,
        id_tipo_servicio: servicio.id_tipo_servicio,
      }));

      // Calcular los servicios que necesitan ser agregados
      const serviciosToAdd = serviciosSeleccionados.filter(
        (servicioId) =>
          !currentServicios.some(
            (currentServicio) => currentServicio.id_tipo_servicio === servicioId
          )
      );

      // Calcular los servicios que necesitan ser eliminados
      const serviciosToRemove = currentServicios.filter(
        (currentServicio) =>
          !serviciosSeleccionados.includes(currentServicio.id_tipo_servicio)
      );

      // Crear las solicitudes de adición
      const addRequests = serviciosToAdd.map((servicioId) => {
        return sendRequest(
          "POST",
          { servicio_id: servicioId, inmueble_id: inmueble.id_inmueble },
          "/api/inmuebles/servicios",
          "",
          true,
          false
        );
      });

      // Crear las solicitudes de eliminación
      const removeRequests = serviciosToRemove.map((servicio) => {
        return sendRequest(
          "DELETE",
          {},
          `/api/inmuebles/servicios/${servicio.id}`,
          "",
          true,
          false
        );
      });

      // Ejecutar todas las solicitudes
      const addResponses = await Promise.all(addRequests);
      const removeResponses = await Promise.all(removeRequests);

      // Manejar las respuestas
      /*addResponses.forEach(response => {
                console.log('Added:', response.data);
            });
            removeResponses.forEach(response => {
                console.log('Removed:', response.data);
            });*/

      // Cerrar el modal y actualizar la interfaz según sea necesario
      closeModalService();
      setSubmittings(false);
      getInmuebles();
      showAlert("Servicios actualizados correctamente", "success");
    } catch (error) {
      console.log(error);
      showAlert("Error al actualizar los servicios", "error");
    }
  };

  //Servicios extra

  const [modalOpenServiceExtra, setModalOpenServiceExtra] = useState(false);
  const [serviciosSeleccionadosExtra, setServiciosSeleccionadosExtra] =
    useState([]);

  const OpenModalServiceExtra = () => {
    setModalOpenServiceExtra(true);
  };

  const closeModalServiceExtra = () => {
    document.activeElement?.blur();
    setModalOpenServiceExtra(false);
  };
  const handleServiceExtraChange = (event) => {
    const servicioExtraId = parseInt(event.target.value);
    if (event.target.checked) {
      setServiciosSeleccionadosExtra([
        ...serviciosSeleccionadosExtra,
        servicioExtraId,
      ]);
    } else {
      const updatedSelection = serviciosSeleccionadosExtra.filter(
        (id) => id !== servicioExtraId
      );
      setServiciosSeleccionadosExtra(updatedSelection);
    }
  };
  const enviarServiciosSeleccionadosExtra = async () => {
    setSubmittingse(true);
    try {
      // Servicios actuales del inmueble con sus ids
      const currentServicios = inmueble.servicios_ex.map((servicio) => ({
        id: servicio.id_inmueble_servicio_extra,
        id_servicio_extra: servicio.id_servicio_extra,
      }));

      // Calcular los servicios que necesitan ser agregados
      const serviciosToAdd = serviciosSeleccionadosExtra.filter(
        (servicioId) =>
          !currentServicios.some(
            (currentServicio) =>
              currentServicio.id_servicio_extra === servicioId
          )
      );

      // Calcular los servicios que necesitan ser eliminados
      const serviciosToRemove = currentServicios.filter(
        (currentServicio) =>
          !serviciosSeleccionadosExtra.includes(
            currentServicio.id_servicio_extra
          )
      );

      // Crear las solicitudes de adición
      const addRequests = serviciosToAdd.map((servicioId) => {
        return sendRequest(
          "POST",
          { servicio_extra_id: servicioId, inmueble_id: inmueble.id_inmueble },
          "/api/inmuebles/servicios/extra",
          "",
          true,
          false
        );
      });

      // Crear las solicitudes de eliminación
      const removeRequests = serviciosToRemove.map((servicio) => {
        return sendRequest(
          "DELETE",
          {},
          `/api/inmuebles/servicios/extra/${servicio.id}`,
          "",
          true,
          false
        );
      });

      // Ejecutar todas las solicitudes
      const addResponses = await Promise.all(addRequests);
      const removeResponses = await Promise.all(removeRequests);

      closeModalServiceExtra();
      setSubmittingse(false);
      getInmuebles();
      showAlert("Servicios extras actualizados correctamente", "success");
    } catch (error) {
      showAlert("Error al actualizar los servicios extras", "error");
    }
  };

  const { id } = useParams();
  const [inmueble, setInmueble] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [serviciosExtras, setServiciosExtras] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);

  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < imagenes.length - 3) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      scrollRef.current.scrollLeft += scrollRef.current.offsetWidth + 16;
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      scrollRef.current.scrollLeft -= scrollRef.current.offsetWidth + 16;
    }
  };

  const getInmuebles = async () => {
    const response = await sendRequest(
      "GET",
      {},
      "/api/inmuebles/" + id,
      "",
      false
    );

    setInmueble(response.data.inmueble);

    const imagenes = response.data.inmueble.fotos || [];
    setImagenes(imagenes);

    const serv = response.data.inmueble.servicios || [];
    setServiciosSeleccionados(
      serv.map((servicio) => servicio.id_tipo_servicio)
    );

    const servExtra = response.data.inmueble.servicios_ex || [];
    setServiciosSeleccionadosExtra(
      servExtra.map((servicio) => servicio.id_servicio_extra)
    );

    if (imagenes.length > 0) {
      const destacada = imagenes.find((img) => img.destacado === 1);
      setImagenPrincipal(destacada || imagenes[0]);
    }
  };

  const getServicios = async () => {
    const response = await sendRequest("GET", {}, "/api/servicios", "", false);
    setServicios(response.data.servicios);
  };

  const getServiciosExtras = async () => {
    const response = await sendRequest(
      "GET",
      {},
      "/api/servicios/extra",
      "",
      false
    );
    setServiciosExtras(response.data.serviciosExtras);
  };

  useEffect(() => {
    getServicios();
    getServiciosExtras();
    getInmuebles();
  }, [id]);

  const handleClickImagen = (img) => {
    setImagenPrincipal(img);
  };

  if (!inmueble) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={loadingImage} alt="Cargando..." className="loading-image " />
      </div>
    );
  }

  return (
    <div className="font-poppins">
      <div className="grid lg:grid-cols-2 lg:gap-6 mb-5">
        <div className="flex flex-col items-center overflow-hidden">
          <div className="relative w-full max-w-full md:max-w-xl rounded-lg">
            {imagenPrincipal ? (
              <img
                src={`${API_URL}${imagenPrincipal.url}`}
                alt="Imagen principal"
                className="w-full border-2 border-gray-300 rounded"
              />
            ) : (
              <img
                src={defaultImage}
                alt="Imagen por defecto"
                className="w-full border-2 border-gray-300 rounded"
              />
            )}
            <div className="absolute top-2 right-2 bg-white bg-opacity-80 backdrop-blur-lg p-2 rounded-lg shadow-lg">
              <p className="text-gray-700 text-sm font-medium">
                Precio:{" "}
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(inmueble.precio)}
              </p>
              {inmueble.precio_descuento > 0 && (
                <p className="text-red-600 text-sm font-medium mt-1">
                  Ahora:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(inmueble.precio_descuento)}
                </p>
              )}
            </div>
            <button
              className="absolute top-2 left-2 text-white bg-primary hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={() => openModalFt()}
            >
              <i className="fa-solid fa-circle-plus"></i>{" "}
            </button>
          </div>

          <div className="relative w-full overflow-hidden mt-4">
            {/* Carousel wrapper */}
            <div className="relative overflow-hidden rounded-lg">
              {/* Carousel items */}
              <div
                className="flex gap-4 overflow-x-auto overflow-y-hidden hide-scrollbar"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                }}
                ref={scrollRef}
              >
                {imagenes.map((img, index) => (
                  <div key={img.id_foto} className="flex-none w-20 md:w-32">
                    <div className="relative">
                      <img
                        src={`${API_URL}${img.url}`}
                        alt={`Imagen ${img.id_foto}`}
                        className="w-full h-20 md:h-24 object-cover rounded cursor-pointer transition-transform transform hover:scale-110"
                        onClick={() => handleClickImagen(img)}
                      />
                      <button
                        onClick={() =>
                          handleEliminarImagen(img.id_foto, img.url)
                        }
                        className="absolute top-1 left-1 text-red-600  hover:text-acent p-1 text-xs"
                      >
                        <i className="fa-solid fa-trash text-xl"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Slider controls */}
            <button
              className={`btn-scroll absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none ${
                currentIndex === 0 ? "hidden" : "md:block "
              }`}
              onClick={prevSlide}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-acent rtl:rotate-180"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              className={`btn-scroll absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none ${
                currentIndex >= imagenes.length - 4 ? "hidden" : "md:block"
              }`}
              onClick={nextSlide}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-acent rtl:rotate-180"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        </div>
        <div className="text-wrap mt-4 ">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-8">
            <div className="relative">
              {inmueble.destacado === 1 && (
                <i className="absolute -top-3 -end-3  text-3xl z-10 text-yellow-500 fa-solid fa-crown transform rotate-45"></i>
              )}
              <button
                disabled
                className={`block w-full text-white ${
                  inmueble.estado === 1
                    ? "bg-acent border-solid border-2 border-acent"
                    : "bg-warning border-solid border-2 border-warning"
                } font-medium rounded-lg text-sm px-5 py-2.5 text-center relative`}
              >
                {inmueble.estado === 1 ? "Activo" : "Inactivo"}
              </button>
            </div>

            <button className="block text-acent border-solid border-2 border-acent font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              {inmueble.genero.descripcion}
            </button>

            <button
              onClick={OpenModalService}
              className="block text-white bg-primary hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <i className="fa-solid fa-circle-plus"></i> Servicios
            </button>

            <button
              onClick={OpenModalServiceExtra}
              className="block text-white bg-primary hover:bg-acent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <i className="fa-solid fa-circle-plus"></i> Servicios Extra
            </button>
          </div>
          <h2 className="text-primary font-semibold text-xl md:text-3xl mb-4">
            {inmueble.codigo}: {inmueble.nombre}
          </h2>
          <p className="text-sm ">
            {inmueble.direccion}, {inmueble.ciudad}-{inmueble.region},{" "}
            {inmueble.pais}{" "}
          </p>
          <div className="flex space-x-4 mt-2">
            <p className="flex items-center text-sm">
              <i className="fa-solid fa-ruler-horizontal mr-2"></i>{" "}
              {inmueble.medida} m²
            </p>
            <p className="flex items-center text-sm">
              <i className="fa-solid fa-people-roof mr-2"></i>{" "}
              {inmueble.habitaciones}
            </p>
          </div>
          <br />
          <span className="text-sm ">{inmueble.descripcion} </span>
          <br />
          <br />
          <i className="fa-solid fa-school-circle-check mr-2"></i> Tipos de
          servicios:
          <div className="flex flex-wrap gap-2 mt-2">
            {inmueble.servicios.map((servicio) => (
              <div
                key={servicio.id_inmueble_tipo_servicio}
                className="bg-primary text-text rounded-full px-3 py-1 text-sm flex items-center"
              >
                <i className="fa-solid fa-check-circle mr-2"></i>
                {servicio.servicio.descripcion}
              </div>
            ))}
          </div>
          <br />
          <i className="fa-solid fa-layer-group mr-2"></i> Servicios extra:
          <div className="flex flex-wrap gap-2 mt-2">
            {inmueble.servicios_ex.map((servicio) => (
              <div
                key={servicio.id_inmueble_servicio_extra}
                className="bg-primary text-text rounded-full px-3 py-1 text-sm flex items-center"
              >
                <i className="fa-solid fa-check-circle mr-2"></i>

                {servicio.servicio_ex.descripcion}
              </div>
            ))}
          </div>
          <br />
          <i className="fa-solid fa-circle-user mr-2"></i> Autor:{" "}
          {inmueble.usuario.name}
        </div>
      </div>

      {/**Modales */}
      <Modal
        isOpen={modalOpenService}
        onClose={closeModalService}
        modal="inmublesModalServicios"
        ancho="full max-w-2xl"
        title="Agregar servicios"
      >
        <div className="grid grid-cols-1 gap-4 ">
          {/* Renderizar checkboxes dinámicamente */}
          {servicios.map((servicio) => (
            <div key={servicio.id_tipo_servicio} className="flex items-center">
              <input
                type="checkbox"
                id={`servicio-${servicio.id_tipo_servicio}`}
                value={servicio.id_tipo_servicio}
                checked={serviciosSeleccionados.includes(
                  servicio.id_tipo_servicio
                )}
                onChange={handleServiceChange}
                className="mr-2"
              />
              <label
                htmlFor={`servicio-${servicio.id_tipo_servicio}`}
                className="text-sm text-gray-500 dark:text-white"
              >
                {servicio.descripcion}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={enviarServiciosSeleccionados}
            disabled={submittings}
            className="py-2 mt-4 px-4 bg-gray-800 text-white w-full rounded-lg hover:bg-acent focus:outline-none"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpenServiceExtra}
        onClose={closeModalServiceExtra}
        modal="inmublesModalServiciosExtra"
        ancho="full max-w-2xl"
        title="Agregar servicios extra"
      >
        <div className="grid grid-cols-1 gap-4 ">
          {/* Renderizar checkboxes dinámicamente */}
          {serviciosExtras.map((servicio) => (
            <div key={servicio.id_servicio_extra} className="flex items-center">
              <input
                type="checkbox"
                id={`servicio-extra-${servicio.id_servicio_extra}`}
                value={servicio.id_servicio_extra}
                checked={serviciosSeleccionadosExtra.includes(
                  servicio.id_servicio_extra
                )}
                onChange={handleServiceExtraChange}
                className="mr-2"
              />
              <label
                htmlFor={`servicio-extra-${servicio.id_servicio_extra}`}
                className="text-sm text-gray-500 dark:text-white"
              >
                {servicio.descripcion}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={enviarServiciosSeleccionadosExtra}
            disabled={submittingse}
            className="py-2 mt-4 px-4 bg-gray-800 text-white w-full rounded-lg hover:bg-acent focus:outline-none"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isModalFtOpen}
        onClose={closeModalFt}
        modal="inmublesModalFt"
        ancho="full max-w-2xl"
        title={titleFt}
      >
        <form onSubmit={handleSubmitFt} className="p-4">
          <div className="grid grid-cols-3 gap-4 text-white">
            <input
              required
              type="file"
              className="col-span-2 text-gray-500 dark:text-white"
              multiple
              onChange={handleChangeFt}
            />

            <input
              disabled
              type="text"
              className=" text-end bg-transparent text-gray-500 dark:text-white"
              value={`Inmueble ID: ${inmueble.id_inmueble}`}
            />
            <div className="col-span-2 mb-3">
              <input
                type="checkbox"
                onChange={handleChangeCheck}
                name="destacado"
                className="mr-2 text-gray-500 dark:text-white"
                value="1"
                id="destacado"
                checked={destacada === 1}
              />{" "}
              <label htmlFor="destacado" className="text-gray-500 dark:text-white">Foto destacada</label>
            </div>
          </div>
          <div className="relative flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 w-full md:w-1/5 text-sm font-medium hover:bg-acent bg-primary text-white focus:outline-none rounded-lg border border-gray-600 focus:z-10 focus:ring-4 focus:ring-gray-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Detalle;
