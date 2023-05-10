"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const environment_1 = require("../global/environment");
const basico = (0, express_1.Router)();
var DeptosCargados = [];
var puestosCargados = [];
var generoCargados = [];
function precargarDeptos() {
    const queryString = `SELECT * FROM empleado.departamento`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de los Departamentos");
        }
        else {
            if (rows.length > 0) {
                DeptosCargados = rows;
            }
            console.log("Datos Cargados");
        }
    });
}
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
function precargarGenero() {
    const queryString = `SELECT * FROM empleado.empleado_genro`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de los Generos");
        }
        else {
            if (rows.length > 0) {
                generoCargados = rows;
            }
        }
    });
}
precargarDeptos();
precargarPuestos();
precargarGenero();
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
basico.get('/genero', (req, res) => {
    res.status(200).json({
        ok: true,
        registros: generoCargados
    });
});
exports.default = basico;
