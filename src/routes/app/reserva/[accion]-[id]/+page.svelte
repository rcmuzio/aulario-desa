<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { sre_usuario } from "$lib/stores";

    import Espacios from "$lib/components/reserva/grillas/espacios.svelte";
    import Carreras from "$lib/components/reserva/grillas/carreras.svelte";
    import Materias from "$lib/components/reserva/grillas/materias.svelte";
    import Docentes from "$lib/components/reserva/grillas/docentes.svelte";
    import SelectUnidadesVinculadas from "$lib/components/reserva/selects/select_unidades_vinculadas.svelte";

    import Mensajes from "$lib/components/reserva/mensajes.svelte";
    import EstaSeguro from "$lib/components/reserva/esta_seguro.svelte";
    import { apiFetch } from "$lib/client/api";

    let mensajes = [];

    let displayEspacios = "none";
    let displayCarreras = "none";
    let displayMaterias = "none";
    let displayDocentes = "none";
    let displayMensajes = "none";
    let displayAviso = "none";
    let displayEstaSeguro = "none";
    let displayAgregarHorario = "none";

    let readonly = $page.params.accion == "Borrar" ? true : false;
    let disabled = $page.params.accion == "Borrar" ? true : false;
    let color_titulo = $page.params.accion == "Borrar" ? "red" : "blue";

    let horarios = [];

    let param = {
        desde: "",
        hasta: "",
        dias: [0, 0, 0, 0, 0, 0],
    };

    let tipo_actividad = [
        { codigo: "1", descri: "Curricular" },
        { codigo: "2", descri: "Extra Curricular" },
        { codigo: "3", descri: "Curso" },
        { codigo: "4", descri: "Seminario" },
        { codigo: "5", descri: "Conferencia" },
        { codigo: "6", descri: "Congreso" },
        { codigo: "7", descri: "Otra" },
    ];

    let cursos = [
        { codigo: "0", descri: "No determinado" },
        { codigo: "1", descri: "1" },
        { codigo: "2", descri: "2" },
        { codigo: "3", descri: "3" },
        { codigo: "4", descri: "4" },
        { codigo: "5", descri: "5" },
        { codigo: "6", descri: "6" },
    ];

    let registro = {
        espacio_id: 0,
        sede: "",
        edificio: "",
        espacio: "",
        cod_uni: "00",
        cod_car: "",
        cod_mate: "",
        cod_prof: "",
        curso: 0,
        catedra: "",
        comision: "",
        tipo_acti: "1",
        descri: "",
        asistentes: 0,
        desde: "",
        hasta: "",
        horarios: [],
    };

    onMount(async () => {
        // const res = await fetch(`/api/reserva/${$page.params.id}`, {
        //     method: "GET",
        // });

        const res = await apiFetch({
            ruta: `/api/reserva/${$page.params.id}`,
            method: "GET",
            token: false,
            body: "",
        });

        const jsn = await res.json();

        if (res.ok) {
            if (jsn.error) {
                mensajes = [jsn.mensaje];
                displayMensajes = "block";
            } else {
                registro = { ...jsn.datos };
                registro.fecha = registro.fecha.substring(0, 10);
            }
        } else {
            mensajes = ["No se pudo recuperar la repetición solicitada."];
            displayMensajes = "block";
        }
    });

    function espacio_elegido(event) {
        let x = { ...event.detail };
        registro.espacio_id = x.id;
        registro.sede = x.sede;
        registro.edificio = x.edificio;
        registro.unidad = x.unidad;
        registro.espacio = x.espacio;
        //registro.cod_uni = x.cod_uni;
        registro.planta = x.planta;
        registro.capacidad = x.capacidad;
        registro.capacidad_autorizada = x.capacidad_autorizada;
        registro.climatizado = x.climatizado;
        registro.ventilado = x.ventilado;
        registro.sis_vigente = x.sis_vigente;
        displayEspacios = "none";
    }

    function carrera_elegida(event) {
        let x = { ...event.detail };
        registro.cod_car = x.cod_carr;
        registro.carrera = x.nomb_carr;
        displayCarreras = "none";
    }

    function materia_elegida(event) {
        let x = { ...event.detail };
        registro.cod_mate = x.cod_mat;
        registro.materia = x.nom_mat;
        displayMaterias = "none";
    }

    function docente_elegido(event) {
        let x = { ...event.detail };
        registro.cod_prof = x.cod_prof;
        registro.docente = x.apellido + ", " + x.nombre;
        displayDocentes = "none";
    }

    function quitar_carrera() {
        registro.cod_car = "";
        registro.carrera = "";
    }

    function quitar_materia() {
        registro.cod_mate = "";
        registro.materia = "";
    }

    function quitar_docente() {
        registro.cod_prof = "";
        registro.docente = "";
    }

    function agregarHorario(event) {
        horarios.push(event.detail);
        horarios = [...horarios];
        displayAgregarHorario = "none";
    }

    function quitar_horario(i) {
        let x = [];
        horarios.map((hh, h) => {
            if (h != i) x.push(hh);
        });
        horarios = [...x];
    }

    function actualizar_cod_uni(event) {
        //resetSelectCarrera++;
        //console.log("ACTUALIZA COD_UNI");
        registro.cod_uni = event.detail;
        registro.cod_car = "";
        registro.carrera = "";
        registro.cod_prof = "";
        registro.cod_mate = "";
        registro.materia = "";
        registro.docente = "";
    }

    async function reservar() {
        let reserva = {
            espacio_id: registro.espacio_id,
            cod_uni: registro.cod_uni,
            cod_car: registro.cod_car,
            cod_mate: registro.cod_mate,
            cod_prof: registro.cod_prof,
            curso: registro.curso,
            catedra: registro.catedra,
            comision: registro.comision,
            tipo_acti: registro.tipo_acti,
            descri: registro.descri,
            desde: registro.desde,
            hasta: registro.hasta,
            horarios: [...horarios],
        };

        reserva.horarios.map((h) => {
            h.desde = h.desde.length < 6 ? h.desde + ":01" : h.desde;
            h.hasta = h.hasta.length < 6 ? h.hasta + ":00" : h.hasta;
            return h;
        });

        // const res = await fetch("/api/reserva/serie/agregar", {
        //     method: "POST",
        //     body: JSON.stringify(reserva),
        // });

        alert('grabar')
        const res = await apiFetch({
            ruta: "/api/reserva/serie/agregar",
            method: "POST",
            token: false,
            body: { ...reserva },
        });

        const jsn = await res.json();

        if (res.ok) {
            if (jsn.error) {
                mensajes = [jsn.mensaje];
                displayMensajes = "block";
            } else {
                goto("/app/reserva");
            }
        } else {
            mensajes = ["No se pudo agregar la repetición solicitada."];
            displayMensajes = "block";
        }
    }

    function elegir_carrera() {
        if ($page.params.accion == "Modificar") displayCarreras = "block";
    }

    function elegir_materia() {
        if ($page.params.accion == "Modificar") displayMaterias = "block";
    }

    function elegir_docente() {
        if ($page.params.accion == "Modificar") displayDocentes = "block";
    }

    async function borrar() {
        mensajes = [];

        let datos = {
            id: registro.id,
            username: $sre_usuario.username,
        };

        // const res = await fetch(`/api/reserva`, {
        //     method: "DELETE",
        //     body: JSON.stringify(datos),
        // });

        const res = await apiFetch({
            ruta: `/api/reserva`,
            method: 'DELETE',
            token: false,
            body: datos
        })

        const jsn = await res.json();

        if (res.ok) {
            if (jsn.error) {
                mensajes = [jsn.mensaje];
                displayMensajes = "block";
            } else {
                goto("/app/reserva");
            }
        } else {
            mensajes = ["No se pudo borrar la repetición solicitada."];
            displayMensajes = "block";
        }
    }

    async function modificar() {
        mensajes = [];

        if (registro.cod_uni.length == 0)
            mensajes.push("Debe seleccionar una Unidad Académica/Gestión.");

        // if (
        //     (registro.cod_car.trim().length == 0 ||
        //         registro.cod_mate.trim().length == 0) &&
        //     registro.descri.trim().length == 0
        // ) {
        //     mensajes.push(
        //         "Debe seleccionar Carrera y Materia o Ingresar una Descripción"
        //     );
        // }

        if (
            registro.cod_mate.trim().length == 0 &&
            registro.descri.trim().length == 0
        ) {
            mensajes.push(
                "Debe seleccionar una Materia o Ingresar una Descripción"
            );
        }

        if (registro.fecha.toString().length == 0)
            mensajes.push("Debe seleccionar una fecha.");
        if (
            registro.desde.toString().length == 0 ||
            registro.hasta.toString().length == 0
        )
            mensajes.push("Debe seleccionar el horario correctamente.");

        mensajes = [...mensajes];

        if (mensajes.length > 0) {
            displayMensajes = "block";
            return;
        }

        let datos = {
            id: registro.id,
            espacio_id: registro.espacio_id,
            fecha: registro.fecha,
            desde: registro.desde,
            hasta: registro.hasta,
            cod_uni: registro.cod_uni,
            cod_car: registro.cod_car,
            cod_mate: registro.cod_mate,
            cod_prof: registro.cod_prof,
            curso: registro.curso,
            catedra: registro.catedra,
            comision: registro.comision,
            descri: registro.descri,
            tipo_acti: registro.tipo_acti,
            username: $sre_usuario.username,
        };

        // const res = await fetch(`/api/reserva`, {
        //     method: "PUT",
        //     body: JSON.stringify(datos),
        // });

        const res = await apiFetch({
            ruta: `/api/reserva`,
            method: 'PUT',
            token: false,
            body: datos
        })

        const jsn = await res.json();

        if (res.ok) {
            if (jsn.error) {
                mensajes = [jsn.mensaje];
                displayMensajes = "block";
            } else {
                goto("/app/reserva");
            }
        } else {
            mensajes = ["No se pudo modificar la repetición solicitada."];
            displayMensajes = "block";
        }
    }
