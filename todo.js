document.addEventListener("DOMContentLoaded", function () {

const saveBtn = document.getElementById("saveTask");
const taskValue = document.getElementById("task");
const task = document.getElementById("ulId");
const btnDeletetask = document.getElementById("deleteTask");
const btnDeleteAlltask = document.getElementById("deleteAlltask");

let list = JSON.parse(localStorage.getItem("text")) || [];

displayTask();

 saveBtn.addEventListener("click", saveTask);

 taskValue.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
         saveTask();
    }
});

function saveTask() {
    let text = taskValue.value.trim();
    if (text !== "") {
        list.push({ objtext: text, completed: false });
        updateStorageAndRender();
         taskValue.value = "";
    }
}

// Відображає список справ//
function displayTask() {
    task.innerHTML = "";
    for (let i = 0; i < list.length; i++) {
         const completedClass = list[i].completed ? "completed" : "";
        task.innerHTML +=
            `<li class="${completedClass}">
                <span data-index="${i}">${list[i].objtext}</span>
                <div class="btn">
                    <button class="btndelete" data-index="${i}">❌</button>
                    <button class="btncomplate" data-index="${i}">✔️</button>
                </div>
            </li>`;
    }
}

// Слухає кліки по тексту справи, кнопці видалення (❌) та виконання (✔️)//
task.addEventListener("click", function (event) {
    const index = event.target.dataset.index;
    if (index === undefined) return;

    // Редагування по натисканню на текст//
    if (event.target.tagName === "SPAN") {
        const li = event.target.closest("li");
         editTask(index, li);
    }

    // Видалення однієї справи//
    if (event.target.classList.contains("btndelete")) {
        list.splice(index, 1);
        updateStorageAndRender();
    }

    // Позначення виконаною (із плавною анімацією закреслення)//
    if (event.target.classList.contains("btncomplate")) {
        list[index].completed = !list[index].completed;
        localStorage.setItem("text", JSON.stringify(list));
        event.target.closest("li").classList.toggle("completed");
    }
});

// Перетворює текст на поле вводу для редагування//
function editTask(index, li) {
    const span = li.querySelector("span");
    if (!span) return;

    const currentText = list[index].objtext;
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "edit-input";

    li.replaceChild(input, span);
    input.focus();

    let isSaved = false;

    function finishEdit() {
        if (isSaved) return;
        isSaved = true;

        const newText = input.value.trim();
        if (newText !== "") {
            list[index].objtext = newText;
        }
        updateStorageAndRender();
    }

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            finishEdit();
        }
    });
    input.addEventListener("blur", finishEdit);
}

// Видаляє лише виконані справи//
btnDeletetask.addEventListener("click", function () {
    list = list.filter(item => !item.completed);
     updateStorageAndRender();
});

// Очищає весь список//
btnDeleteAlltask.addEventListener("click", function () {
    list = [];
    updateStorageAndRender();
});

// Зберігає в пам'ять браузера та оновлює екран//
function updateStorageAndRender() {
    localStorage.setItem("text", JSON.stringify(list));
    displayTask();
}

});
