//Refereencia dos botoes de selecionar o dia da semana
const btn_days = document.querySelectorAll(".btn-days")

//Referência dos botoes de adicionar e remover
const btn_addWork = document.querySelector(".work__btn--add")
const btn_removeAllWork = document.querySelector(".work__btn--remove")

//Referência dos botoes de adicionar e remover localStorage
const btn_addStorage = document.querySelector(".header__btn--add")
const btn_removeStorage = document.querySelector(".header__btn--remove")

//Função que recebe um atributo e retorna o elemento que contem o atributo no DOM
const getElement = (atr) =>{
    return document.querySelector(atr)
}

//Função para criar objetos works
function factoryWork(time, desc){
    this.time = time
    this.desc = desc
}

//Função imediatamente invocada para manter a referÊncia dos dados salvos 
const handleSchedule = (() =>{

    /*Estrutura de dados: Objeto schedule
        Chave: id do dia da semana 
        Valor: Objeto --Chave: hora das atividades 
                        Valor: array que contem o id e a descricao das atividades
         
    */
   let schedule = {

        mon : {},
        tue : {},
        wed : {},
        thu : {},
        fri : {},
        sat : {},
        sun : {},

        lastId : 1
    }

    return{

        //Retornando objeto correspondente ao dia recebido no parametro
        getScheduleByDay : (idDay) =>{
            
            let scheduleDay = {...schedule[idDay]}
            return scheduleDay
        },
        
        //Salvar a tarefa no objeto schedule - Recebe a tarefa e o dia para qual sera armazenada
        setWork : (work, idDay) =>{
            let day = schedule[idDay]
            
            if(day.hasOwnProperty(work.time)){
                day[work.time].push({id: schedule["lastId"], desc:work.desc})
                schedule["lastId"] = schedule["lastId"] + 1
            }
            else{
        
                day[work.time] = [{id: schedule["lastId"], desc:work.desc}]
                schedule["lastId"] = schedule["lastId"] + 1
            }
        },

        //Remover uma tarefa selecionada - Recebe o id da tarefa, o dia e a hora
        removeWorkByDay : (idParam, idDay, timeParam) => {
            let time = schedule[idDay][timeParam]
            schedule[idDay][timeParam] = time.filter(({id}) => id != idParam)

            if( schedule[idDay][timeParam].length  == 0){
               delete schedule[idDay][timeParam]
            }
            
        },

        //Remove todas as tarefas do dia selecionado - Recebe o dia selecionado
        removeAllWorksByDay : (dayCurrent) =>{
            schedule[dayCurrent] = {}

        },

        //Salva o estado atual da agenda no localstorage
        saveLocalStorage : () =>{
            localStorage.setItem("schedule", JSON.stringify(schedule))
            localStorage.getItem("schedule") ? 
            alert("Os dados foram salvos com sucesso"):
            alert("Não foi possível salvar os dados, por favor, tente novamente")
            
        },

        //Deleta a ultima agenda salva no localstorage
        deleteLocalStorage : () =>{
            localStorage.removeItem("schedule")

            if(!localStorage.getItem("schedule")){
                alert("Os dados foram excuídos com sucesso")

                //Limpar os dados que ja foram renderizados no DOM
                clearScheduleOnDOM()

                //Remover todos vestigios que ainda tiverem salvos na memoria
                for (const key in schedule) {
                    schedule[key] = {}
                }

                schedule["lastId"] = 1

            }
            else{
                alert("Não foi possível excluir os dados salvos no LocalStorage")
            } 
            
        },

        //Pega a ultima agenda salva no localstorage
        getLocalStorage : () => {
            schedule = JSON.parse(localStorage.getItem("schedule")) || schedule

        }
   
    }
 
})()

//Função que altera o estado do dia corrente na aplicação
const handleCurrentDay = (() => {

    let currentDay

    return {
        getCurrentDay : () => currentDay,

        setCurrentDay : (day) => {
            currentDay = day
        }
    }
})()




//Função para limpar os dados na DOM
const clearScheduleOnDOM = () =>{
    let containerWork = getElement(".container-works__content")
    let containerHour = getElement(".panel-works__hour")

    containerHour.innerHTML = ""
    containerWork.innerHTML = ""
}


