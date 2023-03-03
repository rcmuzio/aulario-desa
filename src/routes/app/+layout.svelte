<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import Menu from "$lib/components/menu.svelte";
    import { sre_data, sre_usuario } from "$lib/stores";
    import logo from "$lib/logo.js";

    export let data = {
        SIUC_URL: "",
        SIUC_CLIENT_ID: "",
        SIUC_REDIRECT_URI: "",
        SIUC_URL_LOGOFF: "",
    };

    let cargando = true;

    if (browser) {
        // En localStorage se guarda el último refresh_token de inicio de sesión
        // Lo utiliza para autenticar el usuario
        // Si expiró, solicita un nuevo refresh_token
        // Si no hay refresh_token en el localStorage, fuerza un nuevo inicio de sesión
        const x = JSON.parse(localStorage.getItem("ucc-rcm")) || {
            error: true,
        };
        if (x.error) {
            cargando = false;
        } else {
            autenticar_usuario(x);
        }
    }

    $: if (
        $sre_usuario.menu.length == 1 &&
        $sre_usuario.menu[0].items.length == 1
    ) {
        goto($sre_usuario.menu[0].items[0].ruta);
    }

    async function autenticar_usuario(x) {
        const res = await fetch("/api/autenticar", {
            method: "POST",
            body: JSON.stringify(x),
        });

        if (res.ok) {
            const jsn = await res.json();
            if (!jsn.error) {
                const user = { ...$sre_usuario };
                localStorage.setItem(
                    "ucc-rcm",
                    JSON.stringify({ refresh_token: jsn.refresh_token })
                );
                user.apenom = jsn.usuario.fullName;
                user.email = jsn.usuario.mailInstitution;
                user.menu = jsn.menu;
                user.logOn = true;
                sre_usuario.actualizar(user);
                sre_data.actualizar({
                    unidades: jsn.unidades,
                    unidades_vinculadas: jsn.unidades_vinculadas,
                });
            }
        }
        cargando = false;
    }

    async function cerrar_sesion() {
        localStorage.removeItem("ucc-rcm");
        sre_usuario.reset();
        const res = await fetch(`${data.SIUC_URL_LOGOFF}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accpet: "application/json",
                Authorization: `Bearer ${$sre_usuario.id_token}`,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("CERRAR SESION:", jsn);
        }
    }
</script>

<div
    class="w3-display-container background-header w3-hide-small w3-border-bottom"
    style="height: 85px; "
>
    <div class="w3-display-left">
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding-left: 9px;">
                    <button
                        style="border: 0px; background-color:transparent; cursor:pointer"
                        on:click={() => goto("/app")}
                    >
                        <img alt="Logo UCC" height="90px" src={logo} />
                    </button>
                </td>
                <td style="font-weight: bold; color:white">UCC-APPS</td>
            </tr>
        </table>
    </div>
    {#if $sre_usuario.logOn}
        <div class="w3-display-right">
            <table>
                <tr>
                    <td class="w3-text-grey">{$sre_usuario.apenom}</td>
                    <td
                        ><button
                            class="w3-text-red w3-hover-text-orange w3-xlarge"
                            style="background-color: transparent; border:none; cursor:pointer ;"
                            on:click={cerrar_sesion}
                        >
                            <i class="fa fa-sign-out" />
                        </button></td
                    >
                </tr>
            </table>
        </div>
    {/if}
</div>

<div class="background-header w3-hide-medium w3-hide-large">
    <div class="" style="padding-left:10px">
        <table cellpadding="0">
            <tr>
                <td>
                    <img src={logo} alt="Logo UCC" height="90px" />
                </td>
            </tr>
        </table>
        {#if $sre_usuario.logOn}
            <table class="w3-text-gray w3-small">
                <tr>
                    <td style="vertical-align: middle; padding-left:3px"
                        >{$sre_usuario.apenom}</td
                    >
                    <td align="right"
                        ><button
                            class="w3-text-red w3-hover-text-orange w3-xlarge"
                            style="background-color: transparent; border:none; cursor:pointer ;"
                            on:click={cerrar_sesion}
                        >
                            <i class="fa fa-sign-out" />
                        </button></td
                    >
                </tr>
            </table>
        {/if}
    </div>
</div>

{#if cargando}
    <div class="w3-display-container" style="height: 400px;">
        <div class="w3-display-middle">
            <table>
                <tr><td align="center" height="40px" class="w3-text-grey">Cargando... por favor espere...</td></tr>
                <tr
                    ><td align="center"
                        ><i
                            class="fa fa-spinner w3-spin w3-center"
                            style="font-size:64px"
                        /></td
                    ></tr
                >
            </table>
        </div>
    </div>
{:else if $sre_usuario.logOn}
    <Menu />
    <slot><!-- optional fallback --></slot>
{:else}
    <div class="w3-display-container" style="height: 200px;">
        <div class="w3-display-middle">
            <a
                href="{data.SIUC_URL}?client_id={data.SIUC_CLIENT_ID}&redirect_uri={data.SIUC_REDIRECT_URI}"
            >
                <button class="w3-btn w3-round w3-blue">Iniciar sesión</button>
            </a>
        </div>
    </div>
{/if}

<style>
    .background-header {
        /* background-color: rgba(0, 0, 0, 0.25); */
    }
</style>
