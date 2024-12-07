const token = getCookie("token")
console.log(token)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const uuid = urlParams.get('uuid')
console.log(uuid)
var treeUser;
if (urlParams.get('username')) {
    treeUser = urlParams.get('username')
} else {
    treeUser = "empty"
}
const requestEnd = treeUser == "empty" ? "" : `&username=${treeUser}`

const popupOverlay = document.getElementById('popupOverlay');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
type = "";

popupOverlay.addEventListener('click', function (event) {
    if (event.target === popupOverlay) {
        closePopupFunc();
    }
});

document.addEventListener('keydown', async function (e) {
    if (e.key == "Escape") {
        closePopupFunc()
    }
    if (e.key == "Delete") {
        console.log("DELETION COMMENCING")
        await fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify())}${requestEnd}`)
        for (var i = 0; i < res.children.length; i++) {
            child = await (await fetch(`https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${res.children[i]}${requestEnd}`)).json()
            if (child.parent1Id == res.id) child.parent1Id = null
            if (child.parent2Id == res.id) child.parent2Id = null
            fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${child.id}&content=${encodeURI(JSON.stringify(child))}${requestEnd}`)
        }
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=test&content=${requestEnd}`)
        window.close()
    }
})

document.getElementById('existingInput').addEventListener('input', function (e) {
    search()
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function ltrim(str) {
    if (!str) return str;
    return str.replaceAll(/^\s+/g, '');
}
//opens parent adding popup
function openPopupFunc() {
    livingCheck()
    document.getElementById("submitButton").style.display = 'block';
    type = "parents"
    popupOverlay.style.display = 'flex';
    document.getElementById('popup1').innerHTML = addPersonPopup
    document.getElementById('popup1Header').textContent = "Add parent"
    document.getElementById("popup1").style.display = 'block'
}
//opens child adding popup
async function openChildPopup() {
    livingCheck()
    document.getElementById("submitButton").style.display = 'block';
    type = "child"
    popupOverlay.style.display = 'flex';
    document.getElementById('popup1').innerHTML = `
    <p>Select other parent</p>
    <select name="otherParent" id="otherParentSelect"></select>` + addPersonPopup
    for (var i = 0; i < res.spouses.length; i++) {
        document.getElementById('otherParentSelect').innerHTML += `<option value="${res.spouses[i]}">${await idToName(res.spouses[i])}</option>`
    }
    document.getElementById('popup1Header').textContent = "Add child"
    document.getElementById("popup1").style.display = 'block'
}
//opens spouse adding popup
function openSpousePopup() {
    livingCheck()
    document.getElementById("submitButton").style.display = 'block';
    type = "spouse"
    popupOverlay.style.display = 'flex';
    document.getElementById('popup1').innerHTML = addPersonPopup
    document.getElementById('popup1Header').textContent = "Add spouse"
    document.getElementById("popup1").style.display = 'block'
}
//opens the popup for name/birht/etc.
function openDetailsPopup(typeEdit) {
    type = "details"
    popupOverlay.style.display = 'flex';
    document.getElementById("popup3").style.display = 'flex'
    if (typeEdit == "birth") {
        document.getElementById("popup3Content").innerHTML = `
        <h3>Change birth details</h3>
        <p>Birth date</p>
        <input class="popup-input" type="date" placeholder="" id="BirthDateInput" value="${res.birthDate}">
        <p>Birth place</p>
        <input class="popup-input" type="text" placeholder="" id="BirthPlaceInput" value="${res.birthPlace}">
        <p>Gender</p>
        <input class="popup-input" type="text" placeholder="" id="GenderInput" value="${res.gender}">
        `
    }
    if (typeEdit == "death") {
        document.getElementById("popup3Content").innerHTML = `
        <h3>Change death details</h3>
        <p>Death date</p>
        <input class="popup-input" type="date" id="DeathDateInput" value="${res.deathDate}">
        <p>Death place</p>
        <input class="popup-input" type="text" id="DeathPlaceInput" value="${res.deathPlace}">
        <p>Cause of death</p>
        <input class="popup-input" type="text" id="DeathCauseInput" value="${res.causeOfDeath}">
        `
    }
    if (typeEdit == "burial") {
        document.getElementById("popup3Content").innerHTML = `
        <h3>Change burial details</h3>
        <p>Burial place</p>
        <input class="popup-input" type="text" id="BurialPlaceInput" value="${res.burialPlace}">
        `
    }
    if (typeEdit == "name") {
        document.getElementById("popup3Content").innerHTML = `
        <h3>Change death details</h3>
        <p>First name(s)</p>
        <input class="popup-input" type="text" id="FirstNameInput" value="${res.firstName}">
        <p>Last name(s)</p>
        <input class="popup-input" type="text" id="LastNameInput" value="${res.lastName}">
        <p>Birth last name(s)</p>
        <input class="popup-input" type="text" id="OgNameInput" value="${res.ogName}">
        <p>Patronym</p>
        <input class="popup-input" type="text" id="PatronymInput" value="${res.patronym}">
        <p>Lore</p>
        <input class="popup-input" type="text" id="LoreInput" value="${res.lore ? res.lore : ""}">
        <p>Link to profile picture</p>
        <input class="popup-input" type="text" id="img-input" value="${res.pic ? res.pic : ""}">
        <br></br>
        <img id="image-preview" style="width: 300px; max-height: 300px;">
        `

        if (res.pic) document.getElementById("image-preview").src = document.getElementById("img-input").value;
        document.getElementById("img-input").addEventListener('change', function () {
            document.getElementById("image-preview").src = document.getElementById("img-input").value;
            document.getElementById("image-preview").style.display = "inline-block"
        })
    }
}
function textPopup(typeEdit) {
    type = "text"
    popupOverlay.style.display = 'flex';
    document.getElementById("popup3").style.display = 'flex'
    if (typeEdit == "writing") {
        document.getElementById("popup3Content").innerHTML = `
        <h3>Edit writing</h3>
        <textarea class="text-input" type="text" placeholder="" id="WritingInput" rows="20">
        `
        console.log(res.writing)
        document.getElementById("WritingInput").value = res.writing.replaceAll("%79", "+")
    }
    if (typeEdit == "sources") {
        document.getElementById("popup3Content").innerHTML = `
        <h3>Edit sources</h3>
        <textarea class="text-input" type="text" placeholder="" id="SourcesInput" rows="20">
        `
        document.getElementById("SourcesInput").value = res.sources.replaceAll("%79", "+")
    }
}
function closePopupFunc() {
    document.getElementById("popupOverlay").style.display = 'none'
    document.getElementById("popup1").style.display = 'none';
    document.getElementById("popup2").style.display = 'none';
    document.getElementById("popup3").style.display = 'none';
}
function livingCheck() {
    if (document.querySelector('input[name="deadAlive"]:checked').value == "alive") {
        hideForm("alive", 1)
    } else {
        hideForm("dead", 1)
    }
}
async function submitForm() {
    if (type == "parents") {
        if (!document.querySelector('input[name="maleFemale"]:checked')) {
            document.getElementById("error").textContent = "Please select gender"
            document.getElementById('popup1').scrollIntoView();
            return 1;
        }
        const gender = document.querySelector('input[name="maleFemale"]:checked').value;
        const status = document.querySelector('input[name="deadAlive"]:checked').value;
        const firstNames = document.getElementById("FirstNameInput1").value;
        const lastNames = document.getElementById("LastNameInput1").value;
        const patronym = document.getElementById("patronymInput1").value;
        const dateBirth = document.getElementById("BornDateInput1").value;
        const placeBirth = document.getElementById("BornPlaceInput1").value;
        const dateDeath = document.getElementById("DiedDateInput1").value;
        const placeDeath = document.getElementById("DiedPlaceInput1").value;
        const placeBurial = document.getElementById("BuriedPlaceInput1").value;
        const ogName = document.getElementById("OgNameInput1").value;
        const newUuid = randomUUID()

        let parent = {
            status: status,
            gender: gender,
            firstName: firstNames,
            lastName: lastNames,
            ogName: ogName,
            id: newUuid,
            patronym: patronym,
            birthDate: dateBirth,
            birthPlace: placeBirth,
            deathDate: dateDeath,
            deathPlace: placeDeath,
            burialPlace: placeBurial,
            children: [uuid],
            spouses: [],
            causeOfDeath: "",
            writing: "",
            sources: "",
            name: ltrim(`${firstNames} ${patronym} ${lastNames}${ogName != "" ? ` (${ogName})` : ""}`),
            parent1Id: null,
            parent2Id: null,
        }

        if (res.parent1Id == null || res.parent1Id == "") {
            res.parent1Id = newUuid
        } else {
            res.parent2Id = newUuid
            const oldParent = await (await fetch(`https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${res.parent1Id}${requestEnd}`)).json()
            oldParent[0].spouses.push(newUuid)
            parent.spouses.push(res.parent1Id)
            fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.parent1Id}&content=${encodeURI(JSON.stringify(oldParent[0]))}${requestEnd}`)
        }

        parent = JSON.stringify(parent)
        //parent
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${newUuid}&content=${encodeURI(parent)}${requestEnd}`)
        //child
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        //extra thing that maybe helps hasnt been tested in a month doesnt hurt anyone too much
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=test&content=${requestEnd}`)
    }
    if (type == "details") {
        res.birthDate = document.getElementById("BirthDateInput") ? document.getElementById("BirthDateInput").value : res.birthDate
        res.birthPlace = document.getElementById("BirthPlaceInput") ? document.getElementById("BirthPlaceInput").value : res.birthPlace
        res.deathDate = document.getElementById("DeathDateInput") ? document.getElementById("DeathDateInput").value : res.deathDate
        res.deathPlace = document.getElementById("DeathPlaceInput") ? document.getElementById("DeathPlaceInput").value : res.deathPlace
        res.causeOfDeath = document.getElementById("DeathCauseInput") ? document.getElementById("DeathCauseInput").value : res.causeOfDeath
        res.burialPlace = document.getElementById("BurialPlaceInput") ? document.getElementById("BurialPlaceInput").value : res.burialPlace
        res.firstName = document.getElementById("FirstNameInput") ? document.getElementById("FirstNameInput").value : res.firstName
        res.lastName = document.getElementById("LastNameInput") ? document.getElementById("LastNameInput").value : res.lastName
        res.ogName = document.getElementById("OgNameInput") ? document.getElementById("OgNameInput").value : res.ogName
        res.patronym = document.getElementById("PatronymInput") ? document.getElementById("PatronymInput").value : res.patronym
        res.lore = document.getElementById("LoreInput") ? document.getElementById("LoreInput").value : res.lore
        res.name = ltrim(`${res.firstName} ${res.patronym} ${res.lastName}${res.ogName != "" ? ` (${res.ogName})` : ""}`)
        res.gender = document.getElementById("GenderInput") ? document.getElementById("GenderInput").value : res.gender;
        res.pic = document.getElementById("img-input") ? document.getElementById("img-input").value : res.pic;
        console.log(res)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
    }
    if (type == "text") {
        console.log("YES")
        console.log(res.sources)
        console.log(document.getElementById("SourcesInput").value)
        res.writing = (document.getElementById("WritingInput") ? document.getElementById("WritingInput").value : res.writing).replaceAll("+", "%79")
        res.sources = (document.getElementById("SourcesInput") ? document.getElementById("SourcesInput").value : res.sources).replaceAll("+", "%79")
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
    }
    if (type == "spouse") {
        if (!document.querySelector('input[name="maleFemale"]:checked')) {
            document.getElementById("error").textContent = "Please select gender"
            document.getElementById('popup1').scrollIntoView();
            return 1;
        }
        const gender = document.querySelector('input[name="maleFemale"]:checked').value;
        var status = document.querySelector('input[name="deadAlive"]:checked').value;
        const firstNames = document.getElementById("FirstNameInput1").value;
        const lastNames = document.getElementById("LastNameInput1").value;
        const patronym = document.getElementById("patronymInput1").value;
        const dateBirth = document.getElementById("BornDateInput1").value;
        const placeBirth = document.getElementById("BornPlaceInput1").value;
        const dateDeath = document.getElementById("DiedDateInput1").value;
        const placeDeath = document.getElementById("DiedPlaceInput1").value;
        const placeBurial = document.getElementById("BuriedPlaceInput1").value;
        const ogName = document.getElementById("OgNameInput1").value;
        const newUuid = randomUUID()

        spouse = JSON.stringify({
            status: status,
            gender: gender,
            firstName: firstNames,
            lastName: lastNames,
            ogName: ogName,
            id: newUuid,
            patronym: patronym,
            birthDate: dateBirth,
            birthPlace: placeBirth,
            deathDate: dateDeath,
            deathPlace: placeDeath,
            burialPlace: placeBurial,
            children: [],
            spouses: [uuid],
            causeOfDeath: "",
            writing: "",
            sources: "",
            name: ltrim(`${firstNames} ${patronym} ${lastNames}${ogName != "" ? ` (${ogName})` : ""}`),
            parent1Id: null,
            parent2Id: null,
        })

        if (res.spouses == null) res.spouses = []
        res.spouses.push(newUuid)


        var ele = document.getElementsByClassName('popup-input');
        for (var i = 0; i < ele.length; i++) {
            ele[i].value = "";
        }
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${newUuid}&content=${encodeURI(spouse)}${requestEnd}`)
    }
    if (type == "child") {
        if (!document.querySelector('input[name="maleFemale"]:checked')) {
            document.getElementById("error").textContent = "Please select gender"
            document.getElementById('popup1').scroll({ top: 0, behavior: 'smooth' })
            return 1;
        }
        const gender = document.querySelector('input[name="maleFemale"]:checked').value;
        var status = document.querySelector('input[name="deadAlive"]:checked').value;
        const firstNames = document.getElementById("FirstNameInput1").value;
        const lastNames = document.getElementById("LastNameInput1").value;
        const patronym = document.getElementById("patronymInput1").value;
        const dateBirth = document.getElementById("BornDateInput1").value;
        const placeBirth = document.getElementById("BornPlaceInput1").value;
        const dateDeath = document.getElementById("DiedDateInput1").value;
        const placeDeath = document.getElementById("DiedPlaceInput1").value;
        const placeBurial = document.getElementById("BuriedPlaceInput1").value;
        const ogName = document.getElementById("OgNameInput1").value;
        const newUuid = randomUUID()
        const parent2 = document.getElementById("otherParentSelect").value

        child = {
            status: status,
            gender: gender,
            firstName: firstNames,
            lastName: lastNames,
            ogName: ogName,
            id: newUuid,
            patronym: patronym,
            birthDate: dateBirth,
            birthPlace: placeBirth,
            deathDate: dateDeath,
            deathPlace: placeDeath,
            burialPlace: placeBurial,
            children: [],
            spouses: [],
            causeOfDeath: "",
            writing: "",
            sources: "",
            name: ltrim(`${firstNames} ${patronym} ${lastNames}${ogName != "" ? ` (${ogName})` : ""}`),
            parent1Id: res.id,
            parent2Id: parent2,
        }

        var ele = document.getElementsByClassName('popup-input');
        for (var i = 0; i < ele.length; i++) {
            ele[i].value = "";
        }


        //parent who is currently being viewd
        res.children.push(newUuid)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.id}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        //the other parent
        parent = await (await fetch(`https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${parent2}${requestEnd}`)).json()
        parent = parent[0]
        parent.children.push(newUuid)
        if (parent2) {
            fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${parent2}&content=${encodeURI(JSON.stringify(parent))}${requestEnd}`)
        }
        //chiöd
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${newUuid}&content=${encodeURI(JSON.stringify(child))}${requestEnd}`)
    }
    closePopupFunc();
}
function selectExisting() {
    document.getElementById("popup1").style.display = 'none';
    document.getElementById("popup2").style.display = 'block';
    document.getElementById("submitButton").style.display = 'none';
}
function existingSubmit() {
    let person = tree.find((element) => element.id == document.getElementById("selectExisting").value);
    console.log(person)
    if (type == "parents") {
        if (res.parent1Id == null || res.paren1Id == "") {
            res.parent1Id = person.id
        } else {
            res.parent2Id = person.id
        }
        person.children.push(res.id)
        //parent
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${person.id}&content=${encodeURI(JSON.stringify(person))}${requestEnd}`)
        //child
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.id}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
    }
    else if (type == "child") {
        res.children.push(person.id)
        if (person.parent1Id == null || person.paren1Id == "") {
            person.parent1Id = res.id
        } else {
            person.parent2Id = res.id;
        }
        //parent
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.id}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        //child
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${person.id}&content=${encodeURI(JSON.stringify(person))}${requestEnd}`)
    }
    else if (type == "spouse") {
        res.spouses.push(person.id)
        person.spouses.push(res.id)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.id}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${person.id}&content=${encodeURI(JSON.stringify(person))}${requestEnd}`)
    }
    document.getElementById("submitButton").style.display = 'block';
    closePopupFunc()
}
function hideForm(status, popupNumber) {
    show = "none"
    if (status == "dead") { show = "block" }
    var ele = document.getElementsByClassName('tohide' + popupNumber);
    for (var i = 0; i < ele.length; i++) {
        ele[i].style.display = show;
    }
}

