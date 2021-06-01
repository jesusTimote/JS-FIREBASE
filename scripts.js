const $db = firebase.firestore();

const $FormSave = document.getElementById("Formulario");
const $btnSave = document.getElementById("btnSave");
let $cboCiudad = document.getElementById("city");
const $myModal = document.getElementById("Agregar");
const $modal = new mdb.Modal($myModal);

let codigoCliente = "";
let estados = false;
/*------ -----Ver si el usuari existe  ----- ------*/

firebase.auth().onAuthStateChanged((user) => {
    const sesion = document.querySelector(".Perfil-menu .sesion");
    // const openModal=document.querySelector(".OpenModal")
    // const Table=document.getElementById("example")
    const container = document.querySelector(".container");

    if (user) {
        sesion.innerHTML = `
        <a class="dropdown-item Logout" onclick="CerrarSesion()" href="#">Logout</a>
     `;
    } else {
        console.log("no existe");
        sesion.innerHTML = `
        <a class="dropdown-item Iniciar" onclick="IniciarSesion()" href="#">Iniciar Sesion</a>
      `;
        //container.style.visibility = "hidden";
        container.innerHTML = `
        Inicia Sesion con tu usuario`;
        // openModal.style.visibility = "hidden";
    }
});

const CerrarSesion = () => {
    try {
        Swal.fire({
            title: '¿Está seguro?',
            text: "¡Deseas Cerrar Sesion!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Cerrar!'
          }).then((result) => {
            if (result.isConfirmed) {
                 firebase.auth().signOut()
               /* Swal.fire(
                'Eliminado!',
                'Tu archivo ha sido Eliminado.',
                'success'
              )*/
            }
          })
        
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error Cerrar Sesion",
            showConfirmButton: false,
            timer: 1800,
        });
    }

};
const IniciarSesion = () => {
    window.location.href = "index.html";
};

const GuardarCliente = (
    codigo,
    firstName,
    lastName,
    address,
    estado,
    genero,
    city,
    email
) => {
    $db.collection("cliente").doc().set({
        codigo,
        firstName,
        lastName,
        address,
        estado,
        genero,
        city,
        email,
    });
    /*   .then(() => {
             Swal.fire({
                 icon: "success",
                 title: "Exito",
                 text: "Se Registro Correctamenta",
                 showConfirmButton: false,
                 timer: 1500
             });
             console.log("mal");
  
         })
         .catch((error) => {
             Swal.fire({
                 icon: "error",
                 title: "Oops...",
                 text: "No se Registro Verifique",
                 showConfirmButton: false,
                 timer: 1500
             });
             console.log("Error", error);
         });
  
     $modal.hide();*/
};

