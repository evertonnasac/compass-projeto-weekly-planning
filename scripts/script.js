//Refereencia dos botoes de selecionar o dia da semana
const btn_days = document.querySelectorAll(".btn-days")

//Referência dos botoes de adicionar e remover
const btn_addWork = document.querySelector(".work__btn--ad")
const btn_removeWork = document.querySelector(".work__btn--remove")

//Referência dos botoes de adicionar e remover localStorage
const btn_addStorage = document.querySelector(".header__btn--add")
const btn_removeStorage = document.querySelector(".header__btn--remove")

//Função que recebe um atributo e retorna o elemento que contem o atributo no DOM
const getElement = (atr) =>{
    return document.querySelector(atr)
}

//Função imediatamente invocada para manter a referÊncia dos dados salvos 
const handleSchedule = (() =>{

    /*Estrutura de dados: Objeto schedule
        Chave: id do dia da semana (1-seg, 2-ter, 3-qua, 4-qui, 5-sex, 6-sab, 7-dom)
        Valor: Objeto --Chave: hora das atividades convertida em minutos
                        Valor: array que contem a descricao das atividades

    */

    let schedule = {
       1 : {
            5 : ["Comer", "Dormir"],
            6 : ["trabalhar"],
            1:  ["Viajar"]
        },

       2 : {},
       3 : {},
       4 : {},
       5 : {},
       6 : {},
       7 : {},
    }

    return{

        getScheduleToDay : (idDay) =>{
            return schedule[idDay]
        },
    
        setWork : (work, idDay) =>{
            let day = getScheduleToDay(idDay)
    
            if(day.hasOwnProperty(work.time)){
                day[work.time].push(work.desc)
            }
            else{
                day[work.time] = [work.desc]
            }
        }

    }
 
})()

//Função para renderizar os dados das atividades salvas no DOM
const renderSchedule = (key, value) =>{
    let containerWork = getElement(".container-works__content")
    let containerHour = getElement(".panel-works__hour")

    let cardHour = document.createElement("div")
    //cardHour.classList.add("ESTILIZAR A CLASSE DO ELEMENTO")
    cardHour.innerHTML = key
    containerHour.appendChild(cardHour)

    let containerCardWork =  document.createElement("div")
    containerCardWork.classList.add("content-works__container-card")

    value.forEach(desc => {

        let cardDesc = document.createElement("div")
        //cardDesc.classList.add("ESTILIZAR A CLASSE DO ELEMENTO")
        cardDesc.innerHTML = desc
        containerCardWork.appendChild(cardDesc)
    })

    containerWork.appendChild(containerCardWork)
    
}

//Função para selecionar filtrar as atividades por dia da semana
const getDay = (e) => {
    const idDay = e.target.getAttribute("data-id")

    console.log(idDay)
    
    let schedule = handleSchedule.getScheduleToDay(idDay)
    let keys = Object.keys(schedule)
    keys.sort()

    keys.forEach(key => {
        renderSchedule(key, schedule[key])
    })
    
}

const setWorkToDay = ()=>{
    const timeWork = getElement(".work__select--day").value
    const descWork = getElement(".work__input--desc").value
 

}
//Adicinando listener de evento dos botos de selecionar o dia
const addListenerBtnDays = () => {
    btn_days.forEach((btn)=>{
        btn.addEventListener("click", (e) => {
            getDay(e)
        })
    })
}

const init = () =>{
    addListenerBtnDays()
}

init()
