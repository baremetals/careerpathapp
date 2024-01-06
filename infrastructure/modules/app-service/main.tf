# data "azurerm_linux_web_app" "default" {
#   name                = "app-${var.location_shortcode}-discareer-${var.app_service_name}${var.environment_suffix}"
#   resource_group_name = var.resource_group_name
# }

resource "azurerm_linux_web_app" "default" {
  name                = "app-${var.location_shortcode}-discareer-${var.app_service_name}${var.environment_suffix}"
  resource_group_name = var.resource_group
  location            = var.location
  service_plan_id     = var.plan_id
  https_only          = true
  tags                = var.tags

  site_config {
    always_on      = false
    ftps_state     = "Disabled"
    application_stack {
      node_version = "18-lts"
    }
  }
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
  }
}