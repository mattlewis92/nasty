<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  {% include '../partials/head.swig' %}
  <body class="body" style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none" bgcolor="#ffffff">
      <table align="center" cellpadding="0" cellspacing="0" width="100%" height="100%">
          <tr>
              <td align="center" valign="top" bgcolor="#ffffff"  width="100%">

                  <table cellspacing="0" cellpadding="0" width="100%">
                      {% include '../partials/header.swig' %}
                      <tr>
                          <td style="border-bottom:1px solid #e7e7e7;">

                              <center>
                                  <table cellpadding="0" cellspacing="0" width="600" class="w320">
                                      <tr>
                                          <td align="left" class="mobile-padding" style="padding:20px 20px 0">

                                              <br class="mobile-hide" />

                                              <h1>{{ title }}</h1>

                                              <br>
                                              {% autoescape false %}{{ content }}{% endautoescape %}<br>
                                              <br>

                                              {% if button %}
                                                <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff">
                                                    <tr>
                                                        {% include '../partials/button.swig' with button %}
                                                        <td width="316" style="background-color:#ffffff; font-size:0; line-height:0;">&nbsp;</td>
                                                    </tr>
                                                </table>
                                              {% endif %}
                                              <br><br>
                                          </td>
                                          {% include '../partials/phoneLeft.swig' %}
                                      </tr>
                                  </table>
                              </center>

                          </td>
                      </tr>
                      {% include '../partials/footer.swig' %}
                  </table>

              </td>
          </tr>
      </table>
  </body>
</html>
