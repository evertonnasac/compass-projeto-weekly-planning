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

        getScheduleByDay : (idDay) =>{
            console.log(schedule)
            return schedule[idDay]
        },
    
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

        removeWorkByDay : (idParam, idDay, timeParam) => {
            let time = schedule[idDay][timeParam]
            schedule[idDay][timeParam] = time.filter(({id}) => id != idParam)

            if( schedule[idDay][timeParam].length  == 0){
               delete schedule[idDay][timeParam]
            }
            
        },

        removeAllWorksByDay : (dayCurrent) =>{
            schedule[dayCurrent] = {}

        },

        saveLocalStorage : () =>{
            localStorage.setItem("schedule", JSON.stringify(schedule))
            localStorage.getItem("schedule") ? 
            alert("Os dados foram salvos com sucesso"):
            alert("Não foi poss[ivel salvar os dados, por favor, tente novamente")
            
        },

        deleteLocalStorage : () =>{
            localStorage.removeItem("schedule")
            alert("Os dados foram apagados, salve no localstorage se desejar manter o trabalho atual")
        },

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


//Função para renderizar os as atividades no DOM
const renderSchedule = (key, value, idDay) =>{
    let containerWork = getElement(".container-works__content")
    let containerHour = getElement(".panel-works__hour")

    let cardHour = document.createElement("div")
    cardHour.classList.add(idDay)
    cardHour.innerHTML = key
    containerHour.appendChild(cardHour)

    let containerCardWork =  document.createElement("div")
    containerCardWork.classList.add("content-works__container-card")

    value.forEach(({desc, id}) => {

        //Criando o card com a descrição da atividade
        let cardDesc = document.createElement("div")
        cardDesc.classList.add(idDay)
        cardDesc.classList.add("card-work")
        cardDesc.innerHTML = desc
        cardDesc.setAttribute("data-id", id)
        cardDesc.setAttribute("data-time", key)
        containerCardWork.appendChild(cardDesc)

        //Criando o botao de remover a atividade
        let btn_remove = document.createElement("button")
        btn_remove.setAttribute("value", "Apagar")
        btn_remove.classList.add("btn__remove")
        btn_remove.innerHTML = "Apagar"
        btn_remove.setAttribute("data-id", id)
        btn_remove.setAttribute("data-time", key)
        btn_remove.setAttribute("data-day", idDay)

        btn_remove.addEventListener("click", removeWork)
        cardDesc.appendChild(btn_remove)
    })

    containerWork.appendChild(containerCardWork)
    
}

//Função para selecionar filtrar as atividades por dia da semana
const getDay = (day) => {
    const idDay = day

    handleCurrentDay.setCurrentDay(idDay)

    setBtnActiveDay()

    let schedule = handleSchedule.getScheduleByDay(idDay)
    let keys = Object.keys(schedule)
    keys.sort()

    clearScheduleOnDOM()

    keys.forEach(key => {
        renderSchedule(key, schedule[key], idDay)
    })   
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

//Função para criar um objeto "work" e passa para a função setWork que salva os dados
const createWork = ()=>{
    const timeWork = getElement(".work__input--hour").value
    const descWork = getElement(".work__input--desc").value

    const select = getElement(".work__select--day")
    const idDay = select.options[select.selectedIndex].value;

    const work = new factoryWork(timeWork, descWork)

    if(timeWork && descWork){
        handleSchedule.setWork(work, idDay)

        timeWork.value = ""
        descWork.value = ""

        getDay(idDay)
    }
    else{
        if(!descWork){
            alert("Por favor, preencha a descrição da atividade corretamente")
            return
        }
        if(!timeWork){
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


////Listener de eventos

const addListenerBtnDays = () => {
    btn_days.forEach((btn)=>{
        btn.addEventListener("click", (e) => {
            getDay(e.target.getAttribute("data-id"))
        })
    })
}

btn_addWork.addEventListener("click", createWork)
btn_removeAllWork.addEventListener("click", deleteAllWorksByDay)
btn_addStorage.addEventListener("click", handleSchedule.saveLocalStorage)
btn_removeStorage.addEventListener("click", handleSchedule.deleteLocalStorage)

const init = () =>{
    addListenerBtnDays()
    handleSchedule.getLocalStorage()
}

/*
let div2 = document.querySelector(".panel-works__hour")
let div = document.querySelector(".main__panel--works")

div.addEventListener("scroll", (e)=>{
    let p = e.target.scrollLeft
    if(p > 0){
        console.log(p)
        div2.style.position  = "fixed"
    }
    if(p==0){
        div2.style.position = "static"
    }
    
})*/




init()
