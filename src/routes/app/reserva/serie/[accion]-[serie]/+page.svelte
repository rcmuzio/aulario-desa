<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { valida_hora } from "$lib/funciones";
    import { sre_usuario, sre_reserva_temp } from "$lib/stores";

    import Espacios from "$lib/components/reserva/grillas/espacios.svelte";
    import Carreras from "$lib/components/reserva/grillas/carreras.svelte";
    import Materias from "$lib/components/reserva/grillas/materias.svelte";
    import Docentes from "$lib/components/reserva/grillas/docentes.svelte";
    import SelectUnidadesVinculadas from "$lib/components/reserva/selects/select_unidades_vinculadas.svelte";
    import Mensajes from "$lib/components/reserva/mensajes.svelte";
    import EstaSeguro from "$lib/components/reserva/esta_seguro.svelte";
    import AgregarHorario from "$lib/components/reserva/horarios/agregar.svelte";
    import { apiFetch } from "$lib/client/api";

    export let data;

    let displayAgregarHorario = "none";
    let displayEspacios = "none";
    let displayCarreras = "none";
    let displayMaterias = "none";
    let displayDocentes = "none";
    let displayMensajes = "none";
    let displayEstaSeguro = "none";

    let mensajes = [];

    let readonly = $page.params.accion == "Borrar" ? true : false;
    let disabled = $page.params.accion == "Borrar" ? true : false;
    let color_titulo = $page.params.accion == "Borrar" ? "red" : "blue";

    let resetSelectCarrera = 0;

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
        if ($sre_reserva_temp.espacio_id > 0) {
            let ddd = [];
            $sre_reserva_temp.dias.map((d) => {
                ddd.push(d.checked);
            });
            registro.espacio_id = $sre_reserva_temp.espacio_id;
            registro.sede = $sre_reserva_temp.sede;
            registro.edificio = $sre_reserva_temp.edificio;
            registro.espacio = $sre_reserva_temp.espacio;
            registro.capacidad = $sre_reserva_temp.capacidad;
            registro.capacidad_autorizada =
                $sre_reserva_temp.capacidad_autorizada;
            registro.ventilado = $sre_reserva_temp.ventilado;
            registro.climatizado = $sre_reserva_temp.climatizado;
            registro.disponible = $sre_reserva_temp.disponible;
            registro.planta = $sre_reserva_temp.planta;
            registro.unidad_propietaria = $sre_reserva_temp.unidad_propietaria;
            registro.desde = $sre_reserva_temp.fecini;
            registro.hasta = $sre_reserva_temp.fecfin;
            horarios = [
                {
                    desde: $sre_reserva_temp.desde,
                    hasta: $sre_reserva_temp.hasta,
                    dias: [...ddd],
                },
            ];
            horarios = [...horarios];
        }
        sre_reserva_temp.reset();

        if ($page.params.accion == "Agregar") return;

        const res = await apiFetch({
            ruta: `/api/reserva/series?serie=${data.serie}`,
            method: "GET",
            token: false,
            body: "",
        });
        const jsn = await res.json();

        if (res.ok) {
            if (jsn.error) {
                alert(jsn.mensaje);
            } else {
                const datos = { ...jsn[0] };
                datos.desde = datos.desde.substring(0, 10);
                datos.hasta = datos.hasta.substring(0, 10);
                let xhorarios = JSON.parse(datos.horarios);
                xhorarios.map((xh) => {
                    xh.desde = xh.desde.substring(0, 5);
                    xh.hasta = xh.hasta.substring(0, 5);
                    return xh;
                });
                // console.log('SERIE:',jsn.datos)
                registro = { ...datos };
                horarios = [...xhorarios];
            }
        }
    });

    function espacio_elegido(event) {
        displayEspacios = "none";
        console.log("ESPACIO ELEGIDO::::", event.detail);
        let x = { ...event.detail };
        registro.espacio_id = x.id;
        registro.sede = x.sede;
        registro.edificio = x.edificio;
        registro.unidad_propietaria = x.unidad;
        registro.espacio = x.espacio;
        // registro.cod_uni = x.cod_uni;
        registro.planta = x.planta;
        registro.capacidad = x.capacidad;
        registro.capacidad_autorizada = x.capacidad_autorizada;
        registro.climatizado = x.climatizado;
        registro.ventilado = x.ventilado;
        registro.sis_vigente = x.sis_vigente;
        displayEspacios = "none";
    }

    function elegir_carrera() {
        if (registro.cod_uni == "00") {
            alert("Debe seleccionar una Unidad Académica/Gestión");
        } else {
            displayCarreras = readonly ? "none" : "block";
        }
    }

    function carrera_elegida(event) {
        let x = { ...event.detail };
        registro.cod_car = x.cod_carr;
        registro.carrera = x.nomb_carr;
        displayCarreras = "none";
    }

    function elegir_materia() {
        if (registro.cod_uni == "00") {
            alert("Debe seleccionar una Unidad Académica/Gestión");
        } else {
            displayMaterias = readonly ? "none" : "block";
        }
    }

    function materia_elegida(event) {
        let x = { ...event.detail };
        // console.log("materia elegida", event.detail);
        registro.cod_mate = x.cod_mat;
        registro.materia = x.nom_mat;
        displayMaterias = "none";
    }

    function elegir_docente() {
        if (registro.cod_uni == "00") {
            alert("Debe seleccionar una Unidad Académica/Gestión");
        } else {
            displayDocentes = readonly ? "none" : "block";
        }
    }

    function docente_elegido(event) {
        let x = { ...event.detail };
        registro.cod_prof = x.cod_prof;
        registro.docente = x.apellido + ", " + x.nombre;
        displayDocentes = "none";
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
        resetSelectCarrera++;
        registro.cod_uni = event.detail;
        registro.cod_car = "";
        registro.carrera = "";
        registro.cod_prof = "";
        registro.cod_mate = "";
        registro.materia = "";
        registro.docente = "";
    }

    async function reservar() {
        mensajes = [];
        if (
            registro.sede.trim().length == 0 ||
            registro.edificio.trim().length == 0 ||
            registro.espacio.trim().length == 0
        )
            mensajes.push("Debe seleccionar un Espacio.");

        if (registro.cod_uni == "00")
            mensajes.push("Debe seleccionar una Unidad.");

        if (
            (registro.cod_car.trim().length == 0 ||
                registro.cod_mate.trim().length == 0 ||
                registro.cod_prof.trim().length == 0) &&
            registro.descri.trim().length == 0
        )
            mensajes.push(
                "Debe indicar Carrera, Materia y Docente o ingresar una Descripción."
            );

        if (
                registro.desde.trim().length == 0 || 
                registro.hasta.trim().length == 0 ||
                registro.hasta <= registro.desde
        )
            mensajes.push(
                "El rango de fechas no es válido. Como mínimo debe ser de 2 días."
            );
            
        if (horarios.length == 0) {
            mensajes.push("Debe agreagar al menos un horario.");
        }

        if (mensajes.length > 0) {
            displayMensajes = "block";
            return;
        }

        let reserva = {
            serie: $page.params.serie,
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

        reserva.username = $sre_usuario.username;

        let method = "PUT";

        // alert('params.accion:'+$page.params.accion); return;

        if ($page.params.accion == "Agregar") method = "POST";

        const res = await apiFetch({
            ruta: "/api/reserva/series",
            method,
            token: false,
            body: reserva,
        });

        const jsn = await res.json();

        if (res.ok) {
            if (jsn.error) {
                mensajes = [jsn.mensaje];
                displayMensajes = "block";
            } else {
                goto(`/app/reserva/serie/consulta/${jsn.serie}`);
                return;
            }
        } else {
            mensajes = ["No se pudo modificar la serie solicitada."];
            displayMensajes = "block";
        }
    }

    async function borrar() {
        const res = await fetch(`/api/reserva/series`, {
            method: "DELETE",
            body: JSON.stringify({
                serie: $page.params.serie,
                username: $sre_usuario.username,
            }),
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
            mensajes = ["No se pudo borrar la Serie solicitada"];
            displayMensajes = "block";
        }
    }
</script>

<!-- <h1>Modificar/Borrar Serie</h1>
<p>{$page.params.serie}</p>
<a href="/app/reserva">Volver</a> -->

<div class="w3-container">
    <div class="w3-display-container" style="height: 45px;">
        <div class="w3-display-toplef w3-text-{color_titulo}">
            <h2>{$page.params.accion} Serie</h2>
        </div>
        <div class="w3-display-topright">
            <button class="w3-btn w3-red" on:click={() => goto("/app/reserva")}>
                <i class="fa fa-close w3-text-white" />
            </button>
        </div>
    </div>

    <div
        class="w3-container"
        on:click={() => (displayEspacios = readonly ? "none" : "block")}
    >
        <h3>
            <i
                class="fa fa-search w3-hover-text-blue"
                style="cursor: pointer;"
                title="Seleccionar Espacio"
            /> Espacio
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
                bind:value={registro.unidad_propietaria}
            />
        </div>

        <div class="w3-section">
            <label for="espacio">Espacio:</label>
            <input
                type="text"
                name="espacio"
                class="w3-input w3-round w3-light-grey"
                {readonly}
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
                    bind:checked={registro.disponible}
                />
                Disponible
            </div>
        </div>

        <!-- <div class="w3-section">
            <button
                class="w3-btn w3-grey w3-text-white w3-round"
                on:click={() => (displayEspacios = "block")}
                >Seleccionar Espacio</button
            >
        </div> -->
        <hr />
    </div>

    <div class="w3-container">
        <h3>Actividad</h3>

        <div class="w3-section">
            <SelectUnidadesVinculadas
                cod_uni={registro.cod_uni}
                on:actualizar={actualizar_cod_uni}
            />
        </div>

        <div class="w3-section" on:click={elegir_carrera}>
            <!-- <div class="w3-section" on:click={() => (displayCarreras = "block")}> -->
            <label for="carrera">
                <i class="fa fa-search" />
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

        <div class="w3-section" on:click={elegir_materia}>
            <!-- <div class="w3-section" on:click={() => (displayMaterias = "block")}> -->
            <label for="materia">
                <i class="fa fa-search" />
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

        <div class="w3-section" on:click={elegir_docente}>
            <!-- <div class="w3-section" on:click={() => (displayDocentes = "block")}> -->
            <label for="docente">
                <i class="fa fa-search" />
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
                    {disabled}
                    bind:value={registro.curso}
                >
                    {#each cursos as c}
                        <option value={c.codigo}>{c.descri}</option>
                    {/each}
                </select>
            </div>

            <div class="w3-quarter">
                <label for="catedra">Cátedra:</label>
                <input
                    name="catedra"
                    type="text"
                    class="w3-input w3-light-grey w3-round"
                    maxlength="5"
                    {readonly}
                    bind:value={registro.catedra}
                />
            </div>

            <div class="w3-quarter">
                <label for="comision">Comisión:</label>
                <input
                    name="comision"
                    type="text"
                    class="w3-input w3-light-grey w3-round"
                    {readonly}
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
            <label for="descri">Descripción:</label>
            <textarea
                type="text"
                name="descri"
                class="w3-input w3-round w3-light-grey"
                {readonly}
                bind:value={registro.descri}
            />
        </div>
    </div>

    <div class="w3-container">
        <h3>Rango de fechas</h3>
        <div class="w3-section">
            <div class="w3-row-padding">
                <div class="w3-quarter">
                    <label for="desde">Desde:</label>
                    <input
                        type="date"
                        class="w3-input w3-light-grey w3-round"
                        name="desde"
                        {readonly}
                        bind:value={registro.desde}
                    />
                </div>

                <div class="w3-quarter">
                    <label for="hasta">Hasta:</label>
                    <input
                        type="date"
                        class="w3-input w3-light-grey w3-round"
                        name="hasta"
                        {readonly}
                        bind:value={registro.hasta}
                    />
                </div>
            </div>
        </div>
    </div>

    <div class="w3-container">
        <h3>Horarios</h3>
        <div class="w3-responsive">
            <table
                width="90%"
                cellpadding="5"
                align="center"
                border="1"
                style="align:center; border-collapse: collapse; border-spacing: 10px  border: 1px solid grey"
            >
                <thead>
                    <tr>
                        <td rowspan="2" align="center">
                            <button
                                style="background-color:transparent; border:none; cursor:pointer"
                                {disabled}
                                on:click={() => {
                                    displayAgregarHorario = "block";
                                }}
                            >
                                <i class="fa fa-plus w3-large" /></button
                            >
                        </td>
                        <td colspan="2">Horario</td>
                        <td colspan="6">Días</td>
                    </tr>
                    <tr>
                        <td>Desde</td>
                        <td>Hasta</td>
                        <td>Lun</td>
                        <td>Mar</td>
                        <td>Mie</td>
                        <td>Jue</td>
                        <td>Vie</td>
                        <td>Sab</td>
                    </tr>
                </thead>
                <tbody>
                    {#each horarios as h, i}
                        <tr>
                            <td align="center">
                                <button
                                    style="background-color:transparent; border:none; cursor:pointer"
                                    {disabled}
                                    on:click={() => quitar_horario(i)}
                                >
                                    <i class="fa fa-trash-o w3-large" /></button
                                >
                            </td>
                            <td style="width:100px"
                                ><input
                                    type="text"
                                    style="width:95%"
                                    bind:value={h.desde}
                                    maxlength="4"
                                    disabled
                                    on:blur={() =>
                                        (h.desde = valida_hora(h.desde))}
                                /></td
                            >
                            <td style="width:100px"
                                ><input
                                    type="text"
                                    style="width:95%"
                                    bind:value={h.hasta}
                                    maxlength="4"
                                    disabled
                                    on:blur={() =>
                                        (h.hasta = valida_hora(h.hasta))}
                                /></td
                            >
                            {#each h.dias as d}
                                <td
                                    ><input
                                        type="checkbox"
                                        disabled
                                        bind:checked={d}
                                    /></td
                                >
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <div class="w3-section w3-center">
        {#if $page.params.accion == "Agregar"}
            <button
                class="w3-btn w3-blue w3-text-white w3-round-large w3-block"
                on:click={reservar}>Click aquí para agregar la Serie</button
            >
        {/if}
        {#if $page.params.accion == "Modificar"}
            <button
                class="w3-btn w3-blue w3-text-white w3-round-large w3-block"
                on:click={reservar}
                >Click aquí para grabar las modificaciones</button
            >
        {/if}
        {#if $page.params.accion == "Borrar"}
            <button
                class="w3-btn w3-red w3-text-white w3-round-large w3-block"
                on:click={() => (displayEstaSeguro = "block")}
                >Click aquí para borrar esta Serie</button
            >
        {/if}
    </div>
</div>

<Espacios
    display={displayEspacios}
    reserva={1}
    on:elegido={espacio_elegido}
    on:salir={() => (displayEspacios = "none")}
/>

<AgregarHorario
    display={displayAgregarHorario}
    on:agregar={agregarHorario}
    on:salir={() => (displayAgregarHorario = "none")}
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

<Mensajes
    display={displayMensajes}
    {mensajes}
    on:salir={() => (displayMensajes = "none")}
/>
