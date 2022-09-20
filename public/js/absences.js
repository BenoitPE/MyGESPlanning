function ChangeYearAbsence() {

    for (var option of document.getElementById("selectYearAbsence").options) {
        let absences = document.getElementsByClassName(option.value)
        for (var absence of absences) {
            absence.style.visibility = "hidden";
            absence.style.display = "none";

        }
    }

    let selectedAbsences = document.getElementsByClassName(document.getElementById("selectYearAbsence").options[document.getElementById("selectYearAbsence").selectedIndex].value);
    for (var absence of selectedAbsences) {
        absence.style.visibility = "visible";
        absence.style.display = "table-row";

    }
}

ChangeYearAbsence();