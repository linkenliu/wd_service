/*
 Navicat Premium Data Transfer

 Source Server         : testdb
 Source Server Type    : MySQL
 Source Server Version : 50713
 Source Host           : localhost
 Source Database       : jctvDB

 Target Server Type    : MySQL
 Target Server Version : 50713
 File Encoding         : utf-8

 Date: 08/18/2016 19:10:20 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `channel`
-- ----------------------------
DROP TABLE IF EXISTS `channel`;
CREATE TABLE `channel` (
  `chid` int(11) NOT NULL,
  `sid` int(11) DEFAULT NULL,
  `editor_id` varchar(32) DEFAULT NULL,
  `source` varchar(100) NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `users` char(20) DEFAULT '0',
  `description` text,
  `language` varchar(30) DEFAULT '',
  `state` int(11) DEFAULT '1',
  `release_state` int(1) DEFAULT '1',
  `create_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`chid`),
  KEY `chid_index` (`chid`),
  KEY `editor_id_index` (`editor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `channel`
-- ----------------------------
BEGIN;
INSERT INTO `channel` VALUES ('1222', '11500', 'gmchannel', 'tvbus://1PhqnvNgb6iqRvTvnSe4Ho4PKPnUoxcVMcaLmh4Jig1f73K2Tz', '体育', 'CCTV5', '332', '', 'zh', '1', '1', '2016-08-16 13:25:00', '2016-08-16 13:25:00'), ('1223', '11510', 'gmchannel', 'tvbus://1493hBN9eaBVUkbyKigaRPTscFiwqD1GdSkf8pRJS2NUWTd7NK', '体育', '五星体育', '340', '', 'zh', '0', '1', '2016-08-16 11:34:00', '2016-08-16 11:34:00'), ('1225', '11530', 'gmchannel', 'tvbus://1DxqALrfeJV6b7zeCR6dFKFoTeJXZX9L7z5yArAny9Lynzav9g', '体育', '劲爆体育 HD', '21', '', 'zh', '1', '1', '2016-08-16 11:34:00', '2016-08-16 11:34:00'), ('1226', '11540', 'gmchannel', 'tvbus://12JZnYpvmdc7CAMX6VVfK9V6AVHCzdhXZw9t7LBhes9D1kniyLa', '体育', '新视觉', '32', '', 'zh', '1', '1', '2016-08-16 11:34:00', '2016-08-16 11:34:00'), ('1228', '11501', 'gmchannel', 'tvbus://1nLRk7bAkx5UbEj8gr8be1UYPJq5amxqNQixjcZjHcFn8qb2yT', '', 'CCTV5+', '51', '', 'zh', '1', '1', '2016-08-16 11:34:00', '2016-08-16 11:34:00'), ('1229', '11570', 'gmchannel', 'tvbus://1u2jLxpZyYLQsBjsDFUynQuZj38qVcAP1XHUcapQS4RKZ5G5oA', '体育', 'BTV', '20', '', 'zh', '1', '1', '2016-08-16 11:34:00', '2016-08-16 11:34:00'), ('1242', '11670', 'gmchannel1', 'tvbus://125yMAWEtSFbdvUbZh1AKhyjNV6At2dAVrGQhuZgjrdFYLjgenh', '', '广东体育', '15', '', 'zh', '1', '1', '2016-08-18 14:23:00', '2016-08-18 14:23:00');
COMMIT;

-- ----------------------------
--  Table structure for `channel_history`
-- ----------------------------
DROP TABLE IF EXISTS `channel_history`;
CREATE TABLE `channel_history` (
  `id` varchar(32) NOT NULL,
  `chid` int(11) NOT NULL,
  `users` varchar(50) DEFAULT '0' COMMENT '观看人数',
  `qs` varchar(11) NOT NULL,
  `qc` varchar(11) NOT NULL DEFAULT '0',
  `screenshot_small` varchar(100) DEFAULT NULL,
  `screenshot` varchar(100) DEFAULT '',
  `state` int(1) DEFAULT '1',
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chid_index` (`chid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `channel_history`


-- ----------------------------
--  Table structure for `editor`
-- ----------------------------
DROP TABLE IF EXISTS `editor`;
CREATE TABLE `editor` (
  `id` varchar(32) NOT NULL,
  `name` varchar(30) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '',
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `picture` varchar(40) NOT NULL DEFAULT '',
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  `state` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_index` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `editor`
-- ----------------------------
BEGIN;
INSERT INTO `editor` VALUES ('681723b0651e11e6821213af5d644ffc', '大白', 'd28e9def2fe0cb9541b7240817a5659e', '', '', '', '2016-08-18 16:33:15', '2016-08-18 16:33:18', '1'), ('8604cf30606e11e6b102378d2161d82c', 'admin', 'd5944aa50d6e5138760659970bfd8339', '13245632891', 'admin@qq.com', '', '2016-08-12 17:24:09', '2016-08-18 17:01:53', '1'), ('f7a99f405e4211e6a647693ffc186c86', 'linken', 'a4e3de66e761519cd105ea8e6a31aa5d', '199999', 'a@qq.com', '', '2016-08-09 23:07:19', '2016-08-18 16:16:35', '1');
COMMIT;

-- ----------------------------
--  Table structure for `epg`
-- ----------------------------
DROP TABLE IF EXISTS `epg`;
CREATE TABLE `epg` (
  `epg_id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` int(11) NOT NULL,
  `editor_id` varchar(32) DEFAULT NULL,
  `state` int(11) NOT NULL DEFAULT '1',
  `name` varchar(100) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`epg_id`),
  KEY `epg_id_index` (`epg_id`),
  KEY `channel_id_index` (`channel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `epg`
-- ----------------------------
BEGIN;
INSERT INTO `epg` VALUES ('10', '1222', 'f7a99f405e4211e6a647693ffc186c86', '1', '节目2123', '2016-08-20 00:00:00', '2016-08-27 00:00:00', '2016-08-12 15:21:06', '2016-08-15 16:11:34'), ('11', '1223', 'f7a99f405e4211e6a647693ffc186c86', '1', '节目3', '2016-08-12 15:22:19', '2016-08-27 00:00:00', '2016-08-12 15:22:23', '2016-08-16 09:56:38'), ('14', '1228', 'f7a99f405e4211e6a647693ffc186c86', '1', '123', '2016-08-10 00:00:00', '2016-08-17 00:00:00', '2016-08-12 16:08:24', '2016-08-12 16:08:24'), ('15', '1223', 'f7a99f405e4211e6a647693ffc186c86', '1', '99', '2016-08-15 21:39:12', '2016-08-19 00:00:00', '2016-08-15 21:39:15', '2016-08-16 13:18:06'), ('16', '1225', 'f7a99f405e4211e6a647693ffc186c86', '1', '9', '2016-08-15 00:00:00', '2016-08-16 00:00:00', '2016-08-15 21:53:27', '2016-08-16 09:51:23'), ('23', '1225', 'f7a99f405e4211e6a647693ffc186c86', '1', '99', '2016-08-16 09:58:04', '2016-08-17 00:00:00', '2016-08-16 09:58:07', '2016-08-16 09:58:07');
COMMIT;

-- ----------------------------
--  Table structure for `message`
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `editor_id` varchar(32) DEFAULT NULL,
  `type` int(1) NOT NULL DEFAULT '0' COMMENT '0表示全部用户   1表示单个用户',
  `message` varchar(3000) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '1',
  `create_date` datetime NOT NULL,
  `release_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `message`
-- ----------------------------
BEGIN;
INSERT INTO `message` VALUES ('ab191c8062ae11e6856f338b7047adce', 'a39d37c062ae11e6856f338b7047adce', 'f7a99f405e4211e6a647693ffc186c86', '1', '第一条消息', '1', '2016-08-15 14:08:21', null), ('ec959380653011e69dfe7f0854bec453', '1002', 'f7a99f405e4211e6a647693ffc186c86', '1', '1', '1', '2016-08-18 18:45:48', null), ('ee6cd44062ae11e6856f338b7047adce', null, 'f7a99f405e4211e6a647693ffc186c86', '0', '全部消息', '1', '2016-08-15 14:10:14', null);
COMMIT;

-- ----------------------------
--  Table structure for `right`
-- ----------------------------
DROP TABLE IF EXISTS `right`;
CREATE TABLE `right` (
  `right_id` varchar(32) NOT NULL,
  `right_name` varchar(50) NOT NULL,
  `right_node` varchar(50) NOT NULL,
  `right_path` varchar(50) NOT NULL,
  `right_parent_id` varchar(32) DEFAULT NULL,
  `is_parent` int(1) DEFAULT '0',
  `icon` varchar(50) DEFAULT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`right_id`),
  KEY `right_id_index` (`right_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `right`
-- ----------------------------
BEGIN;
INSERT INTO `right` VALUES ('138f40a0651611e683e16f3d73474d5a', '菜单列表', 'RIGHT_LIST', '/admin/rightList', 'ba6b6da0651511e683e16f3d73474d5a', '0', 'icon-list-alt', '3', '2016-08-18 15:33:37'), ('37d6f8e0651611e683e16f3d73474d5a', '活跃度', 'ACTIVE_LIST', '/admin/activeList', null, '1', 'icon-tumblr', '3', '2016-08-18 15:34:38'), ('6a3d95f0644911e6b904f3aa2d8be3fc', '频道管理', 'CHANNEL_MANAGER', '', null, '1', 'tasks', '1', '2016-08-17 15:08:35'), ('6adfcfb0651511e683e16f3d73474d5a', '电视墙', 'CHANNEL_SCREENSHOT', '/admin/channelScreenshot', '6a3d95f0644911e6b904f3aa2d8be3fc', '0', 'icon-check-empty', '2', '2016-08-18 15:28:54'), ('88abb150645511e69871f130975b6e20', '统计信息', 'CHANNEL_SPSS', '/admin/channelSPSS', '6a3d95f0644911e6b904f3aa2d8be3fc', '0', 'icon-leaf', '1', '2016-08-17 16:35:20'), ('907ae750653311e6a24f0522dc82bac5', '系统概述', 'SYSTEM_SUMMARY', '/admin/index', null, '1', 'icon-home', '-1', '2016-08-18 19:04:42'), ('ba6b6da0651511e683e16f3d73474d5a', '系统设置', 'SYSTEM_SET', '', null, '1', 'icon-cog', '4', '2016-08-18 15:31:07'), ('d4d0a160651511e683e16f3d73474d5a', '小编列表', 'EDITOR_LIST', '/admin/editorList', 'ba6b6da0651511e683e16f3d73474d5a', '0', 'icon-user', '0', '2016-08-18 15:31:52'), ('ed2fede0646311e6b267777df8f4d36e', '消息列表', 'MESSAGE_LIST', '/admin/messageList', null, '1', 'icon-envelope-alt', '2', '2016-08-17 18:18:22'), ('ee3ecaf0651511e683e16f3d73474d5a', '角色列表', 'ROLE_LIST', '/admin/roleList', 'ba6b6da0651511e683e16f3d73474d5a', '0', 'icon-tint', '1', '2016-08-18 15:32:34'), ('f564e840644911e6a41f477d4c5cb313', '频道列表', 'CHANNEL_LIST', '/admin/channelList', '6a3d95f0644911e6b904f3aa2d8be3fc', '0', 'icon-youtube-play', '0', '2016-08-17 15:12:29'), ('fa34c530645c11e6a58539bf5974e2f4', '用户列表', 'USER_LIST', '/admin/userList', null, '1', 'icon-user', '0', '2016-08-17 17:28:37');
COMMIT;

-- ----------------------------
--  Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `role_id` varchar(32) NOT NULL,
  `role_name` varchar(30) NOT NULL,
  `role_node` varchar(255) NOT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`role_id`),
  KEY `role_id_index` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `role`
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES ('02c1c30064e511e6abf85743c5767992', '管理员', 'ADMIN', '2016-08-18 09:42:23'), ('ad0212c0645911e686de03bb92cc516a', '超级管理员', 'SUPER_ADMIN', '2016-08-17 17:04:59');
COMMIT;

-- ----------------------------
--  Table structure for `role_right`
-- ----------------------------
DROP TABLE IF EXISTS `role_right`;
CREATE TABLE `role_right` (
  `role_right_id` varchar(32) NOT NULL,
  `role_id` varchar(32) NOT NULL,
  `right_id` varchar(32) NOT NULL,
  `state` int(1) DEFAULT '1',
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`role_right_id`),
  KEY `role_id_index` (`role_id`),
  KEY `right_id_index` (`right_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `role_right`
-- ----------------------------
BEGIN;
INSERT INTO `role_right` VALUES ('3702dbd0651d11e6bd1a55f4c6763d0a', '02c1c30064e511e6abf85743c5767992', 'fa34c530645c11e6a58539bf5974e2f4', '1', '2016-08-18 16:24:43'), ('370302e0651d11e6bd1a55f4c6763d0a', '02c1c30064e511e6abf85743c5767992', '6a3d95f0644911e6b904f3aa2d8be3fc', '1', '2016-08-18 16:24:43'), ('370302e1651d11e6bd1a55f4c6763d0a', '02c1c30064e511e6abf85743c5767992', 'f564e840644911e6a41f477d4c5cb313', '1', '2016-08-18 16:24:43'), ('370302e2651d11e6bd1a55f4c6763d0a', '02c1c30064e511e6abf85743c5767992', '88abb150645511e69871f130975b6e20', '1', '2016-08-18 16:24:43'), ('370302e3651d11e6bd1a55f4c6763d0a', '02c1c30064e511e6abf85743c5767992', '6adfcfb0651511e683e16f3d73474d5a', '1', '2016-08-18 16:24:43'), ('370302e4651d11e6bd1a55f4c6763d0a', '02c1c30064e511e6abf85743c5767992', 'ed2fede0646311e6b267777df8f4d36e', '1', '2016-08-18 16:24:43'), ('a6b53610653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', '907ae750653311e6a24f0522dc82bac5', '1', '2016-08-18 19:05:19'), ('a6b5ab40653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', 'fa34c530645c11e6a58539bf5974e2f4', '1', '2016-08-18 19:05:19'), ('a6b5d250653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', '6a3d95f0644911e6b904f3aa2d8be3fc', '1', '2016-08-18 19:05:19'), ('a6b5d251653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', 'f564e840644911e6a41f477d4c5cb313', '1', '2016-08-18 19:05:19'), ('a6b5d252653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', '88abb150645511e69871f130975b6e20', '1', '2016-08-18 19:05:19'), ('a6b5d253653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', '6adfcfb0651511e683e16f3d73474d5a', '1', '2016-08-18 19:05:19'), ('a6b5f960653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', 'ed2fede0646311e6b267777df8f4d36e', '1', '2016-08-18 19:05:19'), ('a6b5f961653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', '37d6f8e0651611e683e16f3d73474d5a', '1', '2016-08-18 19:05:19'), ('a6b62070653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', 'ba6b6da0651511e683e16f3d73474d5a', '1', '2016-08-18 19:05:19'), ('a6b62071653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', 'd4d0a160651511e683e16f3d73474d5a', '1', '2016-08-18 19:05:19'), ('a6b62072653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', 'ee3ecaf0651511e683e16f3d73474d5a', '1', '2016-08-18 19:05:19'), ('a6b64780653311e6bec2a117c26c43da', 'ad0212c0645911e686de03bb92cc516a', '138f40a0651611e683e16f3d73474d5a', '1', '2016-08-18 19:05:19');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int(50) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(50) NOT NULL,
  `editor_id` varchar(50) DEFAULT '',
  `user_name` varchar(30) NOT NULL,
  `password` varchar(30) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(30) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `gender` int(1) NOT NULL DEFAULT '1' COMMENT '1表示男    0表示女',
  `state` int(1) NOT NULL DEFAULT '1',
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `user_id_index` (`user_id`),
  KEY `editor_id_index` (`editor_id`),
  KEY `edvice_id_index` (`device_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1003 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1001', '1234567890', 'f7a99f405e4211e6a647693ffc186c86', 'linkenliu', null, '15618788231', '', '', '1', '1', '2016-08-15 14:08:09', '2016-08-15 14:08:09');
COMMIT;

-- ----------------------------
--  Table structure for `user_money`
-- ----------------------------
DROP TABLE IF EXISTS `user_money`;
CREATE TABLE `user_money` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `user_id` varchar(50) NOT NULL COMMENT '用户id',
  `money` varchar(20) NOT NULL COMMENT '钱',
  `start_date` datetime NOT NULL COMMENT '续费开始时间',
  `end_date` datetime NOT NULL COMMENT '续费结束时间',
  `state` int(11) NOT NULL DEFAULT '1' COMMENT '状态',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `update_date` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY `user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `user_money`
-- ----------------------------
BEGIN;
INSERT INTO `user_money` VALUES ('c00a979062ae11e6856f338b7047adce', 'a39d37c062ae11e6856f338b7047adce', '299', '2016-08-15 14:08:54', '2016-08-20 00:00:00', '1', '2016-08-15 14:08:56', '2016-08-15 14:12:12'), ('f9755270653011e69dfe7f0854bec453', '1001', '198', '2016-08-18 00:00:00', '2016-08-26 00:00:00', '1', '2016-08-18 18:46:09', '2016-08-18 18:46:09');
COMMIT;

-- ----------------------------
--  Table structure for `user_role`
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `user_role_id` varchar(32) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `role_id` varchar(32) NOT NULL,
  `state` int(1) NOT NULL DEFAULT '1',
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`user_role_id`),
  KEY `user_id_index` (`user_id`),
  KEY `role_id_index` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `user_role`
-- ----------------------------
BEGIN;
INSERT INTO `user_role` VALUES ('3a4b3590650811e693de1993b87918f1', 'f7a99f405e4211e6a647693ffc186c86', 'ad0212c0645911e686de03bb92cc516a', '1', '2016-08-18 13:54:29'), ('cf48e82064ec11e68bd601a36755f418', '8604cf30606e11e6b102378d2161d82c', '02c1c30064e511e6abf85743c5767992', '1', '2016-08-18 10:38:13');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
