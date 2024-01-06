locals {
  tags = {
    environment = "playground"
  }
  location              = "westeurope"
  location_shortcode    = "weu"
  environment_suffix    = "-playground"
  environment           = "playground"
  resource_group_name   = "discareer-api-playground"
  sku_name              = "F1"
  app_service_plan_name = "app-service-playground"
  app_service_name      = "discareer-api"
  worker_count          = 1
}