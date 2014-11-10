create or replace PACKAGE body clickable_blocks_plugin
IS
FUNCTION render(
    p_item                IN apex_plugin.t_page_item ,
    p_plugin              IN apex_plugin.t_plugin ,
    p_value               IN VARCHAR2 ,
    p_is_readonly         IN BOOLEAN ,
    p_is_printer_friendly IN BOOLEAN )
  RETURN apex_plugin.t_page_item_render_result
IS
  l_value VARCHAR2(32767) := sys.htf.escape_sc (p_value);
  l_name  VARCHAR2(30);
  l_min apex_application_page_items.attribute_01%type                    := COALESCE(p_item.attribute_01, '0');
  l_max apex_application_page_items.attribute_02%type                    := COALESCE(p_item.attribute_02, '1440');
  l_step apex_application_page_items.attribute_03%type                   := COALESCE(p_item.attribute_03, '30');
  l_step_label_disp_format apex_application_page_items.attribute_04%type := COALESCE(p_item.attribute_04, 'function (s) {return "";}');
  l_first_instance apex_application_page_items.attribute_05%type         := COALESCE(p_item.attribute_05, 'Y');
  l_options JSON                                                         := json();
  l_change_callback VARCHAR2(32767);
  retval apex_plugin.t_page_item_render_result;
  -- test data
  CURSOR c_data(pc_clickb_id VARCHAR2)
  IS
    SELECT * FROM test_plugins_data m WHERE m.clickb_id = pc_clickb_id;
  r_data c_data%rowtype;
BEGIN
  --
  l_name := apex_plugin.get_input_name_for_page_item (false);
  --
  -- load the css and js only for first plugin instance
  IF l_first_instance = 'Y' THEN
    -- CSS files
    apex_css.add_file(p_name => 'main', p_directory => p_plugin.file_prefix);
    -- JS files
    apex_javascript.add_library(p_name => 'vendor', p_directory => p_plugin.file_prefix, p_version => NULL);
    apex_javascript.add_library(p_name => 'main', p_directory => p_plugin.file_prefix, p_version => NULL);
  END IF;
  -- html part
  -- Showing the item and blocks
  sys.htp.p ('<input type="hidden" name="'||l_name||'" id="'||p_item.name||'" '|| 'size="'||p_item.element_width||'" '|| p_item.element_attributes||' />');
  sys.htp.p ('<div id="'||p_item.name||'_parent" '||p_item.element_option_attributes||'></div>');
  --
  -- JS ClickB class constructor
  sys.htp.p('<script>var ' || p_item.name || ';</script>');
  l_options.put(pair_name => 'min', pair_value => l_min);
  l_options.put(pair_name => 'max', pair_value => l_max);
  l_options.put(pair_name => 'step', pair_value => l_step);
  l_options.put(pair_name => 'stepLabelDispFormat', pair_value => l_step_label_disp_format);
  apex_javascript.add_onload_code(p_code => p_item.name || '= new ClickB("' || p_item.name || '",'||l_options.to_char||');');
  --
  -- JS ClickB API
  -- callback on change
  l_change_callback := 'function () {$("#'||p_item.name ||'").val(JSON.stringify('|| p_item.name||'.getBlocks()));}';
  apex_javascript.add_onload_code(p_code => p_item.name || '.setChangeCallback('||l_change_callback||');');
  --
  OPEN c_data(p_item.name);
  FETCH c_data INTO r_data;
  apex_javascript.add_onload_code(p_code => p_item.name || '.addBlocks('||r_data.clickb_data||');');
  CLOSE c_data;

  --apex_javascript.add_onload_code(p_code => p_item.name || '.addBlocks([{"start": 990, "value": 60, "planned": 0, "colorp": "#dff0d8", "coloru": "#FFFFFF"},'|| '{"start": "480","value": "30","planned": "1", "colorp": "#dff0d8","coloru": "#FFFFFF"},'|| '{ "start": "840","value": "120","planned": "1","colorp":"#dff0d8","coloru": "#FFFFFF"},'|| '{"start": "510","value": "60","planned": "1","colorp": "#dff0d8", "coloru": "#FFFFFF"},'|| '{ "start": "600","value": "120","planned": "1","colorp":"#dff0d8","coloru": "#FFFFFF"}]);');
  --
  --
  RETURN retval;
END;
-- test
PROCEDURE save_data(
    p_id   VARCHAR2,
    p_data VARCHAR2)
IS
  l_count NUMBER;
BEGIN
  SELECT COUNT(1) INTO l_count FROM TEST_PLUGINS_DATA WHERE clickb_id = p_id;
  IF l_count > 0 THEN
    UPDATE TEST_PLUGINS_DATA SET clickb_data = p_data WHERE clickb_id = p_id;
  ELSE
    INSERT
    INTO TEST_PLUGINS_DATA
      (
        clickb_id,
        clickb_data
      )
      VALUES
      (
        p_id,
        p_data
      );
  END IF;
END;
END clickable_blocks_plugin;
/
