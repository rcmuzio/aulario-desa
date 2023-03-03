<script>
    import { apiFetch } from "$lib/client/api";
    import { createEventDispatcher } from "svelte";

    export let id = 0;

    let fotos = [];
    let files;
    let image;

    let displayMensaje = "none";
    let mensaje = "";

    const dispatch = new createEventDispatcher();

    $: cargar();

    async function cargar() {
        const t = new Date().valueOf();

        const res = await apiFetch({
            ruta: `/api/mantenimiento/espacios/fotos/consulta`,
            method: "POST",
            token: false,
            body: { id },
        });

        if (res.ok) {
            fotos = await res.json();
        } else {
            fotos = [];
        }

        fotos = [...fotos];
    }

    function subir_archivo_imagen(file) {
        if (!file.type.includes("image")) {
            mensaje = `
                Debe seleccionar un archivo de tipo imagen <Br>
                y su tamaño no puede exceder los 100 Kb.
            `;
            displayMensaje = "block";
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                let base64 = e.target.result
                    .replace("data:", "")
                    .replace(/^.+,/, "");
                let type = file.type;

                agregar(type, base64);
            };
            return;
        }
    }

    async function agregar(type, base64) {
        const res = await apiFetch({
            ruta: `/api/mantenimiento/espacios/fotos`,
            method: "POST",
            token: false,
            body: { espacio_id: id, type, base64 },
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("SE AGREGO LA FOTO:", jsn);
            await cargar();
        } else {
            console.log("NO SE AGREGO LA FOTO");
        }
    }

    async function eliminar(i) {

        const res = await apiFetch({
            ruta: "/api/mantenimiento/espacios/fotos",
            method: "DELETE",
            token: false,
            body: { id: fotos[i].id },
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("SE ELIMINO LA FOTO:", jsn);
            await cargar();
        } else {
            console.log("NO SE ELIMINO LA FOTO");
        }
        // dispatch("afotos", { fotos });
    }
</script>

<input
    type="file"
    id="foto"
    style="display: none ;"
    bind:files
    bind:this={image}
    on:change={() => subir_archivo_imagen(files[0])}
/>

<div class=" w3-border w3-round" style="padding-top: 6px; min-height:100px">
    <div class="w3-center w3-large w3-text-grey">
        <button
            class="w3-text-grey"
            style="cursor:pointer; border: none; background-color:transparent"
            on:click={() => document.getElementById("foto").click()}
        >
            Click aquí para agregar una foto
        </button>
    </div>
    <div class="w3-row-padding">
        {#each fotos as f, i}
            <div class="w3-quarter">
                <img
                    src={`data:${f.type};base64,${f.base64}`}
                    alt={`Foto ${i}`}
                    style="max-height: 150px; max-width: 100%; margin-top:10px "
                />
                <div>
                    <button
                        class="rcm-btn-ico"
                        on:click|stopPropagation={() => eliminar(i)}
                    >
                        <i class="fa fa-trash-o w3-text-red" />
                    </button>
                    <!-- {#if f.id == 0}
                        <span class="w3-text-blue w3-tiny">(Nuevo)</span>
                    {/if}
                    {#if f.eliminar}
                        <span class="w3-text-red w3-tiny">(Borrar)</span>
                    {/if} -->
                </div>
            </div>
        {/each}
    </div>
</div>

<div class="w3-modal" style="display: {displayMensaje}; padding:16px">
    <div class="w3-content w3-white w3-round">
        <div class="w3-padding">
            <div class="w3-display-container" style="height: 45px;">
                <div class="w3-display-topright">
                    <button
                        class="w3-btn w3-red"
                        on:click={() => {
                            displayMensaje = "none";
                        }}
                    >
                        <i class="fa fa-close w3-text-white" />
                    </button>
                </div>
            </div>

            <div
                class="w3-padding w3-text-red w3-large"
                style="font-weight: bold"
            >
                {@html mensaje}
            </div>
        </div>
    </div>
</div>

<style>
    .rcm-btn-ico {
        border: none;
        background-color: transparent;
        cursor: pointer;
    }
</style>
