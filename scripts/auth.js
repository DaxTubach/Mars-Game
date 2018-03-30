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
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
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
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
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
            conlony: null

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

// InitApp handles setting up UI event listeners and registering Firebase auth listeners:
// Firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or out, and that is where we update the UI.

function initApp() {
    if (firebase.auth().currentUser) {
        // Document.getElementById('game').submit();

    }
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            const docRef = db.collection('users').doc(user.uid);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log('Document data:', doc.data());
                    if (doc.data().conlony == null) {
                        window.location.replace('colony-selection.html');
                    }
                } else {
                    // Doc.data() will be undefined in this case
                    console.log('No such document!');
                }
            })
                .catch((error) => {
                    console.log('Error getting document:', error);
                });

            document.getElementById('native-sign-in-status').textContent = 'Signed in';
            document.getElementById('native-sign-in').textContent = 'Sign out';
            document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            // Document.getElementById('google-signin').disabled = true;
        } else {
            // User is signed out.
  		     // Document.getElementById('google-signin').disabled = false;
            document.getElementById('native-sign-in-status').textContent = 'Signed out';
            document.getElementById('native-sign-in').textContent = 'Sign in';
            document.getElementById('quickstart-account-details').textContent = 'null';
        }

        document.getElementById('native-sign-in').disabled = false;
    });

    document.getElementById('native-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('sign-up').addEventListener('click', handleSignUp, false);

    // RAF, use these ID names when creating verify email and password reset buttons, I think omission of google sign in for now
    /*
        Document.getElementById('verify-email').addEventListener('click', sendEmailVerification, false);
        document.getElementById('password-reset').addEventListener('click', sendPasswordReset, false);
        document.getElementById('google-signin').addEventListener('click', toggleGoogleSignIn, false);
        */
}
