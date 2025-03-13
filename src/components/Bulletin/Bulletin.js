import React from "react";
import "./Bulletin.css";
import lunaNueva from "../../assets/Nueva.png";
import lunaCreciente from "../../assets/Creciente.png";
import lunaLlena from "../../assets/Llena.png";
import lunaMenguante from "../../assets/Menguante.png";
import minLogo from '../../assets/minLogo.png';
import lunaIco from '../../assets/lunaIco.png';

function Bulletin({ refProp, edicion, mes, anio, titulo, lunarEvents }) {
  // Podrías calcular los días reales según mes/año.
  // Para el ejemplo, usamos 30.
  const daysInMonth = 30;

  // Mapeo de fase -> URL de imagen (usa las tuyas propias)
  const phaseImages = {
    nueva: lunaNueva, // Luna Nueva
    creciente: lunaCreciente, // Luna Creciente
    llena: lunaLlena, // Luna Llena
    menguante: lunaMenguante, // Luna Menguante
  };

  // Para saber si un día tiene evento
  const getPhaseImage = (day) => {
    const event = lunarEvents.find((e) => e.day === day);
    return event ? phaseImages[event.phase] : null;
  };

  // Array [1..daysInMonth]
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Partir en semanas de 7 días
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };
  const weeks = chunkArray(days, 7);

  return (
    <div
      className="boletin-container"
      ref={refProp}
      style={{
        width: "600px",
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ENCABEZADO */}
      <div
        style={{
          backgroundColor: "#f1c40f",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          src={minLogo}
          alt="Logo"
          style={{ height: "40px" }}
        />
        <span>Mesa Técnica Agroclimática - Casanare</span>
        <span>
          Edición {edicion} - {mes} {anio}
        </span>
      </div>

      {/* TÍTULO */}
      <h2 style={{ textAlign: "center", margin: "20px 0 10px" }}>{titulo}</h2>

      {/* SUBTÍTULO */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>Calendario lunar</span>
        <img
          src={lunaIco}
          alt="Icono Luna"
          style={{ height: "24px" }}
        />
      </div>

      {/* CALENDARIO */}
      <table
        style={{
          width: "90%",
          margin: "0 auto 20px",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#eaeaea" }}>
            <th style={cellStyle}>Do</th>
            <th style={cellStyle}>Lu</th>
            <th style={cellStyle}>Ma</th>
            <th style={cellStyle}>Mi</th>
            <th style={cellStyle}>Ju</th>
            <th style={cellStyle}>Vi</th>
            <th style={cellStyle}>Sa</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day) => {
                const phaseImage = getPhaseImage(day);
                return (
                  <td key={day} style={cellStyle}>
                    <div>{day}</div>
                    {phaseImage && (
                      <img
                        src={phaseImage}
                        alt="Fase lunar"
                        style={{ marginTop: "4px" }}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* PIE DE PÁGINA */}
      <div
        style={{
          backgroundColor: "#27ae60",
          color: "#fff",
          textAlign: "center",
          padding: "10px",
          fontWeight: "bold",
        }}
      >
        Agropecuaria
      </div>
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  height: "50px",
  verticalAlign: "middle",
};

export default Bulletin;
