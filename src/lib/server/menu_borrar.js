// export function menu_usuario(clave, roles, refresh_token) {
// { ruta: '/app/mantenimiento/tipo_articulo'+'?refresh_token='+refresh_token, titulo: 'Tipos de Artículos' },

export function menu_usuario(clave, roles) {

    const mantenimiento = {
        menu: 'Mantenimiento',
        items: [
            { ruta: '/app/mantenimiento/tipo_articulo', titulo: 'Tipos de Artículos' },
            { ruta: '/app/mantenimiento/articulos', titulo: 'Artículos' },
            { ruta: '/app/mantenimiento/sedes', titulo: 'Sedes' },
            { ruta: '/app/mantenimiento/edificios', titulo: 'Edificios' },
            { ruta: '/app/mantenimiento/tipo_espacio', titulo: 'Tipos de Espacios' },
            { ruta: '/app/mantenimiento/espacios', titulo: 'Espacios' },
            { ruta: '/app/mantenimiento/monitores', titulo: 'Monitores' },
        ]
    }

    const soporte = {
        menu: 'Soporte Técnico IT',
        items: [
            { ruta: '/app/soporte/equipamiento', titulo: 'Equipamiento' },
            { ruta: '/app/soporte/instalaciones', titulo: 'Equipamiento instalado ' },
        ]
    }

    const secre = {
        menu: 'Secretaría',
        items: [
            { ruta: '/app/reserva', titulo: 'Reservas' },
        ]
    }

    const alumno = {
        menu: 'Alumno',
        items: [
            { ruta: '/app/alumno/agenda', titulo: 'Agenda clases' },
            { ruta: '/app/publico/misreservas', titulo: 'Mis reservas.' },
        ]
    }

    const docente = {
        menu: 'Docente',
        items: [
            { ruta: '/app/docente/agenda', titulo: 'Agenda clases' },
        ]
    }

    let menu = []

    for (let rol of roles) {
        switch (rol) {
            case "ROLE_MANTE_AULA":
                menu.push(mantenimiento)
                break;
            case "ROLE_SOPORTE_AULA":
                menu.push(soporte)
                break;
            case "ROLE_SECRE_AULA":
                menu.push(secre)
                break;
            case "ROLE_DOCENTE":
                menu.push(docente)
                break;
            case "ROLE_ALUMNO":
                menu.push(alumno);
                break;
        }
    }

    // MENU VALIDO
    // MENU RCM

    if(clave=="0317031"){
        menu = []
        menu.push(mantenimiento)
        menu.push(soporte)
        menu.push(secre)
        menu.push(docente)
        menu.push(alumno)
    }

    if(clave=="9508912"){
        menu = []
        menu.push(soporte)
    }

    if(clave=="1648186"){
        menu = []
        menu.push(mantenimiento)
    }

    return menu
}