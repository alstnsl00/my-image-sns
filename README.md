# _my-image-sns_

### [프로젝트 개요]

-   #### 이미지 기반 SNS 서비스 API 설계

### [프로젝트 내용]

-   #### 프로세스 항목
    -   ##### 인증 처리는 JWT를 데이터 저장은 sqlite를 사용함
    -   ##### 회원가입과 로그인을 제외하고는 로그인을 하여 JWT 토큰을 기반으로 API를 요청해야 함
    -   ##### Swagger(http://localhost:3000/api-docs) 를 이용한 API 확인이 가능하며 테스트 코드는 E2E로 처리함

-   #### API 설계
    -   ##### 회원가입: [POST] /api/users { userId, userName, password, type? }
    -   ##### 회원정보 수정: [PUT] /api/users/:id { userName, password? }
    -   ##### 로그인: [POST] /api/login { username, password, type }
    -   ##### 로그아웃: [POST] /api/logout
    -   ##### 이미지 등록: [POST] /api/images/uploadSingle { image, userId, type? }
    -   ##### 이미지 등록: [POST] /api/images/uploadMulti { images, userId, type? }
    -   ##### 유저 이미지 확인: [GET] /api/images/user { userId, date, type, sort? }
    -   ##### 전체 이미지 확인: [GET] /api/images/total { date, sort?, num?, offset? }
    -   ##### 이미지 수정: [PUT] /api/images/:imageId { image, type }
    -   ##### 이미지 삭제: [DELETE] /api/images/:imageId
    -   ##### 댓글 등록: [POST] /api/images/:imageId/comments { userId, comment }
    -   ##### 댓글 조회: [GET] /api/images/:imageId/comments 
    -   ##### 댓글 수정: [PUT] /api/images/comments/:commentId { comment }
    -   ##### 댓글 삭제: [DELETE] /api/images/comments/:commentId

### [프로젝트 빌드 & 테스트 & 실행 방법]

-   #### npm i && npm run test:e2e && npm start

### [미해결 이슈 정리 및 향후 계획]

-   #### Unit 테스트 처리, 추가 기능 개발 및 고도화 작업
