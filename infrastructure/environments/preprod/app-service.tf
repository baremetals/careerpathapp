module "dis_service_plan" {
  source              = "../../modules/app-service"
  plan_id             = module.dis_app_plan.id
  app_service_name    = local.app_service_name
  resource_group = local.resource_group_name
  location            = local.location
  tags                = local.tags
  environment_suffix  = local.environment_suffix
  location_shortcode  = local.location_shortcode
  depends_on = [module.dis_app_plan]
}