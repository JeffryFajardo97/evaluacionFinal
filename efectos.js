    const apiUrl = "http://localhost/uspg/todoapi.php"; 
        var estadoGeneral = "F";
       function obtenerTareas(filtro) {
        estadoGeneral = filtro;

        console.log(filtro)
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            
            let tabla = document.getElementById("tablaTareas");
            
            tabla.innerHTML = ""; 

            
            let tareasPendientes = data.filter(tarea => tarea.estado === filtro);

            if(filtro=="P"){
                tareasPendientes.forEach(tarea => {
                let row = `<tr>
                    <td>
                        <input type="checkbox" onchange="marcarFinalizado(${tarea.codigoActividad}, '${tarea.nombreActividad}', this)">
                    </td>
                    <td>${tarea.nombreActividad}</td>       
                </tr>`;
                tabla.innerHTML += row;
            });
            }else if(filtro=="F"){
             
                    tareasPendientes.forEach(tarea => {
                    let row = `<tr>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${tarea.codigoActividad})">X</button>
                        </td>
                        <td>${tarea.nombreActividad}</td>       
                    </tr>`;
                    tabla.innerHTML += row;
                });

            }

            
        })
        .catch(error => console.error("Error al obtener tareas:", error));
}

        document.getElementById("formAgregar").addEventListener("submit", function(event) {
            event.preventDefault();
            let nombreActividad = document.getElementById("nombreActividad").value;
            let estado = "P"
            fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombreActividad, estado })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Tarea agregada correctamente");
                    obtenerTareas(); 
                } else {
                    alert("Error al agregar tarea");
                }
            let modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregar"));
            modal.hide();
            })
            .catch(error => console.error("Error al agregar:", error));
        });
        
        obtenerTareas('P')
       



        function marcarFinalizado(codigoActividad, nombreActividad, checkbox) {
    if (checkbox.checked) {
        fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                codigoActividad,
                nombreActividad,
                estado: "F"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(`Tarea ${codigoActividad} marcada como finalizada.`);
                obtenerTareas();
                alert("Finalizado Correctamente"); 
            } else {
                console.error("Error al actualizar estado:", data.error);
                checkbox.checked = false;
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            checkbox.checked = false; 
        });
    }
}

const INTERVALO_ACTUALIZACION = 10000; // 10 segundos

function iniciarActualizacionAutomatica() {
    function actualizar() {
        obtenerTareas(estadoGeneral);
        setTimeout(actualizar, INTERVALO_ACTUALIZACION);
    }
    setTimeout(actualizar, INTERVALO_ACTUALIZACION);
}

iniciarActualizacionAutomatica();


function eliminarTarea(codigoActividad) {
    if (confirm('¿Estás seguro que deseas eliminar esta tarea?')) {
        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigoActividad: codigoActividad })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Tarea eliminada correctamente');
             
                obtenerTareas(estadoGeneral);

            } else {
                console.error('Error al eliminar la tarea:', data.error);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
    }
}
