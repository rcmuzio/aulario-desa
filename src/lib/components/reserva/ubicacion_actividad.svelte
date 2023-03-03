<script>
    export let reserva = {fecha:'', desde:'', hasta:''};
</script>

<div class="w3-section w3-tiny">
    <div class="w3-row-padding">
        <div class="w3-half">
            <div
                class="w3-padding w3-round w3-light-grey"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            >
                <div class="rubro">Lugar de la reserva</div>
                <div class="rotulo">Ubicación:</div>
                <div class="recortar">{reserva.sede}</div>
                <div class="rotulo">Edificio:</div>
                <div class="recortar">{reserva.edificio}</div>
                <div class="rotulo">Unidad:</div>
                <div class="recortar">{reserva.unidad}</div>
                <div class="rotulo">Espacio:</div>
                <div class="recortar">{reserva.espacio} {reserva.planta}</div>
                <div class="rotulo">Horario:</div>
                <div class="recortar">{reserva.fecha}  {reserva.desde}-{reserva.hasta}</div>
            </div>
        </div>

        <div class="w3-half">
            <div
                class="w3-padding w3-round w3-light-grey"
                style="overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
            >
                <div class="rubro">Actividad Académica</div>
                <div class="rotulo">Unidad:</div>
                <div class="recortar">{reserva.unidad_academica}</div>
                <div class="rotulo">Carrera:</div>
                <div class="recortar">{reserva.carrera}</div>
                <div class="rotulo">Materia:</div>
                <div class="recortar">
                    {reserva.materia} (Cátedra:{reserva.catedra}) (Comisión:{reserva.comision})
                </div>
                <div class="rotulo">Docente:</div>
                <div class="recortar">{reserva.docente}</div>
                <div class="rotulo">Descripción:</div>
                <div class="recortar">{reserva.descri}</div>
            </div>
        </div>
    </div>
</div>

<style>
/*     table tr td {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cortar {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 95%;
    } */
    .rubro {
        font-weight: bold;
        height: 18px;
        font-size: 12px;
    }
    .rotulo {
        width: 80px;
        float: left;
        height: 18px;
    }
    .recortar {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 18px;
        text-transform: uppercase;
        color: dodgerblue;
    }
</style>
