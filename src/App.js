import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const bulletinRef = useRef(null);

  const generarBoletin = () => {
    if (bulletinRef.current) {
      html2canvas(bulletinRef.current, { backgroundColor: null })
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

  return (
    <div className="App">
      <h1>Generador de Boletín</h1>
      <div className="formulario">
        <div className="campo">
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div className="campo">
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <button onClick={generarBoletin}>Generar</button>
      </div>

      {/* Plantilla del boletín */}
      <div
        className="boletin"
        ref={bulletinRef}
        style={{
          width: "600px",
          padding: "20px",
          border: "1px solid #000",
          background: "#fff",
          marginTop: "20px",
        }}
      >
        <h2>{titulo || "Título del Boletín"}</h2>
        <p>{descripcion || "Aquí va la descripción del boletín."}</p>
      </div>
    </div>
  );
}

export default App;
