import { dbSelect, dbAction } from "$lib/server/db";
import { json } from "@sveltejs/kit";

//--------------------------------------------------
// funciones

function limpiar(datos) {
    try {
        [
            { campo: "edificio_id", tipo: "numero", condi: ">=0" },
            { campo: "cod_uni", tipo: "texto", mayuscula: true },
            { campo: "espacio", tipo: "texto", mayuscula: true },
            { campo: "planta", tipo: "texto", mayuscula: true },
            { campo: "tipo_espacio_id", tipo: "numero" },
        ].map((x) => {
            if (x.tipo == "texto") datos[x.campo] = datos[x.campo].trim();
            if (x.mayuscula) datos[x.campo] = datos[x.campo].toUpperCase();
            // return x;
        })
    } catch (e) {
        console.log('ERROR:', e)
    }

    datos.climatizado = datos.climatizado ? 1 : 0
    datos.ventilado = datos.ventilado ? 1 : 0
    datos.disponible = datos.disponible ? 1 : 0
    datos.espacio_reserva = datos.espacio_reserva ? 1 : 0
    datos.verificado = datos.verificado ? 1 : 0
    datos.sis_vigente = datos.sis_vigente ? 1 : 0

    return datos;
}

async function existente(datos) {

    const { id, edificio_id, espacio } = datos;

    const sql = `
        select *
        from aulario_espacios
        where id != ?
        and edificio_id = ?
        and nombre = ?
        and sis_anulado = 0
    `
    const existe = await dbSelect(sql, [id, edificio_id, espacio])

    console.log('ya existe :', existe.length > 0)
    return existe.length > 0;
}

async function existen_dependencias(datos) {

    const { id } = datos;

    let sql = `
        select 1 as uno,
        (
            select count(a.id)
            from aulario_espacios_articulos a
            where a.espacio_id = ?
            and a.sis_anulado = 0
        ) as articulos,
        (
            select count(q.id)
            from aulario_espacios_equipos q
            where q.espacio_id = ?
            and q.sis_anulado = 0
        ) as equipos,
        (
            select count(f.id)
            from aulario_espacios_fotos f
            where f.espacio_id = ?
            and f.sis_anulado = 0
        ) as fotos, 
        (
            select count(p.id)
            from aulario_espacios_publicos p
            where p.espacio_id = ?
            and p.sis_anulado = 0
        ) as publicos, 
        (
            select count(rr.id)
            from aulario_reserva rr
            where rr.espacio_id = ?
            and rr.sis_anulado = 0
        ) as reservas
        from dual
    `
    const result = await dbSelect(sql, [id, id, id, id, id])
    const x = result[0]
    
    return (x.articulos>0 || x.fotos>0 || x.equipos>0 || x.publicos>0 || x.reservas>0 );
}


async function getFotos(espacio_id) {
    const sql = `
        select * 
        from aulario_espacios_fotos
        where espacio_id = '${espacio_id}'
    `

    let filas = await dbSelect(sql, [])

    let fotos = []

    if (filas.length > 0) {
        filas.map((f) => {
            fotos.push({
                id: f.id,
                type: f.tipo,
                base64: f.foto.toString()
            })
        })
    }

    return fotos
}
//--------------------------------------------------
// servicios

export async function consulta(paginado, items, cod_uni) {
    let condi = '';
    let param = [];

    let filtros = {
        "reservables" : ` tipo_reservable = 1 and `
    }

    if(cod_uni){
        condi += ' cod_uni = ? and ';
        param.push(cod_uni)
    }
 
    if(paginado.filtros){
        paginado.filtros.map((f)=>{
            condi += filtros[f]
        })
    }

    items.map((i) => {
        if (i.filtro.toString().length > 0) {
            switch (i.name) {
                case 'sede':
                    condi += i.name + " like concat('%',?,'%') and ";
                    param.push(i.filtro)
                    break;
                case 'edificio':
                    condi += i.name + " like concat('%',?,'%') and ";
                    param.push(i.filtro)
                    break;
                case 'unidad':
                    condi += i.name + " like concat('%',?,'%') and ";
                    param.push(i.filtro)
                    break;
                case 'tipo_espacio':
                    condi += i.name + " like concat('%',?,'%') and ";
                    param.push(i.filtro)
                    break;
                case 'espacio':
                    condi += i.name + " like concat('%',?,'%') and ";
                    param.push(i.filtro)
                    break;
                case 'planta':
                    condi += i.name + " like concat('%',?,'%') and ";
                    param.push(i.filtro)
                    break;
                case 'capacidad':
                    condi += i.name + " >= ? and ";
                    param.push(i.filtro)
                    break;
                case 'capacidad_autorizada':
                    condi += i.name + " >= ? and ";
                    param.push(i.filtro)
                    break;
                case 'tipo_reservable':
                    condi += i.name + " = ? and ";
                    param.push(i.filtro)
                    break;
                case 'verificado':
                    condi += i.name + " = ? and ";
                    param.push(i.filtro)
                    break;
                case 'equipos':
                    condi += i.name + " >= ? and ";
                    param.push(i.filtro)
                    break;
                case 'sis_vigente':
                    condi += i.name + " = ? and ";
                    param.push(i.filtro)
                    break;
                case 'sis_vigente_txt':
                    condi += i.name + " = ? and ";
                    param.push(i.filtro)
                    break;
            }
        }
    })

    condi = condi.length > 0 ? " where " + condi.substring(0, condi.length - 4) : '';

    let sql = `
        select count(*) as registros
        from aulario_v_espacios
        ${condi}
    `

    let result = await dbSelect(sql, param)

    let registros = parseInt(result[0].registros);

    paginado.registros = registros;

    if (paginado.rxp > registros) {
        paginado.pagina = 1;
        paginado.paginas = 1;
    } else {
        paginado.paginas = parseInt(registros / paginado.rxp);
        if ((registros / paginado.rxp) > paginado.paginas) paginado.paginas++
    }

    if (paginado.pagina > paginado.paginas) paginado.pagina = paginado.paginas;

    let inicio = (paginado.pagina - 1) * paginado.rxp;

    sql = `
        select *
        from aulario_v_espacios
        ${condi}
        order by sede, edificio, unidad, tipo_espacio, espacio
        limit ${inicio}, ${paginado.rxp}
    `

    result = await dbSelect(sql, param);

    return {
        filas: result,
        paginado,
    };
}