const Listado = () => {
    $db.collection("cliente").onSnapshot((element) => {
        let Cliente = [];
        element.forEach((lista) => {
            Cliente.push({ ...lista.data(), id: lista.id });
            // console.log(Cliente);
        });
        $("#example").DataTable({
            destroy: true,
            processing: true,
            //bSortable: false,
            data: Cliente,
            columns: [
                { data: "codigo" },
                { data: "firstName" },
                { data: "lastName" },
                { data: "address" },
                { data: "estado" },
                { data: "genero" },
                { data: "city" },
                { data: "email" },
                {
                    data: "id",
                    render(data) {
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
            lengthMenu: [
                [5, 10, 20, -1],
                [5, 10, 20, "Todos"],
            ],
            language: {
                url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
            },
        });
    });
};

const Eliminar = (codigo) => {
    try {
      
        Swal.fire({
            title: '¿Está seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, borralo!'
          }).then((result) => {
            if (result.isConfirmed) {
                $db.collection("cliente").doc(codigo).delete()
              Swal.fire(
                'Eliminado!',
                'Tu archivo ha sido Eliminado.',
                'success'
              )
            }
          })
    } catch (error) {
        console.error("Error Delete document: ", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al Eliminar",
            showConfirmButton: false,
            timer: 1500,
        });

    }
  
};
const Editar = (codigo) => {
    // let rdbtnHombre = document.getElementById("Hombre");
    // let rdbtnMujer = document.getElementById("Mujer");
    let genero = document.querySelectorAll("input[type=radio]");
    $db
        .collection("cliente")
        .doc(codigo)
        .get()
        .then((lista) => {
            $modal.show();
            let data = lista.data();
            estados = true;
            codigoCliente = lista.id;
            // console.log(codigoCliente);

            $btnSave.innerHTML = "Update";
            $FormSave["Codigo"].value = data.codigo;
            $FormSave["Name"].value = data.firstName;
            $FormSave["LastName"].value = data.lastName;
            $FormSave["Address"].value = data.address;
            $FormSave["Estado"].value = data.estado;
            /**  //   validar radios 
                                  rdbtnOption = "";
                              if (rdbtnHombre.checked) {
                                  rdbtnOption = "Hombre"
                              } else {
                                  rdbtnOption = "Mujer"
                              }
                              rdbtnHombre.checked=data.genero
                              rdbtnMujer.checked=data.genero
                              */

            genero.checked = data.genero;
            $FormSave["city"].value = data.city;
            $FormSave["email"].value = data.email;
        })
        .catch((error) => {
            console.log("Error", error);
        });
};

const ComboCiuad = () => {
    $db.collection("Ciudad").onSnapshot((query) => {
        $cboCiudad.innerHTML = "";
        $cboCiudad.innerHTML += `
    <option selected>--- Selected ---</option>
    `;
        query.forEach((element) => {
            $cboCiudad.innerHTML += `
        <option value="${element.data().$ciudad}">${element.data().$ciudad
                }</option>
        `;
        });
    });
};

/*------ ----- Metodo Guardado ----- ------*/
$btnSave.addEventListener("click", (e) => {
    try {
        let codigo = $FormSave["Codigo"].value,
            firstName = $FormSave["Name"].value,
            lastName = $FormSave["LastName"].value,
            address = $FormSave["Address"].value,
            estado = $FormSave["Estado"].value,
            /*   rdbtnHombre = $FormSave["Hombre"],
                          rdbtnMujer = $FormSave["Mujer"],
                       //   validar radios 
                          rdbtnOption = "";
                      if (rdbtnHombre.checked) {
                          rdbtnOption = "Hombre"
                      } else if (rdbtnMujer.checked) {
                          rdbtnOption = "Mujer"
                      }*/
            genero = document.querySelector("input[type=radio]:checked").value,
            city = $FormSave["city"].value,
            email = $FormSave["email"].value;
        if (!estados) {
            GuardarCliente(
                codigo,
                firstName,
                lastName,
                address,
                estado,
                genero,
                city,
                email
            );
            $modal.hide();
            Swal.fire({
                icon: "success",
                title: "Exito",
                text: "Se Registro Correctamenta",
                showConfirmButton: false,
                timer: 2000,
            });
            // console.log("mal");
        } else {
            $db.collection("cliente").doc(codigoCliente).update({
                codigo,
                firstName,
                lastName,
                address,
                estado,
                genero: genero,
                city,
                email,
            });

            $modal.hide();
            Swal.fire({
                icon: "success",
                title: "Exito",
                text: "Se Actualizo Correctamenta",
                showConfirmButton: false,
                timer: 2000,
            });
        }
    } catch (error) {
        console.log("hola", error);
        $modal.hide();
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error Verifica Los Datos",
            showConfirmButton: false,
            timer: 2000,
        });
    }
    estados = false;
    $btnSave.innerHTML = "Save";
});
/*------ ----- Modal ----- ------*/
$myModal.addEventListener("show.mdb.modal", (event) => {
    $btnSave.textContent = "Save";
    $FormSave.reset();
});

document.addEventListener("DOMContentLoaded", Listado);

ComboCiuad();
