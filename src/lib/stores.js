import { writable } from 'svelte/store';

function usuario() {

	let usuario = {
		apenom: '',
		email: '',
		id_token: '',
		refresh_token: '',
		logOn: false,
		menu: [],
	}

	const { subscribe, set, update } = writable(usuario);

	return {
		subscribe,
		actualizar: (x) => update(n => x),
		reset: () => set(usuario)
	};
}
export const sre_usuario = usuario();



// function siuc() {
// 	let params = {
// 		client_id: `${variables.client_id}`,
// 		secret: `${variables.client_secret}`,
// 		/* redirect_uri: "http://aulario.ucc.edu.ar/dist", */
// 		redirect_uri: `${variables.basePath}`,
// 		url: `${variables.url}`,
// 		/*url: "https://accounts-sandbox.ucc.edu.ar/signin/authorize",*/
// 		url_token: `${variables.url_token}`,
// 		/* url_token: "https://apisiuc-sandbox.ucc.edu.ar/api/token", */
// 		url_username: (username) => {
// 			return 'https://apisiuc.ucc.edu.ar/v1/api/connects/' + username + '/user';
// 		}
// 	}

// 	const { subscribe, set, update } = writable(params);

// 	return {
// 		subscribe,
// 		actualizar: (x) => update(n => x),
// 		reset: () => set(params)
// 	};
// }
// export const sre_siuc = siuc();



function data() {
	let datos = {
		unidades: [],
		unidades_vinculadas: [],
	}
	const { subscribe, set, update } = writable(datos);

	return {
		subscribe,
		actualizar: (x) => update(n => x),
		reset: () => set(datos)
	};
}
export const sre_data = data();


function cod_uni_actual() {

    let actual = 'XX'
    const { subscribe, set, update } = writable(actual)

    return {
        subscribe,
        actualizar: (a) => update(x => a),
        reset: () => set(actual)
    }
}
export const sre_cod_uni_actual = cod_uni_actual();


function reserva() {
    let estado_inicial = {
        cod_uni: undefined,
        vista: undefined,
        fecha: undefined,
        espacio_id: undefined,
        monitor_id: 0,
		vista_monitor: 1,
		rxp_monitor:3,
		pausa_monitor:10,
		pagina_monitor:1,
		actividad_monitor:1,
		font_size:8,
		ancho_columna:200,
		mostrar:{
			"unidad": true, 
			"carrera": true,
			"docente": true
		}
		/* fecha:'',
		desde:'',
		hasta:'' */
    }

    const { subscribe, set, update } = writable(estado_inicial)

    return {
        subscribe,
        actualizar: (datos) => update(x => x = { ...datos }),
        reset: () => set(estado_inicial)
    }
}
export const sre_reserva = reserva();



function reserva_temp() {
    let estado_inicial = {
        fecini: '',
		fecfin:'',
		desde: '',
		hasta: '',
		dias:[]
    }

    const { subscribe, set, update } = writable(estado_inicial)

    return {
        subscribe,
        actualizar: (datos) => update(x => x = { ...datos }),
        reset: () => set(estado_inicial)
    }
}
export const sre_reserva_temp = reserva_temp();