export async function leer(id) {

    const sql = `
        select *
        from aulario_v_espacios
        where id = ?
    `
    const param = [id]

    const result = await dbSelect(sql, param)

    if (result.length > 0) {
        return result[0]
    } else {
        return {}
        // return {
        //     id: 0,
        //     sede_id: 0,
        //     sede: "",
        //     edificio_id: 0,
        //     edificio: "",
        //     cod_uni: "",
        //     unidad: "",
        //     tipo_espacio_id: 0,
        //     tipo_espacio: "",
        //     espacio: "",
        //     planta: "",
        //     superficie: 0,
        //     capacidad: 0,
        //     capacidad_autorizada: 0,
        //     ventilado: 0,
        //     climatizado: 0,
        //     disponible: 0,
        //     tipo_reservable: 0,
        //     verificado: 0,
        //     equipos: 0,
        //     sis_usuario: "",
        //     sis_fecha: "",
        //     sis_vigente: 0,
        // }
    }
}

export async function leerId(id) {

    // LEER FOTOS Y EQUIPOS

    let sql = `
        select *
        from aulario_v_espacios
        where id = ?
    `
    const param = [id]

    const result = await dbSelect(sql, param)

    if (result.length > 0) {
        result[0].equipos = []
        result[0].fotos = []

        sql = `
            select *
            from aulario_v_espacios_equipos
            where espacio_id = '${id}'
        `;

        let equipos = await dbSelect(sql, []);

        if (equipos.length > 0) result[0].equipos = equipos;
        // result[0].equipos = [...equipos];

        let fotos = await getFotos(id)

        if (fotos.length > 0) result[0].fotos = fotos;
    }

    if (result.length > 0) {
        return result[0]
    } else {
        return {}
    }
}

export async function agregar(datos, sis_usuario_id) {
    datos = limpiar(datos)

    if (await existente(datos)) {
        return {
            error: true,
            mensaje: "Ya existe un Espacio con el mismo nombre en la misma Ubicación."
        }
    }

    let sql = `
        insert into aulario_espacios 
            (
                edificio_id,
                cod_uni,
                tipo_espacio,
                nombre,
                planta,
                superficie,
                capacidad,
                capacidad_autorizada,
                ventilado,
                climatizado,
                verificado,
                reserva,
                comentario,
                sis_vigente,
                sis_usuario_id,
                sis_fecha
            )
        values
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now() )
    `

    let result = await dbAction(sql, [
        datos.edificio_id,
        datos.cod_uni,
        datos.tipo_espacio_id,
        datos.espacio,
        datos.planta,
        datos.superficie,
        datos.capacidad,
        datos.capacidad_autorizada,
        datos.ventilado,
        datos.climatizado,
        datos.verificado,
        datos.espacio_reserva,
        datos.comentario,
        datos.sis_vigente,
        sis_usuario_id
    ])

    console.log('Resultado de Agregar:', result)

    return result
}

export async function modificar(datos, sis_usuario_id) {
    datos = limpiar(datos)

    if (await existente(datos)) {
        return {
            error: true,
            mensaje: "Ya existe un Espacio con el mismo nombre en la misma Ubicación."
        }
    }

    console.log('DATOS:', datos)

    let sql = `
        update aulario_espacios set
            edificio_id = ?,
            cod_uni = ?,
            tipo_espacio = ?,
            nombre = ?,
            planta = ?,
            superficie = ?,
            capacidad = ?,
            capacidad_autorizada = ?,
            climatizado = ?,
            ventilado = ?,
            disponible = ?,
            reserva = ?,
            verificado = ?,
            comentario = ?,
            sis_vigente = ?,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [
        datos.edificio_id,
        datos.cod_uni,
        datos.tipo_espacio_id,
        datos.espacio,
        datos.planta,
        datos.superficie,
        datos.capacidad,
        datos.capacidad_autorizada,
        datos.climatizado,
        datos.ventilado,
        datos.disponible,
        datos.espacio_reserva,
        datos.verificado,
        datos.comentario,
        datos.sis_vigente,
        sis_usuario_id,
        datos.id
    ])

    console.log('Resultado de Modificar:', result)

    return result
}

export async function borrar(datos, sis_usuario_id) {
    datos = limpiar(datos)

    if (await existen_dependencias (datos)) {
        return {
            error: true,
            mensaje: "No se puede borrar, existen datos relacionados en otras entidades."
        }
    }

    let sql = `
        update aulario_espacios set
            sis_anulado = 1,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [
        sis_usuario_id,
        datos.id
    ])

    return result
}
