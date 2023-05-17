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

var Jugador:any = [];
var PageArray: number = 0 
var Inicio:number = 0
var Fin: number = 0;
var Pages: number = 1;
var TickePreCarga:any = [];
var EmpleadosCargados:any = [];


function precargarEmpleados() {
    const queryString = `SELECT jugador.Id_jugador, jugador.Nombre, jugador.Apellido, jugador.cedula, jugador.f_nacimiento, jugador.cod_carnet, jugador.f_altas, jugador.f_baja,
                         equipos.Id_equipo, equipos.nombre FROM jugadorDB.jugador INNER JOIN jugadorDB.equipos ON jugador.equipo = equipos.Id_equipo`
    connection.query(queryString, (err:any, rows:any, fields:any) => {
        if( err ){
            console.log("Se a Sucitado un Error en la Carga de todos los Jugador");
        }else {
            if(rows.length> 0){
                Jugador = rows
                console.log("Datos Cargados Empleados");
            }
        }
    });
}

// ==============================================================================================================================================
empleado.post('/addJugador', (req:Request, res:Response)=>{
    const valor = req.body;
    archivo.InsertarJugadores(valor).then((msg:any)=>{
        precargarEmpleados();
        res.status(200).json({
            ok: true
        });
    });
});

empleado.post('/buscarJugador', (req:Request, res:Response)=>{
    let result:any = [];
    const valor = String(req.body.valor);

    Jugador.forEach( (e:any) => {
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
            Jugador.forEach( (e:any) => {
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

empleado.get('/jugadores/:Fin', (req:Request, res:Response)=>{
    Fin = Number(req.params.Fin);
    if(Jugador.length > 0 ) {

          PageArray =  Math.ceil(Number(Jugador.length / Fin ));
          EmpleadosCargados = Jugador.slice(0, Fin);
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
    if(Jugador.length > 0 ) {
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
           Data =  Jugador.slice(Inicio, Fin);
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
    Data = Jugador.find( (e:any)=>{
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

empleado.put('/putJugador', (req:Request, res:Response) => {
    const data = req.body;
            archivo.ModificarJugador(data).then((msg:any)=>{
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
