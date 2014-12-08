--------------------------------------------------------
--  DDL for Table TEST_PLUGINS_DATA
--------------------------------------------------------

  CREATE TABLE "TEST_PLUGINS_DATA"
   (	"MRS_ID" VARCHAR2(4000 BYTE),
	"MRS_DATA" VARCHAR2(4000 BYTE),
	"DADB_ID" VARCHAR2(4000 BYTE),
	"DADB_DATA" VARCHAR2(4000 BYTE),
	"CLICKB_ID" VARCHAR2(4000 BYTE),
	"CLICKB_DATA" VARCHAR2(4000 BYTE)
   );
REM INSERTING into TEST_PLUGINS_DATA
Insert into TEST_PLUGINS_DATA (MRS_ID,MRS_DATA,DADB_ID,DADB_DATA,CLICKB_ID,CLICKB_DATA) values ('mrs1','[[660,420]]','dadb1','[{"id":"step_dadb1_11","start":"660","value":"120","colorp":"rgb(232, 249, 8)"},{"id":"step_dadb1_19","start":"900","value":"120","colorp":"rgb(232, 249, 8)"}]',null,null);
Insert into TEST_PLUGINS_DATA (MRS_ID,MRS_DATA,DADB_ID,DADB_DATA,CLICKB_ID,CLICKB_DATA) values ('mrs2','[[420,690]]','dadb2','[{"id":"step_dadb2_5","start":"480","value":"30","colorp":"rgb(255, 137, 0)"},{"id":"step_dadb2_6","start":"510","value":"120","colorp":"rgb(232, 249, 8)"},{"id":"step_dadb2_12","start":"690","value":"120","colorp":"rgb(255, 137, 0)"}]',null,null);
Insert into TEST_PLUGINS_DATA (MRS_ID,MRS_DATA,DADB_ID,DADB_DATA,CLICKB_ID,CLICKB_DATA) values ('mrs3','[[420,510]]','dadb3','[{"id":"step_dadb3_6","start":"510","value":"120","colorp":"rgb(255, 137, 0)"}]',null,null);
Insert into TEST_PLUGINS_DATA (MRS_ID,MRS_DATA,DADB_ID,DADB_DATA,CLICKB_ID,CLICKB_DATA) values (null,null,null,null,'P6_CB1','[{"id":"step_P6_CB1_5","start":"480","value":"30","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB1_6","start":"510","value":"60","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB1_9","start":"600","value":"120","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB1_17","start":"840","value":"120","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB1_22","start":"990","value":"60","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"}]');
Insert into TEST_PLUGINS_DATA (MRS_ID,MRS_DATA,DADB_ID,DADB_DATA,CLICKB_ID,CLICKB_DATA) values (null,null,null,null,'P6_CB2','[{"id":"step_P6_CB2_5","start":"480","value":"30","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB2_6","start":"510","value":"60","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB2_9","start":"600","value":"120","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB2_17","start":"840","value":"120","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB2_22","start":"990","value":"60","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"}]');
Insert into TEST_PLUGINS_DATA (MRS_ID,MRS_DATA,DADB_ID,DADB_DATA,CLICKB_ID,CLICKB_DATA) values (null,null,null,null,'P6_CB3','[{"id":"step_P6_CB3_5","start":"480","value":"30","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB3_6","start":"510","value":"60","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB3_9","start":"600","value":"120","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB3_17","start":"840","value":"120","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB3_22","start":"990","value":"60","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"}]');
Insert into TEST_PLUGINS_DATA (MRS_ID,MRS_DATA,DADB_ID,DADB_DATA,CLICKB_ID,CLICKB_DATA) values (null,null,null,null,'P6_CB4','[{"id":"step_P6_CB4_5","start":"480","value":"30","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB4_6","start":"510","value":"60","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB4_9","start":"600","value":"120","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB4_17","start":"840","value":"120","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB4_22","start":"990","value":"60","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"}]');
Insert into TEST_PLUGINS_DATA (MRS_ID,MRS_DATA,DADB_ID,DADB_DATA,CLICKB_ID,CLICKB_DATA) values (null,null,null,null,'P6_CB5','[{"id":"step_P6_CB5_5","start":"480","value":"30","planned":"1","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB5_6","start":"510","value":"60","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB5_9","start":"600","value":"120","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB5_17","start":"840","value":"120","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"},{"id":"step_P6_CB5_22","start":"990","value":"60","planned":"0","colorp":"#dff0d8","coloru":"#FFFFFF"}]');