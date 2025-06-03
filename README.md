# Windows 환경에서 git, npm 등 명령어 실행을 위한 일회성 권한 부여

```
Set-ExecutionPolicy RemoteSigned -Scope Process
```

---

# Service에서 사용하는 CRUD 메서드

| 메서드         | 설명                                                        |
| -------------- | ----------------------------------------------------------- |
| find()         | 전체 목록 조회 (SELECT \* FROM user)                        |
| findOne()      | 조건에 맞는 단일 엔티티 조회                                |
| findBy()       | find의 조건 버전 (find({ where: { name: 'hj' } })이랑 같음) |
| findOneBy()    | findOne의 간단 버전                                         |
| findAndCount() | 결과와 전체 개수를 함께 조회 ([data, count])                |
| save(entity)   | 엔티티 삽입 또는 수정 (PK 유무로 구분)                      |
| insert()       | 삽입 전용 (속도 빠름, 반환 값 제한)                         |
| update()       | 수정 전용 (엔티티 안 쓰고 조건+값만 씀)                     |
| delete()       | 조건에 맞는 레코드 삭제                                     |
| softDelete()   | 소프트 삭제 (엔티티에 @DeleteDateColumn 필요)               |
| restore()      | 소프트 삭제 복원                                            |
| count()        | 조건에 맞는 개수 카운팅                                     |
| query()        | 쿼리 직접 작성 (raw SQL)                                    |
| create()       | save() 전에 빈 Entity 인스턴스 생성                         |

# Repository 메서드

| 함수                     | 역할                                             | 주의점                                              |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------- |
| `save(data)`             | 삽입 또는 수정 (PK 없으면 INSERT, 있으면 UPDATE) | 내부에서 `create()`와 `insert`/`update`를 자동 처리 |
| `insert(data)`           | INSERT 전용, 빠름                                | 반환값에 id 없음                                    |
| `update(조건, data)`     | UPDATE 전용                                      | 조건부 수정, 객체 반환 아님                         |
| `remove(entity)`         | 완전 삭제 (엔티티 필요)                          | DB에서 row 삭제                                     |
| `softDelete(조건)`       | `@DeleteDateColumn` 있는 경우만 사용 가능        | 소프트 삭제                                         |
| `restore(조건)`          | `softDeleted` 된 row 복구                        | `softDelete`랑 짝꿍                                 |
| `count()`                | 조건에 맞는 row 개수                             | 통계용으로 좋음                                     |
| `findOne({ where: {} })` | 조건으로 단일 조회                               | 보통 로그인 시 유저 찾기 등                         |
| `create(data)`           | 실제 DB에 넣진 않고, 엔티티 형태만 생성          | `save()` 전에 사용됨                                |

# TypeORM에서 자주 사용되는 데코레이터 정리

## 1. 📁 Entity 관련

| 데코레이터                  | 설명                                           |
| --------------------------- | ---------------------------------------------- |
| `@Entity()`                 | 엔티티 클래스를 DB 테이블로 매핑               |
| `@PrimaryGeneratedColumn()` | 기본 키 + 자동 증가 (숫자 또는 UUID 지원 가능) |
| `@Column()`                 | 일반 컬럼                                      |
| `@CreateDateColumn()`       | 생성일 자동 관리 (INSERT 시 자동 기록)         |
| `@UpdateDateColumn()`       | 수정일 자동 관리 (UPDATE 시 자동 기록)         |
| `@DeleteDateColumn()`       | 소프트 삭제용 컬럼 (DELETE 시 날짜 저장)       |
| `@Index()`                  | 인덱스 추가 (단일 or 복합 인덱스 가능)         |
| `@Unique(['email'])`        | 컬럼 or 컬럼 조합에 유니크 제약 조건 설정      |

## 2. 📁 관계

| 데코레이터      | 설명                                               |
| --------------- | -------------------------------------------------- |
| `@OneToOne()`   | 1:1 관계                                           |
| `@OneToMany()`  | 1:N 관계 (읽기 전용, 실제 FK는 `ManyToOne`에 작성) |
| `@ManyToOne()`  | N:1 관계 (FK 지정)                                 |
| `@ManyToMany()` | N:N 관계 (조인 테이블 생성)                        |
| `@JoinColumn()` | 관계 설정 시 FK 컬럼 명시                          |
| `@JoinTable()`  | `@ManyToMany`에서 조인 테이블 명시 시 사용         |

## 3. 📁 제약 조건 / 인덱스 관련

| 데코레이터                 | 설명                        |
| -------------------------- | --------------------------- |
| `@Index()`                 | 단일 컬럼 인덱스            |
| `@Index(['col1', 'col2'])` | 복합 인덱스                 |
| `@Unique(['email'])`       | 유니크 제약 조건            |
| `@Check("price > 0")`      | 조건 검사                   |
| `@Generated("uuid")`       | UUID 자동 생성 컬럼         |
| `@VersionColumn()`         | 낙관적 락(버전 관리)용 컬럼 |

## 4. 📁 고급 컬럼 타입 / 옵션

| 데코레이터                                                | 주요 옵션 설명           |
| --------------------------------------------------------- | ------------------------ |
| `@Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE'] })` | enum 타입                |
| `@Column({ type: 'json' })`                               | JSON 컬럼                |
| `@Column({ nullable: true })`                             | null 허용                |
| `@Column({ default: 1 })`                                 | 기본값 설정              |
| `@Column({ select: false })`                              | 조회 제외 (예: password) |
| `@Column({ update: false })`                              | 수정 불가 필드 설정      |

## 5. 📌 실전에서 유용한 추천 조합

| 사용 예                     | 조합                                          |
| --------------------------- | --------------------------------------------- |
| 유저 엔티티의 비밀번호 보호 | `@Column({ select: false })`                  |
| 유저 탈퇴 대신 soft delete  | `@DeleteDateColumn()` + `softDelete()`        |
| user_id에 자동 인덱스       | `@ManyToOne(() => User)` + `@JoinColumn()`    |
| 로그인 이력 빠른 검색       | `@Index(['user_id', 'createdAt'])`            |
| 고정된 상태값 ENUM 관리     | `@Column({ type: 'enum', enum: UserStatus })` |

## 6. 🧠 마무리

| 유형           | 대표 데코레이터                                               |
| -------------- | ------------------------------------------------------------- |
| 기본 정의      | `@Entity`, `@Column`, `@PrimaryGeneratedColumn`               |
| 시간/삭제 처리 | `@CreateDateColumn`, `@UpdateDateColumn`, `@DeleteDateColumn` |
| 관계 매핑      | `@OneToMany`, `@ManyToOne`, `@JoinColumn`, `@JoinTable`       |
| 인덱스/제약    | `@Index`, `@Unique`, `@Check`                                 |
| 기타 활용      | `@Column({ select: false })`, `@Column({ type: 'json' })` 등  |
