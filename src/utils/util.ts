import { IntervalsPerDays } from "./interfaces";

const num_to_time = (num : number) : string => {
    if(Number.isInteger(num)) {
        return num + ':00'
    }
    else {
        return Math.floor(num) + ':30'
    }

}

const get_intervals = (times : IntervalsPerDays) => {
    let result : IntervalsPerDays = {
        월 : [],
        화 : [],
        수 : [],
        목 : [],
        금 : []
    };

    let day : string;
    for(day in result) {
        let start : number = -1;
        let len = times[day].length
    
        for(let i = 0; i < len; i++) {

            if(start == -1) {
                start = times[day][i].start as number;
            } 
            
            if(i == len -1 || times[day][i].end != times[day][i+1].start) {
                result[day].push({
                    start : num_to_time(start), 
                    end : num_to_time(times[day][i].end as number)
                });
                start = -1;
            }
        }
        
    }

    return result;
};

export { get_intervals } 