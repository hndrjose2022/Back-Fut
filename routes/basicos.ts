import { Router, Request, Response } from 'express';
import { connection } from '../global/environment';

const basico = Router();

var DeptosCargados:any = [];
var equiposcargados:any = [];
var equipoCargados:any = [];


function precargaEquipo() {
    const queryString = `SELECT * FROM jugadorDB.equipos`
    connection.query(queryString, (err:any, rows:any, fields:any) => {
        if( err ){
            console.log("Se a Sucitado un Error en la Carga de los Departamentos");
        }else {
            if(rows.length> 0){
                equiposcargados = rows
            }
            console.log("Datos Cargados");
        }
    });
}
precargaEquipo()

basico.get('/equipos', (req:Request, res:Response)=>{
        res.status(200).json({
            ok: true,
            registros: equiposcargados
        });
});


export default basico;