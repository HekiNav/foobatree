//returns the 1971 - 2009 thing for a person
function personToLifespan(person) {
    if (person.status == "alive") {
        return `Living`
    }
    if (person.deathDate != "" && person.birthDate != "") {
        return `${person.birthDate.slice(0, 4)} - ${person.deathDate.slice(0, 4)}`
    }
    if (person.birthDate != "") {
        return `${person.birthDate.slice(0, 4)} - Deceased`
    }
    if (person.deathDate != "") {
        return ` - ${person.deathDate.slice(0, 4)}`
    }
    return "Deceased"
}

//opens the person page on click 
function openPerson(id, requestEnd) {
    window.open(`../person/?uuid=${id}${requestEnd}`, "_blank")
}

function btrim(str) {
    if (!str) return str;
    return str.replaceAll(/^\s+|\s+$/g, '');
}

function search(data) {
    document.getElementById("selectFocus").innerHTML = ""
    const text = document.getElementById("focusInput").value
    let miniSearch = new MiniSearch({
        fields: ['name'], // fields to index for full-text search
        storeFields: ['name', 'id'], // fields to return with search results
        searchOptions: {
            fuzzy: 0.4
        }
    })
    miniSearch.addAll(data)
    let results = miniSearch.autoSuggest(text)
    console.log(results)
    for (var i = 0; i < results.length; i++) {
        document.getElementById("selectFocus").innerHTML += `<option value="${results[i].id}">${results[i].name}</option>`
    }
}