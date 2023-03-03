<script>
    export let horarios = [];
</script>

{#each horarios as h}
    <tr>
        <td align="center">
            <button
                style="background-color:transparent; border:none; cursor:pointer"
            >
                <i class="fa fa-trash-o w3-large" /></button
            >
        </td>
        <td style="width:100px"
            ><input type="text" style="width:95%" bind:value={h.desde} /></td
        >
        <td style="width:100px"
            ><input type="text" style="width:95%" bind:value={h.hasta} /></td
        >
        {#each h.dias as d}
            <td><input type="checkbox" bind:checked={d} /></td>
        {/each}
    </tr>
{/each}
