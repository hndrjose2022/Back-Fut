import { Router, Request, Response } from 'express';
import { connection } from '../global/environment';

const archivo = require('../classes/archivos');
const analisis = require('../classes/analisis');

const empleado = Router();

// >>>>>> CARGA DE FEHCA ACTUAL >>>>>>>> 
var fecha = new Date();
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1;
var ano = fecha.getFullYear();
var fechalocal = dia + '/' + mes + '/' + ano;
var fechainter = ano + '-' + mes + '-' + dia
// >>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>

var Empleados:any = [];
var PageArray: number = 0 
var Inicio:number = 0
var Fin: number = 0;
var Pages: number = 1;
var TickePreCarga:any = [];
var EmpleadosCargados:any = [];


function precargarEmpleados() {
    const queryString = `SELECT *, departamento.nombre_depto, puesto.nombre_puesto , empleado_genro.nombre_genero, direc_indirc.nombre_direc
                         FROM empleado.empleados 
                         INNER JOIN empleado.departamento ON empleados.depto = departamento.Id_depto
                         INNER JOIN empleado.puesto ON empleados.puesto = puesto.Id_puesto
                         INNER JOIN empleado.empleado_genro ON  empleados.genero = empleado_genro.Id_genero
                         INNER JOIN empleado.direc_indirc ON  empleados.dic_indc = direc_indirc.Id_direc`
    connection.query(queryString, (err:any, rows:any, fields:any) => {
        if( err ){
            console.log("Se a Sucitado un Error en la Carga de todos los Empleados");
        }else {
            if(rows.length> 0){
                Empleados = rows
                console.log("Datos Cargados Empleados");
            }
        }
    });
}

// ==============================================================================================================================================
empleado.post('/addEmpleado', (req:Request, res:Response)=>{
    const valor = req.body;
    archivo.InsertarEmpleado(valor).then((msg:any)=>{
        precargarEmpleados();
        res.status(200).json({
            ok: true
        });
    });
});

empleado.post('/buscarEmpleado', (req:Request, res:Response)=>{
    let result:any = [];
    const valor = String(req.body.valor);

    Empleados.forEach( (e:any) => {
        if( e.nombre.includes( valor.toUpperCase() ) ){
            result.push( e );
        }
    });
    setTimeout(()=>{
        if( result.length > 0 ) {
            res.status(200).json({
                ok: true,
                registros: result
            });
        }else {
            Empleados.forEach( (e:any) => {
                if( e.apellido.includes( valor.toUpperCase() ) ){
                    result.push( e );
                }
            });
            setTimeout(()=>{
                res.status(200).json({
                    ok: true,
                    registros: result
                });
            },2000);
        }
    },2000);
});

empleado.get('/empleados/:Fin', (req:Request, res:Response)=>{
    Fin = Number(req.params.Fin);
    if(Empleados.length > 0 ) {

          PageArray =  Math.ceil(Number(Empleados.length / Fin ));
          EmpleadosCargados = Empleados.slice(0, Fin);
          res.status(200).json({
             ok: true,
             TotPages: PageArray,
             registros: EmpleadosCargados
          });
          Pages = 1;
          Inicio = 0;
          console.log("Paginas a Mostrar son " + PageArray);
    }
});


empleado.get('/refecencia/:ref', (req: any, res: any, next:any) => {
    console.log(req.params);
    const ref = req.params.ref;
    if(Empleados.length > 0 ) {
          if ( ref === 'mas' ){
            if( PageArray != 1 ){
                Inicio += 40;
                Fin += 40;
                PageArray -= 1;
                Pages += 1;

                console.log(`Referencia de Num. Reg entre los Parametros ${Inicio}  ${Fin}`);
            } else {
              console.log("Maximo de Registros Mostrados");
            }
          }
          if ( ref === 'menos' ){
            if( Inicio == 0 ){
              console.log("Inicio de la PAgina");
            } else{
              Inicio -= 40;
              Fin -= 40;
              PageArray += 1;
              Pages -= 1;
            }
          }
           var Data = [];
           Data =  Empleados.slice(Inicio, Fin);
           res.status(200).json({
                ok: true,
                TotPages: PageArray,
                pages: Pages,
                registros: Data
           });
    }
});

empleado.get('/unempleado/:id', (req:Request, res:Response)=>{
    precargarEmpleados();
    const id= req.params.id
    var Data = []
    //console.log(Empleados[0]);
    Data = Empleados.find( (e:any)=>{
        return e.Id_Empleado == id
    });
    // console.log(Data);
    if(Data) {
        res.status(200).json({
            ok: true,
            registros: Data
        })
    } else {
        res.status(200).json({
            ok: false
        })
    }

});

empleado.get('/getUltmId', (req:Request, res:Response)=>{
    analisis.getUltimoId().then((msg:any)=>{
        res.status(200).json({
            ok: true,
            registros: msg.registro
        });
    });
});

empleado.put('/putEmpleado', (req:Request, res:Response) => {
    const data = req.body;
            archivo.ModificarEmpleado(data).then((msg:any)=>{
                if(msg.ok){
                    precargarEmpleados();
                    res.status(200).json({
                        ok: true
                    });
                }else {
                    res.status(200).json({
                        ok: false
                    });
                }
            });
});



export default empleado;
