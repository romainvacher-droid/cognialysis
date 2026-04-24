-- Schéma de données PostgreSQL pour CognIAlysys

CREATE TABLE ia_profiles (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    model_name TEXT NOT NULL,
    big_five JSONB,
    mbti TEXT,
    horoscope JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB
);

CREATE TABLE user_horoscopes (
    user_id UUID PRIMARY KEY,
    sign TEXT NOT NULL,
    element TEXT,
    modality TEXT,
    trait_weights JSONB,
    fetched_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE matches (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES user_horoscopes(user_id),
    ia_profile_id UUID REFERENCES ia_profiles(id),
    score NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table de poids Big Five pour chaque signe
CREATE TABLE big_five_weights (
    sign TEXT PRIMARY KEY,
    openness NUMERIC,
    conscientiousness NUMERIC,
    extraversion NUMERIC,
    agreeableness NUMERIC,
    neuroticism NUMERIC
);