</script>

<div class="w3-container">
    <div class="w3-display-container" style="height: 45px;">
        <div
            class="w3-display-toplef w3-text-{color_titulo}"
            style="font-weight: bold;"
        >
            <h2>{$page.params.accion} Repetición</h2>
        </div>
        <div class="w3-display-topright">
            <button class="w3-btn w3-red" on:click={() => goto("/app/reserva")}>
                <i class="fa fa-close w3-text-white" />
            </button>
        </div>
    </div>

    <div class="w3-container">
        <h3 class="w3-border-bottom w3-text-green" style="font-weight: bold;">
            Espacio
        </h3>

        <div class="w3-section">
            <label for="sede">Ubicación:</label>
            <input
                type="text"
                name="sede"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.sede}
            />
        </div>

        <div class="w3-section">
            <label for="edificio">Edificio:</label>
            <input
                type="text"
                name="edificio"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.edificio}
            />
        </div>

        <div class="w3-section">
            <label for="espacio">Unidad:</label>
            <input
                type="text"
                name="espacio"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.unidad}
            />
        </div>

        <div class="w3-section">
            <label for="espacio">Espacio:</label>
            <input
                type="text"
                name="espacio"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.espacio}
            />
        </div>

        <div class="w3-row-padding">
            <div class="w3-third">
                <label for="planta">Planta:</label>
                <input
                    type="text"
                    name="planta"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={registro.planta}
                />
            </div>
            <div class="w3-third">
                <label for="sede">Capacidad:</label>
                <input
                    type="text"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={registro.capacidad}
                />
            </div>
            <div class="w3-third">
                <label for="sede">Capacidad autorizada:</label>
                <input
                    type="text"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={registro.capacidad_autorizada}
                />
            </div>
        </div>
        <br />
        <div class="w3-row-padding">
            <div class="w3-third">
                <input
                    type="checkbox"
                    disabled
                    bind:checked={registro.climatizado}
                />
                Climatizado
            </div>
            <div class="w3-third">
                <input
                    type="checkbox"
                    disabled
                    bind:checked={registro.ventilado}
                />
                Ventilado
            </div>
            <div class="w3-third">
                <input
                    type="checkbox"
                    disabled
                    bind:checked={registro.sis_vigente}
                />
                Vigente
            </div>
        </div>

        <div class="w3-section">
            <button
                class="w3-btn w3-grey w3-text-white w3-round"
                {disabled}
                on:click={() => (displayEspacios = "block")}
                >Seleccionar Espacio</button
            >
        </div>
        <hr />
    </div>

    <div class="w3-container">
        <h3 class="w3-border-bottom w3-text-green" style="font-weight: bold;">
            Actividad
        </h3>

        <div class="w3-section">
            <SelectUnidadesVinculadas
                {disabled}
                cod_uni={registro.cod_uni}
                on:actualizar={actualizar_cod_uni}
            />
        </div>
        <div class="w3-section">
            <label for="carrera">
                <i
                    class="fa fa-search cursor"
                    on:click={elegir_carrera}
                    title="Buscar carrera"
                />
                <i
                    class="fa fa-trash-o w3-text-red cursor"
                    on:click={quitar_carrera}
                    title="Quitar carrera"
                />
                Carrera:</label
            >
            <input
                type="text"
                name="carrera"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.carrera}
            />
        </div>
        <div class="w3-section">
            <label for="materia">
                <i
                    class="fa fa-search cursor"
                    on:click={elegir_materia}
                    title="Buscar materia"
                />
                <i
                    class="fa fa-trash-o w3-text-red cursor"
                    on:click={quitar_materia}
                    title="Quitar materia"
                />
                Materia:</label
            >
            <input
                type="text"
                name="materia"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.materia}
            />
        </div>
        <div class="w3-section">
            <label for="docente">
                <i
                    class="fa fa-search cursor"
                    on:click={elegir_docente}
                    title="Buscar docente"
                />
                <i
                    class="fa fa-trash-o w3-text-red cursor"
                    on:click={quitar_docente}
                    title="Quitar docente"
                />
                Docente:</label
            >
            <input
                type="text"
                name="docente"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.docente}
            />
        </div>
        <div class="w3-row-padding">
            <div class="w3-quarter">
                <label for="catedra">Curso:</label>
                <select
                    name="curso"
                    class="w3-input w3-light-grey w3-round"
                    bind:value={registro.curso}
                >
                    {#each cursos as c}
                        <option value={c.codigo}>{c.descri}</option>
                    {/each}
                </select>
            </div>
            <div class="w3-quarter">
                <label for="catedra">Cátedras:</label>
                <input
                    name="catedra"
                    type="text"
                    {readonly}
                    class="w3-input w3-light-grey w3-round"
                    maxlength="5"
                    bind:value={registro.catedra}
                />
            </div>
            <div class="w3-quarter">
                <label for="comision">Comisión:</label>
                <input
                    name="comision"
                    type="text"
                    {readonly}
                    class="w3-input w3-light-grey w3-round"
                    bind:value={registro.comision}
                />
            </div>
            <div class="w3-quarter">
                <label for="tipo_actividad">Tipo de actividad:</label>
                <select
                    name="tipo_actividad"
                    class="w3-input w3-light-grey w3-round"
                    {disabled}
                    bind:value={registro.tipo_acti}
                >
                    {#each tipo_actividad as t}
                        <option value={t.codigo}>{t.descri}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="w3-section">
            <label for="docente">Descripción:</label>
            <textarea
                type="text"
                name="descri"
                class="w3-input w3-round w3-light-grey"
                {readonly}
                bind:value={registro.descri}
            />
        </div>
        <div class="w3-row-padding">
            <div class="w3-half">
                <label for="fecha">Día:</label>
                <input
                    type="date"
                    name="fecha"
                    {readonly}
                    bind:value={registro.fecha}
                    class="w3-input w3-light-grey w3-round"
                />
            </div>
            <div class="w3-quarter">
                <label for="desde">Desde:</label>
                <input
                    type="time"
                    name="desde"
                    {readonly}
                    bind:value={registro.desde}
                    class="w3-input w3-light-grey w3-round"
                />
            </div>
            <div class="w3-quarter">
                <label for="hasta">Hasta:</label>
                <input
                    type="time"
                    name="hasta"
                    {readonly}
                    bind:value={registro.hasta}
                    class="w3-input w3-light-grey w3-round"
                />
            </div>
        </div>
    </div>

    <div class="w3-section w3-center">
        {#if $page.params.accion == "Borrar"}
            <button
                class="w3-btn w3-red w3-text-white w3-round-large w3-block"
                on:click={() => (displayEstaSeguro = "block")}
                >Click aquí para borrar la Repetición</button
            >
        {:else}
            <button
                class="w3-btn w3-blue w3-text-white w3-round-large w3-block"
                on:click={modificar}
                >Click aquí para grabar las modificaciones</button
            >
        {/if}
    </div>
</div>

<div class="w3-modal" style="display:{displayAviso}">
    <div
        class="w3-modal-content w3-sand w3-round"
        style="height: 60px; max-width:250px"
    >
        <div
            class="w3-section w3-text-indigo w3-center"
            style="padding-top:20px"
        >
            Procesando...
        </div>
    </div>
</div>

<Mensajes
    {mensajes}
    display={displayMensajes}
    on:salir={() => (displayMensajes = "none")}
/>

<Espacios
    display={displayEspacios}
    on:elegido={espacio_elegido}
    on:salir={() => (displayEspacios = "none")}
/>

<Carreras
    display={displayCarreras}
    cod_uni={registro.cod_uni}
    on:elegida={carrera_elegida}
    on:salir={() => (displayCarreras = "none")}
/>

<Materias
    display={displayMaterias}
    cod_uni={registro.cod_uni}
    on:elegida={materia_elegida}
    on:salir={() => (displayMaterias = "none")}
/>

<Docentes
    display={displayDocentes}
    cod_uni={registro.cod_uni}
    on:elegido={docente_elegido}
    on:salir={() => (displayDocentes = "none")}
/>

<EstaSeguro
    display={displayEstaSeguro}
    on:si={borrar}
    on:no={() => (displayEstaSeguro = "none")}
/>

<!-- 
<AgregarHorario
    display={displayAgregarHorario}
    on:agregar={agregarHorario}
    on:salir={() => {
        displayAgregarHorario = "none";
    }}
/>

 -->
<style>
    .cursor {
        cursor: pointer;
    }
</style>
