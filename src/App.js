import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Bulletin from "./components/Bulletin/Bulletin";

function App() {
  const [titulo, setTitulo] = useState("Boletín Agroclimático");
  const [edicion, setEdicion] = useState("72");
  const [mes, setMes] = useState("Nov.");
  const [anio, setAnio] = useState("2024");

  // Número de días en el mes (podrías calcularlo dinámicamente)
  const daysInMonth = 30;

  // Eventos de luna [{ day: number, phase: string }, ...]
  const [lunarEvents, setLunarEvents] = useState([]);

  // Campos para crear un nuevo evento (sin botón "Agregar")
  const [newDay, setNewDay] = useState("");
  const [newPhase, setNewPhase] = useState("");

  const boletinRef = useRef(null);

  const generarBoletin = () => {
    if (boletinRef.current) {
      html2canvas(boletinRef.current, { backgroundColor: null })
        .then((canvas) => {
          const link = document.createElement("a");
          link.download = "boletin.jpg";
          link.href = canvas.toDataURL("image/jpeg", 1.0);
          link.click();
        })
        .catch((error) => {
          console.error("Error al generar la imagen:", error);
        });
    }
  };

  /**
   * Cada vez que el usuario termine de editar (onBlur) uno de los campos (día/fase)
   * verificamos si ambos están completos para agregar el evento.
   * - Si day+phase ya existe, podrías actualizarlo en vez de duplicarlo.
   */
  const handleNewEventBlur = () => {
    // Validamos que haya un día y una fase
    if (newDay && newPhase) {
      // Convertimos el día a número
      const dayNumber = parseInt(newDay, 10);

      // Revisar si ya existe un evento para ese día (opcional)
      const existingIndex = lunarEvents.findIndex((e) => e.day === dayNumber);
      if (existingIndex !== -1) {
        // Si ya existe, actualizamos la fase
        const updated = [...lunarEvents];
        updated[existingIndex].phase = newPhase;
        setLunarEvents(updated);
      } else {
        // Si no existe, lo agregamos
        setLunarEvents((prev) => [
          ...prev,
          { day: dayNumber, phase: newPhase },
        ]);
      }

      // Limpiamos el formulario de nuevo evento
      setNewDay("");
      setNewPhase("");
    }
  };

  // Manejadores para el nuevo evento
  const handleNewDayChange = (e) => {
    let val = e.target.value;
    // Limitar a [1..daysInMonth]
    if (val < 1) val = 1;
    if (val > daysInMonth) val = daysInMonth;
    setNewDay(val);
  };

  const handleNewPhaseChange = (e) => {
    setNewPhase(e.target.value);
  };

  /**
   * Para permitir modificar los eventos existentes en la lista,
   * podemos hacer un "onChange" en sus inputs y selects.
   */
  const handleEventDayChange = (index, value) => {
    let val = parseInt(value, 10);
    if (val < 1) val = 1;
    if (val > daysInMonth) val = daysInMonth;

    const updated = [...lunarEvents];
    updated[index].day = val;
    setLunarEvents(updated);
  };

  const handleEventPhaseChange = (index, value) => {
    const updated = [...lunarEvents];
    updated[index].phase = value;
    setLunarEvents(updated);
  };

  const removeEvent = (index) => {
    setLunarEvents(lunarEvents.filter((_, i) => i !== index));
  };

  return (
    <div className="container my-4">
      <h1 className="text-center">Generador de Boletín</h1>

      {/* DOS COLUMNAS: FORM + PREVIEW */}
      <div className="row">
        {/* Columna izquierda: Formulario y lista de eventos */}
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h5>Datos del Boletín</h5>
            <div className="mb-3">
              <label>Edición:</label>
              <input
                type="text"
                className="form-control"
                value={edicion}
                onChange={(e) => setEdicion(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Mes:</label>
              <input
                type="text"
                className="form-control"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Año:</label>
              <input
                type="text"
                className="form-control"
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Título principal:</label>
              <input
                type="text"
                className="form-control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
          </div>

          {/* Sección para gestionar los eventos lunares */}
          <div className="card p-3 mb-3">
            <h5>Eventos Lunares</h5>

            {/* Lista de eventos existentes */}
            {lunarEvents.length > 0 && (
              <div className="mb-3">
                {lunarEvents.map((ev, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-2"
                    style={{ gap: "10px" }}
                  >
                    {/* Día editable */}
                    <input
                      type="number"
                      min={1}
                      max={daysInMonth}
                      className="form-control"
                      style={{ width: "80px" }}
                      value={ev.day}
                      onChange={(e) =>
                        handleEventDayChange(index, e.target.value)
                      }
                    />
                    {/* Fase editable */}
                    <select
                      className="form-control"
                      style={{ width: "120px" }}
                      value={ev.phase}
                      onChange={(e) =>
                        handleEventPhaseChange(index, e.target.value)
                      }
                    >
                      <option value="nueva">Nueva</option>
                      <option value="creciente">Creciente</option>
                      <option value="llena">Llena</option>
                      <option value="menguante">Menguante</option>
                    </select>
                    {/* Botón de eliminar */}
                    <button
                      className="btn btn-danger"
                      onClick={() => removeEvent(index)}
                    >
                      Borrar
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Campos para crear un nuevo evento sin botón "Agregar" */}
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <input
                type="number"
                min={1}
                max={daysInMonth}
                className="form-control"
                style={{ width: "80px" }}
                placeholder="Día"
                value={newDay}
                onChange={handleNewDayChange}
                onBlur={handleNewEventBlur}
              />
              <select
                className="form-control"
                style={{ width: "120px" }}
                value={newPhase}
                onChange={handleNewPhaseChange}
                onBlur={handleNewEventBlur}
              >
                <option value="">Fase...</option>
                <option value="nueva">Nueva</option>
                <option value="creciente">Creciente</option>
                <option value="llena">Llena</option>
                <option value="menguante">Menguante</option>
              </select>
            </div>
          </div>

          {/* Botón para generar la imagen */}
          <button className="btn btn-primary mb-3" onClick={generarBoletin}>
            Generar Imagen
          </button>
        </div>

        {/* Columna derecha: Vista previa */}
        <div className="col-md-6">
          <Bulletin
            refProp={boletinRef}
            edicion={edicion}
            mes={mes}
            anio={anio}
            titulo={titulo}
            lunarEvents={lunarEvents}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
