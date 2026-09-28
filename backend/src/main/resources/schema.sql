-- =============================================================================
-- contact_messages — the only table this application owns.
--
-- Applied automatically on first run when JPA_DDL_AUTO=update (the local
-- default). For production, set JPA_DDL_AUTO=validate and run this script once
-- against the target database.
-- =============================================================================

CREATE TABLE IF NOT EXISTS contact_messages (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(254) NOT NULL,
    message    TEXT         NOT NULL,
    created_at DATETIME(6)  NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_contact_messages_created_at (created_at)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
