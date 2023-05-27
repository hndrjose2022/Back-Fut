"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const environment_1 = require("../global/environment");
const basico = (0, express_1.Router)();
var DeptosCargados = [];
var equiposcargados = [];
var equipoCargados = [];
function precargaEquipo() {
    const queryString = `SELECT * FROM jugadorDB.equipos`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de los Departamentos");
        }
        else {
            if (rows.length > 0) {
                equiposcargados = rows;
            }
            console.log("Datos Cargados");
        }
    });
}
precargaEquipo();
basico.get('/equipos', (req, res) => {
    res.status(200).json({
        ok: true,
        registros: equiposcargados
    });
});
exports.default = basico;
