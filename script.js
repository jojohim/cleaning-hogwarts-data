// Global object
let globalStudents = [];

fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(res => res.json())
    .then(cleanStudents);

function cleanStudents(students) {
    students.forEach(student => {
        const cleanedStudentObject = cleanStudent(student);
        
        globalStudents.push(cleanedStudentObject);
    });

    console.table(globalStudents);
}

// ES6 Arrow function (new way of writing functions)
// const cleanStudents = (students) => {

// }

function cleanStudent(student) {
    const nameObject = cleanNames(student.fullname);
    const house =  parseName(student.house);
    const imageURL = `${nameObject.lastName.toLowerCase()}_${nameObject.firstName.charAt(0).toLowerCase()}.png`;

    return {
        firstName: nameObject.firstName,
        lastName: nameObject.lastName,
        middleName: nameObject.middleName,
        nickName: nameObject.nickName,
        house: house,
        imageUrl: imageURL
    }
}

function cleanNames(fullname) {
    const nameObject = {
        // Start these two with undefined, in case that the student doesn't have any 
        // middle or nickname (the student will always have a firstName and a lastName)
        nickName: undefined,
        middleName: undefined
    };

    const names = fullname.trim().split(' ');

    names.forEach((name, index) => {
        if (index === 0) {
            // Combines first letter at index 0 and uppercase it, and then combines it
            // with the rest of the name (from index 1) and set it to lowercase
            nameObject.firstName = parseName(name);   
        }

        // If index is not 0 or names.length - 1 (last index) (last name or first name)
        if (index !== 0 && index !== names.length - 1) {

            
            // If this is a nickname (starts and ends with ")
            if (name[0] == '"' && name[name.length - 1] == '"' ) {
                nameObject.nickName = parseName(name);
            } else {
                nameObject.middleName = parseName(name);   
            }
        }

        if (index === names.length - 1) {
            nameObject.lastName = parseName(name);   
        }
    })

    return nameObject;
}

function parseName(name) {
    let nameWithoutQuotationMarks = name.replaceAll('"', '');
    
    const hyphenIndex = nameWithoutQuotationMarks.indexOf('-');

    if (hyphenIndex > -1) {
        // Split names into two names (easier to handle)
        const hypenNames = nameWithoutQuotationMarks.split('-');

        // Combine names + add uppercase to the latter name in the hyphen
        nameWithoutQuotationMarks = `${hypenNames[0]}-${hypenNames[1].charAt(0).toUpperCase()}${hypenNames[1].slice(1)}`
    }

    return `${nameWithoutQuotationMarks.charAt(0).toUpperCase()}${nameWithoutQuotationMarks.slice(1).toLowerCase()}`;
}

