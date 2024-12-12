
const loginButton = document.getElementById("loginButton")
const registerButton = document.getElementById("registerButton")

const loginPageButton = document.getElementById("loginPageButton")
const registerPageButton = document.getElementById("registerPageButton")

const registerPassword1 = document.getElementById("password1")
const registerPassword2 = document.getElementById("password2")
const errorText1 = document.getElementById("incorrect1")
const errorText2 = document.getElementById("incorrect2")
const usernameNewAccount = document.getElementById("usernameR")

function setup() {
    loginButton.addEventListener("click", auth)
    registerButton.addEventListener("click", register)
    loginPageButton.addEventListener("click", loginPage)
    registerPageButton.addEventListener("click", registerPage)

    loginPage()

    checkOnline();
}

async function checkOnline() {
    try {
        res = await fetch(`https://familytree.loophole.site/helloworld`, { signal: AbortSignal.timeout(1000)})
        document.getElementById("online").style.backgroundColor = 'green';
        document.getElementById("online").title = "FoobaTree API status: online"
    }catch (e){
        document.getElementById("online").style.backgroundColor = 'red';
        document.getElementById("online").title = "FoobaTree API status: offline"
    }
}

async function auth() {
    username = await document.getElementById("username").value
    password = await document.getElementById("password").value
    res = await fetch(`https://familytree.loophole.site/login?username=${username}&password=${password}`)
    data = await res.text()

    if (data[0] == "{") {
        errorText1.style.visibility = "visible"
        errorText1.textContent = "Incorrect credientals"
        return 0
    } else {
        errorText1.style.visibility = "hidden"
        errorText1.textContent = ""
        /* document.cookie = `token=${data}`
        document.cookie = `username=${username};`; */
        localStorage.setItem("token",data)
        localStorage.setItem("userName",username)
        console.log(data)
        localStorage.setItem("treeUser","empty")
        localStorage.setItem("path","/")
        /* document.cookie = `treeUser=empty;path=/` */
        window.location.href = "./graph/"
    }

    username = document.getElementById("username").value;
    password = document.getElementById("password").value;


    /*
    waiting on roope (?)
    if(1 == 0){
        document.getElementById("incorrect").textContent = "No more attempts"
    }*/
}
async function register() {
    if (registerPassword1.value != registerPassword2.value) {
        errorText1.style.visibility = "visible"
        errorText2.textContent = "Passwords do not match"
        return 0
    } else if (registerPassword1.value.length < 6) {
        errorText2.style.visibility = "visible"
        errorText2.textContent = "Password must be at least 6 characters"
        return 0
    } else if (registerPassword1.value.length > 64) {
        errorText2.style.visibility = "visible"
        errorText2.textContent = "Password can be only 64 characters long"
        return 0
    } else if (document.getElementById("usernameR").length < 3) {
        errorText2.style.visibility = "visible"
        errorText2.textContent = "Username must be at least 3 characters"
        return 0
    }
    else {
        errorText2.style.visibility = "hidden"
        errorText2.textContent = ""
    }

    username = usernameNewAccount.value
    password = registerPassword1.value
    data = await (await fetch(`https://familytree.loophole.site/register?username=${username}&password=${password}`)).text()
    console.log(data)
    if(data[0] != "{"){
        errorText2.style.visibility = "visible"
        errorText2.textContent = "Error"
        return 0
    }
    const parsed = JSON.parse(data)
    if (parsed.error) {
        errorText2.style.visibility = "visible"
        errorText2.textContent = parsed.desc == "The provided argument already exists." ? "Username is taken" : parsed.desc
        return 0
    }
    document.cookie = `token=${data}`
    document.cookie = `username=${username};`;
    document.cookie = `treeUser=empty;path=/`
    window.location.href = "./graph/"
}

function loginPage() {
    document.getElementById("login").hidden = false
    document.getElementById("register").hidden = true
    errorText2.style.visibility = "hidden"
    errorText1.style.visibility = "visible"
}

function registerPage() {
    document.getElementById("login").hidden = true
    document.getElementById("register").hidden = false
    errorText1.style.visibility = "hidden"
    errorText2.style.visibility = "visible"
}
setup()