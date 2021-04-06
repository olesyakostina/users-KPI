const lastNameInp = $("#inp__surname");
const nameInp = $("#inp__name");
const phoneInp = $("#inp__phone");
const groupInp = $("#inp__group");
const weekInp = $("#inp__week");
const monthInp = $("#inp__month");
const list = $("ul");
const button = $(".btn");
let editId = null;
let searchText = "";
let page = 1;
let pageCount = 1;

let API = " http://localhost:8001/users";

$(".btn").on("click", function () {
    if (!$(".inp").val().trim()) {
        alert("Пожалуйста, заполните поле!");
    } else if (lastNameInp.val() && !groupInp.val()) {
        alert("Пожалуйста, заполните поле!");
    } else if (weekInp.val() && !nameInp.val()) {
        alert("Пожалуйста, заполните поле!");
    } else {
        alert("Спасибо !");
        return;
    }
});

button.on("click", function () {
    const newContact = {
        name: nameInp.val(),
        lastName: lastNameInp.val(),
        phone: phoneInp.val(),
        group: groupInp.val(),
        week: weekInp.val(),
        month: monthInp.val(),
    };

    postNewContacts(newContact);

    nameInp.val("");
    lastNameInp.val("");
    phoneInp.val("");
    groupInp.val("");
    weekInp.val("");
    monthInp.val("");
});
function postNewContacts(newContact) {
    fetch(API, {
        method: "POST",
        body: JSON.stringify(newContact),
        headers: {
            "Content-Type": "application/json;charset = utf-8",
        },
    }).then(() => render());
}
function render() {
    fetch(`${API}?q=${searchText}&_page=${page}&_limit=5`)
        .then((response) => response.json())
        .then((data) => {
            list.html("");
            console.log(data);
            data.forEach((contact) => {
                list.append(`
                 <li id=${contact.id}           
                ${contact.name} 
                ${contact.lastName} 
                ${contact.phone}
                ${contact.group}                   
                ${contact.week}               
                ${contact.month} 
                 <div class="card" style="width: 18rem;">                
                <img src="https://image.freepik.com/free-vector/student-boy-graduated-avatar-character_24908-21998.jpg" class="card-img-top" alt="student"style="width: 10rem">
                <div class="card-body">
                <h3 class="card-title ">  <br>${contact.lastName} ${contact.name} !!!<br> 
                ${contact.phone} </h3>               
                <p class="card-text " >Мы рады приветствовать Вас в <b>"Makers"</b>. <br>
                Вы зачислены в группу <b>${contact.group}</b>.<br>
                Ваш <b>KPI</b> за неделю  составил <b>${contact.week} </b>баллов<br>
                Ваш <b>KPI</b> за месяц составил <b>${contact.month} </b>баллов<br>
                С дальнейшей программой обучения Вы можете ознакомиться, пройдя по ссылке!!!</p>
                
        <a target="blank" href="https://github.com/olesyakostina" class="button btn btn-primary "> Makers Documentation</a>
    </div>
</div>
<br>
                 <button class="delete">Delete</button>
                 <button class = "edit" >Edit</button>   
                 </li>`);

                //добавила 2 кнопки delet edit
            });
        });
}
//-------------delete
$(".inner-modal").on("click", ".delete", function (e) {
    const id = event.target.parentNode.id;
    fetch(`${API}/${id}`, {
        method: "DELETE",
    }).then(() => render());
});
render();
//-----------edit
$(".inner-modal").on("click", ".edit", function (e) {
    const editId = e.target.parentNode.id;

    fetch(`${API}/${editId}`)
        .then((res) => res.json())
        .then((taskToEdit) => {
            // console.log(taskToEdit);
            $(".btn-save").attr("id", taskToEdit.id);
            $(".edit-inp_name").val(taskToEdit.name);
            // console.log($(".edit-inp_name"));
            $(".edit-inp_lastName").val(taskToEdit.lastName);
            $(".edit-inp_phone").val(taskToEdit.phone);
            $(".edit-inp_group").val(taskToEdit.group);
            $(".edit-inp_week").val(taskToEdit.week);
            $(".edit-inp_month").val(taskToEdit.month);
            $(".window").css("display", "block");
        });
});

$(".btn-save").on("click", function (e) {
    if (!$(".edit-inp_name").val().trim()) {
        alert("Заполните поле");
        inp.val("");
        return;
    }

    const id = e.target.id;

    let editedTask = {
        name: $(".edit-inp_name").val(),
        lastName: $(".edit-inp_lastName").val(),
        phone: $(".edit-inp_phone").val(),
        group: $(".edit-inp_group").val(),
        week: $(".edit-inp_week").val(),
        month: $(".edit-inp_month").val(),
    };

    fetch(`${API}/${id}/`, {
        method: "PUT",
        body: JSON.stringify(editedTask),
        headers: {
            "Content-Type": "application/json; charset = utf-8",
        },
    }).then(() => {
        render();
        $(".window").css("display", "none");
    });
});
$(".btn-close").on("click", function () {
    $(".window").css("display", "none");
});
// ----------------------------------------------пагинация
getPagination();
function getPagination() {
    fetch(`${API}?q=${searchText}`)
        .then((res) => res.json())
        .then((data) => {
            pageCount = Math.ceil(data.length / 5); //округляет вверх
            $(".pagination-page").remove();
            for (let i = pageCount; i >= 1; i--) {
                $(".previous-btn").after(`
        <span class = "pagination-page"> <a href = "#">${i}</a>
        </span>`);
            }
        });
}
//---------------------------------search
$(".search-inp").on("input", function (e) {
    searchText = e.target.value;
    render();
});
//-----------------------------------
$(".next-btn").on("click", function () {
    if (page >= pageCount) return;
    page++;
    render();
});
$(".previous-btn").on("click", function () {
    if (page <= 1) return;
    page--;
    render();
});
$("body").on("click", ".pagination-page", function (e) {
    page = e.target.innerText;
    render();
});
