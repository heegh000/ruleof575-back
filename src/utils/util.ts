const num_to_time = (num : number) => {
    if(Number.isInteger(num)) {
        return num + ':00'
    }
    else {
        return num.toFixed() + ':30'
    }

}

const get_intervals = (times : any) => {
    let result : any = {
        '월' : [],
        '화' : [],
        '수' : [],
        '목' : [],
        '금' : []
    };

    for(let day in result) {
        let start = -1;
        let len = times[day].length
    
        for(let i = 0; i < len; i++) {

            if(start == -1) {
                start = times[day][i].start;
            } 
            
            if(i == len -1 || times[day][i].end != times[day][i+1].start) {
                result[day].push({
                    start : num_to_time(start), 
                    end : num_to_time(times[day][i].end)
                });
                start = -1;
            }
        }
        
    }

    return result;
};

const filed_order = [
    "가상대학영역",
    "고전읽기영역",
    "과학과기술영역",
    "글로벌언어와문화영역",
    "미래산업과창업영역",
    "사회와세계영역",
    "소프트웨어영역",
    "인문과예술영역",
    "일반영역",
    "영역없음"
]

export { get_intervals, filed_order } 