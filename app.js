const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const calendar = document.querySelector(".calendar");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const addEventModal = document.getElementById("addEventModal");
const saveButton = document.getElementById("save-btn");
const deleteButton = document.getElementById("delete-btn");
const eventTitleInput = document.getElementById('event-input');
const eventDescInput = document.getElementById('event-desc');
const eventsList = document.getElementById('events-list');

const colors = ["#eb5e28", "#ff477e", "#38b000", "#219ebc"];

let currentMonth = 0;

let calendarEvents = localStorage.getItem('cevents') ? JSON.parse(localStorage.getItem('cevents')) : [];

let clickedDate;
function showCalendar() {
    let d = new Date();

    d.setMonth(d.getMonth() + currentMonth);

    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    const nofdays = new Date(year, month + 1, 0).getDate();

    const firstDay = new Date(year, month, 1);

    const numBlankDivs = firstDay.getDay();

    document.querySelector(".month-year").innerText = `${months[month]} ${year}`;

    calendar.innerHTML = "";

    for (let i = 1; i <= numBlankDivs + nofdays; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-div');

        if (i <= numBlankDivs) {
            dayDiv.classList.add('blank-div');
        }
        else {
            dayDiv.innerText = i - numBlankDivs;
            if(i-numBlankDivs === day && currentMonth === 0){
                dayDiv.classList.add("todaydate");
            }
            dayDiv.classList.add("daystyle");
            dayDiv.setAttribute("data-bs-toggle", "modal");
            dayDiv.setAttribute("data-bs-target", "#addEventModal");
            dayDiv.addEventListener('click', () => {
                clickedDate = new Date(year, month, i - numBlankDivs);
                updateModalData();
            });
            
            let dateString = getDateString(new Date(year, month, i - numBlankDivs));
                        
            let event = calendarEvents.filter(cevent => cevent.id === dateString);
            if(event !== null && event !== undefined && event.length > 0){
                event = event[0];
                let newDiv = document.createElement('div');
                newDiv.classList.add("new-div");
                newDiv.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
                newDiv.innerText= event.title;
                dayDiv.appendChild(newDiv)
            }

        }

        calendar.appendChild(dayDiv);
    }

}

function showUpcomingEvents(){
   
        let eventsListData = calendarEvents.map(calendarEvent => {
            let date = new Date(calendarEvent.id);
            let monthString = months[date.getMonth()];
            return `${calendarEvent.title} - ${date.getDate()} ${monthString}`
        });
        
        eventsList.innerHTML = "";
        for(let i =0 ; i < eventsListData.length ; i++ ){
            let listElement = document.createElement('li');
            listElement.innerText = eventsListData[i];
            eventsList.appendChild(listElement);
        }
    
}
function updateModalData() {
    let dateForEvent = clickedDate;
    const dateString = getDateString(dateForEvent);
    let event = calendarEvents.filter(cevent => cevent.id === dateString);
    if (event !== null && event !== undefined && event.length > 0) {
        event = event[0];
        eventTitleInput.value = event.title;
        eventDescInput.value = event.description;
        deleteButton.classList.remove('hide');
    } else {
        eventDescInput.value = "";
        eventTitleInput.value = "";
        deleteButton.classList.add('hide');
    }
}

saveButton.addEventListener('click', () => {
    let dateForEvent = clickedDate;
    const dateString = getDateString(dateForEvent);
    let event = calendarEvents.filter(cevent => cevent.id === dateString);
    if (event !== null && event !== undefined && event.length > 0) {
        let eventObj = {
            id: getDateString(dateForEvent),
            title: eventTitleInput.value,
            description: eventDescInput.value
        }
        let index = calendarEvents.findIndex(cevent => cevent.id === dateString);
        if (index !== -1) {
            calendarEvents[index] = eventObj;
            localStorage.setItem('cevents', JSON.stringify(calendarEvents));
            showCalendar();
            showUpcomingEvents();
        }


    } else {
        if (eventTitleInput.value !== "") {
            let eventObj = {
                id: getDateString(dateForEvent),
                title: eventTitleInput.value,
                description: eventDescInput.value
            }
            console.log(eventObj);
            calendarEvents.push(eventObj);
            localStorage.setItem('cevents', JSON.stringify(calendarEvents));
            showCalendar();
            showUpcomingEvents();
        }
    }
});


deleteButton.addEventListener('click', () => {
    let dateForEvent = clickedDate;
    const dateString = getDateString(dateForEvent);
    let index = calendarEvents.findIndex(cevent => cevent.id === dateString);
    if (index > -1) {
        calendarEvents.splice(index, 1);
        localStorage.setItem('cevents', JSON.stringify(calendarEvents));
        showCalendar();
        showUpcomingEvents();
    }
})

function getDateString(date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

showCalendar();

prevButton.addEventListener("click", () => {
    currentMonth--;
    showCalendar();
})

nextButton.addEventListener("click", () => {
    currentMonth++;
    showCalendar();
})

showUpcomingEvents();
