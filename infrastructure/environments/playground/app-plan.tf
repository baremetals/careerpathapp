module "dis_app_plan" {
  source              = "../../modules/app-plan"
  app_service_name    = local.app_service_name
  resource_group = local.resource_group_name
  location            = local.location
  environment         = local.environment
  tags                = local.tags
  environment_suffix  = local.environment_suffix
  location_shortcode  = local.location_shortcode
  worker_count        = local.worker_count
  sku_name            = local.sku_name
  depends_on = [module.dis_resource_group]
}

