import { Router, Request, Response } from 'express';
import { connection } from '../global/environment';

const basico = Router();

var DeptosCargados:any = [];
var puestosCargados:any = [];
var equipoCargados:any = [];

function precargarDeptos() {
    const queryString = `SELECT * FROM empleado.departamento`
    connection.query(queryString, (err:any, rows:any, fields:any) => {
        if( err ){
            console.log("Se a Sucitado un Error en la Carga de los Departamentos");
        }else {
            if(rows.length> 0){
                DeptosCargados = rows
            }
            console.log("Datos Cargados");
        }
    });
}
function precargarPuestos() {
    const queryString = `SELECT * FROM empleado.puesto`
    connection.query(queryString, (err:any, rows:any, fields:any) => {
        if( err ){
            console.log("Se a Sucitado un Error en la Carga de los Departamentos");
        }else {
            if(rows.length> 0){
                puestosCargados = rows
            }
            console.log("Datos Cargados");
        }
    });
}
function precargaEquipo() {
    const queryString = `SELECT * FROM equipos`
    connection.query(queryString, (err:any, rows:any, fields:any) => {
        if( err ){
            console.log("Se a Sucitado un Error en la Carga de EQuipos");
        }else {
            if(rows.length> 0){
                equipoCargados = rows
            }
        }
    });
}
// precargarDeptos();
// precargarPuestos();
precargaEquipo();

basico.get('/departamento', (req:Request, res:Response)=>{
        res.status(200).json({
            ok: true,
            registros: DeptosCargados
        });
});

basico.get('/puestos', (req:Request, res:Response)=>{
        res.status(200).json({
            ok: true,
            registros: puestosCargados
        });
});

basico.get('/equipo', (req:Request, res:Response)=>{
    precargaEquipo();
    setTimeout(()=>{
        res.status(200).json({
            ok: true,
            registros: equipoCargados
        });
    },500);
});

export default basico;