function randomUUID() {
    return "10000000-1000-4000-8000-100000000000".replaceAll(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}
function search() {
    document.getElementById("selectExisting").innerHTML = ""
    text = document.getElementById("existingInput").value
    let miniSearch = new MiniSearch({
        fields: ['name'], // fields to index for full-text search
        storeFields: ['name', 'id'] // fields to return with search results
    })
    miniSearch.addAll(tree)
    let results = miniSearch.search(text)
    console.log(results)
    for (var i = 0; i < results.length; i++) {
        document.getElementById("selectExisting").innerHTML += `<option value="${results[i].id}">${results[i].name}</option>`
    }
}
async function main() {
    console.log(treeUser)
    res = await fetch(`https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${uuid}${requestEnd}`)
        .then(response => response.json())
    res = res[0];
    document.title = "FT | " + res.name;
    addPersonPopup = await (await fetch("../data/addPersonPopup.html")).text()
    document.getElementById("popup1").innerHTML = addPersonPopup;
    document.getElementById("profile-pic").src = res.pic ? res.pic : document.getElementById("profile-pic").src
    tree = await getTree()
    relativeCheck();
    showRelatives();

    document.getElementById("name-text").textContent = res.name
    document.getElementById("birthDate").textContent = res.birthDate
    document.getElementById("birthPlace").textContent = res.birthPlace
    document.getElementById("deathDate").textContent = res.deathDate
    document.getElementById("deathPlace").textContent = res.deathPlace
    document.getElementById("deathCause").textContent = res.causeOfDeath
    document.getElementById("burialPlace").textContent = res.burialPlace
    document.getElementById("writingText").textContent = res.writing.replaceAll("%79", "+")
    document.getElementById("sourcesText").textContent = res.sources.replaceAll("%79", "+")
    document.getElementById("gender").textContent = res.gender.charAt(0).toUpperCase() + res.gender.slice(1)

}

async function getTree() {
    let data = await fetch(`https://familytree.loophole.site/getTree?token=${token}${requestEnd}`)
    return await data.json()
}

function idToName(id) {
    return tree.find((element) => element.id == id).name;
}

function idToData(id) {
    return tree.find((element) => element.id == id)
}

async function relativeCheck() {
    //check if parents of person exist and if not delete the references to them
    if (res.parent1Id) {
        parentTest = await (await fetch(`https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${res.parent1Id}${requestEnd}`)).json()
        if (parentTest.error == 400) {
            console.log("parent 1 doesnt")
            res.parent1Id = null;
            fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        }
    }
    if (res.parent2Id) {
        parentTest = await (await fetch(`https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${res.parent2Id}${requestEnd}`)).json()
        if (parentTest.error == 400) {
            console.log("parent 2 doesnt")
            res.parent2Id = null;
            fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        }
    }

    //check if children are real
    todelete = [];
    for (var i = 0; i < res.children.length; i++) {
        childTest = await (await fetch(`https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${res.children[i]}${requestEnd}`)).json()

        if (childTest.error == 400) {
            todelete.push(res.children[i])
        }
    }
    if (todelete.length > 0) {
        console.log("children not real")
        for (var i = todelete.length; i > 0; i--) {
            if (res.children.length != 1) {
                res.children = res.children.splice(res.children.indexOf(todelete[i]), 1);
            } else {
                res.children = []
            }
        }
        console.log(res)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
    }

    //check if spouses are real
    todelete = [];
    for (var i = 0; i < res.spouses.length; i++) {
        spouseTest = await (await fetch(`https://familytree.loophole.site/getProfile?token=${token}&profileUuid=${res.spouses[i]}${requestEnd}`)).json()

        if (spouseTest.error == 400) {
            todelete.push(res.spouses[i])
        }
    }
    if (todelete.length > 0) {
        console.log("spouse not real")
        for (var i = todelete.length; i > 0; i--) {
            if (res.spouses.length != 1) {
                res.spouses = res.spouses.splice(res.spouses.indexOf(todelete[i]), 1);
            } else {
                res.spouses = []
            }
        }
        console.log(res)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${uuid}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
    }

}
//puts relatives in the relative boxes
async function showRelatives() {
    //parents
    if (res.parent1Id && res.parent2Id) {
        document.getElementById("parents-container").innerHTML += personToRelativeLabel(idToData(res.parent1Id))
        document.getElementById("parents-container").innerHTML += personToRelativeLabel(idToData(res.parent2Id))
    }
    else if (res.parent1Id) {
        document.getElementById("parents-container").innerHTML += personToRelativeLabel(idToData(res.parent1Id))
        document.getElementById("parents-container").innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openPopupFunc()">ADD PARENT</p>
        </div>`
    }
    else if (res.parent2Id) {
        document.getElementById("parents-container").innerHTML += personToRelativeLabel(idToData(res.parent2Id))
        document.getElementById("parents-container").innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openPopupFunc()">ADD PARENT</p>
        </div>`
    }
    else {
        document.getElementById("parents-container").innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openPopupFunc()">ADD PARENT</p>
        </div>`
    }

    //spouses
    for (var i = 0; i < res.spouses.length; i++) {
        document.getElementById("spouses-container").innerHTML += personToRelativeLabel(idToData(res.spouses[i]))
    }
    document.getElementById("spouses-container").innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openSpousePopup()">ADD SPOUSE</p>
        </div>`

    //children
    let childArray = [];
    for (var i = 0; i < res.children.length; i++) {
         childArray.push(idToData(res.children[i]));
    }
    console.log(childArray)
    childArray.sort((a,b) => a.birthDate.slice(0, 4) - b.birthDate.slice(0, 4));
    console.log(childArray)
    for (var i = 0; i < childArray.length; i++) {
        document.getElementById("children-container").innerHTML += personToRelativeLabel(childArray[i]);
   }
    
    document.getElementById("children-container").innerHTML += `<div class="row add-button" style="font-weight: 1000">
        <p style="font-size: 150%; align-content:center; margin: 0; margin-left: 5%;">+</p>
        <p style="align-content:center; margin:0;" onclick="openChildPopup()">ADD CHILD</p>
        </div>`
}

function personToRelativeLabel(person) {
    return `<div class="relative" style="background-color: ${person.gender == "male" ? "#00c4f3" : "#ff72af"};">
        <div class="row">
            <p style="font-size: 80%; margin-bottom: 0; margin-left: 5%;" onclick="openPerson('${person.id}', '${requestEnd}')">${person.name}</p>
            <img src="/img/trash.png" style="max-width: 20%; margin-left:auto; height:fit-content;" onclick="deleteConnectionPopup('${person.id}')"></img>
        </div>
        <p style="font-size: 70%; margin-top: 0; margin-left: 5%;">${personToLifespan(person)}</p>
    </div>`
}

function deleteConnectionPopup(id) {
    type = "deleteConnection"
    popupOverlay.style.display = 'flex';
    document.getElementById("popup3").style.display = 'flex'
    document.getElementById("submitButton").style.display = 'none';
    document.getElementById("popup3Content").innerHTML = `
    <h3>Are you sure you want to delete this connection?</h3>
    <button class="submit" id="deleteConnectionButton" style="background-color: red;"onclick="deleteConnection('${id}')">DELETE CONNECTION</button>
    `
}

async function deleteConnection(id) {
    console.log(id)
    if (res.spouses.includes(id)) {
        let spouse = idToData(id)
        spouse.spouses.splice(spouse.spouses.indexOf(res.id), 1);
        res.spouses.splice(res.spouses.indexOf(spouse.id), 1);

        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.id}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${spouse.id}&content=${encodeURI(JSON.stringify(spouse))}${requestEnd}`)
    }
    else if (res.children.includes(id)) {
        let child = idToData(id)
        if(child.parent1Id == res.id) child.parent1Id = null;
        if(child.parent2Id == res.id) child.parent2Id = null;
        
        res.children.splice(res.children.indexOf(child.id), 1);

        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.id}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${child.id}&content=${encodeURI(JSON.stringify(child))}${requestEnd}`)
    }
    else if (res.parent1Id == id) {
        let parent = idToData(id)
        parent.children.splice(parent.children.indexOf(res.id), 1);

        res.parent1Id = null;
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.id}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${parent.id}&content=${encodeURI(JSON.stringify(parent))}${requestEnd}`)
    }
    else if (res.parent2Id == id) {
        let parent = idToData(id)
        parent.children.splice(parent.children.indexOf(res.id), 1);

        res.parent2Id = null;
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${res.id}&content=${encodeURI(JSON.stringify(res))}${requestEnd}`)
        fetch(`https://familytree.loophole.site/setProfile?token=${token}&profileUuid=${parent.id}&content=${encodeURI(JSON.stringify(parent))}${requestEnd}`)
    }
    closePopupFunc()
}

main()
