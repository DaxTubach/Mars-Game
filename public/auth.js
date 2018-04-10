// Initialize Firebase

let config = {
    apiKey: 'AIzaSyBBFrScSC__f_I53oamxNZTVpLZYmrmlfI',
    authDomain: 'mars-hq.firebaseapp.com',
    databaseURL: 'https://mars-hq.firebaseio.com',
    projectId: 'mars-hq',
    storageBucket: 'mars-hq.appspot.com',
    messagingSenderId: '521104559480'
};
firebase.initializeApp(config);
let db = firebase.firestore();


function initApp() {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            const docRef = db.collection('users').doc(user.uid);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log('Document data:', doc.data());
                    if (doc.data().name == undefined && window.location.pathname != '/colony-selection.html') {
                        window.location.href = '/colony-selection.html';
                    }
                    else if (doc.data().colonyMade == null && doc.data().equipment == undefined && window.location.pathname != '/colony-equipment.html')
                    {                   
                        window.location.href = '/colony-equipment.html';
                    }
                    else if(doc.data().colonyMade == true && window.location.pathname != '/start')
                    {
                        console.log("Hey");
                        post('/start', {name: 'Tests'});
                    }

                } else {
                    // Doc.data() will be undefined in this case
                    console.log('No such document!');
                }
            })
                .catch((error) => {
                    console.log('Error getting document:', error);
                });
            
            /*
            document.getElementById('native-sign-in-status').textContent = 'Signed in';
            document.getElementById('native-sign-in').textContent = 'Sign out';
            document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            */

            // Document.getElementById('google-signin').disabled = true;
        } else {
            // User is signed out.
               // Document.getElementById('google-signin').disabled = false;
            
            if(window.location.pathname == '/index.html' || window.location.pathname == '/' )
            {}
            else
                window.location.href = '/index.html';
       
            
            /*
            document.getElementById('native-sign-in-status').textContent = 'Signed out';
            document.getElementById('native-sign-in').textContent = 'Sign in';
            document.getElementById('quickstart-account-details').textContent = 'null';
            */
        }

       // document.getElementById('native-sign-in').disabled = false;
    });
    // RAF, use these ID names when creating verify email and password reset buttons, I think omission of google sign in for now
    /*
        Document.getElementById('verify-email').addEventListener('click', sendEmailVerification, false);
        document.getElementById('password-reset').addEventListener('click', sendPasswordReset, false);
        document.getElementById('google-signin').addEventListener('click', toggleGoogleSignIn, false);
        */
}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.
    path = '/start';
    params = params || {name: 'Tests'};
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
function signOut() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
}