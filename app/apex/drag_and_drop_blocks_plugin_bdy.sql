create or replace package body drag_and_drop_blocks_plugin is

  /*
   * DEMO DATA
   *
   create table multi_range_slider_data(mrs_id varchar2(4000), mrs_data varchar2(4000))
   1  mrs1  [[390,480],[720,840],[960,1140]]
   2  mrs2  [[390,480],[720,1140]]
   3  mrs3  [[390,1140]]
   *
  */

  function render(p_region              in apex_plugin.t_region,
                  p_plugin              in apex_plugin.t_plugin,
                  p_is_printer_friendly in boolean)
    return apex_plugin.t_region_render_result is

    -- Component attributes
    l_min  apex_application_page_regions.attribute_01%type := coalesce(p_region.attribute_01,
                                                                       '0');
    l_max  apex_application_page_regions.attribute_02%type := coalesce(p_region.attribute_02,
                                                                       '1440');
    l_step apex_application_page_regions.attribute_03%type := coalesce(p_region.attribute_03,
                                                                       30);

    l_toolbarId apex_application_page_regions.attribute_04%type := coalesce(p_region.attribute_04,
                                                                            'toolbar1');

    l_blocksToolbar       apex_application_page_regions.attribute_05%type := coalesce(p_region.attribute_05,
                                                                                      '[]');
    l_stepLabelDispFormat apex_application_page_regions.attribute_07%type := p_region.attribute_07;
    --
    l_elementId      apex_application_page_regions.attribute_08%type := p_region.attribute_08;
    l_first_instance apex_application_page_regions.attribute_09%type := coalesce(p_region.attribute_09,
                                                                                 'Y');
    l_options        JSON := json();
    retval           apex_plugin.t_region_render_result;
    -- test data
    cursor c_data(pc_dadb_id varchar2) is
      select * from multi_range_slider_data m where m.dadb_id = pc_dadb_id;
    r_data c_data%rowtype;
  begin
    if apex_application.g_debug then
      apex_plugin_util.debug_region(p_plugin => p_plugin,
                                    p_region => p_region);
    end if;

    -- load the css and js only for first plugin instance
    if l_first_instance = 'Y' then
      -- CSS files
      apex_css.add_file(p_name      => 'vendor',
                        p_directory => p_plugin.file_prefix);

      apex_css.add_file(p_name      => 'main',
                        p_directory => p_plugin.file_prefix);

      -- JS files
      apex_javascript.add_library(p_name      => 'vendor',
                                  p_directory => p_plugin.file_prefix,
                                  p_version   => null);

      apex_javascript.add_library(p_name      => 'main',
                                  p_directory => p_plugin.file_prefix,
                                  p_version   => null);
    end if;

    -- html part
    sys.htp.p('<script>var ' || l_elementId || '</script>');
    sys.htp.p('<div id="content-' || l_elementId ||
              '" class="content"><div id="' || l_elementId ||
              '"></div></div>');

    --  plugin inicialization
    l_options.put(pair_name => 'min', pair_value => l_min);
    l_options.put(pair_name => 'max', pair_value => l_max);
    l_options.put(pair_name => 'step', pair_value => l_step);
    l_options.put(pair_name => 'toolbarId', pair_value => l_toolbarId);
    l_options.put(pair_name  => 'blocksToolbar',
                  pair_value => l_blocksToolbar);

    /*l_options.put(pair_name  => 'stepLabelDispFormat',
    pair_value => l_stepLabelDispFormat);*/

    open c_data(l_elementId);
    fetch c_data
      into r_data;
    if c_data%found then
      l_options.put(pair_name  => 'openBlocks',
                    pair_value => r_data.mrs_data);
    end if;

    close c_data;

    apex_javascript.add_onload_code(p_code => l_elementId ||
                                              ' = new Dadb("' ||
                                              l_elementId || '",' ||
                                              l_options.to_char || ');');

    -- test data
    open c_data(l_elementId);
    fetch c_data
      into r_data;
    if c_data%found then
      apex_javascript.add_onload_code(p_code => r_data.dadb_id ||
                                                '.addBlocks(' ||
                                                r_data.dadb_data || ');');
    end if;

    close c_data;

    return retval;
  end render;

  -- test
  procedure save_data(p_id varchar2, p_data varchar2) is
    l_count number;
  begin
    select count(1)
      into l_count
      from multi_range_slider_data
     where dadb_id = p_id;

    if l_count > 0 then
      update multi_range_slider_data
         set dadb_data = p_data
       where dadb_id = p_id;
    else
      insert into multi_range_slider_data
        (dadb_id, dadb_data)
      values
        (p_id, p_data);
    end if;
  end;
end drag_and_drop_blocks_plugin;
/
