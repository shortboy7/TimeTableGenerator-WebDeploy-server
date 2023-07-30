    create table if not exists course
(
    course_number varchar(255) not null
        primary key,
    name          varchar(255) not null,
    theory        int          not null,
    practice      int          not null,
    credit        int          not null,
    curriculum    varchar(255) not null,
    college       varchar(255) null,
    department    varchar(255) null,
    major         varchar(255) null,
    grade         varchar(255) null
);

create table if not exists professor
(
    professor_id bigint auto_increment
        primary key,
    name         varchar(255) not null,
    major        varchar(255) not null
);

create table if not exists class
(
    class_id      char(4)      not null,
    course_number varchar(255) not null,
    year          int          not null,
    semester      int          not null,
    rating        int          not null,
    capacity      int          not null,
    professor_id  bigint       not null,
    primary key (class_id, course_number, year, semester),
    constraint class_ibfk_1
        foreign key (professor_id) references professor (professor_id),
    constraint class_ibfk_2
        foreign key (course_number) references course (course_number)
);

create index course_number
    on class (course_number);

create index professor_id
    on class (professor_id);

create table if not exists schedule
(
    day           int          not null,
    start_time    time         not null,
    end_time      time         not null,
    classroom     varchar(255) null,
    campus        varchar(255) not null,    
    schedule_id   bigint auto_increment,
    course_number varchar(255) not null,
    class_id      char(4)      not null,
    year          int          not null,
    semester      int          not null,
    primary key (schedule_id, course_number, class_id, year, semester),
    constraint schedule_ibfk_1
        foreign key (course_number, class_id, year, semester) references class (course_number, class_id, year, semester)
);

create index course_number
    on schedule (course_number, class_id, year, semester);

