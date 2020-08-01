var actualDate = new Date();
var day = actualDate.getDate();
var month = actualDate.getMonth() + 1;
var year = actualDate.getFullYear();
var now_date = [Number(day), Number(month), Number(year)];
now_date = JSON.parse(JSON.stringify(now_date));

var max_date = [31,28,31,30,31,30,31,31,30,31,30,31];

// localStorage.clear();


var task_list = JSON.parse(localStorage.getItem('task_list'));
if (task_list == null) {
    task_list = [];
}

var old_date = JSON.parse(localStorage.getItem("old_date"));
if (old_date == null) {
    old_date = [Number(day), Number(month), Number(year)];
    localStorage.setItem('old_date', JSON.stringify(old_date));
}

function adapt_date() {
    localStorage.setItem('old_date', JSON.stringify(now_date));
    let security = 365;

    while (old_date != now_date) {
        if (old_date[0] == now_date[0] && old_date[1] == now_date[1] && old_date[2] == now_date[2]) {
            return;
        }
        if (security < 0) {
            old_date = now_date;
            console.log("Security exit loop");
            break;
        }
        security--;
        old_date[0]++;
        if (old_date[0] > max_date[old_date[1]-1]) {
            old_date[0] = 1;
            old_date[1]++;
            if (old_date[1] > 12) {
                old_date[2]++;
                old_date[1] = 1;
            }
        }
        new_day(false);
    }
}


function Task(title, frequency, begining) {
    this.title = title;
    this.frequency = frequency;
    this.begining = begining;
    this.isDone = false;
}

function new_day(show=true) {
    for (let i=0; i<task_list.length; i++) {
        task_list[i].begining--;
        task_list[i].isDone = false;
        if (task_list[i].begining < 0) {
            task_list[i].begining += task_list[i].frequency;
        }
    }
    if (show) {
        show_to_do_list();
    }
}

function show_task_to_do(task) {
    if (task.begining > 0) {
        return;
    }
    let new_task = document.createElement("li");
    new_task.setAttribute("class", "task");
    let task_title = document.createElement("p");
    task_title.innerHTML = task.title;
    let task_button = document.createElement("button");
    task_button.innerHTML = "V";
    task_button.onclick = function() {
        if (this.parentNode.style.backgroundColor == "rgb(0, 186, 0)") {
            task.isDone = false;
            this.parentNode.style.backgroundColor = "rgb(161, 0, 161)";
            this.style.backgroundColor = "rgb(0, 186, 0)";
            this.innerHTML = "V";
        }
        else {
            task.isDone = true;
            this.parentNode.style.backgroundColor = "rgb(0, 186, 0)";
            this.style.backgroundColor = "rgb(255, 153, 0)";
            this.innerHTML = "annuler";
        }
        localStorage.setItem('task_list', JSON.stringify(task_list));
        actualie_label_task_done();
    }

    new_task.appendChild(task_title);
    new_task.appendChild(task_button);

    document.getElementById("task_list").appendChild(new_task);

    if (task.isDone) {
        task.isDone = false;
        task_button.click();
    }
}

