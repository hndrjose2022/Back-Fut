"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const environment_1 = require("../global/environment");
const basico = (0, express_1.Router)();
var DeptosCargados = [];
var puestosCargados = [];
var equipoCargados = [];
function precargarPuestos() {
    const queryString = `SELECT * FROM empleado.puesto`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de los Departamentos");
        }
        else {
            if (rows.length > 0) {
                puestosCargados = rows;
            }
            console.log("Datos Cargados");
        }
    });
}
function precargaEquipo() {
    const queryString = `SELECT * FROM equipos`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de EQuipos");
        }
        else {
            if (rows.length > 0) {
                equipoCargados = rows;
            }
        }
    });
}
// precargarDeptos();
// precargarPuestos();
precargaEquipo();
basico.get('/departamento', (req, res) => {
    res.status(200).json({
        ok: true,
        registros: DeptosCargados
    });
});
basico.get('/puestos', (req, res) => {
    res.status(200).json({
        ok: true,
        registros: puestosCargados
    });
});
basico.get('/equipo', (req, res) => {
    precargaEquipo();
    setTimeout(() => {
        res.status(200).json({
            ok: true,
            registros: equipoCargados
        });
    }, 500);
});
exports.default = basico;
