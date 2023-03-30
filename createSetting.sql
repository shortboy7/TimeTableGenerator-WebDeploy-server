drop table if exists schedule;
drop table if exists class;
drop table if exists course_open;
drop table if exists professor;
drop table if exists course_grade;
drop table if exists course;

create table course(
    course_id bigint not null auto_increment primary key ,
    course_number varchar(255) not null ,
    name varchar(255) not null,
    theory int not null,
    practice int not null,
    credit int not null,
    year int not null ,
    semester int not null ,
    curriculum varchar(255) not null
);

create table course_grade(
  course_id bigint not null,
  grade int not null,
  primary key (course_id, grade),
  foreign key (course_id) references course(course_id)
);


create table professor(
  professor_id bigint auto_increment not null primary key ,
  name varchar(255) not null,
  major varchar(255) not null
);

create table class (
  class_id char(2) not null,
  course_id bigint not null,
  rating int not null,
  capacity int not null,
  professor_id bigint not null,
  primary key (class_id, course_id),
  foreign key (professor_id) references professor(professor_id),
  foreign key (course_id) references course(course_id)
);

create table schedule(
  schedule_id bigint auto_increment not null primary key ,
  day int not null,
  start_time datetime not null,
  end_time datetime not null,
  classroom varchar(255) not null,
  class_id char(2) not null,
  course_id bigint not null,
  foreign key (class_id) references class(class_id),
  foreign key (course_id) references course(course_id)
);