function show_task_manager(task) {
    let new_task = document.createElement("li");
    new_task.setAttribute("class", "task_manager");

    let btn_erase = document.createElement("button");
    btn_erase.setAttribute("class", "btn_erase_task");
    btn_erase.innerHTML = "x";
    btn_erase.onclick = function() {
        for (let i=0; i<task_list.length; i++) {
            if (task_list[i] == task) {
                task_list.splice(i,1);
                localStorage.setItem('task_list', JSON.stringify(task_list));
                show_task_list_manager();
                break;
            }
        }
    }
    new_task.appendChild(btn_erase);

    let task_title = document.createElement("p");
    task_title.innerHTML = task.title;
    new_task.appendChild(task_title);


    let container = document.createElement("div");
    let label = document.createElement("p");
    label.innerHTML = "Fréquence";
    let data = document.createElement("p");
    data.innerHTML = "1 jour sur "+String(task.frequency);
    data.setAttribute("class", "data_task");

    let btn_container = document.createElement("div");
    btn_container.setAttribute("class", "value_modifier");
    let btn_less = document.createElement("button");
    btn_less.innerHTML = "-";
    btn_less.onclick = function() {
        change_frequency_task(this, -1, 1, task);
    }
    let btn_more = document.createElement("button");
    btn_more.innerHTML = "+";
    btn_more.onclick = function() {
        change_frequency_task(this, +1, 1, task);
    }
    btn_container.appendChild(btn_less);
    btn_container.appendChild(btn_more);

    container.appendChild(label);
    container.appendChild(data);
    container.appendChild(btn_container);
    new_task.appendChild(container);


    
    container = document.createElement("div");
    label = document.createElement("p");
    label.innerHTML = "Commence dans";
    data = document.createElement("p");
    data.innerHTML = String(task.begining) + " jour(s)";
    data.setAttribute("class", "data_task");

    btn_container = document.createElement("div");
    btn_container.setAttribute("class", "value_modifier");
    btn_less = document.createElement("button");
    btn_less.innerHTML = "-";
    btn_less.onclick = function() {
        change_begining_task(this, -1, 1, task);
    }
    btn_more = document.createElement("button");
    btn_more.innerHTML = "+";
    btn_more.onclick = function() {
        change_begining_task(this, +1, 1, task);
    }
    btn_container.appendChild(btn_less);
    btn_container.appendChild(btn_more);

    container.appendChild(label);
    container.appendChild(data);
    container.appendChild(btn_container);
    new_task.appendChild(container);

    document.getElementById("task_list").appendChild(new_task);
}

function change_frequency_task(elt, qte, child_index, task=null) {
    let text = elt.parentNode.parentNode.children[child_index].innerHTML.split(" ");
    let new_frequency = Number(text.pop()) + qte;
    if (new_frequency < 1) {
        return;
    }
    let new_text = text.join(" ") + " " + String(new_frequency);
    elt.parentNode.parentNode.children[child_index].innerHTML = new_text;
    if (task != null) {
        task.frequency = new_frequency;
    }
}

function change_begining_task(elt, qte, child_index, task=null) {
    let text = elt.parentNode.parentNode.children[child_index].innerHTML.split(" ");
    let new_begining = Number(text.shift()) + qte;
    if (new_begining < 0) {
        return;
    }
    let new_text = String(new_begining) + " " + text.join(" ");
    elt.parentNode.parentNode.children[child_index].innerHTML = new_text;
    if (task != null) {
        task.begining = new_begining;
    }
}

function actualie_label_task_done() {
    let task_done = 0;
    let task_total = 0;
    for (let i=0; i<task_list.length; i++) {
        if (task_list[i].begining == 0) {
            task_total++;
            if (task_list[i].isDone) {
                task_done++;
            }
        }
    }
    document.getElementById("nb_task_done").textContent = task_done+"/"+task_total;
}

function show_to_do_list() {
    document.getElementById("new_task").style.display = "none";
    document.getElementById("task_list").innerHTML = "";
    for (let i=0; i<task_list.length; i++) {
        show_task_to_do(task_list[i]);
    }
    document.getElementById("nb_task_done").style.display = "block";
    document.getElementById("btn_task_list").style.backgroundImage = "url(img/parameters.png)";
    document.getElementById("btn_task_list").onclick = function() {
        show_task_list_manager();
    }
    document.getElementById("btn_new_task").style.display = "none";
    actualie_label_task_done();
}

function show_task_list_manager() {
    document.getElementById("task_list").innerHTML = "";
    for (let i=0; i<task_list.length; i++) {
        show_task_manager(task_list[i]);
    }

    document.getElementById("nb_task_done").style.display = "none";
    document.getElementById("btn_task_list").style.backgroundImage = "url(img/home.png)";
    document.getElementById("btn_task_list").onclick = function() {
        localStorage.setItem('task_list', JSON.stringify(task_list));
        show_to_do_list();
    }
    document.getElementById("btn_new_task").style.display = "block";
    document.getElementById("btn_new_task").onclick = function() {
        document.getElementById("task_list").innerHTML = "";
        document.getElementById("new_task").style.display = "flex";
        document.getElementById("new_task_title").value = "";
        document.getElementById("new_task_frequency").innerHTML = "1 jour sur 1";
        document.getElementById("new_task_begining").innerHTML = "0 jour(s)";
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


adapt_date();
show_to_do_list();