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