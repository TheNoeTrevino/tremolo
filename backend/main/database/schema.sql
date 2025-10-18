create table schools (
    id serial primary key,
    title varchar(255) not null,
    city varchar(255) not null,
    county varchar(255) not null,
    state varchar(255) not null,
    country varchar(255) not null,
    created_date date default current_date,
    created_time time default current_time
);

create table users (
    id serial primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    role varchar(255),
    email varchar(255),
    school_id int references schools (id) not null,
    created_date date default current_date,
    created_time time default current_time
);

create table note_game_entries (
    id serial primary key,
    user_id int not null references users (id),
    time_length time not null,
    total_questions int not null,
    correct_questions int not null,
    notes_per_minute int not null,
    created_date date default current_date,
    created_time time default current_time
);

create table teacher_to_parent (
    teacher_id int not null references users (id),
    parent_id int not null references users (id),
    primary key (teacher_id, parent_id)
);

create table teacher_to_student (
    teacher_id int not null references users (id),
    student_id int not null references users (id),
    primary key (teacher_id, student_id)
);

create table parent_to_child (
    parent_id int not null references users (id),
    child_id int not null references users (id),
    primary key (parent_id, child_id)
);
