-- ─────────────────────────────────────────────
-- Signal Theory — Supabase Schema
-- Run this in the Supabase SQL editor
-- ─────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Quiz Profiles (from web quiz)
-- ─────────────────────────────────────────────

create table if not exists quiz_profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  profile_type text not null,
  signal_score int default 5 check (signal_score between 1 and 10),
  readiness_score int default 5 check (readiness_score between 1 and 10),
  strategy_score int default 5 check (strategy_score between 1 and 10),
  weak_questions jsonb default '[]',
  action_plan_practices jsonb default '[]',
  quiz_completed_at timestamptz default now(),
  app_linked_at timestamptz
);

-- ─────────────────────────────────────────────
-- Users (extends auth.users)
-- ─────────────────────────────────────────────

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  profile_type text default 'unknown',
  subscription_status text default 'free' check (subscription_status in ('free', 'monthly', 'annual')),
  scenarios_used_week int default 0,
  analyses_used_week int default 0,
  week_reset_at timestamptz default now(),
  quiz_profile_id uuid references quiz_profiles(id),
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Scenarios
-- ─────────────────────────────────────────────

create table if not exists scenarios (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  options jsonb not null,           -- ScenarioOption[]
  correct_signal_state text not null check (correct_signal_state in ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'AMBIGUOUS')),
  category text not null check (category in ('texting', 'in-person', 'app-based')),
  difficulty text not null default 'basic' check (difficulty in ('basic', 'intermediate', 'advanced')),
  target_dimensions text[] default '{}',
  target_profiles text[] default '{}',
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Scenario Results
-- ─────────────────────────────────────────────

create table if not exists scenario_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  scenario_id uuid references scenarios(id),
  selected_option int not null,
  was_correct boolean not null,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Analyses
-- ─────────────────────────────────────────────

create table if not exists analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  input_text text not null,
  signal_state text check (signal_state in ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'AMBIGUOUS')),
  ai_response jsonb,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- RLS Policies
-- ─────────────────────────────────────────────

alter table users enable row level security;
alter table scenario_results enable row level security;
alter table analyses enable row level security;
alter table scenarios enable row level security;
alter table quiz_profiles enable row level security;

-- Users
create policy "Users can read own data"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own data"
  on users for update
  using (auth.uid() = id);

create policy "Users can insert own row"
  on users for insert
  with check (auth.uid() = id);

-- Scenario results
create policy "Users can read own results"
  on scenario_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own results"
  on scenario_results for insert
  with check (auth.uid() = user_id);

-- Analyses
create policy "Users can read own analyses"
  on analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on analyses for insert
  with check (auth.uid() = user_id);

-- Scenarios (public read)
create policy "Anyone can read scenarios"
  on scenarios for select
  using (true);

-- Quiz profiles (users can read their own linked profile)
create policy "Users can read linked quiz profile"
  on quiz_profiles for select
  using (
    id in (
      select quiz_profile_id from users where id = auth.uid()
    )
  );

-- Service role can link quiz profiles
create policy "Service role can update quiz profiles"
  on quiz_profiles for update
  using (true);

-- ─────────────────────────────────────────────
-- Atomic increment functions (avoid race conditions)
-- ─────────────────────────────────────────────

create or replace function increment_scenarios_used(user_id_arg uuid)
returns void
language plpgsql
security definer
as $$
begin
  update users
  set scenarios_used_week = scenarios_used_week + 1
  where id = user_id_arg;
end;
$$;

create or replace function increment_analyses_used(user_id_arg uuid)
returns void
language plpgsql
security definer
as $$
begin
  update users
  set analyses_used_week = analyses_used_week + 1
  where id = user_id_arg;
end;
$$;

-- ─────────────────────────────────────────────
-- Useful views
-- ─────────────────────────────────────────────

create or replace view user_stats as
select
  u.id,
  u.email,
  u.profile_type,
  u.subscription_status,
  u.scenarios_used_week,
  u.analyses_used_week,
  count(distinct sr.id) as total_scenarios,
  count(distinct sr.id) filter (where sr.was_correct) as total_correct,
  case
    when count(distinct sr.id) = 0 then 0
    else round(count(distinct sr.id) filter (where sr.was_correct)::numeric / count(distinct sr.id) * 100)
  end as accuracy_pct
from users u
left join scenario_results sr on sr.user_id = u.id
group by u.id;
