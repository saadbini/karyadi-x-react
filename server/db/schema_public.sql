BEGIN;

CREATE TABLE public.agenda (
    id serial NOT NULL,
    name text NOT NULL,
    description text,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    slido_url text,
    event_id integer,
    CONSTRAINT agenda_pkey PRIMARY KEY (id)
);

CREATE TABLE public.attendance (
    id serial NOT NULL,
    user_id integer,
    event_id integer,
    attendance_status text,
    created_on timestamp with time zone,
    CONSTRAINT attendance_pkey PRIMARY KEY (id)
);

CREATE TABLE public.certification (
    id serial NOT NULL,
    user_id integer NOT NULL,
    certification_name character varying(255) NOT NULL,
    issuing_organization character varying(255),
    issue_date timestamp with time zone,
    expiration_date timestamp with time zone,
    credential_id character varying(255),
    credential_url text,
    created_on timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    has_expiration_date boolean DEFAULT false,
    CONSTRAINT certification_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_cert UNIQUE (user_id, certification_name, issuing_organization)
);

CREATE TABLE public.event (
    id serial NOT NULL,
    name text NOT NULL,
    details text,
    event_type text,
    event_status text,
    image text,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    location_url text,
    slots integer,
    created_by integer,
    created_on timestamp with time zone,
    virtual_link text,
    start_date date,
    end_date date,
    CONSTRAINT event_pkey PRIMARY KEY (id)
);

CREATE TABLE public.event_collaborator (
    id serial NOT NULL,
    event_id integer,
    organization_id integer,
    event_collaborator_type text,
    CONSTRAINT event_collaborator_pkey PRIMARY KEY (id)
);

CREATE TABLE public.event_organizer (
    id serial NOT NULL,
    organizer_id integer NOT NULL,
    is_main_organizer boolean DEFAULT false,
    event_id integer NOT NULL,
    CONSTRAINT event_organizer_pkey PRIMARY KEY (id)
);

CREATE TABLE public.event_partner (
    id serial NOT NULL,
    organization_id integer,
    event_partner_tier text,
    event_id integer,
    CONSTRAINT event_partner_pkey PRIMARY KEY (id)
);

CREATE TABLE public.event_sponsor (
    id serial NOT NULL,
    organization_id integer,
    event_sponsor_tier text,
    event_id integer,
    CONSTRAINT event_sponsor_pkey PRIMARY KEY (id)
);

CREATE TABLE public.form (
    id serial NOT NULL,
    title text NOT NULL,
    event_id integer NOT NULL,
    created_by integer NOT NULL,
    created_on timestamp with time zone,
    description text,
    CONSTRAINT form_pkey PRIMARY KEY (id)
);

CREATE TABLE public.form_question (
    id serial NOT NULL,
    form_id integer NOT NULL,
    question text NOT NULL,
    type text NOT NULL,
    options jsonb DEFAULT '[]'::jsonb,
    order_number integer NOT NULL,
    is_required boolean DEFAULT false,
    additional_settings jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT form_question_pkey PRIMARY KEY (id)
);

CREATE TABLE public.form_response (
    id serial NOT NULL,
    form_id integer NOT NULL,
    user_id integer NOT NULL,
    responses jsonb NOT NULL,
    submitted_on timestamp with time zone,
    CONSTRAINT form_response_pkey PRIMARY KEY (id)
);

CREATE TABLE public.job_application (
    id serial NOT NULL,
    user_id integer NOT NULL,
    job_post_id integer NOT NULL,
    created_on timestamp with time zone,
    CONSTRAINT job_application_pkey PRIMARY KEY (id)
);

CREATE TABLE public.job_post (
    id serial NOT NULL,
    title text NOT NULL,
    job_post_status text NOT NULL,
    employment_type text NOT NULL,
    job_description text NOT NULL,
    minimum_qualification text,
    workplace_type text,
    industry text,
    application_deadline date NOT NULL,
    no_of_vacancies integer,
    minimum_salary numeric,
    maximum_salary numeric,
    organization_id integer,
    created_by integer,
    created_on timestamp with time zone,
    CONSTRAINT job_post_pkey PRIMARY KEY (id)
);

CREATE TABLE public.judge (
    id integer NOT NULL DEFAULT nextval('speaker_id_seq'::regclass),
    name character varying(255) NOT NULL,
    designation text,
    description text,
    agenda_id integer,
    event_id integer,
    image text,
    CONSTRAINT judge_pkey PRIMARY KEY (id)
);

