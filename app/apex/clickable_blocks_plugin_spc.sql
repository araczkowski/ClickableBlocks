create or replace PACKAGE clickable_blocks_plugin
IS
  FUNCTION render(
      p_item                IN apex_plugin.t_page_item ,
      p_plugin              IN apex_plugin.t_plugin ,
      p_value               IN VARCHAR2 ,
      p_is_readonly         IN BOOLEAN ,
      p_is_printer_friendly IN BOOLEAN )
    RETURN apex_plugin.t_page_item_render_result;
  -- test
  PROCEDURE save_data(
      p_id   VARCHAR2,
      p_data VARCHAR2);
END clickable_blocks_plugin;

/
