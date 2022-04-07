function ChangeSemester() {
    
    for(var option of document.getElementById("selectSemester").options) {
        console.log(option.value)

        let courses = document.getElementsByClassName(option.value)
        for(var course of courses) {
            course.style.visibility = "hidden";
            course.style.display = "none";

        }
    }

    let selectedCourses = document.getElementsByClassName(document.getElementById("selectSemester").options[document.getElementById("selectSemester").selectedIndex].value);
    for(var course of selectedCourses) {
        course.style.visibility = "visible";
        course.style.display = "table-row";

    }
}

ChangeSemester();