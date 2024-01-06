locals {
  tags = {
    environment = "preprod"
  }
  location              = "uksouth"
  location_shortcode    = "weu"
  environment_suffix    = "-preprod"
  environment           = "preprod"
  resource_group_name   = "discareer-api-preprod"
  sku_name              = "F1"
  app_service_plan_name = "app-service-preprod"
  app_service_name      = "discareer-api"
  worker_count          = 1
}