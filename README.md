# 이젠3조 쇼핑몰

> ## 서버 실행 명령문
> 클라이언트 : npm start<br>
> 서버 : npm run dev

### Branch
* main : 배포본
* develop : 총 통합 내용
* feature/기능명 : 기능<br>
 ex) feature/login, feature/main

### 개발흐름
1. 개인이 맡은 기능(feature) 브랜치에서 작업하고,
2. 해당 기능이 완성 됐으면 develop 브랜치에 올린다.
3. develop에 모든 기능들이 모이고 문제 없이 정상적으로 작동하면
4. main 브랜치(배포본)에 올린다.
5. main 브랜치 파일로 배포

### commit 컨벤션
* feat : 새로운 기능 추가
* fix : 에러 수정
* docs : 문서 수정
* style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
  ex) Feat: 로그인 페이지 버튼 추가