//Função para renderizar  as atividades da agenda no DOM - Recebe o dia selecionado
const renderSchedule = (idDay) =>{

    //objeto correspondente ao dia passado no parametro da função
    let scheduleDay = handleSchedule.getScheduleByDay(idDay)

    //garantir a renderização pela ordem da hora da atividade
    let hours = Object.keys(scheduleDay)
    hours.sort()
    
    hours.forEach(hour => {
        
        //Pegando o array (horario) com as atividades salvas 
        let scheduleWorks = scheduleDay[hour]

        let containerWork = getElement(".container-works__content")
        let containerHour = getElement(".panel-works__hour")
    
        let cardHour = document.createElement("div")
        cardHour.classList.add(idDay)
        cardHour.innerHTML = hour.replace(":", "h") + "m"
        containerHour.appendChild(cardHour)
    
        let containerCardWork =  document.createElement("div")
        containerCardWork.classList.add("content-works__container-card")
    
        scheduleWorks.forEach(({desc, id}) => {
    
            //Criando o card com a descrição da atividade
            let cardDesc = document.createElement("div")
            cardDesc.classList.add(idDay)
            cardDesc.classList.add("card-work")
            cardDesc.innerHTML = desc
            cardDesc.setAttribute("data-id", id)
            cardDesc.setAttribute("data-time", hour)
            containerCardWork.appendChild(cardDesc)
    
            //Criando o botao de remover a atividade
            let btn_remove = document.createElement("button")
            btn_remove.setAttribute("value", "Apagar")
            btn_remove.classList.add("btn__remove")
            btn_remove.innerHTML = "Apagar"
            btn_remove.setAttribute("data-id", id)
            btn_remove.setAttribute("data-time", hour)
            btn_remove.setAttribute("data-day", idDay)
    
            btn_remove.addEventListener("click", (e) =>{
                actionUser("Deseja apagar essa atividade?", removeWork, e)})
    
            cardDesc.appendChild(btn_remove)
        })
    
        containerWork.appendChild(containerCardWork)

        //Verificando se existe mais de uma atividade no Array (horario), para sinalizar o conflito  a view
        if(scheduleWorks.length > 1){
            let img = document.createElement("img")
            img.setAttribute("src", "./assets/images/redline.png")
            containerCardWork.appendChild(img)
            containerCardWork.classList.add("conflict")
            cardHour.classList.add("conflict")
        }

    })

   
    
}

//Função para selecionar filtrar as atividades por dia da semana
const getDay = (day) => {
    const idDay = day

    handleCurrentDay.setCurrentDay(day)
    
    setBtnActiveDay()

    clearScheduleOnDOM()

    renderSchedule(idDay)
    
}

//Função para destacar o botao correspondente ao dia atual
const setBtnActiveDay = () =>{
    let currentDay = handleCurrentDay.getCurrentDay()
  
    btn_days.forEach(btn =>{
        let idDay = btn.getAttribute("data-id")

        if(idDay == currentDay){
            btn.classList.add("selected")
        }
        else{
            btn.classList.remove("selected")
        }
    })
}

//Função para criar um objeto "work" e passar para a função setWork para salvar na agenda
const createWork = ()=>{
    const timeWork = getElement(".work__input--hour")
    const descWork = getElement(".work__input--desc")

    const select = getElement(".work__select--day")
    const idDay = select.options[select.selectedIndex].value;

    const work = new factoryWork(timeWork.value, descWork.value)

    if(timeWork.value && descWork.value){
        handleSchedule.setWork(work, idDay)

        timeWork.value = ""
        descWork.value = ""

        getDay(idDay)
    }
    else{
        if(!descWork.value){
            alert("Por favor, preencha a descrição da atividade corretamente")
            return
        }
        if(!timeWork.value){
            alert("Por favor, preencha o horário da atividade corretamente")
        }
    }
    
}

//Função para deletar a atividade selecionada
const removeWork = (e) => {
    const id = e.target.getAttribute("data-id")
    const idDay = e.target.getAttribute("data-day")
    const time = e.target.getAttribute("data-time")

    handleSchedule.removeWorkByDay(id, idDay,time)
    getDay(idDay)
}

//Função para deletar todas as tarefas do dia corrente na aplicação
const deleteAllWorksByDay = () =>{
    const dayCurrent = handleCurrentDay.getCurrentDay()
    handleSchedule.removeAllWorksByDay(dayCurrent)

    getDay(dayCurrent)

}

//Pegar a hora em tempo real
const getTimeNow = () =>{

    const pTime = getElement(".container-time--hour")
    const pDate = getElement(".container-time--date")
    
    const optionDate = {
        year: 'numeric',
        month: 'long',
        day: "numeric",
    }

    const optionTime = {
        hour : "numeric",
        minute : "numeric"
    }

    let date = new Date().toLocaleDateString('pt-br', optionDate)
    let time = new Date().toLocaleTimeString("pt-br", optionTime)

    pTime.innerHTML = time
    pDate.innerHTML = date
  
}

//Garantir a confirmação do usuario antes de executar uma ação crítica
const actionUser = (message, callback, event) => {
    let opt = confirm(message)
    if(opt){
        callback(event)
    }
}


////Listener de eventos

const addListenerBtnDays = () => {
    btn_days.forEach((btn)=>{
        btn.addEventListener("click", (e) => {
            getDay(e.target.getAttribute("data-id"))
        })
    })
}


btn_addWork.addEventListener("click", createWork)

btn_removeAllWork.addEventListener("click", () =>{
    actionUser("Deseja apagar todos as atividades do dia?", deleteAllWorksByDay)
})

btn_addStorage.addEventListener("click", handleSchedule.saveLocalStorage)

btn_removeStorage.addEventListener("click", () =>{
    actionUser("Deseja apagar todos os dados salvos no LocalStorage definitivamente?", 
                handleSchedule.deleteLocalStorage)
})

const init = () =>{

    addListenerBtnDays()

    handleSchedule.getLocalStorage()

    setInterval(() => {
        getTimeNow()
    }, 1000);

    const day = new Date().toLocaleDateString("en-us", {weekday: 'short'}).toLocaleLowerCase()
    getDay(day)

}

init()
