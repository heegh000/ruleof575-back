# 삼다수 BE 설계 개요

- 프로젝트에 대한 자세한 설명은 [삼다수(프로젝트명 ruleof575)](https://github.com/dan2kk/ruleof575front)
- [삼다수(프로젝트명 ruleof575)](https://github.com/dan2kk/ruleof575front) Back-End 설계 설명

# Server 설계


Directory 구조
---

- src : typescript 파일
    - database
        - db_info.json : 데이터베이스에 대한 정보, 테이블 이름이 저장된 JSON 파일, github에는 올라가지 않음
        - db.ts : db_info.json을 읽어서 db 생성
        - tables.js : db_info.json을 읽어서 테이블에 대한 정보를 담는 객체를 생성
    - router
        - custom.ts : **강의랭킹**을 처리하기 위한 라우터
        - details.ts : **수업상세**를 처리하기 위한 라우터
        - gard.ts : **졸업사정**을 처리하기 위한 라우터
        - list.ts : **수업목록**을 처리하기 위한 라우터
        - recommend.ts : **교양찾기**을 처리하기 위한 라우터
        - test.ts : 테스트 라우터
    - utils
        - interfaces.ts : typescript interface 모듈화
        - util.ts : 연산에 필요한 함수 모듈화
        - sql.ts : sql 관련 모듈화
    - app.ts : 실제 서버  구동을 위한 파일
- dist : 컴파일된 javascript 파일, src구조와 동일

router
---

### custom.ts

1. custom/ge
    - FE에서 교양에 대한 인기도 순위 요구시 처리
    - Method : GET
    - sql_custom_ge, sql_custom_ge_score 사용
2. custom/major
    - FE에서 전공에 대한 인기도 순위 요구 시 처리
    - Method: GET
    - sql_custom_major, sql_custom_major_score 사용

### details.ts

1. details/
    - FE에서 어떠한 수업에 대한 상세 정보를 요청할 시 처리
    - Method: GET
    - sql_details_cur(올해 과목 정보), sql_details_prev(그동안 개설되었던 동일 과목에 대한 정보) 사용

### grad.ts

1. grad/init
    - FE에서 로그인 성공시 사용자의 현재 졸업사정에 대한 정보를 요청할 시 처리
    - Method: GET
    - sql_grad_init 사용
2. grad/view
    - FE에서 졸업요건 확인을 위해 사용자가 현재 시간표에 담아둔 수업에 대한 정보를 요청할 시 처리
    - Method: GET
    - sql_grad_view 사용
3. grad/update
    - FE에서 최초로 사용자가 졸업사정을 불러왔을 경우, DB에 저장을 요청할 때 처리
    - Method: POST
    - sql_grad_update 사용

### list.ts

1. list/init
    - FE에서 로그인 성공시 사용자의 현재 수업목록에 대한 정보를 요청할 시 처리
    - Method: GET
    - sql_list_init 사용
2. list/update
    - FE에서 사용자의 수업목록에 대한 업데이트를 요청할 시 처리
    - Method: POST
    - sql_list_old_list, sql_list_update 사용
3. list/search
    - FE에서 사용자가 과목명으로 검색하여 수업에 대한 정보를 요청할 시 처리
    - Method: POST
    - sql_list_search 사요

### recommend.ts

1. recommend/
    - FE에서 시간에 대한 정보를 주고, 해당 시간에 맞는 수업에 대한 정보를 요청할 때 처리
    - Method: POST
    - sql_recommend, sql_recommend_nt 사용
    

utils
---

### interfaces.ts

- type check를 위한 interface들을 모아둔 파일

### sql.ts

- FE로 부터 받은 값들로 생성한 SQL Query를 반화하는 함수들 모둘화
1. sql_list_init: 사용자의 수업목록 조회 쿼리
2. sql_list_old_list: 업데이트를 위해 사용자의 수업 목록 조회 쿼리
3. sql_list_update: 사용자의 수업목록 업데이트  쿼리
4. sql_list_search: 과목명으로 검색 시 정보 조회 쿼리
5. sql_recommend: 사용자가 원하는 시간에 맞는 교양 조회 쿼리
6. sql_recommend_nt: 시간미지정 강좌 교양 조회 쿼리
7. sql_custom_ge: 선택된 교양영역에 해당하는 교양 과목과 개설 예정 과목 조회 쿼리 (종합점수 순)
8. sql_custom_ge_score: 선택된 교양영역에 해당하는 교양 과목과 개설 예정 과목 조회 쿼리 (설강기준평점 순)
9. sql_custom_major: 선택된 학과, 학년에 해당하는 전공 과목과 개설 예정 과목 조회 쿼리 (종합점수 순)
10. sql_custom_major_score: 선택된 학과, 학년에 해당하는 전공 과목과 개설 예정 과목 조회 쿼리 (설강기준평점 순)
11. sql_details_cur: 사용자가 선택한 수업에 대한 상세 정보 조회 쿼리
12. sql_details_prev: 이전 학기에 개설된 수업들 중에서, 사용자가 선택한 수업과 동일한 수업에 대한 상세 정보 조회 쿼리
13. sql_details_prev_not_same: 선택한 수업과 동일한 수업이 없을 때, 다른 교수님의 수업에 대한 정보 조회 쿼리 (사용X)
14. sql_grad_init: 사용자의 졸업사정 조회 쿼리
15. sql_grad_view: 사용자가 시간표에 담은 수업들에 대한 정보 조회 쿼리 
16. sql_grad_update: 최초 로그인 시 사용자의 졸업사정 등록 쿼리

### util.ts

- recommend/ 처리를 할 때 FE로부터 IntervalsPerDays 형식으로 받음 → 해당 데이터를 시간으로 변환하기 위한 함수들 모듈화
    
    ```tsx
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
    ```
    

기타
---

- ec2가 주기적으로 터지는 문제 → swap 메모리 생성으로 해결
- DB 관련 정보(endpoint, 비밀번호 등)은 절대 github에 올라가서는 안됨 (하드코딩X)
- CORS 미들웨어을 통한 CORS문제 해결

# DB 설계

input_file 스키마
---

### 개요

- CSV 파일(학교 제공된 엑셀 파일)을 DB에 올리기 위한 스키마
- import 실행 → Procedure 실행 → Service 스키마의 테이블에 INSERT
- 단순히 input_file을 올리기 위해 존재하는 스키마이기 때문에 index, primary key를 설정하지 않음

### 테이블 상세

![input_file 스키마](https://github.com/heegh000/ruleof575-back/assets/108382134/6afd251d-1df2-4cca-a712-3acc0d6a2a8b)

1. 수강편람
    - 수강편람에 대한 엑셀파일을 위한 테이블
    - 수업시간, 장소, 교강사등 정보는 varhar형으로 담은 뒤 이후 PostgreSQL 내장 함수인 string_to_array를 이용하여 가공
2. 수업별_포트폴리오
    - A+ ~ F가 몇명인지에 대한 정보가 담긴 엑셀파일을 위한 테이블
3. 희망등록_소속별_인원
    - 지난 학기 희망 인원, 증원인에 대한 정보가 담긴 엑셀 파일을 위한 테이블
4. 로그분석_순위
    - 데이터분석으로 부터 건네받은 파일을 저장하기 위한 테이블
    - 신청 순서, 도달 시간, 기준 시간내 신청, 정원 대비 희망인원 순위에 대한 정보가 담김
5. 로그분석_인원정보
    - 데이터분석으로 부터 건네받은 파일을 저장하기 위한 테이블
    - 수업별로, 1~5순위로 신청한 학생 수, 취소 인원, 증원 인원이 몇명인지에 대한 정보가 담김

service 스키마
---

![service 스키마](https://github.com/heegh000/ruleof575-back/assets/108382134/b08ec249-2df3-431f-b4df-25037a3ac3c6)


### 테이블 상세

1. **222_학생별_수업목록**
    - 학생들이 담은 수업 ****리스트를 저장한 테이블
    - FE로부터 학번, 수업번호, 시간표에 등록된 수업이 무엇인지(상태), 순서를 받으면 저장
    - 학번을 기준을 탐색하므로 학번으로 index 생성
    - 상태가 -1인경우 **수업목록**에 없음, 0인 경우 **수업목록**에만 있음, 1인경우 시간표에도 있음
2. **222_학생별_졸업사정**
    - 전 학기까지 들은 학생별 졸업사정에 대한 정보를 저장한 테이블
    - FE로부터 졸업사정에 대한 데이터를 받으면 저장
    - 학번을 기준으로 탐색하므로 학번으로 index 생성
3. **수강편람**
    - 강의들에 대한 모든 정보를 저장한 테이블
    - (수업번호, 수업년도, 수업학기)를 primary key로 지정 → clustered index
    - 추가로 (학수번호, 수업년도, 학기)로 접근할 일이 있어서 따로 index 생성 (카디널리티가 높은 컬럼 순으로 다중 컬럼 인덱스)
    - insert_lec_info() 프로시져을 input_file 스키마의 수강편람 테이블에서 데이터들을 가공하여 insert함
4. **수업별_시간_장소**
    - 각 수업별 수업 시간과 강의실을 파싱하여 저장한 테이블
    - 단순히 FE한테 수업 시간과 강의실을 보낼 땐 varchar형이여도 문제가 없음
    - FE쪽에서 시간을 기준으로 요청을 보낼 때를(**교양찾기**) 처리하기 위해 **수강편람 테이블**과 1:N 관계 형성
    - (수업번호, 수업년도, 수업학기), (시작시간, 끝시간)으로 index 생성
    - insert_tp_per_lec() 프로시져을 통해 input_file 스키마의 수강편람 테이블에서 데이터들을 가공하여 insert함
5. **수업별_전공학과_학년**
    - 수업이 어떤 학과의 몇 학년 전공인지에 대한 데이터를 저장하는 테이블
    - 한 수업이 2개의 학과의 공통 전공일 수도 있기 때문에 **수강편람 테이블**과 1:N 관계 형성
    - (수업번호, 수업년도, 수업학기, 전공학과코드 학년)에 unique 제약조건을 걸어둠 → 제공받은 파일 특성 때문에 insert 시 conflit 검사를 해야 함
    - (전공학과, 학년) 기준으로 탐색하므로 (전공학과, 학년)으로 index 생성
    - insert_department_grade() 프로시져를 통해 input_file 스키마의 수강편람 테이블에서 데이터들을 가공하여 insert함
6. **수업별_포트폴리오**
    - 각 수업별 A+~F까지 몇명인지에 대한 정보를 저장한 테이블
    - **수강편람 테이블**과 1:1 관계 형성
    - **수강편람 테이블**에 column을 추가하지 않고 따로 테이블을 만든 이유는 다음과 같음
        - input_file이 다름
        - **수강편람 테이블**은 매번 참조되는 반면, **수업별_포트폴리오 테이블**은  **수업상세**에서만 참조됨
    - (수업번호, 수업년도, 수업학기)에 unique 제약 조건을 걸어둠 → index 사용 가능
    - insert_pp() 프로시져를 통해 input_file 스키마의 수업별_포트폴리오 테이블에서 데이터들을 가공하여 insert함
7. **희망등록_소속별_인원**
    - 각 수업별로 희망수업으로 등록한 학과 인원이 몇명인지에 대한 정보를 저장한 테이블
    - **수강편람 테이블**과 1:N 관계 형성
    - (수업번호, 수업년도, 수업학기)를 기준으로 탐색하므로 (수업번호, 수업년도, 수업학기)로 index 생성
    - insert_wanted_stu_per_department() 프로시져를 통해 input_file 스키마의 희망등록_소속별_인원 테이블에서 데이터들을 가공하여 insert 함
8. **신청결과_순위**
    - 로그 파일 분석을 통해 다양한 기준별 순위(신청순서, 기준 인원 도달 시간, 기준시간 내 신청, 희망수업 비율)를 저장한 테이블
    - 교양 수업의 경우, 학년별로 따로 수강신청 하므로 **수강편람 테이블**과 1:N 관계 형성
    - (수업번호, 년도, 학기, 학년) unique 제약 조건을 걸어둠 → index 사용 가능
    - insert_log_anal_ranking() 프로시져를 통해 input_file 스키마의 **로그분석_순위** 테이블에서 데이터들을 가공하여 insert 함
    - 쿼리에서 cal_score를 통해 해당 테이블에 접근하여 종합 순위를 계산
9. **신청결과_인원정보**
    - 로그 파일 분석을 통해 수업별 인원 정보(해당 수업을 몇순위로 신청 했는지, 취소를 몇명 했는지 등등)를 저장한 테이블
    - **수강편람 테이블**과 1:1 관계 형성
    - (수업번호, 년도, 학기) unique 제약 조건을 걸어둠 → index 사용 가능
    - insert_log_anal_pn_info() 프로시져를 통해 input_file 스키마의 **로그분석_인원정보** 테이블에서 데이터들을 가공하여 insert 함
