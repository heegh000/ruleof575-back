let temp : any = {
    월 : [[9, 10], [10, 11], [11, 11.5], [14, 15]],
    화 : [[11, 12]],
    수 : [[15, 16], [17, 18]],
    목 : [],
    금 : [[10.5, 11], [11, 12], [13, 13.5], [14, 15]]
};

// const func = (times : any) => {
//     let result : any = {
//         월 : [],
//         화 : [],
//         수 : [],
//         목 : [],
//         금 : []
//     };

//     let days = Object.keys(result);

//     for(let day in result) {
//         //console.log(result[day]);
//         if(times[day].length != 0) {
//             let start = times[day][0][0];
//             let end = times[day][0][1];
        
//             for(let i = 1; i < times[day].length; i++) {
//                 if(end == times[day][i][0]) {
//                     end = times[day][i][1];
//                 }
//                 else {
//                     result[day].push([start, end]);
        
//                     start = times[day][i][0];
//                     end = times[day][i][1]; 
//                 }
//             }
        
//             result[day].push([start, end]);
//         }
        
//     }
//     console.log(result);
// };

const num_to_time = (num : number) => {
    if(num % 1 == 0) {
        return num + ':00'
    }
    else {
        return num.toFixed() + ':30'
    }

}

const get_intervals = (times : any) => {
    let result : any = {
        월 : [],
        화 : [],
        수 : [],
        목 : [],
        금 : []
    };

    let days = Object.keys(result);

    for(let day in result) {
        let start = -1;
        let len = times[day].length
    
        for(let i = 0; i < len; i++) {

            if(start == -1) {
                start = times[day][i][0];
            } 
            
            if(i == len -1 || times[day][i][1] != times[day][i+1][0]) {
                result[day].push([num_to_time(start), num_to_time(times[day][i][1])]);
                start = -1;
            }
        }
        
    }
};