CREATE TABLE t_p93119858_vk_lp_bot.bot_config (
  id SERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL,
  group_name TEXT,
  token_set BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p93119858_vk_lp_bot.moderators (
  id SERIAL PRIMARY KEY,
  vk_id BIGINT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'trusted',
  is_active BOOLEAN DEFAULT TRUE,
  actions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p93119858_vk_lp_bot.mod_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  target_vk_id BIGINT,
  target_name TEXT,
  moderator_vk_id BIGINT,
  moderator_name TEXT,
  reason TEXT,
  chat_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mod_logs_created_at ON t_p93119858_vk_lp_bot.mod_logs(created_at DESC);
CREATE INDEX idx_mod_logs_action ON t_p93119858_vk_lp_bot.mod_logs(action);
