interface LecToSend {
    수업번호 : number;
    과목명 : string;
    대표교강사명 : string | null;
    수업시간 : string;
    학점 : number;
    이수구분코드명 : string;
    영역코드명 : string;
    isInTable : number;
    order : number;
}

interface LecToUpdate {
    수업번호 : number;
    state? : number;
    isInTable? : number
    order : number;
}

interface RecommLecs {
    영역코드명 : string,
    수업목록 : LecToSend[]
}

interface CustomRankingLec {
    수업번호 : number;
    과목명 : string;
    대표교강사명 : string | null;
    수업시간 : string;
    설강기준평점? : number;
    개설예정수업목록 : LecToSend[];
}

interface Interval {
    start : number|string;
    end : number|string;
}

interface IntervalsPerDays {
    [day : string] : Interval[],
    월 : Interval[];
    화 : Interval[];
    수 : Interval[];
    목 : Interval[];
    금 : Interval[];
}

interface LecDetailsInfo {
    수업번호 : number;
    학수번호 : string;
    과목명 : string;
    이수구분코드명 : string;
    학점 : number;
    이론 : number;
    실습 : number;
    대표교강사명 : string | null;
    강좌유형 : string;
    수업시간 : string;
    강의실 : string;
    특수수업구분: string[];
    정원 : number;
    설강기준평점 : number;
    'A+' : number;
    A0 : number;
    'B+' : number;
    B0 : number;
    'C+' : number;
    C0 : number;
    'D+' : number; 
    D0 : number;
    Pass : number;
    F : number;
    전체인원 : number;
}

interface WantedStuDetails {
    희망신청소속 : string;
    학생수 : number;
}

interface PrevLecDetailsInfo {
    수업번호 : number;
    수업년도 : number;
    수업학기 : number;
    대표교강사명 : number | null;
    제한인원 : number;
    신청인원 : number;
    증원인원 : number;
    전체취소 : number;
    정정취소 : number;
    순위1 : number;
    순위2 : number;
    순위3 : number; 
    순위4 : number;
    순위5 : number;
    순위5초과 : number;
    희망수업등록인원 : number;
    재수강인원 : number;
    희망수업세부정보 : WantedStuDetails[];
}

interface GradRecord {
    이수여수: any;
    이수명 : string;
    기준 : number;
    이수 : number;
    이수여부 : string;
}

interface LecForGrad {
    이수구분코드명 : string;
    영역코드명 : string;
    학점 : number;
    특수수업구분 : string;
}

interface Semester {
    year : number;
    sem : number;
}

export {
    LecToSend,
    LecToUpdate,
    RecommLecs,
    CustomRankingLec,
    Interval,
    IntervalsPerDays,
    LecDetailsInfo,
    PrevLecDetailsInfo,
    GradRecord,
    LecForGrad,
    Semester
}