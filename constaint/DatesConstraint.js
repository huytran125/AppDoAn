export  const  Dates= {
    currentDate: new Date(),
    maxDate: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() +7)
}

export const changeDateToVietnamStringFormat=(date)=>{
    return `${date.getDate()} tháng ${date.getMonth()+1} năm ${date.getFullYear()}`
}