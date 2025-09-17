# Full-Stack Web Application

Spring Boot + Next.js 기반 풀스택 웹 애플리케이션

## 기술 스택

### Backend
- **Java 21** + **Spring Boot 3.5.4**
- **Spring Security** + **JWT 인증**
- **Spring Data JPA** + **H2 Database**
- **Gradle** 빌드 도구
- **Bean Validation** + **예외 처리**

### Frontend
- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** (스타일링)
- **Axios** (API 통신)

## 구현 기능

**인증 시스템**
- 회원가입 / 로그인 (JWT 기반)
- 사용자 권한 분리 (Admin / User)

**게시글 관리**
- 게시글 CRUD (생성, 조회, 수정, 삭제)
- 검색 및 페이징 처리

**댓글 시스템**
- 댓글 CRUD 기능
- 게시글별 댓글 관리

**파일 업로드**
- 파일 업로드/다운로드
- 파일 관리 기능

**예외 처리**
- 전역 예외 처리
- 유효성 검증

**테스트 코드**
- 단위 테스트 / 통합 테스트

## 실행 방법

### Backend 실행
```bash
cd backEnd/app
./gradlew bootRun
```
- 서버: http://localhost:8080
- H2 콘솔: http://localhost:8080/h2-console

### Frontend 실행
```bash
cd frontend
npm run dev
```
- 웹 애플리케이션: http://localhost:3000

## API 엔드포인트

### 인증 API (`/api/auth`)
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 게시글 API (`/api/posts`)
- `POST /api/posts` - 게시글 작성
- `GET /api/posts` - 게시글 목록 (페이징)
- `GET /api/posts/{id}` - 게시글 조회
- `GET /api/posts/search?keyword=검색어` - 게시글 검색
- `PUT /api/posts/{id}` - 게시글 수정
- `DELETE /api/posts/{id}` - 게시글 삭제

### 댓글 API (`/api/comments`)
- `POST /api/comments` - 댓글 작성
- `GET /api/comments/post/{postId}` - 게시글 댓글 조회
- `PUT /api/comments/{id}` - 댓글 수정
- `DELETE /api/comments/{id}` - 댓글 삭제

### 파일 API (`/api/files`)
- `POST /api/files/upload` - 파일 업로드
- `GET /api/files/download/{id}` - 파일 다운로드
- `DELETE /api/files/{id}` - 파일 삭제

## 프론트엔드 기능

### 메인 페이지 (http://localhost:3000)
- **회원가입 폼**: 사용자 등록
- **로그인 폼**: JWT 토큰 기반 인증
- **게시글 작성**: 인증된 사용자만 작성 가능
- **게시글 목록**: 실시간 조회 및 새로고침
- **API 정보**: 사용 가능한 엔드포인트 안내

### 주요 특징
- **반응형 디자인**: Tailwind CSS로 모바일/데스크톱 대응
- **실시간 업데이트**: API 호출 후 자동 새로고침
- **에러 처리**: 사용자 친화적 오류 메시지
- **로딩 상태**: 사용자 경험 개선

## 개발 환경

### 필요 조건
- Java 21+
- Node.js 18+
- npm 또는 yarn

### 데이터베이스
- **개발/테스트**: H2 (인메모리)
- **운영**: PostgreSQL (설정 가능)

## 프로젝트 구조

```
my_app/
├── backEnd/app/                 # Spring Boot 백엔드
│   ├── src/main/java/          # Java 소스 코드
│   │   └── app/jjyoon/dev/
│   │       ├── auth/           # JWT 인증
│   │       ├── user/           # 사용자 관리
│   │       ├── post/           # 게시글 관리
│   │       ├── comment/        # 댓글 관리
│   │       ├── file/           # 파일 관리
│   │       ├── config/         # 설정
│   │       └── exception/      # 예외 처리
│   └── src/main/resources/     # 설정 파일
└── frontend/                   # Next.js 프론트엔드
    ├── src/app/               # App Router
    │   └── page.tsx           # 메인 페이지
    └── package.json           # 의존성
```

## 완성된 기능

**완전한 풀스택 애플리케이션**
**JWT 기반 인증 시스템**
**RESTful API 설계**
**반응형 웹 인터페이스**
**실시간 데이터 처리**
**에러 처리 및 유효성 검증**

