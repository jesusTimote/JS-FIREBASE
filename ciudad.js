const $db = firebase.firestore();
const $btnSave = document.getElementById("btnSave")
const $formCity = document.getElementById("city");
const $myModal = document.getElementById('Agregar')
const $modal = new mdb.Modal($myModal)
let editStatus = false;
let cod = ""

const GuardarCiudad = ($codigo, $ciudad, $pais) => {
    $db.collection("Ciudad").doc().set({
        $codigo,
        $ciudad,
        $pais,
    }).then(() => {
        console.log("Registrado exito");
    }).catch(() => {
        console.log("Error");
    })
    $formCity.reset();
}

const Listar = () => {
    $db.collection("Ciudad")
        .onSnapshot(snapshot => {
            let ciudades = [];
            snapshot.forEach(doc => {
                ciudades.push({ ...doc.data(), id: doc.id });
                // console.log(ciudades);
            });
            $('#ListarCiudad').DataTable({
                destroy: true,
                processing: true,
                //bSortable: false,
                data: ciudades,
                columns: [

                    { data: "$codigo" },
                    { data: "$ciudad" },
                    { data: "$pais" },
                    {
                        data: "id",
                        render(data) {
                            /*  return (
                                  "<a class='btn btn-success btnEditar' data-id='" + data + "' title='Editar'><i class='fas fa-edit'></i><a/>" +
                                  " | <a class='btn btn-danger btnEliminar' data-id='" + data + "' ><i class='fas fa-trash-alt'></i><a/>"
                              );*/
                            return (
                                "<a class='btn btn-success' onclick=Editar('" +
                                data +
                                "')  title='Editar'><i class='fas fa-edit'></i><a/> | <a class='btn btn-danger' onclick=Eliminar('" +
                                data +
                                "')><i class='fas fa-trash-alt'></i><a/>"
                            );
                        },
                    },
                ],
                "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "Todos"]],
                /* "language": {
                     "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                 }*/
            })

        });
}

const Eliminar = (codigo) => {
    console.log(codigo);
    $db.collection("Ciudad").doc(codigo).delete()
        .then(() => {
            console.log(" successfully Delete!");
        })
        .catch((error) => {
            console.error("Error Delete document: ", error);
        });

}

const Editar = async (codigo) => {
    console.log(codigo);
    let edit = await $db.collection("Ciudad").doc(codigo).get()
    $modal.show();
    let select = edit.data();
    editStatus = true
    cod=edit.id
    
    $formCity["CodigoCity"].value = select.$codigo
    $formCity["NameCity"].value = select.$ciudad
    $formCity["Pais"].value = select.$pais
    $btnSave.innerText = "Update"
   

}
document.addEventListener("DOMContentLoaded", Listar);

$btnSave.addEventListener("click", e => {
    let id = $formCity["CodigoCity"].value,
        ciudad = $formCity["NameCity"].value,
        pais = $formCity["Pais"].value;
    if (!editStatus) {
        GuardarCiudad(id, ciudad, pais)
    }else{
        $db.collection("Ciudad").doc(cod).update({
            $codigo:id,
            $ciudad:ciudad,
            $pais:pais
        })
        .then(() => {
            console.log(" successfully Update!");
            
        })
        .catch((error) => {
            console.error("Error Update: ", error);
        });
        editStatus=false;
        $btnSave.textContent = "Save"
        $formCity.reset();
    }
    editStatus=false;
        $btnSave.textContent = "Save"
        $formCity.reset();
    $modal.hide();
 
})
$myModal.addEventListener('show.mdb.modal', (event) => {
    $btnSave.textContent = "Save"
    $formCity.reset();
    
  })
