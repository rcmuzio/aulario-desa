<script>
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
        const res = await fetch(
            `/api/mantenimiento/espacios/imagen/${id}-${t}`,
            {
                method: "GET",
            }
        );

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

                fotos.push({
                    id: 0,
                    type,
                    base64,
                });
                fotos = [...fotos];

                dispatch("afotos", { fotos });
            };
            return;
        }
    }

    function eliminar(i) {
        if (fotos[i].id != 0) {
            if (fotos[i].eliminar) {
                fotos[i].eliminar = false;
            } else {
                fotos[i].eliminar = true;
            }
            fotos = [...fotos];
        } else {
            let x = [];
            fotos.map((f, fi) => {
                if (fi != i) x.push(f);
            });
            fotos = [...x];
        }

        dispatch("afotos", { fotos });
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

<div
    class=" w3-border w3-round"
    style="padding-top: 6px; min-height:100px"
    on:click={() => document.getElementById("foto").click()}
>
    <div class="w3-center w3-large w3-text-grey">
        Click aquí para agregar una foto
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
                    {#if f.id == 0}
                        <span class="w3-text-blue w3-tiny">(Nuevo)</span>
                    {/if}
                    {#if f.eliminar}
                        <span class="w3-text-red w3-tiny">(Borrar)</span>
                    {/if}
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
