# _my-image-sns_

### [프로젝트 개요]

- #### '이미지 기반 SNS 서비스' 를 위한 백엔드 구현

### [프로젝트 내용]

  - #### 개발 스택은 NestJS 프레임워크 기반 인증 처리는 JWT를, 데이터 처리는 SQLite를 사용함
  - #### 회원가입과 로그인을 제외하고는 JWT 토큰을 기반으로 API를 요청해야 함
  - #### Swagger(http://localhost:3000/api-docs) 기반 API 관련 확인이 가능함

- #### API 구현 항목
  - ##### 회원가입: [POST] /api/users { userId, userName, password, type? }
  - ##### 회원정보 수정: [PUT] /api/users/:idx { userName?, password? }
  - ##### 로그인: [POST] /api/login { userId, password, type? }
  - ##### 로그아웃: [POST] /api/logout
  - ##### 이미지 등록: [POST] /api/images/upload-single { image, type? }
  - ##### 이미지 등록: [POST] /api/images/upload-multi { images, type? }
  - ##### 유저 이미지 확인: [GET] /api/images/by-user { date, userIdx, type, sort? }
  - ##### 전체 이미지 확인: [GET] /api/images/by-total { date, num?, offset?, sort? }
  - ##### 이미지 수정: [PUT] /api/images/:imageIdx { image?, type? }
  - ##### 이미지 삭제: [DELETE] /api/images/:imageIdx
  - ##### 댓글 등록: [POST] /api/images/:imageIdx/comments { comment }
  - ##### 댓글 조회: [GET] /api/images/:imageIdx/comments
  - ##### 댓글 수정: [PUT] /api/images/:imageIdx/comments/:commentIdx { comment }
  - ##### 댓글 삭제: [DELETE] /api/images/:imageIdx/comments/:commentIdx
  
- #### DB 설계 항목
  - ##### User
    | Name      | Type        | Note       |
    |-----------|-------------|------------|
    | idx       | integer     | primaryKey |
    | userId    | varchar(20) |            |
    | userName  | varchar(20) |            |
    | password  | varchar(20) |            |
    | type      | varchar(10) |            |
    | createdAt | datetime    |            |
    | updatedAt | datetime    |            |

  - ##### Image
    | Name      | Type        | Note       |
    |-----------|-------------|------------|
    | idx       | integer     | primaryKey |
    | userIdx   | integer     |            |
    | fileName  | varchar(50) |            |
    | type      | varchar(10) |            |
    | createdAt | datetime    |            |
    | updatedAt | datetime    |            |

  - ##### Comment
    | Name      | Type         | Note       |
    |-----------|--------------|------------|
    | idx       | integer      | primaryKey |
    | userIdx   | integer      |            |
    | imageIdx  | integer      |            |
    | comment   | varchar(255) |            |
    | createdAt | datetime     |            |
    | updatedAt | datetime     |            |

### [프로젝트 빌드 & 테스트 & 실행 방법]

- #### npm i && npm run test:e2e && npm start

### [프로젝트 향후 계획]

- #### Unit 테스트 처리 및 고도화 작업
