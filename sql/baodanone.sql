-- ============================================================
-- 无忧两全保险 - 投保申请相关表（基于 baodanone.vue）
-- 字符集: utf8mb4 | 引擎: InnoDB
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------
-- 1. 投保申请主表（投保方案 + 流程状态）
-- -----------------------------------------------------------
DROP TABLE IF EXISTS `insurance_beneficiary`;
DROP TABLE IF EXISTS `insurance_insured`;
DROP TABLE IF EXISTS `insurance_holder`;
DROP TABLE IF EXISTS `insurance_application`;

CREATE TABLE `insurance_application` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `member_id`       BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `product_name`    VARCHAR(100)    NOT NULL DEFAULT '无忧两全保险' COMMENT '投保产品',
  `annual_premium`  VARCHAR(50)     NOT NULL DEFAULT '1万元' COMMENT '年交保费（展示值）',
  `payment_term`    VARCHAR(20)     NOT NULL DEFAULT '10年' COMMENT '交费年限',
  `coverage_term`   VARCHAR(20)     NOT NULL DEFAULT '10年' COMMENT '保险期间',
  `agreed_terms`    TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '是否同意条款 0否 1是',
  `current_step`    TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '当前步骤 1填写资料 2提交资料 3上传体检 4审核 5缴纳保费',
  `status`          TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '申请状态 0草稿 1已提交 2审核中 3已通过 4已驳回',
  `order_no`        VARCHAR(32)     DEFAULT NULL COMMENT '订单号',
  `policy_no`       VARCHAR(32)     DEFAULT NULL COMMENT '电子保单号',
  `paper_policy_no` VARCHAR(32)     DEFAULT NULL COMMENT '纸质保单号',
  `app_date`        DATE            DEFAULT NULL COMMENT '投保日期',
  `effective_date`  DATE            DEFAULT NULL COMMENT '保单生效日',
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  UNIQUE KEY `uk_policy_no` (`policy_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='保险投保申请主表';

-- -----------------------------------------------------------
-- 2. 投保人信息表（与申请 1:1）
-- 对应字段: holder.name / idType / idNo / phone / birthday / gender
-- -----------------------------------------------------------
CREATE TABLE `insurance_holder` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `member_id`       BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `application_id`  BIGINT UNSIGNED NOT NULL COMMENT '投保申请ID',
  `name`            VARCHAR(50)     NOT NULL DEFAULT '' COMMENT '姓名',
  `id_type`         TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '证件类型 1身份证 2护照 3港澳通行证 4台湾通行证',
  `id_no`           VARCHAR(32)     NOT NULL DEFAULT '' COMMENT '证件号码',
  `phone`           VARCHAR(20)     NOT NULL DEFAULT '' COMMENT '手机号码',
  `birthday`        DATE            DEFAULT NULL COMMENT '出生日期',
  `gender`          TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '性别 1男 2女',
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_application_id` (`application_id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_id_no` (`id_no`),
  KEY `idx_phone` (`phone`),
  CONSTRAINT `fk_holder_application`
    FOREIGN KEY (`application_id`) REFERENCES `insurance_application` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='投保人信息表';

-- -----------------------------------------------------------
-- 3. 被保险人信息表（与申请 1:N，支持添加多个）
-- 对应字段: insuredList[].name / idType / idNo / phone / birthday / gender
-- -----------------------------------------------------------
CREATE TABLE `insurance_insured` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `member_id`       BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `application_id`  BIGINT UNSIGNED NOT NULL COMMENT '投保申请ID',
  `sort_order`      TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '序号（页面第几个被保险人）',
  `name`            VARCHAR(50)     NOT NULL DEFAULT '' COMMENT '姓名',
  `id_type`         TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '证件类型 1身份证 2护照 3港澳通行证 4台湾通行证',
  `id_no`           VARCHAR(32)     NOT NULL DEFAULT '' COMMENT '证件号码',
  `phone`           VARCHAR(20)     NOT NULL DEFAULT '' COMMENT '手机号码',
  `birthday`        DATE            DEFAULT NULL COMMENT '出生日期',
  `gender`          TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '性别 1男 2女',
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_application_sort` (`application_id`, `sort_order`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_id_no` (`id_no`),
  CONSTRAINT `fk_insured_application`
    FOREIGN KEY (`application_id`) REFERENCES `insurance_application` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='被保险人信息表';

-- -----------------------------------------------------------
-- 4. 受益人信息表（与申请 1:N，收益比例合计须为100%）
-- 对应字段: beneficiaryList[].relation / name / idNo / ratio
-- -----------------------------------------------------------
CREATE TABLE `insurance_beneficiary` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `member_id`       BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `application_id`  BIGINT UNSIGNED NOT NULL COMMENT '投保申请ID',
  `sort_order`      TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '序号（页面第几个受益人）',
  `relation`        TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '与被保人关系 1配偶 2子女 3父母 4兄弟姐妹 5其他',
  `name`            VARCHAR(50)     NOT NULL DEFAULT '' COMMENT '受益人姓名',
  `id_no`           VARCHAR(32)     NOT NULL DEFAULT '' COMMENT '证件号码',
  `benefit_ratio`   DECIMAL(5,2)    NOT NULL DEFAULT 100.00 COMMENT '收益比例(%)',
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_application_sort` (`application_id`, `sort_order`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_id_no` (`id_no`),
  CONSTRAINT `fk_beneficiary_application`
    FOREIGN KEY (`application_id`) REFERENCES `insurance_application` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='受益人信息表';

SET FOREIGN_KEY_CHECKS = 1;
