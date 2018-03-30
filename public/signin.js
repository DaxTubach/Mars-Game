// Sign In Button Press: ------------------------------
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // Document.getElementById('game').submit();

        firebase.auth().signOut();
    } else {
        const email = document.getElementById('email').value;
        const password = document.getElementById('pwd').value;
        if (email.length < 4) {
            alert('Please enter a valid email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a valid password.');
            return;
        }
        // Sign in with email and pass---------------------
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((error) => {
            // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                document.getElementById('native-sign-in').disabled = false;
            });
    }
    document.getElementById('native-sign-in').disabled = true;
    //  Document.getElementById('google-signin').disabled = true;
}

// Google Sign In  Button Press: ------------------------------
function toggleGoogleSignIn() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');

        // Disallows automatic gmail sign in
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        // Handle Errors Here
        firebase.auth().signInWithPopup(provider)
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                alert(errorMessage);
                console.log(error.code);
                console.log(error.message);
            });
    }
}


// Sign Up Button Press -------------------------------------
function handleSignUp() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pwd').value;
    
    // Confirm pwd and user
    if (email.length < 4) {
        // RAF, style alert msg
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        // RAF, style alert msg
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and password --------------------------
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            // Register user for the first time
            var user = firebase.auth().currentUser;
            registerUser(user);
        }, (error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
            // RAF, style alert msg
                alert('The password is too weak.');
            } else if (errorCode == 'auth/invalid-email') {
            // RAF, style alert msg
                alert('Invalid email format.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
}

function registerUser(user) {
    const displayName = user.displayName;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const uid = user.uid;

    db.collection('users').doc(uid)
        .set({
            uid,
            email,
            colony: null

        })
        .then(() => {
            console.log('Document successfully written! With ID ', uid);
        })
        .catch((error) => {
            console.error('Error writing document: ', error);
        });
}

// Send Email Verification ----------------------------
function sendEmailVerification() {
    firebase.auth().currentUser.sendEmailVerification().then(() => {
        alert('An Email Verification has been sent!');
    });
}

// Send Password Reset Email --------------------------
function sendPasswordReset() {
    const email = document.getElementById('email').value;

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert('A Password Reset Email has been sent!');
        })
        .catch((error) => {
            // Error Handeling ----------------------
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode == 'auth/invalid-email') {
                alert(errorMessage);
            } else if (errorCode == 'auth/user-not-found') {
                alert(errorMessage);
            }
            console.log(error);
        });
}
