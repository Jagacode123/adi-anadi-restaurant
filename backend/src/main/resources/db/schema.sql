-- ============================================================
-- Adi Anadi Restaurant — Database Schema
-- MySQL 8.x
-- Run once to create all tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS restaurant_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE restaurant_db;

-- ============================================================
-- roles
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(50)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    mobile        VARCHAR(15)  NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NULL     ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email  (email),
    UNIQUE KEY uq_users_mobile (mobile)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- user_roles (join table)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- restaurants
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurants (
    id                          BIGINT         NOT NULL AUTO_INCREMENT,
    name                        VARCHAR(200)   NOT NULL,
    logo_url                    VARCHAR(500)   NULL,
    phone                       VARCHAR(20)    NULL,
    email                       VARCHAR(150)   NULL,
    address                     TEXT           NULL,
    opening_time                TIME           NULL,
    closing_time                TIME           NULL,
    min_guests                  INT            NOT NULL DEFAULT 1,
    max_guests                  INT            NOT NULL DEFAULT 100,
    advance_payment_required    BOOLEAN        NOT NULL DEFAULT FALSE,
    advance_payment_percentage  DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    created_at                  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  DATETIME       NULL     ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- menu_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_categories (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    restaurant_id BIGINT       NOT NULL,
    name          VARCHAR(100) NOT NULL,
    description   VARCHAR(300) NULL,
    display_order INT          NOT NULL DEFAULT 0,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NULL     ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_mc_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- menu_items
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id            BIGINT         NOT NULL AUTO_INCREMENT,
    category_id   BIGINT         NOT NULL,
    name          VARCHAR(200)   NOT NULL,
    description   TEXT           NULL,
    price         DECIMAL(10,2)  NOT NULL,
    image_url     VARCHAR(500)   NULL,
    is_vegetarian BOOLEAN        NOT NULL DEFAULT FALSE,
    is_available  BOOLEAN        NOT NULL DEFAULT TRUE,
    display_order INT            NOT NULL DEFAULT 0,
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME       NULL     ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_mi_category FOREIGN KEY (category_id) REFERENCES menu_categories(id),
    INDEX idx_mi_category    (category_id),
    INDEX idx_mi_available   (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- extra_items
-- ============================================================
CREATE TABLE IF NOT EXISTS extra_items (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    name         VARCHAR(200)  NOT NULL,
    description  VARCHAR(300)  NULL,
    price        DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NULL     ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id                   BIGINT        NOT NULL AUTO_INCREMENT,
    order_number         VARCHAR(20)   NOT NULL,
    customer_id          BIGINT        NOT NULL,
    restaurant_id        BIGINT        NOT NULL,
    guest_count          INT           NOT NULL,
    booking_date         DATE          NOT NULL,
    booking_time         TIME          NOT NULL,
    special_instructions TEXT          NULL,
    subtotal             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    extra_total          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    grand_total          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status               ENUM('PENDING','APPROVED','REJECTED','CANCELLED','COMPLETED')
                                       NOT NULL DEFAULT 'PENDING',
    rejection_reason     TEXT          NULL,
    created_at           DATETIME      NOT NULL,
    updated_at           DATETIME      NULL     ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_order_number (order_number),
    CONSTRAINT fk_ord_customer   FOREIGN KEY (customer_id)   REFERENCES users(id),
    CONSTRAINT fk_ord_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    INDEX idx_ord_customer    (customer_id),
    INDEX idx_ord_status      (status),
    INDEX idx_ord_booking_date(booking_date),
    INDEX idx_ord_created_at  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    order_id     BIGINT        NOT NULL,
    menu_item_id BIGINT        NOT NULL,
    item_name    VARCHAR(200)  NOT NULL,
    quantity     INT           NOT NULL,
    unit_price   DECIMAL(10,2) NOT NULL,
    total_price  DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_oi_order     FOREIGN KEY (order_id)     REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_oi_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
    CONSTRAINT chk_oi_qty      CHECK (quantity > 0),
    INDEX idx_oi_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- order_extra_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_extra_items (
    id            BIGINT        NOT NULL AUTO_INCREMENT,
    order_id      BIGINT        NOT NULL,
    extra_item_id BIGINT        NOT NULL,
    item_name     VARCHAR(200)  NOT NULL,
    quantity      INT           NOT NULL,
    unit_price    DECIMAL(10,2) NOT NULL,
    total_price   DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_oei_order      FOREIGN KEY (order_id)      REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_oei_extra_item FOREIGN KEY (extra_item_id) REFERENCES extra_items(id),
    CONSTRAINT chk_oei_qty       CHECK (quantity > 0),
    INDEX idx_oei_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- order_status_history
-- ============================================================
CREATE TABLE IF NOT EXISTS order_status_history (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    order_id   BIGINT       NOT NULL,
    old_status VARCHAR(20)  NULL,
    new_status VARCHAR(20)  NOT NULL,
    changed_by BIGINT       NULL,
    reason     TEXT         NULL,
    changed_at DATETIME     NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_osh_order      FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_osh_changed_by FOREIGN KEY (changed_by) REFERENCES users(id),
    INDEX idx_osh_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    order_id       BIGINT        NOT NULL,
    amount         DECIMAL(10,2) NOT NULL,
    payment_method ENUM('ONLINE','CASH') NOT NULL DEFAULT 'CASH',
    payment_status ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(200)  NULL,
    paid_at        DATETIME      NULL,
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME      NULL     ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_payment_order (order_id),
    CONSTRAINT fk_pay_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       NOT NULL,
    order_id   BIGINT       NULL,
    title      VARCHAR(200) NOT NULL,
    message    TEXT         NOT NULL,
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_notif_user  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- customer_addresses
-- ============================================================
CREATE TABLE IF NOT EXISTS customer_addresses (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    user_id       BIGINT       NOT NULL,
    label         VARCHAR(50)  NULL,
    address_line1 VARCHAR(300) NULL,
    city          VARCHAR(100) NULL,
    state         VARCHAR(100) NULL,
    pincode       VARCHAR(10)  NULL,
    is_default    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_ca_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- time_slot_capacities
-- ============================================================
CREATE TABLE IF NOT EXISTS time_slot_capacities (
    id            BIGINT NOT NULL AUTO_INCREMENT,
    restaurant_id BIGINT NOT NULL,
    slot_time     TIME   NOT NULL,
    max_guests    INT    NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tsc_restaurant_slot (restaurant_id, slot_time),
    CONSTRAINT fk_tsc_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
