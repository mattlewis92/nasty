<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
{% include '../partials/head.swig' %}
<body>

<table class="body-wrap">
	<tr>
		<td></td>
		<td class="container" width="600">
			<div class="content">
				<table class="main" width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td class="content-wrap">
							<table width="100%" cellpadding="0" cellspacing="0">

							  <tr>
                  <td class="content-block">
                    <h1>{{ title }}</h1>
                  </td>
                </tr>
								<tr>
									<td class="content-block">
										{% autoescape false %}{{ content }}{% endautoescape %}
									</td>
								</tr>
								{% if button %}
								<tr>
									<td class="content-block">
										{% include '../partials/button.swig' with button %}
									</td>
								</tr>
								{% endif %}
								<tr>
									<td class="content-block">
										&mdash; Your app
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				{% include '../partials/footer.swig' %}
				</div>
		</td>
		<td></td>
	</tr>
</table>

</body>
</html>
