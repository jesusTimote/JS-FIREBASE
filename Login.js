const $RegisterLogin = document.getElementById("Register");
const $Login = document.getElementById("Login");

const $db = firebase.firestore();
/*------ ----- Metodo guardar  ----- ------*/
const $saveTasks = ($user, $email, $password) => {
    $db.collection("tasks").doc().set({
        $user,
        $email,
        $password,
    })
        .then(() => {
            console.log("Document successfully written!");
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'Usuario Registrado!'
            
              })
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            Swal.fire({
                icon: 'error',
                title: 'oops...',
                text: "Usuario no registrado"
            
              })
        });
};
/*------ ----- Metodo autenticar usuario  ----- ------*/

$RegisterLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = $RegisterLogin["Name"].value;
    const email = $RegisterLogin["emails"].value;
    const password = $RegisterLogin["passwords"].value;
    const Repeatpassword = $RegisterLogin["RepeatPassword"].value;

    if (password === Repeatpassword) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                $saveTasks(user, email, password)

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
            });

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La contraseña no coiciden'
        
          })

    }

});


$Login.addEventListener("submit", e => {

    e.preventDefault();
    const email = $Login["email"].value;
    const password = $Login["password"].value;
    
    firebase.auth().signInWithEmailAndPassword(email,password)
        .then(() => {
            // Signed in
            //var user =  gv b userCredential.user;
            Swal.fire({
                icon: 'success',
                title: 'Exito!',
                text:"Bienvenido ",
                showConfirmButton: false,
                timer: 1500
              })
              setTimeout(()=>{
                console.log("Exito")
                window.location.href="Principal.html"
              },2000)
          
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage
            
              })
        });
})


