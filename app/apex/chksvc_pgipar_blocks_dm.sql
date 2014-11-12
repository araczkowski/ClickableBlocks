--------------------------------------------------------
--  DDL for Sequence PGIPAR_BLO_PK_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "PGIPAR_BLO_PK_SEQ"  MINVALUE 1 MAXVALUE 999999999999999999999999999 INCREMENT BY 1 START WITH 21 CACHE 20 NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Sequence PGIPAR_BLO_RAN_PK_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "PGIPAR_BLO_RAN_PK_SEQ"  MINVALUE 1 MAXVALUE 999999999999999999999999999 INCREMENT BY 1 START WITH 41 CACHE 20 NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Sequence PGIPAR_RAN_PK_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "PGIPAR_RAN_PK_SEQ"  MINVALUE 1 MAXVALUE 999999999999999999999999999 INCREMENT BY 1 START WITH 101 CACHE 20 NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Sequence PRE_BLO_PK_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "PRE_BLO_PK_SEQ"  MINVALUE 1 MAXVALUE 999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Table PGIPAR_BLOCKS
--------------------------------------------------------

  CREATE TABLE "PGIPAR_BLOCKS"
   (	"PAR_BLO_ID" NUMBER,
	"PAR_BLO_CODE" VARCHAR2(100),
	"PAR_BLO_NAME" VARCHAR2(200),
	"PAR_BLO_TYPE" VARCHAR2(200),
	"PAR_BLO_VALUE" NUMBER,
	"PAR_BLO_COLOR_T" VARCHAR2(100),
	"PAR_BLO_COLOR_P" VARCHAR2(100),
	"PAR_BLO_COLOR_U" VARCHAR2(100),
	"PAR_BLO_ACTIVE" CHAR(1) DEFAULT 'Y',
	"PAR_BLO_CREATION_USER" VARCHAR2(100),
	"PAR_BLO_CREATION_DATE" DATE,
	"PAR_BLO_MODIFICATION_USER" VARCHAR2(100),
	"PAR_BLO_MODIFICATION_DATE" DATE
   ) ;
--------------------------------------------------------
--  DDL for Table PGIPAR_BLOCKS_RANGES
--------------------------------------------------------

  CREATE TABLE "PGIPAR_BLOCKS_RANGES"
   (	"PAR_BLO_RAN_ID" NUMBER,
	"PAR_BLO_RAN_BLO_ID" NUMBER,
	"PAR_BLO_RAN_RAN_ID" NUMBER,
	"PAR_BLO_RAN_START" NUMBER,
	"PAR_BLO_RAN_CREATION_USER" VARCHAR2(100),
	"PAR_BLO_RAN_CREATION_DATE" DATE,
	"PAR_BLO_RAN_MODIFICATION_USER" VARCHAR2(100),
	"PAR_BLO_RAN_MODIFICATION_DATE" DATE
   ) ;
--------------------------------------------------------
--  DDL for Table PGIPAR_RANGES
--------------------------------------------------------

  CREATE TABLE "PGIPAR_RANGES"
   (	"PAR_RAN_ID" NUMBER,
	"PAR_RAN_ORG_ID" NUMBER,
	"PAR_RAN_OPEN_FROM" NUMBER,
	"PAR_RAN_OPEN_TO" NUMBER,
	"PAR_RAN_VACATION" CHAR(1) DEFAULT 'N',
	"PAR_RAN_DAY_MON" CHAR(1),
	"PAR_RAN_DAY_TUE" CHAR(1),
	"PAR_RAN_DAY_WED" CHAR(1),
	"PAR_RAN_DAY_THU" CHAR(1),
	"PAR_RAN_DAY_FRI" CHAR(1),
	"PAR_RAN_DAY_SAT" CHAR(1),
	"PAR_RAN_DAY_SUN" CHAR(1),
	"PAR_RAN_ACTIVE" CHAR(1) DEFAULT 'Y',
	"PAR_RAN_CREATION_USER" VARCHAR2(100),
	"PAR_RAN_CREATION_DATE" DATE,
	"PAR_RAN_MODIFICATION_USER" VARCHAR2(100),
	"PAR_RAN_MODIFICATION_DATE" DATE
   ) ;
--------------------------------------------------------
--  DDL for Table PGIPRESENCES_BLOCKS
--------------------------------------------------------

  CREATE TABLE "PGIPRESENCES_BLOCKS"
   (	"PRE_BLO_ID" NUMBER,
	"PRE_BLO_BLO_ID" NUMBER,
	"PRE_BLO_PRE_ID" NUMBER,
	"PRE_BLO_CREATION_USER" VARCHAR2(100),
	"PRE_BLO_CREATION_DATE" DATE DEFAULT sysdate,
	"PRE_BLO_MODIFICATION_USER" VARCHAR2(100),
	"PRE_BLO_MODIFICATION_DATE" DATE DEFAULT sysdate
   ) ;
--------------------------------------------------------
--  DDL for Trigger PGIPAR_BLOCKS_AUDIT_TRG
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "PGIPAR_BLOCKS_AUDIT_TRG" BEFORE
  INSERT OR
  UPDATE ON PGIPAR_BLOCKS
    /** ============================================================================
    ** ==
    ** == Generated on: 2014-11-11 09:03:34
    ** == Contact: andrzej.raczkowski@ext.sigi.lu
    ** ==
    ** ========================================================================= */
    --
    REFERENCING NEW AS NEW OLD AS OLD FOR EACH ROW BEGIN IF INSERTING THEN
    --
    IF :NEW.PAR_BLO_ID IS NULL THEN
  SELECT PGIPAR_BLO_PK_SEQ.NEXTVAL INTO :NEW.PAR_BLO_ID FROM dual;