CREATE TABLE public.organization (
    id serial NOT NULL,
    name character varying(255) NOT NULL,
    organization_description text,
    logo text,
    no_of_employees integer,
    website_url text,
    industry_category text,
    created_by integer,
    created_on timestamp with time zone,
    CONSTRAINT organization_pkey PRIMARY KEY (id)
);

CREATE TABLE public.speaker (
    id serial NOT NULL,
    name character varying(255) NOT NULL,
    designation text,
    description text,
    agenda_id integer,
    event_id integer,
    image text,
    CONSTRAINT speaker_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_profile (
    id serial NOT NULL,
    display_name character varying(255),
    gender character varying(255),
    date_of_birth timestamp with time zone,
    user_location character varying(255),
    profile_desc text,
    user_id integer,
    language character varying(255),
    profile_img text,
    CONSTRAINT user_profile_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users (
    id serial NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone_number character varying(20),
    user_type character varying(20) NOT NULL,
    created_on timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE certification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(255),
    credential_url TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_certification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_cert
        UNIQUE (user_id, certification_name, issuing_organization)
);

CREATE TABLE education_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    education_level VARCHAR(100),
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    education_status VARCHAR(50), -- e.g., "Ongoing", "Completed"
    grade VARCHAR(50),
    activities TEXT,
    description TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_education_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_education
        UNIQUE (user_id, institution_name, degree, field_of_study),

    -- 1. Enforce rules based on status
    CONSTRAINT chk_ongoing_status
        CHECK (
            (education_status = 'Ongoing' AND end_date IS NULL)
            OR
            (education_status <> 'Ongoing' AND end_date IS NOT NULL)
        ),

    -- 2. Ensure start_date is not after end_date (only if end_date is provided)
    CONSTRAINT chk_date_order
        CHECK (
            end_date IS NULL OR start_date <= end_date
        )
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT
);

-- Enforce case-insensitive uniqueness on skill name
CREATE UNIQUE INDEX unique_skill_name_lower ON skills (LOWER(name));


ALTER TABLE public.agenda
    ADD CONSTRAINT agenda_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.attendance
    ADD CONSTRAINT attendance_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.attendance
    ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.certification
    ADD CONSTRAINT certification_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.event
    ADD CONSTRAINT event_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

ALTER TABLE public.event_collaborator
    ADD CONSTRAINT event_collaborator_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.event_collaborator
    ADD CONSTRAINT event_collaborator_organization_id_fkey FOREIGN KEY (organization_id)
    REFERENCES public.organization (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.event_organizer
    ADD CONSTRAINT event_organizer_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.event_organizer
    ADD CONSTRAINT event_organizer_organizer_id_fkey FOREIGN KEY (organizer_id)
    REFERENCES public.organization (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.event_partner
    ADD CONSTRAINT event_partner_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.event_partner
    ADD CONSTRAINT event_partner_organization_id_fkey FOREIGN KEY (organization_id)
    REFERENCES public.organization (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.event_sponsor
    ADD CONSTRAINT event_sponsor_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.event_sponsor
    ADD CONSTRAINT event_sponsor_organization_id_fkey FOREIGN KEY (organization_id)
    REFERENCES public.organization (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.form
    ADD CONSTRAINT form_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

ALTER TABLE public.form
    ADD CONSTRAINT form_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

ALTER TABLE public.form_question
    ADD CONSTRAINT form_question_form_id_fkey FOREIGN KEY (form_id)
    REFERENCES public.form (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.form_response
    ADD CONSTRAINT form_response_form_id_fkey FOREIGN KEY (form_id)
    REFERENCES public.form (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.form_response
    ADD CONSTRAINT form_response_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

ALTER TABLE public.job_application
    ADD CONSTRAINT job_application_job_post_id_fkey FOREIGN KEY (job_post_id)
    REFERENCES public.job_post (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.job_application
    ADD CONSTRAINT job_application_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.job_post
    ADD CONSTRAINT job_post_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.job_post
    ADD CONSTRAINT job_post_organization_id_fkey FOREIGN KEY (organization_id)
    REFERENCES public.organization (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.judge
    ADD CONSTRAINT judge_agenda_id_fkey FOREIGN KEY (agenda_id)
    REFERENCES public.agenda (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.judge
    ADD CONSTRAINT judge_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.organization
    ADD CONSTRAINT organization_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

ALTER TABLE public.speaker
    ADD CONSTRAINT speaker_agenda_id_fkey FOREIGN KEY (agenda_id)
    REFERENCES public.agenda (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.speaker
    ADD CONSTRAINT speaker_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.event (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.user_profile
    ADD CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE certification
    ADD COLUMN has_expiration_date BOOLEAN DEFAULT FALSE;


END;