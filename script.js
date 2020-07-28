var actualDate = new Date();
var day = actualDate.getDay();
var month = actualDate.getMonth() + 1;
var year = actualDate.getFullYear();
console.log(day+"-"+month+"-"+year);

// localStorage.clear();

task_list = JSON.parse(localStorage.getItem('task_list'));
if (task_list == null) {
    task_list = [];
}

function Task(title, frequency, begining) {
    this.title = title;
    this.frequency = frequency;
    this.begining = begining;
}

function show_task_to_do(task) {
    let new_task = document.createElement("li");
    new_task.setAttribute("class", "task");
    let task_title = document.createElement("p");
    task_title.innerHTML = task.title;
    let task_button = document.createElement("button");
    task_button.innerHTML = "V";
    task_button.onclick = function() {
        if (this.parentNode.style.backgroundColor == "green") {
            this.parentNode.style.backgroundColor = "grey";
            this.innerHTML = "V";
        }
        else {
            this.parentNode.style.backgroundColor = "green";
            this.innerHTML = "annuler";
        }
    }

    new_task.appendChild(task_title);
    new_task.appendChild(task_button);

    document.getElementById("task_list").appendChild(new_task);
}

function show_task_manager(task) {
    let new_task = document.createElement("li");
    new_task.setAttribute("class", "task_manager");
    let task_title = document.createElement("p");
    task_title.innerHTML = task.title;
    new_task.appendChild(task_title);


    let container = document.createElement("div");
    let label = document.createElement("p");
    label.innerHTML = "Fréquence :";
    let data = document.createElement("p");
    data.innerHTML = "1 jour sur "+String(task.frequency);

    let btn_container = document.createElement("div");
    btn_container.setAttribute("class", "value_modifier");
    let btn_less = document.createElement("button");
    btn_less.innerHTML = "-";
    btn_less.onclick = function() {
        change_frequency_task(this, -1);
    }
    let btn_more = document.createElement("button");
    btn_more.innerHTML = "+";
    btn_more.onclick = function() {
        change_frequency_task(this, +1);
    }
    btn_container.appendChild(btn_less);
    btn_container.appendChild(btn_more);

    container.appendChild(label);
    container.appendChild(data);
    container.appendChild(btn_container);
    new_task.appendChild(container);


    
    container = document.createElement("div");
    label = document.createElement("p");
    label.innerHTML = "Commence dans :";
    data = document.createElement("p");
    data.innerHTML = String(task.begining) + " jour(s)";

    btn_container = document.createElement("div");
    btn_container.setAttribute("class", "value_modifier");
    btn_less = document.createElement("button");
    btn_less.innerHTML = "-";
    btn_less.onclick = function() {
        change_begining_task(this, -1);
    }
    btn_more = document.createElement("button");
    btn_more.innerHTML = "+";
    btn_more.onclick = function() {
        change_begining_task(this, +1);
    }
    btn_container.appendChild(btn_less);
    btn_container.appendChild(btn_more);

    container.appendChild(label);
    container.appendChild(data);
    container.appendChild(btn_container);
    new_task.appendChild(container);

    document.getElementById("task_list").appendChild(new_task);
}

function change_frequency_task(elt, qte, place_child=1) {
    let text = elt.parentNode.parentNode.children[place_child].innerHTML.split(" ");
    let new_frequency = Number(text.pop()) - qte;
    if (new_frequency < 1) {
        return;
    }
    let new_text = text.join(" ") + " " + String(new_frequency);
    elt.parentNode.parentNode.children[place_child].innerHTML = new_text;
}

function change_begining_task(elt, qte, place_child=1) {
    let text = elt.parentNode.parentNode.children[place_child].innerHTML.split(" ");
    let new_begining = Number(text.shift()) + qte;
    if (new_begining < 0) {
        return;
    }
    let new_text = String(new_begining) + " " + text.join(" ");
    elt.parentNode.parentNode.children[place_child].innerHTML = new_text;
}

function show_to_do_list() {
    document.getElementById("new_task").style.display = "none";
    document.getElementById("task_list").innerHTML = "";
    for (let i=0; i<task_list.length; i++) {
        show_task_to_do(task_list[i]);
    }
    document.getElementById("btn_task_list").innerHTML = "Gestion des tâches";
    document.getElementById("btn_task_list").onclick = function() {
        show_task_list_manager();
    }
    document.getElementById("btn_new_day").innerHTML = "Nouveau jour";

    document.getElementById("btn_new_day").onclick = function() {

    }
}

function show_task_list_manager() {
    document.getElementById("task_list").innerHTML = "";
    for (let i=0; i<task_list.length; i++) {
        show_task_manager(task_list[i]);
    }
    let btn_clear = document.createElement("button");
    btn_clear.setAttribute("id", "btn_clear");
    btn_clear.innerHTML = "clear";
    btn_clear.onclick = function() {
        localStorage.clear();
        location.reload();
    }
    document.getElementById("task_list").appendChild(btn_clear);


    document.getElementById("btn_task_list").innerHTML = "Accueil";
    document.getElementById("btn_task_list").onclick = function() {
        show_to_do_list();
    }
    document.getElementById("btn_new_day").innerHTML = "Nouvelle tâche";
    document.getElementById("btn_new_day").onclick = function() {
        document.getElementById("task_list").innerHTML = "";
        document.getElementById("new_task").style.display = "flex";
        document.getElementById("new_task_title").value = "";
        document.getElementById("new_task_frequency").innerHTML = "1 jour sur 1";
        document.getElementById("new_task_begining").innerHTML = "1 jour(s)";
    }
}

function validation_new_task() {
    let new_task_title = document.getElementById("new_task_title").value;
    if (new_task_title == "") {
        alert("Vous devez rentrer un nom pour la nouvelle tâche.");
        return;
    }
    let text = document.getElementById("new_task_frequency").innerHTML.split(" ");
    let new_task_frequency = Number(text[text.length - 1]);
    text = document.getElementById("new_task_begining").innerHTML.split(" ");
    let new_task_begining = Number(text[0]);
    let new_task = new Task(new_task_title, new_task_frequency, new_task_begining);
    task_list.push(new_task);
    localStorage.setItem('task_list', JSON.stringify(task_list));
    document.getElementById("new_task").style.display = "none";
    show_task_list_manager();
}




show_to_do_list();