END IF;
--
SELECT NVL(v('USER'), USER),
  SYSDATE
INTO :NEW.PAR_BLO_CREATION_USER,
  :NEW.PAR_BLO_CREATION_DATE
FROM DUAL;
--
ELSIF UPDATING THEN
  --
  SELECT NVL(v('USER'), USER),
    SYSDATE
  INTO :NEW.PAR_BLO_MODIFICATION_USER,
    :NEW.PAR_BLO_MODIFICATION_DATE
  FROM DUAL;
  --
END IF;
END;
/
ALTER TRIGGER "PGIPAR_BLOCKS_AUDIT_TRG" ENABLE;
--------------------------------------------------------
--  DDL for Trigger PGIPAR_BLOCKS_RANGES_AUDIT_TRG
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "PGIPAR_BLOCKS_RANGES_AUDIT_TRG" BEFORE
  INSERT OR
  UPDATE ON PGIPAR_BLOCKS_RANGES
    /** ============================================================================
    ** ==
    ** == Generated on: 2014-11-11 09:03:34
    ** == Contact: andrzej.raczkowski@ext.sigi.lu
    ** ==
    ** ========================================================================= */
    --
    REFERENCING NEW AS NEW OLD AS OLD FOR EACH ROW BEGIN IF INSERTING THEN
    --
    IF :NEW.PAR_BLO_RAN_ID IS NULL THEN
  SELECT PGIPAR_BLO_RAN_PK_SEQ.NEXTVAL INTO :NEW.PAR_BLO_RAN_ID FROM dual;
END IF;
--
SELECT NVL(v('USER'), USER),
  SYSDATE
INTO :NEW.PAR_BLO_RAN_CREATION_USER,
  :NEW.PAR_BLO_RAN_CREATION_DATE
FROM DUAL;
--
ELSIF UPDATING THEN
  --
  SELECT NVL(v('USER'), USER),
    SYSDATE
  INTO :NEW.PAR_BLO_RAN_MODIFICATION_USER,
    :NEW.PAR_BLO_RAN_MODIFICATION_DATE
  FROM DUAL;
  --
END IF;
END;
/
ALTER TRIGGER "PGIPAR_BLOCKS_RANGES_AUDIT_TRG" ENABLE;
--------------------------------------------------------
--  DDL for Trigger PGIPAR_RANGES_AUDIT_TRG
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "PGIPAR_RANGES_AUDIT_TRG" BEFORE
  INSERT OR
  UPDATE ON PGIPAR_RANGES
    /** ============================================================================
    ** ==
    ** == Generated on: 2014-11-11 09:03:34
    ** == Contact: andrzej.raczkowski@ext.sigi.lu
    ** ==
    ** ========================================================================= */
    --
    REFERENCING NEW AS NEW OLD AS OLD FOR EACH ROW BEGIN IF INSERTING THEN
    --
    IF :NEW.PAR_RAN_ID IS NULL THEN
  SELECT PGIPAR_RAN_PK_SEQ.NEXTVAL INTO :NEW.PAR_RAN_ID FROM dual;
END IF;
--
SELECT NVL(v('USER'), USER),
  SYSDATE
INTO :NEW.PAR_RAN_CREATION_USER,
  :NEW.PAR_RAN_CREATION_DATE
FROM DUAL;
--
ELSIF UPDATING THEN
  --
  SELECT NVL(v('USER'), USER),
    SYSDATE
  INTO :NEW.PAR_RAN_MODIFICATION_USER,
    :NEW.PAR_RAN_MODIFICATION_DATE
  FROM DUAL;
  --
END IF;
END;
/
ALTER TRIGGER "PGIPAR_RANGES_AUDIT_TRG" ENABLE;
--------------------------------------------------------
--  DDL for Trigger PGIPRESENCES_BLOCKS_AUDIT_TRG
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "PGIPRESENCES_BLOCKS_AUDIT_TRG" BEFORE
  INSERT OR
  UPDATE ON PGIPRESENCES_BLOCKS
    /** ============================================================================
    ** ==
    ** == Generated on: 2014-11-11 09:03:34
    ** == Contact: andrzej.raczkowski@ext.sigi.lu
    ** ==
    ** ========================================================================= */
    --
    REFERENCING NEW AS NEW OLD AS OLD FOR EACH ROW BEGIN IF INSERTING THEN
    --
    IF :NEW.PRE_BLO_ID IS NULL THEN
  SELECT PRE_BLO_PK_SEQ.NEXTVAL INTO :NEW.PRE_BLO_ID FROM dual;
END IF;
--
SELECT NVL(v('USER'), USER),
  SYSDATE
INTO :NEW.PRE_BLO_CREATION_USER,
  :NEW.PRE_BLO_CREATION_DATE
FROM DUAL;
--
ELSIF UPDATING THEN
  --
  SELECT NVL(v('USER'), USER),
    SYSDATE
  INTO :NEW.PRE_BLO_MODIFICATION_USER,
    :NEW.PRE_BLO_MODIFICATION_DATE
  FROM DUAL;
  --
END IF;
END;
/
ALTER TRIGGER "PGIPRESENCES_BLOCKS_AUDIT_TRG" ENABLE;

