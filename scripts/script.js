//Refereencia dos botoes de selecionar o dia da semana
const btn_days = document.querySelectorAll(".btn-days")

//Referência dos botoes de adicionar e remover
const btn_addWork = document.querySelector(".work__btn--add")
const btn_removeWork = document.querySelector(".work__btn--remove")

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
        Chave: id do dia da semana (1-seg, 2-ter, 3-qua, 4-qui, 5-sex, 6-sab, 7-dom)
        Valor: Objeto --Chave: hora das atividades convertida em minutos
                        Valor: array que contem a descricao das atividades
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

//Função para renderizar os dados das atividades no DOM
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

        let cardDesc = document.createElement("div")
        cardDesc.classList.add(idDay)
        cardDesc.classList.add("card-work")
        cardDesc.innerHTML = desc
        cardDesc.setAttribute("data-id", id)
        cardDesc.setAttribute("data-time", key)
        containerCardWork.appendChild(cardDesc)
    })

    containerWork.appendChild(containerCardWork)
    
}

//Função para selecionar filtrar as atividades por dia da semana
const getDay = (e) => {
    const idDay = e.target.getAttribute("data-id")

    let schedule = handleSchedule.getScheduleByDay(idDay)
    let keys = Object.keys(schedule)
    keys.sort()

    clearScheduleOnDOM()

    keys.forEach(key => {
        renderSchedule(key, schedule[key], idDay)
    })   
}

const createWork = ()=>{
    const timeWork = getElement(".work__input--hour").value
    const descWork = getElement(".work__input--desc").value

    const select = getElement(".work__select--day")
    const idDay = select.options[select.selectedIndex].value;


    const work = new factoryWork(timeWork, descWork)

    handleSchedule.setWork(work, idDay)
}


//Adicinando listener de evento dos botos de selecionar o dia
const addListenerBtnDays = () => {
    btn_days.forEach((btn)=>{
        btn.addEventListener("click", (e) => {
            getDay(e)
        })
    })
}

btn_addWork.addEventListener("click", createWork)


const init = () =>{
    addListenerBtnDays()
}

init()
